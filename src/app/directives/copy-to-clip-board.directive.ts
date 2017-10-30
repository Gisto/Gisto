import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[CopyToClipBoard]'
})
export class CopyToClipBoardDirective {

  @Input() string: string;

  @HostListener('click') onClick() {
    function handleCopy (event) {
      event.clipboardData.setData('text/plain', this.string);
      event.preventDefault();
      document.removeEventListener('copy', handleCopy, true);
    }
    document.addEventListener('copy', handleCopy.bind(this), true);
    document.execCommand('copy');
  }
}
