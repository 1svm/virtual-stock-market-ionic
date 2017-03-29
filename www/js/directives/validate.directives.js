(function() {
  "use strict";

  var emailAvailable = [
    "$http",
    "$q",
    "API",
    function($http, $q, API) {
      return {
        restrict: "A",
        require: "ngModel",
        link: function(scope, element, attrs, ngModel) {
          ngModel.$asyncValidators.emailAvailable = function(email) {
            var deferred = $q.defer();
            $http.get(API[API.ENV].SEARCH_USER_BY_EMAIL + email).then(function(data) {
              ngModel.$available = true;
              ngModel.$unavailable = false;
              deferred.resolve(data);
            }).catch(function(err) {
              ngModel.$available = false;
              ngModel.$unavailable = true;
              deferred.reject(err);
            });
            return deferred.promise;
          };
        }
      }
    }];

  var phoneAvailable = [
    "$http",
    "$q",
    "API",
    function($http, $q, API) {
      return {
        restrict: "A",
        require: "ngModel",
        link: function(scope, element, attrs, ngModel) {
          ngModel.$asyncValidators.phoneAvailable = function(phone) {
            var deferred = $q.defer();
            $http.get(API[API.ENV].SEARCH_USER_BY_PHONE + phone).then(function(data) {
              ngModel.$available = true;
              ngModel.$unavailable = false;
              deferred.resolve(data);
            }).catch(function(err) {
              ngModel.$available = false;
              ngModel.$unavailable = true;
              deferred.reject(err);
            });
            return deferred.promise;
          };
        }
      };
    }];

  angular.module("app").directive("emailAvailable", emailAvailable).directive("phoneAvailable", phoneAvailable);

}());