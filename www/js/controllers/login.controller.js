(function() {
  "use strict";

  var LoginCtrl = [
    "$log",
    "$scope",
    "$state",
    "$ionicLoading",
    "$ionicPopup",
    "AuthService",
    function($log, $scope, $state, $ionicLoading, $ionicPopup, AuthService) {
      $scope.Auth = AuthService;

      $scope.$watch("Auth.isLoading", function(newVal, oldValue) {
        if((!oldValue) && newVal) {
          $ionicLoading.show({
            template: "<ion-spinner icon='spiral'></ion-spinner><br>" +
            "<div style='font-size:small'>Please Wait...</div>"
          })
        }
        if(oldValue && (!newVal)) {
          $ionicLoading.hide();
        }
      });

      $scope.doLogin = function(form) {
        if(form.$valid) {
          AuthService.login({
            email: form.email.$modelValue,
            password: form.password.$modelValue
          }).then(function() {
            $state.go("main.home");
          }).catch(function(message) {
            var pop = $ionicPopup.alert({
              title: "Unable to Log In",
              template: "<div style='text-align: center'>" + message + "</div>"
            });
          });
        }
      };

    }];

  angular.module("app").controller("LoginCtrl", LoginCtrl);

}());