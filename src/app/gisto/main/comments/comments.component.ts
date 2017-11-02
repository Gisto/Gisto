import { Component } from '@angular/core';
import { values } from 'lodash/fp';
import { GistsStore } from '../../../store/gists';

@Component({
  selector: 'comments',
  template:
      `
    <h3>Comments:</h3>

    <div class="comment" *ngFor="let comment of values(gistsStore.current.comments)">
      <user [avatar]="comment.user.avatar_url"
            [name]="comment.user.login"></user>
      <date [date]="comment.created_at"
            [style]="styles">
      </date>
      <div Markdown>{{ comment.body }}</div>
    </div>
  `,
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent {

  values: any = values;
  styles = { 'display': 'block', 'margin': '0 0 0 40px', 'font-size': '10px' };

  constructor(public gistsStore: GistsStore) { }

}
