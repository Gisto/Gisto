'use strict';

function viewCtrl($scope) {
    $scope.avatar = 'https://secure.gravatar.com/avatar/' + JSON.parse(localStorage.settings).avatar;
}