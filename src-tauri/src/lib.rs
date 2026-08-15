use notify::{Event, EventKind, RecommendedWatcher, RecursiveMode, Watcher};
use serde::{Deserialize, Serialize};
use std::collections::HashSet;
use std::path::PathBuf;
use std::sync::mpsc;
use std::time::{Duration, Instant};
use tauri::Emitter;

const WATCHER_IDLE_TIMEOUT: Duration = Duration::from_secs(5 * 60);
const WATCHER_POLL_INTERVAL: Duration = Duration::from_secs(30);
const READ_SETTLE_DELAY: Duration = Duration::from_millis(150);

#[derive(Clone, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
struct SnippetFile {
    filename: String,
    content: String,
}

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
struct EditorFileChanged {
    snippet_id: String,
    files: Vec<SnippetFile>,
}

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
struct EditorFileClosed {
    snippet_id: String,
}

fn sanitize_filename(name: &str) -> String {
    let cleaned: String = name
        .chars()
        .map(|c| {
            if c.is_ascii_alphanumeric() || "._- ".contains(c) {
                c
            } else {
                '-'
            }
        })
        .collect();
    let trimmed = cleaned.trim_matches([' ', '.']).trim().to_string();
    if trimmed.is_empty() {
        "file".to_string()
    } else {
        trimmed
    }
}

fn read_changed_files(paths: &[PathBuf], known: &HashSet<String>) -> Vec<SnippetFile> {
    let mut result = Vec::new();
    let mut seen = HashSet::new();

    for path in paths {
        let Some(name) = path.file_name().and_then(|n| n.to_str()) else {
            continue;
        };
        if !known.contains(name) || !seen.insert(name.to_string()) {
            continue;
        }
        if path.is_file() {
            if let Ok(content) = std::fs::read_to_string(path) {
                result.push(SnippetFile {
                    filename: name.to_string(),
                    content,
                });
            }
        }
    }

    result
}

fn start_watcher(
    app: tauri::AppHandle,
    snippet_id: String,
    dir: tempfile::TempDir,
    known_files: HashSet<String>,
) {
    std::thread::spawn(move || {
        let dir_path = dir.path().to_path_buf();
        let (tx, rx) = mpsc::channel::<notify::Result<Event>>();
        let mut watcher = match RecommendedWatcher::new(move |res| {
            let _ = tx.send(res);
        }, notify::Config::default())
        {
            Ok(w) => w,
            Err(e) => {
                log::warn!("[editor] failed to create watcher: {e}");
                let _ = dir.keep();
                return;
            }
        };

        if let Err(e) = watcher.watch(&dir_path, RecursiveMode::NonRecursive) {
            log::warn!("[editor] failed to watch {}: {e}", dir_path.display());
            let _ = dir.keep();
            return;
        }

        log::info!(
            "[editor] watching {} for snippet {snippet_id}",
            dir_path.display()
        );

        let mut last_change = Instant::now();
        loop {
            match rx.recv_timeout(WATCHER_POLL_INTERVAL) {
                Ok(Ok(event)) => {
                    if !matches!(event.kind, EventKind::Create(_) | EventKind::Modify(_)) {
                        continue;
                    }

                    // Give the editor a moment to finish writing before reading.
                    std::thread::sleep(READ_SETTLE_DELAY);

                    let files = read_changed_files(&event.paths, &known_files);
                    if !files.is_empty() {
                        last_change = Instant::now();

                        let payload = EditorFileChanged {
                            snippet_id: snippet_id.clone(),
                            files,
                        };
                        let _ = app.emit("editor-file-changed", payload);
                    }
                }
                Ok(Err(e)) => {
                    log::warn!("[editor] watcher error: {e}");
                }
                Err(_) => {
                    if last_change.elapsed() >= WATCHER_IDLE_TIMEOUT {
                        log::info!(
                            "[editor] idle for {}s, removing {}",
                            WATCHER_IDLE_TIMEOUT.as_secs(),
                            dir_path.display()
                        );
                        let _ = app.emit(
                            "editor-file-closed",
                            EditorFileClosed {
                                snippet_id: snippet_id.clone(),
                            },
                        );
                        break;
                    }
                }
            }
        }

        // dir is dropped here, which removes the temporary directory.
    });
}

#[tauri::command]
fn open_in_editor(
    files: Vec<SnippetFile>,
    command: String,
    snippet_id: String,
    app: tauri::AppHandle,
) -> Result<String, String> {
    if command.trim().is_empty() {
        return Err("Editor command cannot be empty".to_string());
    }

    let dir = tempfile::Builder::new()
        .prefix("gisto-")
        .tempdir()
        .map_err(|e| format!("Failed to create temporary directory: {e}"))?;

    let mut known_files = HashSet::new();
    for file in &files {
        let filename = sanitize_filename(&file.filename);
        known_files.insert(filename.clone());
        let path = dir.path().join(filename);
        std::fs::write(&path, &file.content)
            .map_err(|e| format!("Failed to write {}: {e}", file.filename))?;
    }

    let dir_path = dir.path().to_path_buf();
    let display_path = dir_path.display().to_string();

    let mut parts = command.split_whitespace();
    let program = parts.next().expect("command is not empty");
    let mut cmd = std::process::Command::new(program);
    cmd.args(parts).arg(&dir_path);
    cmd.spawn()
        .map_err(|e| format!("Failed to launch editor '{program}': {e}"))?;

    start_watcher(app, snippet_id, dir, known_files);

    Ok(display_path)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_window_state::Builder::new().build())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![open_in_editor])
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
