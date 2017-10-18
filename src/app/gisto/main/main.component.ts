import { Component } from '@angular/core';
import { UiStore } from '../../store/ui';

@Component({
  selector: 'main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})

export class MainComponent {

  constructor(private uiStore: UiStore) { }
}
