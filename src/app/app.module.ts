import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';
import * as hljs from 'highlight.js';
import { HighlightJsModule, HIGHLIGHT_JS } from 'angular-highlight-js';

import { AppComponent } from './app.component';
import { GistoComponent } from './gisto/gisto.component';
import { HeaderComponent } from './gisto/header/header.component';
import { SubHeaderComponent } from './gisto/sub-header/sub-header.component';
import { MainComponent } from './gisto/main/main.component';
import { SidebarComponent } from './gisto/main/sidebar/sidebar.component';
import { ContentComponent } from './gisto/main/content/content.component';
import { UserComponent } from './gisto/header/user/user.component';
import { AppSettingsComponent } from './gisto/header/app-settings/app-settings.component';

export function highlightJsFactory() {
  return hljs;
}

const appRoutes: Routes = [
    { path: 'main', component: MainComponent },
    { path: 'gist/:id', component: ContentComponent },
    { path: '',   redirectTo: '/main', pathMatch: 'full' },
];

@NgModule({
  declarations: [
    AppComponent,
    GistoComponent,
    HeaderComponent,
    SubHeaderComponent,
    MainComponent,
    SidebarComponent,
    ContentComponent,
    UserComponent,
    AppSettingsComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
        { enableTracing: true } // <-- debugging purposes only
    ),
    HighlightJsModule.forRoot({
      provide: HIGHLIGHT_JS,
      useFactory: highlightJsFactory
    }),
    BrowserModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [ NO_ERRORS_SCHEMA ]
})
export class AppModule { }
