'use strict';

angular.module('gisto.directive.modal', []).directive('modal', function () {
  return {
    restrict: "E",
    template: '<div ng-if="showModal" class="modal-overlay"></div>' +
        '<div ng-if="showModal" class="modal-window">' +
        '<div class="modal-close" ng-click="hideModal()"><i class="fa fa-close"></i></div>' +
        '<h1>{{modal.title}}</h1>' +
        '{{modal.content}}' +
        '</div>',
    scope: true,
    link: function (scope, element, attrs) {
      scope.showModal = true;
      scope.modal = {
        title: 'Title',
        content: 'Content'
      };
      scope.hideModal = function() {
        scope.showModal = !scope.showModal;
      };
    }
  }
});
