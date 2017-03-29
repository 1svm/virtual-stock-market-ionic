(function() {
  "use strict";

  var AuthService = [
    "$rootScope",
    "$window",
    "$http",
    "$q",
    "jwtHelper",
    "API",
    "EVENTS",
    function($rootScope, $window, $http, $q, jwtHelper, API, EVENTS) {
      var store = $window.localStorage;
      var self  = {
        isLoading: false,
        signup: function(credentials) {
          self.isLoading = true;
          var deferred   = $q.defer();
          $http.post(API[API.ENV].CREATE_USER, credentials)
          .then(function(response) {
            deferred.resolve(response.data.message);
          })
          .catch(function(err) {
            deferred.reject(err.data.message);
          })
          .finally(function() {
            self.isLoading = false;
          });
          return deferred.promise;
        },
        login: function(credentials) {
          self.isLoading = true;
          var deferred   = $q.defer();
          $http.post(API[API.ENV].LOGIN_USER, credentials)
          .then(function(response) {
//            var user = jwtHelper.decodeToken(response.data.token);
//            console.log(user);
            var user = response.data.profile;
            store.setItem("token", response.data.token);
            store.setItem("user", angular.toJson(user));
            $rootScope.user = user;
            deferred.resolve(response.data.message);
          })
          .catch(function(err) {
            deferred.reject(err.data.message)
          })
          .finally(function() {
            self.isLoading = false;
          });
          return deferred.promise;
        },
        logout: function() {
          $rootScope.user = null;
          store.clear();
          $rootScope.$broadcast(EVENTS.NOT_AUTHENTICATED);
        },
        restoreUser: function() {
          var user = store.getItem("user");
          if(user) {
            $rootScope.user = angular.fromJson(user);
          }
        }
      };
      return self;
    }];

  angular.module("app").factory("AuthService", AuthService);

}());