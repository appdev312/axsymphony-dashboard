(function() {
  'use strict';

  angular
    .module('symphony')
    .factory('Auth', Auth);

  function Auth($http, $cookies, $q, apiBasePath) {
    return {
      getSiteGuid: function() {
        if (typeof $cookies.get('userRec') === 'undefined') {
          return null;
        }

        var userRec = angular.fromJson($cookies.get('userRec'));
        return userRec.siteGuid;
      },

      login: function(user, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();

        $http.post(apiBasePath + 'securityService/userAuth/', {
          username: user.username,
          password: user.password
        })
        .success(function(data) {
          deferred.resolve(data);
          $cookies.put('access_token', data.token);
          $cookies.put('userRec', angular.toJson(data.userRec));

          return cb(data);
        }).
        error(function(err) {
          this.logout();
          deferred.reject(err);

          return cb(err);
        }.bind(this));

        return deferred.promise;
      },

      logout: function() {
        $cookies.remove('access_token');
        $cookies.remove('userRec');
      },

      isAuthenticated: function() {
        return (typeof $cookies.get('access_token') !== 'undefined' && $cookies.get('access_token') !== null);
      },

      defaultState: function() {
        return angular.fromJson($cookies.get('userRec')).defaultPage;
      }
    }
  }
})();