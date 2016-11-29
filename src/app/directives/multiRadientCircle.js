(function() {
  'use strict';

  angular
    .module('symphony')
    .directive('multiRadientCircle', MultiRadientCircle);

  /** @ngInject */
  function MultiRadientCircle() {
    return {
      template: '<div class="canvas-wrapper"><canvas></canvas></div>',
      restrict: 'E',
      scope: {
        fs: '=',
        r: '=',
        w: '=',
        val: '=',
        txtVal: '=',
        radientColors: '=',
        title: '@', 
        scale: '='
      },
      link: function(scope, el) {
        function wrapText(context, text, x, y, maxWidth, lineHeight) {
          var words = text.split(' ');
          var line = '';

          for(var n = 0; n < words.length; n++) {
            if (words[n].localeCompare("\r") == 0) {
              context.fillText(line.trim(), x, y);
              line = words[n] + ' ';
              y += lineHeight;  
            } else {
              var testLine = line + words[n] + ' ';
              var metrics = context.measureText(testLine);
              var testWidth = metrics.width;
              if (testWidth > maxWidth && n > 0) {
                context.fillText(line.trim(), x, y);
                line = words[n] + ' ';
                y += lineHeight;
              } else {
                line = testLine;
              }
            }
          }
          context.fillText(line.trim(), x, y);
        }

        function drawMultiRadiantCircle(container, canvas, ctx, fs, r, w, val, txtVal, radientColors, title, scale) { 
          if (val < 0)
            val = 0;
          else if (val > 100)
            val = 100;
          var partLength = (2 * Math.PI) / (radientColors.length);
          var start = (Math.PI / 2);
          var gradient = null;
          var startColor = null,
              endColor = null;
          var lengthDrawn = 0;          
          var targetLength = (Math.PI / 2) + (2 * Math.PI) * (val / 100);

          // middle circle
          if (radientColors.length === 2) { 
            targetLength = (Math.PI / 2) + (2 * Math.PI);
          }

          var vWidth = el.find('.canvas-wrapper').width();
          var targetWidth = vWidth * scale;

          if (targetWidth >= 170 && targetWidth <= 300)
            canvas.height = canvas.width = targetWidth;
          else if (targetWidth > 300)
            canvas.height = canvas.width = 300;
          else
            canvas.height = canvas.width = 150;


          var xc = canvas.width / 2;
          var yc = xc;
          r = (canvas.width / 2)-(w);

          ctx.beginPath();

          ctx.strokeStyle = '#e7e4e6';
          ctx.arc(xc, yc, r, 0, Math.PI*2);
          ctx.lineWidth = w;
          ctx.stroke();
          ctx.closePath();

          for (var i = 0; i < radientColors.length; i++) {
            if (lengthDrawn < targetLength) {
              
              var lengthRemaining = targetLength - lengthDrawn;

              startColor = radientColors[i];

              if (i == radientColors.length-1) {
                endColor = radientColors[i];
              } else {
                endColor = radientColors[(i + 1) % radientColors.length];
              }

              // x start / end of the next arc to draw
              var xStart = xc + Math.cos(start) * r;
              var xEnd = xc + Math.cos(start + partLength) * r;
              // y start / end of the next arc to draw
              var yStart = yc + Math.sin(start) * r;

              // if the lengthRemaining is less than a whole segment,
              // then set the partLength = lengthRemaining
              if (lengthRemaining < partLength) {
                partLength = lengthRemaining;
              }
              
              var yEnd = yc + Math.sin(start + partLength) * r;

              ctx.beginPath();

              gradient = ctx.createLinearGradient(xStart, yStart, xEnd, yEnd);
              gradient.addColorStop(0, startColor);
              gradient.addColorStop(1.0, endColor);

              ctx.strokeStyle = gradient;
              ctx.arc(xc, yc, r, start, start + partLength);
              ctx.lineWidth = w;
              ctx.stroke();
              ctx.closePath();

              start += partLength;
              lengthDrawn = start;
            }
          } // end for

          // display title, if not null
          if (title != null) {
            ctx.font = "12pt sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            wrapText(ctx, title, canvas.width/2, canvas.height/3, canvas.width/2, 16)
          }

          // display variable
          ctx.font = fs + "pt sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(txtVal, canvas.width/2, canvas.height/(title==null?2:(3/2)));
        }

        function draw() {
          var canvas = el.find('canvas');
          var ctx = canvas[0].getContext("2d");
          if (typeof scope.val !== 'undefined' && typeof scope.txtVal !== 'undefined') {
            drawMultiRadiantCircle(el, canvas[0], ctx, scope.fs, scope.r, scope.w, scope.val, scope.txtVal, scope.radientColors, scope.title, scope.scale);
          }
        }

        scope.$watch('val', function() {
          draw();
        });

        scope.$watch('txtVal', function() {
          draw();
        });
      }
    };
  }
})();