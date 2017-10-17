import { Injectable } from '@angular/core';
import { observable } from 'mobx-angular';


@Injectable()
export class UserStore {

  @observable user = {
    'login': 'sanusart',
    'id': 267718,
    'avatar_url': 'https://github.com/identicons/user1.png' || 'https://avatars3.githubusercontent.com/u/267718?v=4',
    'gravatar_id': '',
    'url': 'https://api.github.com/users/sanusart',
    'html_url': 'https://github.com/sanusart',
    'followers_url': 'https://api.github.com/users/sanusart/followers',
    'following_url': 'https://api.github.com/users/sanusart/following{/other_user}',
    'gists_url': 'https://api.github.com/users/sanusart/gists{/gist_id}',
    'starred_url': 'https://api.github.com/users/sanusart/starred{/owner}{/repo}',
    'subscriptions_url': 'https://api.github.com/users/sanusart/subscriptions',
    'organizations_url': 'https://api.github.com/users/sanusart/orgs',
    'repos_url': 'https://api.github.com/users/sanusart/repos',
    'events_url': 'https://api.github.com/users/sanusart/events{/privacy}',
    'received_events_url': 'https://api.github.com/users/sanusart/received_events',
    'type': 'User',
    'site_admin': false
  };
}
