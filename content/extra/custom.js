/* Subtle particle animation — lightweight canvas effect */
(function() {
  'use strict';

  var canvas = document.createElement('canvas');
  canvas.id = 'particle-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:-1;';
  document.body.appendChild(canvas);

  var ctx = canvas.getContext('2d');
  var particles = [];
  var mouse = { x: -1000, y: -1000 };
  var animationId = null;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function Particle() {
    this.reset = function() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2.5 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.25 + 0.05;
    };
    this.reset();

    this.update = function() {
      var dx = this.x - mouse.x;
      var dy = this.y - mouse.y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120 && dist > 0) {
        var force = (120 - dist) / 120;
        this.x += (dx / dist) * force * 0.8;
        this.y += (dy / dist) * force * 0.8;
      }
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < -20 || this.x > canvas.width + 20 || this.y < -20 || this.y > canvas.height + 20) {
        this.reset();
      }
    };

    this.draw = function() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(96, 165, 250, ' + this.opacity + ')';
      ctx.fill();
    };
  }

  var count = Math.min(50, Math.floor(canvas.width * canvas.height / 15000));

  function initParticles() {
    particles = [];
    for (var i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    animationId = requestAnimationFrame(animate);
  }

  function start() {
    resize();
    count = Math.min(50, Math.floor(canvas.width * canvas.height / 15000));
    initParticles();
    if (animationId) cancelAnimationFrame(animationId);
    animate();
  }

  window.addEventListener('resize', start);
  document.addEventListener('mousemove', function(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  document.addEventListener('mouseleave', function() {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  start();
})();
