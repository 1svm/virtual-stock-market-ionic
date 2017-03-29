(function() {
  "use strict";

  var WatchlistCtrl = [
    "$rootScope",
    "$scope",
    "$state",
    "$ionicLoading",
    "$ionicHistory",
    "StockService",
    function($rootScope, $scope, $state, $ionicLoading, $ionicHistory, StockService) {

      $scope.$watch("isWatchlistLoading", function(newVal, oldVal) {
        if(newVal) {
          $ionicLoading.show({
            template: "<ion-spinner icon='spiral'></ion-spinner><br>" +
            "<div style='font-size:small'>Please Wait...</div>"
          })
        } else {
          $ionicLoading.hide();
        }
      });

      $scope.$on("$ionicView.beforeEnter", function() {
        $scope.isRemovingFromWatchlist = true;
        $scope.shouldShowDelete = false;
        $scope.isWatchlistLoading = true;
      });

      function callme() {
        if($rootScope.user.watchlist.length === 0) {
          $scope.watchlist = [];
          $scope.isWatchlistLoading = false;
          $scope.isRemovingFromWatchlist = true;
          return;
        }
        StockService.getData($rootScope.user.watchlist)
        .then(function(res) {
          $scope.watchlist = res;
        })
        .finally(function() {
          $scope.isWatchlistLoading = false;
          $scope.isRemovingFromWatchlist = true;
        });
      }

      $scope.$on("$ionicView.enter", function(scopes, states) {
        callme();
      });

      $scope.doRefresh = function() {
        callme();
        $scope.$broadcast("scroll.refreshComplete");
      };

      $scope.toggleDelete = function() {
        $scope.shouldShowDelete = !$scope.shouldShowDelete;
      };

      $scope.removeFromWatchlist = function(instrument) {
        $scope.isRemovingFromWatchlist = false;
        StockService.toggleInWatchlist(instrument)
        .then(function() {
          callme();
        });
      };

    }];

  angular.module("app").controller("WatchlistCtrl", WatchlistCtrl);
}());