(function() {
  "use strict";

  var StockService = [
    "$rootScope",
    "$window",
    "$http",
    "$q",
    "$timeout",
    "API",
    function($rootScope, $window, $http, $q, $timeout, API) {
      // Init
      var store = $window.localStorage;

      // Private Members
      var current = null,
        RelStks = null,
        searchHistory = [],
        searchedStocks = [];

      // Public Members
      var self = {
        isBeingWatched: false,
        search: function(query) {
          var deferred = $q.defer(),
            url = API.SEARCH_STOCK_BY_NAME + $window.encodeURIComponent(query);
          $http.get(url, {timeout: 30000}).then(function(response) {
            var searchArr = response.data.data;
            var countryCode = store.getItem('countryCode');
            if(Array.isArray(searchArr) && countryCode !== 'undefined' && countryCode !== 'null' && countryCode !== '') {
              searchArr = searchArr.filter(function(element) {
                return element.RT0EC === countryCode;
              });
            }
            deferred.resolve(searchArr);
          }).catch(function(err) {
            deferred.reject(err);
          });
          return deferred.promise;
        },
        getData: function(stocksArray) {
          var symbols = "";
          angular.forEach(stocksArray, function(current, index, arr) {
            symbols += current;
            if(!(arr.length - index === 1)) {
              symbols += ",";
            }
          });
          var deferred = $q.defer(),
            url = API.GET_STOCK_DATA + $window.encodeURIComponent(symbols);
          $http.get(url, {timeout: 30000}).then(function(response) {
            deferred.resolve(response.data);
          }).catch(function(err) {
            deferred.reject(err);
          });
          return deferred.promise;
        },
        relatedStocks: function(stocksArray) {
          var query = "";
          angular.forEach(stocksArray, function(current, index, arr) {
            query += (current.exchgId + "." + current.secTyp + "." + current.sym + "." + current.exchg);
            if(!(arr.length - index === 1)) {
              query += ",";
            }
          });
          var url = API.GET_STOCK_DATA + $window.encodeURIComponent(query);
          $http.get(url, {timeout: 30000}).then(function(response) {
            RelStks = response.data;
            current.RelStks = response.data;
          });
        },
        view: function(symbol, relatedStocksFlag) {
          var deferred = $q.defer(), url = API.GET_STOCK_DATA + $window.encodeURIComponent(symbol);
          $http.get(url, {timeout: 30000}).then(function(response) {
            current = response.data[0];
            deferred.resolve(current);
            if(relatedStocksFlag) {
              self.relatedStocks(current.RelStks);
            } else {
              current.RelStks = RelStks;
            }
          }).catch(function(err) {
            deferred.reject(err);
          });
          return deferred.promise;
        },
        addToHistory: function(stock) {
          if(searchHistory.indexOf(stock) === -1) {
            var index = searchHistory.findIndex(function(val) {
              return val.FullInstrument === stock.FullInstrument;
            });
            if(index === -1) {
              searchHistory.push(stock);
              store.setItem("searchHistory", angular.toJson(searchHistory));
            }
          }
        },
        toggleInWatchlist: function(instrument) {
          var deferred = $q.defer();
          if($rootScope.user.watchlist.indexOf(instrument) === -1) {
            $http.put(API[API.ENV].TOGGLE_INSTRUMENT_IN_WATCHLIST, {symbol: instrument}).then(function(res) {
              if(!res.data.error) {
                $rootScope.user.watchlist.push(instrument);
                self.isBeingWatched = true;
                store.setItem("user", angular.toJson($rootScope.user));
                deferred.resolve();
              }
            });
          } else {
            $http.delete(API[API.ENV].TOGGLE_INSTRUMENT_IN_WATCHLIST + instrument).then(function(res) {
              if(!res.data.error) {
                $rootScope.user.watchlist.splice($rootScope.user.watchlist.indexOf(instrument), 1);
                self.isBeingWatched = false;
                store.setItem("user", angular.toJson($rootScope.user));
                deferred.resolve();
              }
            });
          }
          return deferred.promise;
        },
        buy: function(obj) {
          var deferred = $q.defer();
          $http.put(API[API.ENV].BUY_STOCK, obj).then(function(res) {
            if(!res.data.error) {
              $rootScope.user = res.data.data;
              self.isBeingWatched = true;
              store.setItem("user", angular.toJson($rootScope.user));
              deferred.resolve(res.data.message);
            }
          }).catch(function(err) {
            deferred.reject(err.data.message);
          });
          return deferred.promise;
        },
        sell: function(obj) {
          var deferred = $q.defer();
          $http.put(API[API.ENV].SELL_STOCK, obj).then(function(res) {
            if(!res.data.error) {
              $rootScope.user = res.data.data;
              self.isBeingWatched = true;
              store.setItem("user", angular.toJson($rootScope.user));
              deferred.resolve(res.data.message);
            }
          }).catch(function(err) {
            deferred.reject(err.data.message);
          });
          return deferred.promise;
        },
        isWatching: function(instrument) {
          self.isBeingWatched = !($rootScope.user.watchlist.indexOf(instrument) === -1);
        },
        restoreHistory: function() {
          var history = store.getItem("searchHistory");
          if(history) {
            searchHistory = angular.fromJson(history);
          }
        },
        removeHistory: function() {
          searchHistory = [];
        },
        getHistory: function() {
          return searchHistory;
        }
      };
      self.restoreHistory();
      return self;
    }];

  angular.module("app").factory("StockService", StockService);

}());