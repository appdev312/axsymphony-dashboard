(function() {
  'use strict';

  angular
    .module('symphony')
    .factory('TrendsService', TrendsService);

  /** @ngInject */
  function TrendsService(Auth, $http, $httpParamSerializer, apiBasePath) {
    return {
      loadTrendsData: function(variableId, params) {
        var route = apiBasePath + 'presentationServices/trends/' + variableId + '/' + Auth.getSiteGuid();
        if (params) {
          route += '?' + $httpParamSerializer(params);
        }
        return $http.get(route);
      }
    }
  }
})();
