(function() {
  "use strict";

  var StockCtrl = [
    "$scope",
    "$state",
    "$stateParams",
    "$ionicLoading",
    "$rootScope",
    "$ionicPopup",
    "StockService",
    "$log",
    "$interval",
    "$timeout",
    function($scope, $state, $stateParams, $ionicLoading, $rootScope, $ionicPopup, StockService, $log, $interval, $timeout) {

      var intervalFlag = true;

      $scope.calcCapacity = function() {
        $scope.capacity = Math.floor($scope.user.wallet / $scope.stock.Lp);
      };

      $scope.calcDebitAmt = function() {
        $scope.debit = ($scope.quantity * $scope.stock.Lp).toFixed(2);
      };

      $scope.buy = function() {
        $ionicLoading.show({
          template: "<ion-spinner icon='spiral'></ion-spinner><br>" +
          "<div style='font-size:small'>Please Wait...</div>"
        });
        StockService.buy({
          symbol: $stateParams.FullInstrument,
          name: $scope.stock.Cmp,
          rate: $scope.stock.Lp,
          quantity: $scope.quantity
        }).then(function(message) {
          $ionicPopup.alert({
            title: "vTrade",
            template: "<div style='text-align: center'>" + message + ".</div>"
          });
        }).catch(function(errMessage) {
          $ionicPopup.alert({
            title: "vTrade",
            template: "<div style='text-align: center'>" + errMessage + ".</div>"
          });
        }).finally(function() {
          $ionicLoading.hide();
        });
      };

      $scope.sell = function() {
        $ionicLoading.show({
          template: "<ion-spinner icon='spiral'></ion-spinner><br>" +
          "<div style='font-size:small'>Please Wait...</div>"
        });
        StockService.sell({
          symbol: $stateParams.FullInstrument,
          rate: $scope.stock.Lp,
          quantity: $scope.quantity
        }).then(function(msg) {
//          for(var i = array.length; i--;) {}
          $ionicPopup.alert({
            title: "vTrade",
            template: "<div style='text-align: center'>" + msg + ".</div>"
          });
        }).catch(function(message) {
          $ionicPopup.alert({
            title: "vTrade",
            template: "<div style='text-align: center'>" + message + ".</div>"
          });
        }).finally(function() {
          $ionicLoading.hide();
        });
      };

      $scope.$watch("isStockLoading", function(newVal, oldVal) {
        if(newVal) {
          $ionicLoading.show({
            template: "<ion-spinner icon='spiral'></ion-spinner><br>" +
            "<div style='font-size:small'>Please Wait...</div>"
          })
        } else {
          $ionicLoading.hide();
        }
      });

      $scope.$on("$ionicView.beforeEnter", function(scopes, states) {
        $scope.debit = (0).toFixed(2);
        $scope.isStockLoading = true;
        StockService.isWatching($stateParams.FullInstrument);
        $scope.isBeingWatched = StockService.isBeingWatched;
        $scope.isAddingToWatchlist = false;
        $scope.user = $rootScope.user;
      });
      
      $scope.$on('$ionicView.leave', function() {
        intervalFlag = false;
      });

      $scope.refetchData = function(instrument) {
        StockService.view(instrument).then(function(stock) {
          $scope.stock = stock;
        }).finally(function() {
          $scope.calcCapacity();
          $scope.isStockLoading = false;
          if(intervalFlag) {
            $timeout(function() {
              $scope.refetchData(instrument);
            }, 5000);
          }
        });
      };

      $scope.$on("$ionicView.enter", function(scopes, states) {
        var instrument = $stateParams.FullInstrument;
        $scope.refetchData(instrument);
      });

      $scope.viewSt = function(stock) {
        $state.go($state.current, {FullInstrument: stock.FlIns});
      };

      $scope.addToWatchlist = function(isntrument) {
        $scope.isAdding = true;
        StockService.toggleInWatchlist(isntrument).then(function() {
          $scope.isBeingWatched = StockService.isBeingWatched;
          $scope.isAdding = false;
        });
      };

    }];

  angular.module("app").controller("StockCtrl", StockCtrl);

}());