import { Directive, HostListener, Input } from '@angular/core';

/**
 * @Usage: <a CopyToClipBoardDirective clipboardData="I am to be copied">Copy to Clipboard</a>
 */

@Directive({
  selector: '[CopyToClipBoardDirective]'
})
export class CopyToClipBoardDirective {

  @Input() clipboardData: string;

  @HostListener('click') onClick() {
    function handleCopy(event) {
      event.clipboardData.setData('text/plain', this.clipboardData);
      event.preventDefault();
      document.removeEventListener('copy', handleCopy, true);
    }

    document.addEventListener('copy', handleCopy.bind(this), true);
    document.execCommand('copy');
  }
}
