(function() {
  'use strict';

  angular
    .module('symphony')
    .factory('AlarmsService', AlarmsService);

  function AlarmsService($http, apiBasePath, Auth) {
    var endpoint = 'presentationServices/alarms/';
    function hackDate(date) {
      return date.substring(0, 10) + ' ' + date.substring(11, 19);
    }

    var get = function (callback) {
      $http.get(apiBasePath + endpoint + Auth.getSiteGuid())
        .then(function (response) {
          callback (response.data);
        });
    };

    var ack = function (alarm, callbackOnAckDone) {
      $http.put(apiBasePath + endpoint + alarm.eventId + '/' + Auth.getSiteGuid())
        .then(function (response) {
          alarm.ackDateTime = hackDate(response.data.ackDateTime);
          callbackOnAckDone ();
        });
    };

    return {
      get: get,
      ack: ack
    };
  }
})();