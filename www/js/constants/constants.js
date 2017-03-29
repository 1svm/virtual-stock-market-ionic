(function() {
  "use strict";

  var API = {
    ENV: 'PRODUCTION',
    SEARCH_STOCK_BY_NAME: "https://finance.services.appex.bing.com/Market.svc/MTAutocomplete?q=",
    GET_STOCK_DATA: "https://finance.services.appex.bing.com/Market.svc/RealTimeQuotes?symbols=",
    DEVELOPMENT: {
      CREATE_USER: "http://localhost:1337/api/v1/users/",
      LOGIN_USER: "http://localhost:1337/api/v1/users/login/",
      TOGGLE_INSTRUMENT_IN_WATCHLIST: "http://localhost:1337/api/v1/users/watchlist/",
      BUY_STOCK: "http://localhost:1337/api/v1/users/portfolio/buy/",
      SELL_STOCK: "http://localhost:1337/api/v1/users/portfolio/sell/",
      SEARCH_USER_BY_EMAIL: "http://localhost:1337/api/v1/users/search?email=",
      SEARCH_USER_BY_PHONE: "http://localhost:1337/api/v1/users/search?phone="
    },
    PRODUCTION: {
      CREATE_USER: "https://limitless-oasis-34229.herokuapp.com/api/v1/users/",
      LOGIN_USER: "https://limitless-oasis-34229.herokuapp.com/api/v1/users/login/",
      TOGGLE_INSTRUMENT_IN_WATCHLIST: "https://limitless-oasis-34229.herokuapp.com/api/v1/users/watchlist/",
      BUY_STOCK: "https://limitless-oasis-34229.herokuapp.com/api/v1/users/portfolio/buy/",
      SELL_STOCK: "https://limitless-oasis-34229.herokuapp.com/api/v1/users/portfolio/sell/",
      SEARCH_USER_BY_EMAIL: "https://limitless-oasis-34229.herokuapp.com/api/v1/users/search?email=",
      SEARCH_USER_BY_PHONE: "https://limitless-oasis-34229.herokuapp.com/api/v1/users/search?phone="
    }
  };

  var ROLES = {
    USER_ROLE: "user",
    ADMIN_ROLE: "admin"
  };

  var EVENTS = {
    NOT_AUTHENTICATED: "unauthenticated",
    NOT_AUTHORIZED: "unauthorized"
  };

  angular.module("app").constant("API", API).constant("ROLES", ROLES).constant("EVENTS", EVENTS);

}());