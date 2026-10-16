import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog.tsx';
import { Button } from '@/components/ui/button.tsx';
import { t } from '@/lib/i18n';

export type MissingExtensionFile = { filename: string; extension: string };

type Props = {
  files: MissingExtensionFile[];
  onConfirm: () => void;
  onSkip: () => void;
  onDismiss: () => void;
};

// asks the user before renaming files because providers detect language from the extension;
// dismissing the dialog (Escape, outside click) aborts the pending save instead of saving silently
export const MissingExtensionDialog = ({ files, onConfirm, onSkip, onDismiss }: Props) => (
  <AlertDialog open onOpenChange={(open) => !open && onDismiss()}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{t('pages.new.missingExtension.title')}</AlertDialogTitle>
        <AlertDialogDescription>
          <span className="block">{t('pages.new.missingExtension.message')}</span>
          <span className="block space-y-1">
            {files.map(({ filename, extension }) => (
              <span key={filename} className="block font-mono text-xs">
                {filename} → {filename}.{extension}
              </span>
            ))}
          </span>
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <Button variant="outline" onClick={onSkip}>
          {t('pages.new.missingExtension.skip')}
        </Button>
        <Button onClick={onConfirm}>{t('pages.new.missingExtension.confirm')}</Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);
