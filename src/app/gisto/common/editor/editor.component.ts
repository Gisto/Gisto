import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'gisto-code-editor',
  template: `
    <div ace-editor
               (textChange)="onTextChange($event)"
               (textChanged)="onTextChanged($event)"
               [text]="value"
               [mode]="mode"
               [theme]="theme"
               [readOnly]="readOnly"
               [autoUpdateContent]="autoUpdateContent"
               [durationBeforeCallback]="durationBeforeCallback"
               style="min-height: 100px;width:100%;overflow: auto;border-bottom: 1px solid #3f83a8;">
    </div>
  `,
  styleUrls: ['./editor.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => GistoCodeEditorComponent),
    }
  ]
})
export class GistoCodeEditorComponent implements ControlValueAccessor {

  @Input() mode = 'text';
  @Input() theme = 'chrome';
  @Input() readOnly = false;
  @Input() autoUpdateContent = true;
  @Input() durationBeforeCallback = 1000;

  /**
   * Gets called when the editor's value is about to change
   * @type {EventEmitter<string>} The editor's new value
   */
  @Output() textChange = new EventEmitter<string>();

  /**
   * Gets called when the editor's value has changed
   * @type {EventEmitter<string>} The editor's new value
   */
  @Output() textChanged = new EventEmitter<string>();

  _value: string;

  _changeFn: (_: any) => void;
  _touchedFn: any;


  constructor() { }


  // ControlValueAccessor implementation

  registerOnChange(fn: (_: any) => void): void {
    this._changeFn = fn;
  }

  registerOnTouched(fn: any): void {
    this._touchedFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.readOnly = isDisabled;
  }

  writeValue(obj: any): void {
    this.value = obj;
  }


  // Event handling

  onTextChange(text: string) {
    this._value = text;

    if (this._changeFn) {
      this._changeFn(text);
    }

    this.textChange.emit(text);
  }

  onTextChanged(text: string) {
    this._value = text;

    if (this._changeFn) {
      this._changeFn(text);
    }

    this.textChanged.emit(text);
  }


  // Property accessors

  get value(): string {
    return this._value;
  }

  set value(value: string) {
    this.onTextChange(value);
    this._value = value;
    this.onTextChanged(value);
  }

}
