(function() {
  "use strict";

  var run = [
    "$rootScope",
    "$window",
    "$state",
    "$ionicViewSwitcher",
    "$ionicPlatform",
    "$ionicHistory",
    "authManager",
    function($rootScope, $window, $state, $ionicViewSwitcher, $ionicPlatform, $ionicHistory, authManager) {
      var store = $window.localStorage;
      $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
        if(toState.data.authenticated) {
          if(!$rootScope.user) {
            event.preventDefault();
            store.clear();
            $state.go("login");
          } else {
            if(!(store.getItem("token") && (store.getItem("user")))) {
              event.preventDefault();
              $rootScope.user = null;
              store.clear();
              $state.go("login");
            } else if(toState.data.roles.indexOf($rootScope.user.role) === -1) {
              event.preventDefault();
              $state.go($state.current, {}, {reload: true});
            }
          }
        }
      });

      authManager.redirectWhenUnauthenticated();

      $ionicPlatform.ready(function() {
        if($window.cordova && $window.cordova.plugins.Keyboard) {
          $window.cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
          $window.cordova.plugins.Keyboard.disableScroll(true);
        }
        if($window.StatusBar) {
          $window.StatusBar.styleDefault();
        }
      });

    }];

  var config = [
    "$httpProvider",
    "$stateProvider",
    "$urlRouterProvider",
    "$windowProvider",
    "$ionicConfigProvider",
    "jwtOptionsProvider",
    "$ionicNativeTransitionsProvider",
    "ROLES",
    function($httpProvider, $stateProvider, $urlRouterProvider, $windowProvider, $ionicConfigProvider, jwtOptionsProvider, $ionicNativeTransitionsProvider, ROLES) {

      $ionicConfigProvider.backButton.text("").previousTitleText(false);
      $ionicConfigProvider.scrolling.jsScrolling(false);

      $ionicNativeTransitionsProvider.setDefaultOptions({
        duration: 800, // in milliseconds (ms), default 400,
        slowdownfactor: 4, // overlap views (higher number is more) or no overlap (1), default 4
        iosdelay: -1, // ms to wait for the iOS webview to update before animation kicks in, default -1
        androiddelay: -1, // same as above but for Android, default -1
        winphonedelay: -1, // same as above but for Windows Phone, default -1,
        fixedPixelsTop: 0, // the number of pixels of your fixed header, default 0 (iOS and Android)
        fixedPixelsBottom: 0, // the number of pixels of your fixed footer (f.i. a tab bar), default 0 (iOS and Android)
        triggerTransitionEvent: '$ionicView.afterEnter', // internal ionic-native-transitions option
        backInOppositeDirection: false // Takes over default back transition and state back transition to use the opposite direction transition to go back
      });

      $ionicNativeTransitionsProvider.setDefaultTransition({
        type: 'slide',
        direction: 'left'
      });

      $ionicNativeTransitionsProvider.setDefaultBackTransition({
        type: 'slide',
        direction: 'right'
      });

      var $window = $windowProvider.$get(),
        store = $window.localStorage;

      jwtOptionsProvider.config({
        tokenGetter: ["AuthService", function(AuthService) {
          AuthService.restoreUser();
          return store.getItem("token");
        }],
        unauthenticatedRedirector: ["$rootScope", "$state", "$window", function($rootScope, $state, $window) {
          $rootScope.user = null;
          $window.localStorage.clear();
          $state.go("login");
        }],
        whiteListedDomains: ["localhost", "limitless-oasis-34229.herokuapp.com"]
      });

      $httpProvider.interceptors.push("jwtInterceptor");

      $stateProvider.state("login", {
        url: "/login",
        cache: false,
        templateUrl: "templates/login.html",
        controller: "LoginCtrl",
        data: {
          authenticated: false
        }
      }).state("signup", {
        url: "/signup",
        cache: false,
        templateUrl: "templates/signup.html",
        controller: "SignupCtrl",
        data: {
          authenticated: false
        }
      }).state("main", {
        url: "/main",
        abstract: true,
        templateUrl: "templates/user/main.html",
        controller: "MainCtrl"
      }).state("main.home", {
        url: "/home",
        cache: false,
        views: {
          "mainView": {
            templateUrl: "templates/user/home.html",
            controller: "HomeCtrl"
          }
        },
        data: {
          authenticated: true,
          roles: [ROLES.ADMIN_ROLE, ROLES.USER_ROLE]
        }
      }).state("main.watchlist", {
        url: "/watchlist",
        cache: false,
        views: {
          "mainView": {
            templateUrl: "templates/user/watchlist.html",
            controller: "WatchlistCtrl"
          }
        },
        data: {
          authenticated: true,
          roles: [ROLES.ADMIN_ROLE, ROLES.USER_ROLE]
        }
      }).state("main.stock", {
        url: "/stock/:FullInstrument",
        cache: false,
        views: {
          "mainView": {
            templateUrl: "templates/user/stock.html",
            controller: "StockCtrl"
          }
        },
        data: {
          authenticated: true,
          roles: [ROLES.ADMIN_ROLE, ROLES.USER_ROLE]
        }
      });

      $urlRouterProvider.otherwise(function($injector) {
        var $state = $injector.get("$state");
        $state.go("main.home");
      });

    }];

  angular.module("app", ["ionic", "ngAnimate", "angular-jwt", "ionic-native-transitions", "angular-marquee"]).config(config).run(run);

}());
