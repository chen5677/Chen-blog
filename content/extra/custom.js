/* ============================================
   Particle Effects — Background + Mouse Trail
   ============================================ */
(function() {
  'use strict';

  // --- Canvas setup ---
  var canvas = document.createElement('canvas');
  canvas.id = 'particle-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;';
  document.body.appendChild(canvas);

  var ctx = canvas.getContext('2d');
  var bgParticles = [];
  var trailParticles = [];
  var mouse = { x: -1000, y: -1000 };
  var animationId = null;
  var bgCount = 0;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  // --- Background floating particles ---
  function BgParticle() {
    this.reset = function() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.2 + 0.05;
    };
    this.reset();

    this.update = function() {
      var dx = this.x - mouse.x;
      var dy = this.y - mouse.y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100 && dist > 0) {
        var force = (100 - dist) / 100;
        this.x += (dx / dist) * force * 0.6;
        this.y += (dy / dist) * force * 0.6;
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

  // --- Mouse trail particles ---
  var trailColors = [
    [96, 165, 250],   // blue
    [167, 139, 250],  // purple
    [236, 72, 153],   // pink
    [52, 211, 153],   // emerald
    [251, 191, 36]    // amber
  ];

  function TrailParticle(x, y) {
    var color = trailColors[Math.floor(Math.random() * trailColors.length)];
    this.x = x;
    this.y = y;
    this.size = Math.random() * 4 + 2;
    this.speedX = (Math.random() - 0.5) * 2;
    this.speedY = (Math.random() - 0.5) * 2 - 1;
    this.opacity = 1;
    this.decay = Math.random() * 0.03 + 0.02;
    this.color = color;
    this.gravity = 0.05;
    this.shrink = Math.random() * 0.04 + 0.02;

    this.update = function() {
      this.speedY += this.gravity;
      this.x += this.speedX;
      this.y += this.speedY;
      this.opacity -= this.decay;
      this.size -= this.shrink;
      if (this.size < 0) this.size = 0;
    };

    this.draw = function() {
      if (this.opacity <= 0 || this.size <= 0) return;
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + this.color[0] + ',' + this.color[1] + ',' + this.color[2] + ',1)';
      ctx.shadowBlur = 6;
      ctx.shadowColor = 'rgba(' + this.color[0] + ',' + this.color[1] + ',' + this.color[2] + ',0.5)';
      ctx.fill();
      ctx.restore();
    };

    this.isDead = function() {
      return this.opacity <= 0 || this.size <= 0;
    };
  }

  // --- Initialization ---
  function initBgParticles() {
    bgParticles = [];
    bgCount = Math.min(40, Math.floor(canvas.width * canvas.height / 20000));
    for (var i = 0; i < bgCount; i++) {
      bgParticles.push(new BgParticle());
    }
  }

  // --- Spawn trail particles on mouse move ---
  var lastSpawnTime = 0;
  var spawnInterval = 30; // ms between spawns

  function spawnTrailParticles(x, y) {
    var now = Date.now();
    if (now - lastSpawnTime < spawnInterval) return;
    lastSpawnTime = now;

    var count = Math.floor(Math.random() * 3) + 2;
    for (var i = 0; i < count; i++) {
      trailParticles.push(new TrailParticle(x, y));
    }

    // Limit max trail particles for performance
    if (trailParticles.length > 150) {
      trailParticles.splice(0, trailParticles.length - 150);
    }
  }

  // --- Animation loop ---
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background particles
    for (var i = 0; i < bgParticles.length; i++) {
      bgParticles[i].update();
      bgParticles[i].draw();
    }

    // Draw and update trail particles
    for (var j = trailParticles.length - 1; j >= 0; j--) {
      trailParticles[j].update();
      trailParticles[j].draw();
      if (trailParticles[j].isDead()) {
        trailParticles.splice(j, 1);
      }
    }

    animationId = requestAnimationFrame(animate);
  }

  function start() {
    resize();
    initBgParticles();
    if (animationId) cancelAnimationFrame(animationId);
    animate();
  }

  // --- Event listeners ---
  window.addEventListener('resize', function() {
    resize();
    initBgParticles();
  });

  document.addEventListener('mousemove', function(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    spawnTrailParticles(e.clientX, e.clientY);
  });

  document.addEventListener('mouseleave', function() {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  // Reduce animation when tab is hidden
  document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    } else {
      if (!animationId) animate();
    }
  });

  start();
})();
