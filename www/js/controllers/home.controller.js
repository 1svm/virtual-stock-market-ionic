(function() {
  "use strict";

  var HomeCtrl = [
    "$log",
    "$scope",
    "$state",
    "$rootScope",
    function($log, $scope, $state, $rootScope) {

    $scope.$on("$ionicView.beforeEnter", function() {
        $scope.portfolio = $rootScope.user.portfolio;
      });
    }];

  angular.module("app").controller("HomeCtrl", HomeCtrl);

}());