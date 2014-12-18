;;; Define your application name
!define APPNAME "Gisto"
!define APPNAMEANDVERSION "Gisto GISTO_REPLACE_VERSION"

;;; Main Install settings
Name "${APPNAMEANDVERSION}"
InstallDir "$APPDATA\Gisto"
InstallDirRegKey HKLM "Software\${APPNAME}" ""
OutFile "GISTO_REPLACE_EXE_NAME"

;;; Modern interface settings
!include "MUI.nsh"
!define MUI_ICON "GISTO_REPLACE_INC_FILE_ICO"
!define MUI_ABORTWARNING
!define MUI_FINISHPAGE_RUN "$INSTDIR\gisto.exe"

!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_LICENSE "GISTO_REPLACE_LICENSE"
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES

;;; Set languages (first is default language)
!insertmacro MUI_LANGUAGE "English"
!insertmacro MUI_RESERVEFILE_LANGDLL

Section "Gisto" Section1

	;;; Set Section properties
	SetOverwrite on

	;;; Set Section Files and Shortcuts
	SetOutPath "$INSTDIR\"
	File "GISTO_REPLACE_INC_FILE_1"
	File "GISTO_REPLACE_INC_FILE_2"
	File "GISTO_REPLACE_INC_FILE_3"
	File "GISTO_REPLACE_INC_FILE_4"
	File "GISTO_REPLACE_INC_FILE_5"
	File "GISTO_REPLACE_INC_FILE_6"
	File "GISTO_REPLACE_INC_FILE_ICO"
	CreateShortCut "$DESKTOP\Gisto.lnk" "$INSTDIR\gisto.exe" "" $INSTDIR\icon.ico" 0
	CreateDirectory "$SMPROGRAMS\Gisto"
	CreateShortCut "$SMPROGRAMS\Gisto\Gisto.lnk" "$INSTDIR\gisto.exe" "" $INSTDIR\icon.ico" 0
	CreateShortCut "$SMPROGRAMS\Gisto\Uninstall.lnk" "$INSTDIR\uninstall.exe" "" $INSTDIR\icon.ico" 0

SectionEnd

Section -FinishSection

	WriteRegStr HKLM "Software\${APPNAME}" "" "$INSTDIR"
	WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "DisplayName" "${APPNAME}"
	WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}" "UninstallString" "$INSTDIR\uninstall.exe"
	WriteUninstaller "$INSTDIR\uninstall.exe"

SectionEnd

;;; Modern install component descriptions
!insertmacro MUI_FUNCTION_DESCRIPTION_BEGIN
!insertmacro MUI_DESCRIPTION_TEXT ${Section1} ""
!insertmacro MUI_FUNCTION_DESCRIPTION_END

;;; Uninstall section
Section Uninstall

	;;; Remove from registry...
	DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APPNAME}"
	DeleteRegKey HKLM "SOFTWARE\${APPNAME}"

	;;; Delete self
	Delete "$INSTDIR\uninstall.exe"

	;;; Delete Shortcuts
	Delete "$DESKTOP\Gisto.lnk"
	Delete "$SMPROGRAMS\Gisto\Gisto.lnk"
	Delete "$SMPROGRAMS\Gisto\Uninstall.lnk"

	;;; Clean up Gisto
	Delete "$INSTDIR\icudtl.dat"
	Delete "$INSTDIR\gisto.exe"
	Delete "$INSTDIR\libGLESv2.dll"
	Delete "$INSTDIR\libEGL.dll"
	Delete "$INSTDIR\nw.pak"
	Delete "$INSTDIR\d3dcompiler_46.dll"
	Delete "$INSTDIR\icon.ico"
	RMDir "$INSTDIR\locales"

	;;; Remove remaining directories
	RMDir "$SMPROGRAMS\Gisto"
	RMDir "$INSTDIR\"

SectionEnd

BrandingText "Snippets Made Awesome"

;;; eof