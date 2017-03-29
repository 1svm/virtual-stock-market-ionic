(function() {
  "use strict";

  var MainCtrl = [
    "$window",
    "$rootScope",
    "$timeout",
    "$scope",
    "$state",
    "$ionicModal",
    "$ionicHistory",
    "$ionicNavBarDelegate",
    "$ionicLoading",
    "CountryISOService",
    "AuthService",
    "StockService",
    "EVENTS",
    function($window, $rootScope, $timeout, $scope, $state, $ionicModal, $ionicHistory, $ionicNavBarDelegate, $ionicLoading, CountryISOService, AuthService, StockService, EVENTS) {

      $scope.$watch('selected_ccode', function(newVal, oldVal) {
        if(newVal !== undefined && newVal !== 'undefined') {
          $window.localStorage.setItem('countryCode', newVal);
        }
      });

      $scope.$on(EVENTS.NOT_AUTHENTICATED, function() {
        StockService.removeHistory();
      });

      $scope.$on("$ionicView.beforeEnter", function() {
        $ionicModal.fromTemplateUrl("templates/user/search.html", {
          scope: $scope,
          animation: "slide-in-up"
        }).then(function(modal) {
          $scope.searchModal = modal;
        });
        $ionicModal.fromTemplateUrl("templates/user/settings.html", {
          scope: $scope,
          animation: "slide-in-right"
        }).then(function(settingsModal) {
          $scope.settingsModal = settingsModal;
        });
        $scope.itemsInWatchlist = $rootScope.user.watchlist.length;
        $scope.searchHistory = StockService.getHistory();
        $scope.countries = CountryISOService.countries;
        $scope.selected_ccode = $window.localStorage.getItem('countryCode');
      });

      $scope.searchStock = function() {
        $scope.isSearching = true;
        StockService.search($scope.searchQuery).then(function(searchedStocks) {
          $scope.searchedStocks = searchedStocks;
        }).finally(function() {
          $scope.isSearching = false;
        });
      };

      $scope.viewStock = function(stock) {
        $scope.searchModal.hide();
        StockService.addToHistory(stock);
        $state.go("main.stock", {FullInstrument: stock.FullInstrument});
      };

      $scope.logout = function() {
        AuthService.logout();
        $ionicHistory.clearCache();
        $state.go("login");
      };

    }];

  angular.module("app").controller("MainCtrl", MainCtrl);
}());