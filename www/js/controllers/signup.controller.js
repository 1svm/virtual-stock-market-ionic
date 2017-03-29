(function() {
  "use strict";

  var SignupCtrl = [
    "$scope",
    "$state",
    "$ionicPopup",
    "$ionicLoading",
    "AuthService",
    function($scope, $state, $ionicPopup, $ionicLoading, AuthService) {

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

      $scope.doRegister = function(form) {
        if(form.$valid) {
          AuthService.signup({
            name: form.name.$modelValue,
            phone: form.phone.$modelValue,
            email: form.email.$modelValue,
            password: form.password.$modelValue,
            confirmPassword: form.confirmPassword.$modelValue,
            referral: form.referral.$modelValue
          }).then(function(message) {
            $ionicPopup.alert({
              title: "vTrade",
              template: "<div style='text-align: center'>" + message + ".</div>"
            }).then(function() {
              $state.go("login");
            });
          });
        }
      };

      $scope.help = function() {
        $ionicPopup.alert({
          title: "Form Instructions",
          template: "<b>Name</b> - only Alphabets and space is allowed<br>" +
          "<b>Phone Number</b> - only Numerics are allowed<br>" +
          "<b>Password</b> - minimum 3 letters"
        });
      };

    }];

  angular.module("app").controller("SignupCtrl", SignupCtrl);

}());