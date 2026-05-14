/* ============================================
   Particle effect — lightweight mouse follower
   ============================================ */
(function() {
  'use strict';

  // Only enable on desktop (reduced motion preference check)
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mq.matches) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'particle-canvas';
  canvas.style.cssText = [
    'position: fixed',
    'top: 0',
    'left: 0',
    'width: 100%',
    'height: 100%',
    'pointer-events: none',
    'z-index: 9999',
    'opacity: 0.5'
  ].join(';');

  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  canvas.style.opacity = isDark ? '0.4' : '0.3';

  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouse = { x: -1000, y: -1000 };
  let frameId;
  let resizeTimer;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 100);
  });
  resize();

  document.addEventListener('mousemove', function(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  document.addEventListener('mouseleave', function() {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  // Touch support for mobile
  document.addEventListener('touchmove', function(e) {
    if (e.touches.length > 0) {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
    }
  }, { passive: true });

  document.addEventListener('touchend', function() {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  function Particle() {
    const hue = isDark ? 210 : 220;
    this.x = mouse.x + (Math.random() - 0.5) * 40;
    this.y = mouse.y + (Math.random() - 0.5) * 40;
    this.size = Math.random() * 3 + 1;
    this.speedX = (Math.random() - 0.5) * 1.5;
    this.speedY = (Math.random() - 0.5) * 1.5;
    this.life = 1;
    this.decay = 0.012 + Math.random() * 0.015;
    this.hue = hue;
  }

  function spawnParticles() {
    if (particles.length < 60) {
      for (let i = 0; i < 2; i++) {
        particles.push(new Particle());
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    spawnParticles();

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.speedX;
      p.y += p.speedY;
      p.life -= p.decay;

      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      ctx.fillStyle = 'hsla(' + p.hue + ', 70%, 60%, ' + p.life * 0.6 + ')';
      ctx.fill();
    }

    // Draw subtle connection lines between nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 80) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = 'hsla(' + particles[i].hue + ', 50%, 60%, ' + (1 - dist / 80) * 0.2 + ')';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    frameId = requestAnimationFrame(animate);
  }

  animate();
})();
