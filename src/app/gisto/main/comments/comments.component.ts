import { Component } from '@angular/core';
import { values } from 'lodash/fp';
import { GistsStore } from '../../../store/gists';
import { GithubApiService } from '../../../github-api.service';

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

    <h3>New comment:</h3>

    <div>
      <markdown [data]="newComment"></markdown>
      <div><textarea #newCommentText [(ngModel)]="newComment"></textarea></div>
      <button invert (click)="addNewComment(gistsStore.current.id, newCommentText.value)" icon="fa-plus">Add new</button>
    </div>
  `,
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent {

  values: any = values;
  styles = { 'display': 'block', 'margin': '0 0 0 40px', 'font-size': '10px' };
  public newComment = '';
  constructor(public gistsStore: GistsStore, private githubApiService: GithubApiService) { }

  addNewComment(id, body) {
    this.githubApiService.addComment(id, body);
    this.newComment = '';
  }

}
