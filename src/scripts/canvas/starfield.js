/**
 * DEVCON17 — DREAM GALAXY & STARLIGHT CANVAS ENGINE
 * Concept: "Dream it. Code it. Build the future."
 * Features:
 * - Rich cosmic galaxy with spiral nebulae arms & glowing space dust clouds.
 * - Celestial moon & dense multi-depth starfield with twinkling stardust & hyper-stars.
 * - Dynamic shooting stars (comets) streaking across the cosmic sky.
 * - Subtle digital code constellation nodes connecting into geometric architecture.
 * - Interactive mouse parallax & starlight halo.
 */

export class StarfieldEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    
    this.width = 0;
    this.height = 0;
    this.stars = [];
    this.hyperStars = [];
    this.constellationNodes = [];
    this.dreamParticles = [];
    this.nebulae = [];
    this.shootingStars = [];
    this.galaxyAngle = 0;
    
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0, active: false };
    this.animId = null;
    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => {
      this.resize();
      this.createDreamyNebulae();
    });

    window.addEventListener('mousemove', (e) => {
      this.mouse.targetX = (e.clientX - this.width / 2) * 0.04;
      this.mouse.targetY = (e.clientY - this.height / 2) * 0.04;
      this.mouse.active = true;
    });

    // Scale the scene to the device: lighter on phones/tablets so it never lags.
    const isMobile = window.innerWidth <= 767;
    const isTablet = window.innerWidth > 767 && window.innerWidth <= 1024;
    const starCount = isMobile ? 130 : isTablet ? 260 : 480;
    const nodeCount = isMobile ? 0 : isTablet ? 22 : 38;

    this.createStars(starCount);
    this.createConstellationNodes(nodeCount);
    this.createDreamyNebulae();
    this.createShootingStars();

    // Cap frame rate on smaller screens; 0 = uncapped (60fps) on desktop.
    this._frameInterval = (isMobile || isTablet) ? 1000 / 30 : 0;
    this._lastFrame = 0;

    // Respect users who prefer reduced motion: draw one static frame, no loop.
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { this.animate(); this.destroy(); return; }

    this.animate();
  }

  resize() {
    // Cap the pixel ratio so retina phones don't render a huge canvas (major lag).
    const dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth <= 767 ? 1 : 1.5);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = Math.floor(this.width * dpr);
    this.canvas.height = Math.floor(this.height * dpr);
    this.canvas.style.width = this.width + 'px';
    this.canvas.style.height = this.height + 'px';
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  createStars(count) {
    this.stars = [];
    const colors = ['#ffffff', '#ffe9fb', '#ff2bd1', '#a21cff', '#c084fc', '#22e1ff', '#ff5cb8', '#ffd028', '#2b5cff'];
    for (let i = 0; i < count; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        z: Math.random() * 0.85 + 0.15,
        radius: Math.random() * 1.6 + 0.35,
        alpha: Math.random() * 0.85 + 0.15,
        twinkleSpeed: Math.random() * 0.014 + 0.005,
        twinkleDir: Math.random() > 0.5 ? 1 : -1,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
  }

  createHyperStars(count) {
    this.hyperStars = [];
    const colors = ['#ffffff', '#22e1ff', '#ff2bd1', '#ffd028'];
    for (let i = 0; i < count; i++) {
      this.hyperStars.push({
        x: Math.random() * this.width,
        y: Math.random() * (this.height * 0.8),
        size: Math.random() * 2.8 + 2.0,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.015,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
  }

  createConstellationNodes(count) {
    this.constellationNodes = [];
    for (let i = 0; i < count; i++) {
      this.constellationNodes.push({
        x: Math.random() * this.width,
        y: Math.random() * (this.height * 0.75),
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        radius: Math.random() * 2.2 + 1.6,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.015 + Math.random() * 0.01,
        isCodeSquare: Math.random() > 0.65
      });
    }
  }

  createDreamParticles(count) {
    this.dreamParticles = [];
    for (let i = 0; i < count; i++) {
      this.dreamParticles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vy: -0.2 - Math.random() * 0.3,
        vx: (Math.random() - 0.5) * 0.1,
        size: Math.random() * 1.6 + 0.5,
        alpha: Math.random() * 0.7 + 0.15,
        fadeSpeed: 0.003 + Math.random() * 0.003
      });
    }
  }

  createDreamyNebulae() {
    this.nebulae = [
      // Deep Violet Core Nebula
      { x: this.width * 0.22, y: this.height * 0.24, radius: 360, color: { r: 139, g: 92, b: 246 }, alpha: 0.12 },
      // Electric Cyan Starburst Dust
      { x: this.width * 0.78, y: this.height * 0.32, radius: 380, color: { r: 6, g: 182, b: 212 }, alpha: 0.11 },
      // Magenta / Rose Celestial Cloud
      { x: this.width * 0.52, y: this.height * 0.16, radius: 300, color: { r: 219, g: 39, b: 119 }, alpha: 0.08 },
      // Deep Astral Indigo Cluster
      { x: this.width * 0.84, y: this.height * 0.68, radius: 340, color: { r: 79, g: 70, b: 229 }, alpha: 0.09 },
      // Starlight Blue Horizon Fog
      { x: this.width * 0.15, y: this.height * 0.72, radius: 310, color: { r: 2, g: 132, b: 199 }, alpha: 0.08 }
    ];
  }

  createShootingStars() {
    this.shootingStars = [];
    this.lastShootingStarTime = Date.now();
  }

  spawnShootingStar() {
    this.shootingStars.push({
      x: Math.random() * this.width * 0.8 + this.width * 0.1,
      y: Math.random() * this.height * 0.35,
      length: Math.random() * 90 + 70,
      speed: Math.random() * 8 + 10,
      angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2, // ~45 deg downward
      alpha: 1.0,
      fadeSpeed: 0.018 + Math.random() * 0.012
    });
  }

  drawPlanets() {
    // 1. Ringed Gas Giant (Saturn-style Celestial Giant)
    const p1x = this.width * 0.14 + this.mouse.x * 0.18;
    const p1y = this.height * 0.19 + this.mouse.y * 0.18;
    const p1r = 34;

    // Atmospheric Aura
    const p1Aura = this.ctx.createRadialGradient(p1x, p1y, p1r * 0.8, p1x, p1y, p1r * 2.2);
    p1Aura.addColorStop(0, 'rgba(162, 28, 255, 0.34)');
    p1Aura.addColorStop(0.5, 'rgba(255, 43, 209, 0.16)');
    p1Aura.addColorStop(1, 'transparent');
    this.ctx.fillStyle = p1Aura;
    this.ctx.beginPath();
    this.ctx.arc(p1x, p1y, p1r * 2.2, 0, Math.PI * 2);
    this.ctx.fill();

    // Back Ring Segment
    this.ctx.save();
    this.ctx.translate(p1x, p1y);
    this.ctx.rotate(-0.35);
    this.ctx.beginPath();
    this.ctx.ellipse(0, 0, p1r * 2.1, p1r * 0.5, 0, Math.PI, Math.PI * 2);
    this.ctx.strokeStyle = 'rgba(255, 43, 209, 0.45)';
    this.ctx.lineWidth = 4.5;
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.ellipse(0, 0, p1r * 2.4, p1r * 0.6, 0, Math.PI, Math.PI * 2);
    this.ctx.strokeStyle = 'rgba(162, 28, 255, 0.35)';
    this.ctx.lineWidth = 2.0;
    this.ctx.stroke();
    this.ctx.restore();

    // Planet Body Sphere
    const p1Grad = this.ctx.createRadialGradient(p1x - p1r * 0.35, p1y - p1r * 0.35, p1r * 0.1, p1x, p1y, p1r);
    p1Grad.addColorStop(0, '#ffe4fb');
    p1Grad.addColorStop(0.3, '#ff2bd1');
    p1Grad.addColorStop(0.65, '#a21cff');
    p1Grad.addColorStop(0.9, '#2a0a54');
    p1Grad.addColorStop(1, '#05010f');

    this.ctx.fillStyle = p1Grad;
    this.ctx.beginPath();
    this.ctx.arc(p1x, p1y, p1r, 0, Math.PI * 2);
    this.ctx.fill();

    // Front Ring Segment
    this.ctx.save();
    this.ctx.translate(p1x, p1y);
    this.ctx.rotate(-0.35);
    this.ctx.beginPath();
    this.ctx.ellipse(0, 0, p1r * 2.1, p1r * 0.5, 0, 0, Math.PI);
    this.ctx.strokeStyle = 'rgba(255, 92, 184, 0.65)';
    this.ctx.lineWidth = 4.5;
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.ellipse(0, 0, p1r * 2.4, p1r * 0.6, 0, 0, Math.PI);
    this.ctx.strokeStyle = 'rgba(34, 225, 255, 0.5)';
    this.ctx.lineWidth = 2.0;
    this.ctx.stroke();
    this.ctx.restore();

    // 2. Ice Exoplanet with Crescent Corona (Mid Right)
    const p2x = this.width * 0.88 + this.mouse.x * 0.3;
    const p2y = this.height * 0.56 + this.mouse.y * 0.3;
    const p2r = 22;

    const p2Aura = this.ctx.createRadialGradient(p2x, p2y, p2r * 0.7, p2x, p2y, p2r * 2.0);
    p2Aura.addColorStop(0, 'rgba(34, 225, 255, 0.35)');
    p2Aura.addColorStop(0.6, 'rgba(43, 92, 255, 0.14)');
    p2Aura.addColorStop(1, 'transparent');
    this.ctx.fillStyle = p2Aura;
    this.ctx.beginPath();
    this.ctx.arc(p2x, p2y, p2r * 2.0, 0, Math.PI * 2);
    this.ctx.fill();

    const p2Grad = this.ctx.createRadialGradient(p2x - p2r * 0.35, p2y - p2r * 0.35, p2r * 0.05, p2x, p2y, p2r);
    p2Grad.addColorStop(0, '#ffffff');
    p2Grad.addColorStop(0.35, '#22e1ff');
    p2Grad.addColorStop(0.7, '#2b5cff');
    p2Grad.addColorStop(1, '#08102f');

    this.ctx.fillStyle = p2Grad;
    this.ctx.beginPath();
    this.ctx.arc(p2x, p2y, p2r, 0, Math.PI * 2);
    this.ctx.fill();

    // 3. Mystic Rose Starlight Moon (Lower Left)
    const p3x = this.width * 0.07 + this.mouse.x * 0.22;
    const p3y = this.height * 0.54 + this.mouse.y * 0.22;
    const p3r = 15;

    const p3Aura = this.ctx.createRadialGradient(p3x, p3y, p3r * 0.5, p3x, p3y, p3r * 2.2);
    p3Aura.addColorStop(0, 'rgba(255, 43, 209, 0.3)');
    p3Aura.addColorStop(1, 'transparent');
    this.ctx.fillStyle = p3Aura;
    this.ctx.beginPath();
    this.ctx.arc(p3x, p3y, p3r * 2.2, 0, Math.PI * 2);
    this.ctx.fill();

    const p3Grad = this.ctx.createRadialGradient(p3x - p3r * 0.3, p3y - p3r * 0.3, p3r * 0.05, p3x, p3y, p3r);
    p3Grad.addColorStop(0, '#ffd9f4');
    p3Grad.addColorStop(0.4, '#ff2bd1');
    p3Grad.addColorStop(0.8, '#7c1a6b');
    p3Grad.addColorStop(1, '#1a0326');

    this.ctx.fillStyle = p3Grad;
    this.ctx.beginPath();
    this.ctx.arc(p3x, p3y, p3r, 0, Math.PI * 2);
    this.ctx.fill();
  }

  drawMoon() {
    const mx = this.width * 0.85 + this.mouse.x * 0.25;
    const my = this.height * 0.15 + this.mouse.y * 0.25;
    const mRadius = 58;

    const time = Date.now() * 0.001;
    const pulseFactor = Math.sin(time) * 0.06 + 1.0;

    // 1. Soft Lunar Breathing Glow
    const auraGrad = this.ctx.createRadialGradient(mx, my, mRadius * 0.3, mx, my, mRadius * 4.0 * pulseFactor);
    auraGrad.addColorStop(0, 'rgba(255, 43, 209, 0.32)');
    auraGrad.addColorStop(0.35, 'rgba(162, 28, 255, 0.2)');
    auraGrad.addColorStop(0.7, 'rgba(34, 225, 255, 0.08)');
    auraGrad.addColorStop(1, 'transparent');

    this.ctx.fillStyle = auraGrad;
    this.ctx.beginPath();
    this.ctx.arc(mx, my, mRadius * 4.0 * pulseFactor, 0, Math.PI * 2);
    this.ctx.fill();

    // 2. Moon Body Sphere
    const moonGrad = this.ctx.createRadialGradient(mx - mRadius * 0.3, my - mRadius * 0.3, mRadius * 0.05, mx, my, mRadius);
    moonGrad.addColorStop(0, '#ffffff');
    moonGrad.addColorStop(0.4, '#ffe9fb');
    moonGrad.addColorStop(0.75, '#ff5cb8');
    moonGrad.addColorStop(0.95, '#a21cff');
    moonGrad.addColorStop(1, '#0a0326');

    this.ctx.fillStyle = moonGrad;
    this.ctx.shadowColor = '#ff2bd1';
    this.ctx.shadowBlur = 25;
    this.ctx.beginPath();
    this.ctx.arc(mx, my, mRadius, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.shadowBlur = 0;
  }

  drawDreamyNebulae() {
    this.galaxyAngle += 0.0003;
    this.nebulae.forEach((n, idx) => {
      const offsetX = Math.cos(this.galaxyAngle + idx) * 20;
      const offsetY = Math.sin(this.galaxyAngle + idx) * 15;
      
      const grad = this.ctx.createRadialGradient(
        n.x + offsetX, n.y + offsetY, 0,
        n.x + offsetX, n.y + offsetY, n.radius
      );
      grad.addColorStop(0, `rgba(${n.color.r}, ${n.color.g}, ${n.color.b}, ${n.alpha})`);
      grad.addColorStop(0.5, `rgba(${n.color.r}, ${n.color.g}, ${n.color.b}, ${n.alpha * 0.45})`);
      grad.addColorStop(1, 'transparent');
      
      this.ctx.fillStyle = grad;
      this.ctx.beginPath();
      this.ctx.arc(n.x + offsetX, n.y + offsetY, n.radius, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }

  drawStars() {
    this.stars.forEach(s => {
      const px = s.x + this.mouse.x * s.z;
      const py = s.y + this.mouse.y * s.z;

      s.alpha += s.twinkleSpeed * s.twinkleDir;
      if (s.alpha > 0.95 || s.alpha < 0.15) {
        s.twinkleDir *= -1;
      }

      this.ctx.fillStyle = s.color;
      this.ctx.globalAlpha = Math.max(0.1, Math.min(1, s.alpha));
      this.ctx.beginPath();
      this.ctx.arc(px, py, s.radius, 0, Math.PI * 2);
      this.ctx.fill();
    });
    this.ctx.globalAlpha = 1.0;
  }

  drawHyperStars() {
    this.hyperStars.forEach(hs => {
      hs.pulse += hs.pulseSpeed;
      const glowSize = hs.size + Math.sin(hs.pulse) * 1.2;
      const px = hs.x + this.mouse.x * 0.4;
      const py = hs.y + this.mouse.y * 0.4;

      // 4-point cross diffraction flare
      this.ctx.strokeStyle = hs.color;
      this.ctx.globalAlpha = 0.5 + Math.sin(hs.pulse) * 0.3;
      this.ctx.lineWidth = 0.8;
      
      this.ctx.beginPath();
      this.ctx.moveTo(px - glowSize * 2.4, py);
      this.ctx.lineTo(px + glowSize * 2.4, py);
      this.ctx.moveTo(px, py - glowSize * 2.4);
      this.ctx.lineTo(px, py + glowSize * 2.4);
      this.ctx.stroke();

      // Center bright core
      this.ctx.fillStyle = '#ffffff';
      this.ctx.globalAlpha = 0.9;
      this.ctx.beginPath();
      this.ctx.arc(px, py, hs.size * 0.6, 0, Math.PI * 2);
      this.ctx.fill();
    });
    this.ctx.globalAlpha = 1.0;
  }

  drawShootingStars() {
    const now = Date.now();
    // Spawn a shooting star randomly every 4-8 seconds
    if (now - this.lastShootingStarTime > 4500 && Math.random() < 0.02) {
      this.spawnShootingStar();
      this.lastShootingStarTime = now;
    }

    for (let i = this.shootingStars.length - 1; i >= 0; i--) {
      const ss = this.shootingStars[i];
      ss.x += Math.cos(ss.angle) * ss.speed;
      ss.y += Math.sin(ss.angle) * ss.speed;
      ss.alpha -= ss.fadeSpeed;

      if (ss.alpha <= 0 || ss.x > this.width || ss.y > this.height) {
        this.shootingStars.splice(i, 1);
        continue;
      }

      const tailX = ss.x - Math.cos(ss.angle) * ss.length;
      const tailY = ss.y - Math.sin(ss.angle) * ss.length;

      const grad = this.ctx.createLinearGradient(tailX, tailY, ss.x, ss.y);
      grad.addColorStop(0, 'rgba(34, 225, 255, 0)');
      grad.addColorStop(0.6, `rgba(34, 225, 255, ${ss.alpha * 0.6})`);
      grad.addColorStop(1, `rgba(255, 255, 255, ${ss.alpha})`);

      this.ctx.strokeStyle = grad;
      this.ctx.lineWidth = 1.8;
      this.ctx.beginPath();
      this.ctx.moveTo(tailX, tailY);
      this.ctx.lineTo(ss.x, ss.y);
      this.ctx.stroke();
    }
  }

  drawDreamParticles() {
    this.dreamParticles.forEach(p => {
      p.y += p.vy;
      p.x += p.vx;

      p.alpha -= p.fadeSpeed * 0.5;
      if (p.y < 0 || p.alpha <= 0) {
        p.y = this.height + 10;
        p.x = Math.random() * this.width;
        p.alpha = Math.random() * 0.7 + 0.2;
      }

      this.ctx.fillStyle = '#22e1ff';
      this.ctx.globalAlpha = Math.max(0, p.alpha);
      this.ctx.beginPath();
      this.ctx.arc(p.x + this.mouse.x * 0.2, p.y + this.mouse.y * 0.2, p.size, 0, Math.PI * 2);
      this.ctx.fill();
    });
    this.ctx.globalAlpha = 1.0;
  }

  drawConstellations() {
    const maxDist = 140;

    this.constellationNodes.forEach(node => {
      node.x += node.vx;
      node.y += node.vy;

      if (node.x < 0 || node.x > this.width) node.vx *= -1;
      if (node.y < 0 || node.y > this.height) node.vy *= -1;

      node.pulse += node.pulseSpeed;
    });

    for (let i = 0; i < this.constellationNodes.length; i++) {
      const nodeA = this.constellationNodes[i];

      for (let j = i + 1; j < this.constellationNodes.length; j++) {
        const nodeB = this.constellationNodes[j];
        const dist = Math.hypot(nodeA.x - nodeB.x, nodeA.y - nodeB.y);

        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.24;
          this.ctx.strokeStyle = `rgba(255, 43, 209, ${alpha})`;
          this.ctx.lineWidth = 0.9;
          this.ctx.beginPath();
          this.ctx.moveTo(nodeA.x + this.mouse.x * 0.3, nodeA.y + this.mouse.y * 0.3);
          this.ctx.lineTo(nodeB.x + this.mouse.x * 0.3, nodeB.y + this.mouse.y * 0.3);
          this.ctx.stroke();
        }
      }
    }

    this.constellationNodes.forEach(node => {
      const pulseRadius = node.radius + Math.sin(node.pulse) * 1.0;
      const px = node.x + this.mouse.x * 0.3;
      const py = node.y + this.mouse.y * 0.3;

      this.ctx.fillStyle = '#ffffff';
      this.ctx.shadowColor = '#ff2bd1';
      this.ctx.shadowBlur = 8;

      if (node.isCodeSquare) {
        this.ctx.fillRect(px - pulseRadius, py - pulseRadius, pulseRadius * 2, pulseRadius * 2);
      } else {
        this.ctx.beginPath();
        this.ctx.arc(px, py, pulseRadius, 0, Math.PI * 2);
        this.ctx.fill();
      }

      this.ctx.shadowBlur = 0;
    });
  }

  drawSubtleHorizon() {
    const horizonY = this.height * 0.78;
    
    // Soft dreamy horizon backlight
    const horizonGrad = this.ctx.createLinearGradient(0, horizonY - 70, 0, horizonY + 40);
    horizonGrad.addColorStop(0, 'transparent');
    horizonGrad.addColorStop(0.5, 'rgba(167, 139, 250, 0.14)');
    horizonGrad.addColorStop(0.8, 'rgba(56, 189, 248, 0.22)');
    horizonGrad.addColorStop(1, 'transparent');
    
    this.ctx.fillStyle = horizonGrad;
    this.ctx.fillRect(0, horizonY - 70, this.width, 110);

    // Subtle Starlight Horizon Beam Line
    this.ctx.strokeStyle = 'rgba(125, 211, 252, 0.4)';
    this.ctx.shadowColor = '#ff2bd1';
    this.ctx.shadowBlur = 14;
    this.ctx.lineWidth = 1.2;
    this.ctx.beginPath();
    this.ctx.moveTo(0, horizonY);
    this.ctx.lineTo(this.width, horizonY);
    this.ctx.stroke();
    this.ctx.shadowBlur = 0;
  }

  animate(now = 0) {
    this.animId = requestAnimationFrame((t) => this.animate(t));

    // Throttle to ~30fps on phones to save battery/CPU (smooth enough for ambient bg)
    if (this._frameInterval) {
      if (now - (this._lastFrame || 0) < this._frameInterval) return;
      this._lastFrame = now;
    }

    this.ctx.clearRect(0, 0, this.width, this.height);

    // Smooth parallax mouse interpolation
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    // Deep Midnight Blue Galaxy Space Gradient
    const bgGrad = this.ctx.createLinearGradient(0, 0, 0, this.height);
    bgGrad.addColorStop(0, '#01020a');
    bgGrad.addColorStop(0.3, '#050921');
    bgGrad.addColorStop(0.65, '#0b1134');
    bgGrad.addColorStop(1, '#141a4a');
    this.ctx.fillStyle = bgGrad;
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.drawDreamyNebulae();
    this.drawPlanets();
    this.drawStars();
    this.drawShootingStars();
    if (this.constellationNodes.length) this.drawConstellations();
    this.drawSubtleHorizon();
  }

  destroy() {
    if (this.animId) cancelAnimationFrame(this.animId);
  }
}
