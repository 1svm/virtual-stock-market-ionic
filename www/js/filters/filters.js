(function() {
  "use strict";

  var toFixed = function() {
    return function(num, fix) {
      if(!num) return 0;
      if(isNaN(num)) return num;
      return num.toFixed(fix || 3);
    };
  };

  var toDate = function() {
    return function(dateInStringFormat, format, locale) {
      if(!dateInStringFormat) return;
      return moment(dateInStringFormat, format || "DD-MM-YYYY").format(locale || "MMM D");
    }
  };

  var toTime = function() {
    return function(timeInStringFormat) {
      if(!timeInStringFormat) return;
      return timeInStringFormat.substring(0, timeInStringFormat.lastIndexOf(":"));
    }
  };

  var toMoney = function() {
    return function(num) {
      if(!num) return;
      if(isNaN(num)) return num;
      if(num < 9999) {
        return num;
      }
      if(num < 1000000) {
        return Math.round(num / 1000) + "K";
      }
      if(num < 10000000) {
        return (num / 1000000).toFixed(2) + "M";
      }
      if(num < 1000000000) {
        return (num / 1000000).toFixed(2) + "M";
      }
      if(num < 1000000000000) {
        return (num / 1000000000).toFixed(2) + "B";
      }
      if(num < 10000000000000) {
        return (num / 1000000000000).toFixed(2) + "T";
      }
      return num;
    };
  };

  angular.module("app")
  .filter("toFixed", toFixed)
  .filter("toDate", toDate)
  .filter("toTime", toTime)
  .filter("toMoney", toMoney);

}());