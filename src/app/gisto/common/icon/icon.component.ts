/**
 * icon component
 *
 * Usage: <icon icon="globe" size="22" color="red" rotate="0"></icon>
 */

import { Component, Input } from '@angular/core';

@Component({
    selector: 'icon',
    template: `
      <span class="{{ cssClass || '' }}" [ngStyle]="{
        'background-color': color,
        'display': 'inline-block',
        'vertical-align': 'middle',
        '-webkit-mask-repeat': 'no-repeat',
        '-webkit-mask-size': 'contain',
        '-webkit-mask-position': 'center',
        'width': size + 'px',
        'height': size + 'px',
        '-webkit-mask-image': 'url(../../../../assets/svg/' + ICONS[icon] + ')',
        'transform': 'rotate(' + rotate + ')'
      }"></span>
    `
})
export class IconComponent {

    @Input() icon: string;
    @Input() cssClass: string;
    @Input() size = '22';
    @Input() color = '#fff';
    @Input() rotate = '0deg';

    ICONS: Object = {
      add: 'ios-add.svg',
      globe: 'ios-globe-outline.svg',
      cog: 'ios-settings-outline.svg',
      info: 'ios-information-circle-outline.svg',
      success: 'ios-checkmark-circle-outline.svg',
      error: 'ios-close-circle-outline.svg',
      warn: 'ios-information-circle-outline.svg',
      notification: 'ios-notifications-outline.svg',
      lock: 'ios-lock-outline.svg',
      unlock: 'ios-unlock-outline.svg',
      'star-full': 'ios-star.svg',
      'star-empty': 'ios-star-outline.svg',
      search: 'ios-search-outline.svg',
      delete: 'ios-trash-outline.svg',
      chat: 'ios-chatbubbles-outline.svg',
      ellipsis: 'ios-more-outline.svg',
      edit: 'ios-create-outline.svg',
      cancel: 'ios-close.svg',
      eye: 'ios-eye-outline.svg',
      'eye-slash': 'ios-eye-off-outline.svg',
      check: 'ios-checkmark-circle-outline.svg',
      warning: 'ios-warning-outline.svg',
      'arrow-up': 'ios-arrow-up.svg',
      'arrow-down': 'ios-arrow-down.svg',
      'arrow-left': 'ios-arrow-back.svg',
      'arrow-right': 'ios-arrow-forward.svg',
      menu: 'ios-menu-outline.svg',
      activity: 'ios-pulse-outline.svg',
      dashboard: 'ios-speedometer-outline.svg',
      fork: 'ios-git-branch.svg'
    };

}
