import { Injectable } from '@angular/core';
import { observable } from 'mobx-angular';


@Injectable()
export class UserStore {

  @observable user = {
    "login": "sanusart",
    "id": 267718,
    "avatar_url": "https://avatars3.githubusercontent.com/u/267718?v=4",
    "gravatar_id": "",
    "url": "https://api.github.com/users/sanusart",
    "html_url": "https://github.com/sanusart",
    "followers_url": "https://api.github.com/users/sanusart/followers",
    "following_url": "https://api.github.com/users/sanusart/following{/other_user}",
    "gists_url": "https://api.github.com/users/sanusart/gists{/gist_id}",
    "starred_url": "https://api.github.com/users/sanusart/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/users/sanusart/subscriptions",
    "organizations_url": "https://api.github.com/users/sanusart/orgs",
    "repos_url": "https://api.github.com/users/sanusart/repos",
    "events_url": "https://api.github.com/users/sanusart/events{/privacy}",
    "received_events_url": "https://api.github.com/users/sanusart/received_events",
    "type": "User",
    "site_admin": false,
    "name": "Sasha Khamkov",
    "company": "@500tech ",
    "blog": "https://www.sanusart.com",
    "location": "Jerusalem, Israel",
    "email": null,
    "hireable": null,
    "bio": null,
    "public_repos": 35,
    "public_gists": 35,
    "followers": 18,
    "following": 2,
    "created_at": "2010-05-06T21:19:20Z",
    "updated_at": "2017-10-11T19:54:58Z"
  };
}
