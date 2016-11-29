(function() {
  'use strict';

  angular
    .module('symphony')
    .directive('eventsTable', EventsTable);

  /** @ngInject */
  function EventsTable() {
    var template = '<table class="table table-striped table-bordered">' +
        '  <tr>' +
        '    <th style="width: 80px"></th>' +
        '    <th>Raised Date Time</th>' +
        '    <th>Description</th>' +
        '    <th>Acknowledge Date Time</th>' +
        '  </tr>' +
        '  <tr ng-repeat="event in needAttention">' +
        '    <td><button class="btn btn-xs" ng-click="ack(event)" ng-class="{\'btn-danger\': event.messageType==\'Alarm\', \'btn-warning\': event.messageType==\'Alert\'}">ACK</button></td>' +
        '    <td>{{event.raisedDateTime}}</td>' +
        '    <td style="text-align: left">{{event.messageType | uppercase}} {{event.description}}</td>' +
        '    <td>{{event.ackDateTime}}</td>' +
        '  </tr>' +
        '  <tr ng-repeat="event in dealtWith">' +
        '    <td></td>' +
        '    <td>{{event.raisedDateTime}}</td>' +
        '    <td style="text-align: left">{{event.messageType | uppercase}}: {{event.description}}</td>' +
        '    <td>{{event.ackDateTime}}</td>' +
        '  </tr>' +
        '</table>';

    return {
      template: template,
      restrict: 'E',
      scope: {
        data: '=',
        onAck: '&'
      },
      replace: true,
      link: function(scope) {
        function splitEvents() {
          var need = [];
          var dealt = [];

          _.each(scope.data, function (evt) {   // eslint-disable-line
            if (evt.ackDateTime && evt.ackDateTime.length > 0)
              dealt.push(evt);
            else
              need.push(evt);
          });

          scope.ack = function (event) {
            if (scope.onAck)
              scope.onAck()(event, scope.ackDone);
          };

          scope.ackDone = function () {
            splitEvents();
          };

          scope.needAttention = _.orderBy(need, ['raisedDateTime' , 'messageType'], ['desc' , 'asc']);  // eslint-disable-line
          scope.dealtWith = _.orderBy(dealt, ['raisedDateTime' , 'messageType'], ['desc' , 'asc']);     // eslint-disable-line
        }

        scope.$watch('data', function() {
          splitEvents();
        });
      }
    };
  }
})();