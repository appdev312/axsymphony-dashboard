(function() {
  'use strict';

  angular
    .module('symphony')
    .factory('authInterceptor', authInterceptor);

  /** @ngInject */
  function authInterceptor($q, $cookies, $location) {
    return {
      // add authorization token to headers
      request: function(config) {
        config.hearders = config.headers || {};

        if ($cookies.get('access_token')) {
          config.headers.Authorization = 'Bearer ' + $cookies.get('access_token');
        }

        return config;
      },

      // intercept 401s and redirect you to login
      responseError: function(response) {
        if (response.status === 401) {
          $location.path('/');
          $cookies.remove('access_token');

          return $q.reject(response);
        } else {
          return $q.reject(response);
        }
      }
    }
  }

})();
