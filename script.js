/*jshint expr: true, onevar: true */
var rings = !function (win, doc) {
   var
      body     = doc.querySelector('body'),
      canvas   = doc.createElement('canvas'),
      c        = canvas.getContext('2d'),
      width    = window.innerWidth,
      height   = window.innerHeight;

   //random range
   function _rr(min,max){
      return Math.random()*(max-min) + min;
   }
   
   //takes the values returns an hsla(...) css string
   function _hsla (h, s, l, a) {
      h = h || Math.floor(_rr(80, 200));
      s = s || 100;
      l = l || 50;
      a = a || 1.0;

      return "hsla("+ h +", "+ s +"%, "+ l +"%, "+ a +")";
   }

   window._hsla = _hsla;

   //takes degrees returns radians
   function _rad(deg) {
      return deg * (Math.PI /180);
   }

   function Ring (options) {
      options = options || {};

      this.radius = 1;
      this.max = 1;
      this.counter = 0.1;
      this.length = Math.floor(_rr(10, 300));
      this.x = options.x || Math.floor(width /2);
      this.y = options.y || Math.floor(height /2);
      this.color = options.color || _hsla();

      return this;
   }

   Ring.prototype = {
      update: function () {
         if (this.radius < 1) {
            this.counter = 0.1;
         }

         this.radius = this.length * Math.sin(this.counter);
         this.counter += 0.01;

         if (this.radius < this.max) {
            this.destroy = true;
         } else {
            this.max = this.radius;
         }
      },

      draw: function () {
         c.beginPath();
         c.arc(this.x, this.y, this.radius, 0, _rad(360), true);
         c.strokeStyle = this.color;
         c.lineWidth = 2.5;
         c.stroke();
         c.closePath();
      }
   };

   function init () {
      var
         rings = [],
         hue = 1;

      canvas.width = width;
      canvas.height = height;
      body.appendChild(canvas);
      canvas.addEventListener('mousemove', function (ev) {
         hue = hue+1 === 360 ? 1 : hue+1;
         var ring = new Ring({ 
            x:       ev.clientX, 
            y:       ev.clientY,
            color:   _hsla(hue)
         });
         rings.push(ring);
         console.log(ring);
      }, false);

      window.rings = rings;

      setInterval(function () {
         c.save();
         c.fillStyle = "hsla(1,1%,0%, 0.1)";
         c.fillRect(0, 0, width, height);
         c.restore();

         if (rings.length === 0) {
            return;
         }

         _.each(rings, function (ring) {
            ring.update();
            ring.draw();
         });

         rings = _.reject(rings, function (ring) {
            return ring.destroy;
         });
      }, 1000/60);
   }

   init();

} (window, document);
