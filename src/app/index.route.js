(function() {
  'use strict';

  angular
    .module('symphony')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/login/login.html',
        controller: 'LoginController',
        controllerAs: 'vm'
      })
      .state('logout', {
        url: '/logout',
        templateUrl: 'app/login/login.html',
        controller: 'LoginController',
        controllerAs: 'vm'
      })
      .state('overview', {
        url: '/overview',
        templateUrl: 'app/overview/overview.html',
        controller: 'OverviewController',
        controllerAs: 'vm',
        authenticate: true
      })
      .state('dashboard', {
        url: '/dashboard',
        templateUrl: 'app/dashboard/dashboard.html',
        controller: 'DashboardController',
        controllerAs: 'vm',
        authenticate: true
      })
      .state('water-efficiency-summary', {
        url: '/water-efficiency-summary',
        templateUrl: 'app/waterefficiency/waterefficiency.html',
        controller: 'WaterEfficiencyController',
        controllerAs: 'vm',
        authenticate: true
      })
      .state('energy-efficiency-summary', {
        url: '/energy-efficiency-summary',
        templateUrl: 'app/energyefficiency/energyefficiency.html',
        controller: 'EnergyEfficiencyController',
        controllerAs: 'vm',
        authenticate: true
      })
      .state('trends', {
        url: '/trends',
        templateUrl: 'app/trends/trends.html',
        controller: 'TrendsController',
        controllerAs: 'vm',
        authenticate: true
      })
      .state('interventions', {
        url: '/interventions',
        templateUrl: 'app/interventions/interventions.html',
        controller: 'InterventionsController',
        controllerAs: 'vm',
        authenticate: true
      })
      .state('alarms', {
        url: '/alarms',
        templateUrl: 'app/alarms/alarms.html',
        controller: 'AlarmsController',
        controllerAs: 'vm',
        authenticate: true
      })
      .state('water-sources', {
      url: '/water-sources',
      templateUrl: 'app/watersources/watersources.html',
      controller: 'WaterSourcesController',
      controllerAs: 'vm',
      authenticate: true
    });

    $urlRouterProvider.otherwise('/');
  }
})();