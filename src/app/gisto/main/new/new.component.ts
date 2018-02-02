import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { keyBy, omit, flattenDeep, uniq, compact, map, flow, without, includes } from 'lodash/fp';
import { GithubApiService } from '../../../github-api.service';
import { toJS } from 'mobx';
import { GistsStore } from '../../../store/gists';
import { NotificationsStore } from '../../../store/notifications';

interface NewSnippet {
  description: string;
  public: boolean;
  files: object;
}

@Component({
  selector: 'new',
  template: `
    <header></header>
    <div class="content-wrapper" *mobxAutorun>
      
      <h2>
        <icon icon="{{ newSnippetForm.value.public ? 'unlock' : 'lock' }}"
              color="#555"
              size="32"></icon> 
        
        {{ newSnippetForm.value.description || 'New snippet' }}
        
        <span class="selected-tags"
              *ngFor="let localTag of localTags">
          {{ localTag }} <icon icon="cancel" color="#3f83a8" (click)="deleteTag(localTag)"></icon>
        </span>
      </h2>
      
      <form [formGroup]="newSnippetForm"
            (ngSubmit)="createNewGist(newSnippetForm.value)">
        
        <div>
          <input formControlName="description" type="text" placeholder="Description"/>
          <a class="add-tags"
             (click)="this.toggleTagList()">
            <icon icon="{{ showTaglist ? 'cancel' : 'add' }}" 
                  color="{{ showTaglist ? 'tomato' : '#3f83a8' }}" 
            size="14"></icon> 
            <span 
              [style.color]="showTaglist ? 'tomato' : '#3f83a8'">
              {{ showTaglist ? 'Close tag suggestions' : 'Add tag' }}
            </span>
          </a>
          <div *ngIf="showTaglist"
               class="tag-suggestions">
            <p>
              New tag: <input class="add-new-tag-input" #newTag placeholder="tagname"/> 
              <button type="button" (click)="addTag(newTag.value);newTag.value=''">
                <strong>Add</strong> {{ newTag.value }}
              </button>
            </p>
            <hr/>
            <p>Select from existing</p>
            <span class="selected-tags"
                  *ngFor="let tag of getTags()"
                  (click)="addTag(tag)">{{ tag }}</span>
          </div>
        </div>

        <br/>

        <input type="checkbox" formControlName="public"/>
        <span>
          This snippet is <strong>{{ newSnippetForm.value.public ? 'public' : 'private' }}</strong>
          <a target="_new" href="https://help.github.com/articles/about-gists/#types-of-gists">
            <icon icon="info" size="16" color="#3f83a8"></icon>
          </a>
        </span>

        <div formArrayName="files">
          <div *ngFor="let file of newSnippetForm.get('files').controls; let i=index"
               [formGroup]="file">

            <h4 *ngIf="fileNameText.value">{{ fileNameText.value }}</h4>
            <h4 *ngIf="!fileNameText.value">File #{{ i + 1 }}</h4>

            <input formControlName="fileName"
                   #fileNameText
                   placeholder="file.js"
                   type="text"
                   [attr.id]="'filename' + i"/>
            <br>
            <br>
            <td-code-editor class="editor"
                            flex
                            formControlName="content"
                            theme="vs"
                            [attr.id]="'file' + i"
                            language="{{ 'text' }}"
                            automaticLayout
                            value=""
                            [editorOptions]="{}">
            </td-code-editor>
          </div>
        </div>

        <button invert type="reset" routerLink="/">Cancel</button>
        <button icon="add"
                size="16"
                color="white"
                type="button"
                (click)="newSnippetForm.get('files').push(buildNewFiles(''))">Add another file
        </button>
        <button type="submit">Create</button>
      </form>
    </div>
  `,
  styleUrls: ['./new.component.scss']
})
export class NewComponent {
  newSnippetForm: FormGroup;
  localTags: string[] = [];
  showTaglist = false;

  constructor(
    private githubApiService: GithubApiService,
    private formBuilder: FormBuilder,
    public gistsStore: GistsStore,
    private notificationsStore: NotificationsStore
  ) {
    this.newSnippetForm = formBuilder.group({
      description: formBuilder.control('', Validators.required),
      public: formBuilder.control(false),
      files: formBuilder.array([
        this.buildNewFiles('')
      ])
    });
  }

  buildNewFiles(val: string): FormGroup {
    return new FormGroup({
      fileName: new FormControl(val, Validators.required),
      content: new FormControl(val, Validators.required)
    });
  }

  getTags = () => {
    const tags = map('tags', toJS(this.gistsStore.gists));
    const tagList = flow([
      flattenDeep,
      uniq,
      compact
    ])(tags);

    return tagList.sort();
  }

  addTag = (tag) => {
    if (!tag) {
      return false;
    }
    tag = tag.startsWith('#') ? tag : `#${tag}`;
    if (!includes(tag, this.localTags)) {
      this.localTags.push(tag);
    }
  }

  deleteTag = (tag) => {
    this.localTags = without([tag], this.localTags);
  }

  toggleTagList = () => {
    this.showTaglist = !this.showTaglist;
  }

  createNewGist(formData) {
    console.log('%c LOG ', 'background: #555; color: tomato', this.newSnippetForm.status === 'INVALID', this.newSnippetForm);
    if (this.newSnippetForm.status === 'INVALID') {
      this.notificationsStore.addNotification('error', 'Form not valid', 'Please fill all the fields');
      return;
    }

    const files = omit('fileName', keyBy('fileName', formData.files));
    const snippetStructure = {
      description: `${formData.description} ${this.localTags.toString()}`,
      public: formData.public,
      files
    };

    this.githubApiService.createGist(snippetStructure);
  }

}
