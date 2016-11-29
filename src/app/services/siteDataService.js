(function () {
  'use strict';

  angular
    .module('symphony')
    .service('SiteDataService', SiteDataService);

  function SiteDataService($http, apiBasePath, Auth) {
    // implemented the callback to make it easier to include synchronous calls where it may need it
    this.fetchSiteData = function (callback) {
      // we only do this once, the info can be cached safely
      if (this.siteInfo.siteName != '') {
        if (callback)
          callback ();

        return;
      }

      var instance = this;
      $http.get(apiBasePath + 'appServices/siteData/' + Auth.getSiteGuid())
        .then(function (response) {
          instance.siteInfo.siteName = response.data.siteRec.siteInfo.name;
          instance.siteInfo.city = response.data.siteRec.siteInfo.location.city;
          instance.siteInfo.state = response.data.siteRec.siteInfo.location.state;
          instance.siteInfo.weatherURL = response.data.siteRec.siteInfo.location.weatherURL;
          instance.siteInfo.timeZone = response.data.siteRec.siteInfo.location.tz;
          instance.siteInfo.userImage = response.data.siteRec.siteInfo.userImage;

          if (callback)
            callback ();
        });
    };

    this.siteInfo = {
      siteName: '',
      city: '',
      state: '',
      weatherURL: '',
      timeZone: '',
      userImage: ''
    };
  }
})();
