(function() {
  'use strict';

  angular
    .module('symphony')
    .directive('colorSlider', ColorSlider);

  /** @ngInject */
  function ColorSlider($window) {
    return {
      template: '<div class="color-slider"><div class="pointer"></div><div class="slider-wrapper"><div id="red-bar" class="bar"></div><div id="yellow-bar" class="bar"></div><div id="green-bar" class="bar"></div></div></div>',
      restrict: 'E',
      require: 'ngModel',
      scope: {
        point1: '=',
        point2: '=',
        ngChange: '&',
        ngModel: '='
      },
      link: function(scope, el, attrs, ctrl) {
        var slider = el.find('.slider-wrapper');
        var cursor = el.find('.pointer');

        function setCursor() {
          if (typeof scope.ngModel === 'undefined') {
            updateCursorPosition();
          } else {
            cursor.css({ left: scope.ngModel * slider[0].offsetWidth - cursor[0].offsetWidth / 2 });
          }
        }

        // draw slider
        function drawSlider() {
          setCursor();

          el.find('#yellow-bar').css({
            width: slider[0].offsetWidth * scope.point2 + 'px'
          });

          el.find('#green-bar').css({
            width: slider[0].offsetWidth * scope.point1 + 'px'
          });
        }

        // trigger ng-change
        ctrl.$viewChangeListeners.push(function() {
          scope.$eval(attrs.ngChange);
        });

        scope.$watch('ngModel', function() { drawSlider(); }, true);

        // move cursor
        function updateCursorPosition(ev) {
          if (typeof ev !== 'undefined') {
            var tmp = ev.pageX - slider.offset().left;
            if (tmp < 0) {
              tmp = 0;
            } else if (tmp > slider[0].offsetWidth) {
              tmp = slider[0].offsetWidth;
            }

            cursor.css({
              left: tmp - cursor[0].offsetWidth / 2
            });

            ctrl.$setViewValue(parseFloat(tmp) / slider[0].offsetWidth);
          } else {
            cursor.css({ left: - cursor[0].offsetWidth / 2 });
          }
        }

        // mouse events
        function onCursorMove(ev) {
          updateCursorPosition(ev);
        }

        function onCursorUp(ev) {
          angular.element(document).off('mousemove', onCursorMove);
          angular.element(document).off('mouseup', onCursorUp);
          updateCursorPosition(ev);
        }

        slider.on('mousedown', function(ev) {
          angular.element(document).on('mousemove', onCursorMove);
          angular.element(document).on('mouseup', onCursorUp);
          updateCursorPosition(ev);
        });

        // init
        drawSlider();       
        angular.element($window).on('resize', drawSlider);
      }
    };
  }
})();