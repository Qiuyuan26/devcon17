/**
 * DEVCON17 — Constellation Code Lab Canvas Engine
 */

export class CodeConstellationLab {
  constructor(canvasId, inspectorId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.inspector = document.getElementById(inspectorId);

    this.nodes = [];
    this.connections = [];
    this.pulses = [];
    this.explosions = [];
    this.selectedNode = null;
    this.hoveredNode = null;

    this.gravity = 5;
    this.speedMult = 1.0;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    this.canvas.addEventListener('click', (e) => this.handleClick(e));

    this.loadPreset('neural');
    this.animate();
  }

  resize() {
    const parent = this.canvas.parentElement;
    if (parent) {
      this.canvas.width = parent.clientWidth;
      this.canvas.height = parent.clientHeight;
    }
  }

  setGravity(val) {
    this.gravity = val;
  }

  setSpeed(val) {
    this.speedMult = val / 5;
  }

  loadPreset(key) {
    this.nodes = [];
    this.connections = [];
    const w = this.canvas.width || 600;
    const h = this.canvas.height || 400;
    const cx = w / 2;
    const cy = h / 2;

    const presets = {
      neural: [
        { id: 'AST_01', type: 'NeuralRootNode', code: 'class NeuralSkyAgent extends LLM', x: cx, y: cy - 100, luminosity: 95, complexity: 88 },
        { id: 'AST_02', type: 'FunctionDecl', code: 'async synthesizeCode(prompt)', x: cx - 150, y: cy - 20, luminosity: 82, complexity: 75 },
        { id: 'AST_03', type: 'AsyncPipeline', code: 'await AST.parse(prompt)', x: cx + 150, y: cy - 20, luminosity: 78, complexity: 60 },
        { id: 'AST_04', type: 'ConstellationNode', code: 'Stars.connect({ glow: true })', x: cx - 220, y: cy + 80, luminosity: 88, complexity: 65 },
        { id: 'AST_05', type: 'QuantumBuffer', code: 'VectorIndex.query(embeddings)', x: cx - 75, y: cy + 100, luminosity: 70, complexity: 80 },
        { id: 'AST_06', type: 'EventStream', code: 'Devcon.emit("codeSmarter")', x: cx + 75, y: cy + 100, luminosity: 90, complexity: 50 },
        { id: 'AST_07', type: 'ReturnStatement', code: 'return future.build()', x: cx + 220, y: cy + 80, luminosity: 96, complexity: 92 }
      ],
      quantum: [
        { id: 'Q_01', type: 'QuantumState', code: 'Qubit.entangle(alpha, beta)', x: cx, y: cy - 110, luminosity: 98, complexity: 95 },
        { id: 'Q_02', type: 'HadamardGate', code: 'circuit.applyHadamard(0)', x: cx - 130, y: cy, luminosity: 85, complexity: 80 },
        { id: 'Q_03', type: 'PhaseShift', code: 'circuit.phaseShift(Math.PI / 4)', x: cx + 130, y: cy, luminosity: 80, complexity: 70 },
        { id: 'Q_04', type: 'Measurement', code: 'const result = await Qubit.measure()', x: cx, y: cy + 110, luminosity: 92, complexity: 85 }
      ],
      agent: [
        { id: 'AG_01', type: 'AutonomousAgent', code: 'Agent.init({ goal: "Code Smarter" })', x: cx - 110, y: cy - 90, luminosity: 90, complexity: 85 },
        { id: 'AG_02', type: 'ToolRegistry', code: 'Agent.registerTools([Grep, Write, Run])', x: cx + 110, y: cy - 90, luminosity: 85, complexity: 70 },
        { id: 'AG_03', type: 'ReflectionLoop', code: 'while (!goal.reached) await solve()', x: cx, y: cy + 30, luminosity: 95, complexity: 90 },
        { id: 'AG_04', type: 'Verification', code: 'TestRunner.verifyBuild(code)', x: cx, y: cy + 130, luminosity: 88, complexity: 78 }
      ],
      dream: [
        { id: 'DRM_01', type: 'DreamCompiler', code: 'DreamSky.synthesize(stars)', x: cx, y: cy - 120, luminosity: 99, complexity: 90 },
        { id: 'DRM_02', type: 'ConstellationGen', code: 'Constellation.fromCode(ast)', x: cx - 140, y: cy, luminosity: 84, complexity: 65 },
        { id: 'DRM_03', type: 'CosmicPadSynth', code: 'Audio.playSpacePad()', x: cx + 140, y: cy, luminosity: 88, complexity: 72 },
        { id: 'DRM_04', type: 'FutureVision', code: 'Devcon17.buildFuture()', x: cx, y: cy + 120, luminosity: 97, complexity: 94 }
      ]
    };

    const sel = presets[key] || presets.neural;
    this.nodes = sel.map(n => ({
      ...n,
      pulse: Math.random() * Math.PI * 2,
      radius: 7,
      baseX: n.x,
      baseY: n.y
    }));

    this.connections = [];
    if (this.nodes.length > 1) {
      for (let i = 1; i < this.nodes.length; i++) {
        const parentIdx = Math.floor((i - 1) / 2);
        this.connections.push({ from: parentIdx, to: i });
      }
      if (this.nodes.length > 3) {
        this.connections.push({ from: 1, to: 2 });
      }
    }

    this.triggerExplosion(cx, cy);
    this.updateStatusText();
  }

  parseCodeToNodes(codeText) {
    const lines = codeText.split('\n').filter(l => l.trim().length > 0);
    const w = this.canvas.width || 600;
    const h = this.canvas.height || 400;
    const count = lines.length;

    this.nodes = lines.map((line, idx) => {
      const angle = (idx / count) * Math.PI * 2;
      const radius = 120;
      const nx = w / 2 + Math.cos(angle) * radius;
      const ny = h / 2 + Math.sin(angle) * radius;
      return {
        id: `SRC_${idx + 1}`,
        type: line.includes('const') ? 'VariableDeclarator' : (line.includes('function') || line.includes('=>') ? 'FunctionDeclaration' : 'CallExpression'),
        code: line.trim(),
        x: nx,
        y: ny,
        baseX: nx,
        baseY: ny,
        luminosity: Math.floor(Math.random() * 20 + 80),
        complexity: Math.floor(Math.random() * 40 + 55),
        pulse: Math.random() * Math.PI * 2,
        radius: 7
      };
    });

    this.nodes.unshift({
      id: 'ROOT_0',
      type: 'ProgramAST',
      code: '// Devcon17 AST Root',
      x: w / 2,
      y: h / 2,
      baseX: w / 2,
      baseY: h / 2,
      luminosity: 99,
      complexity: 90,
      pulse: 0,
      radius: 10
    });

    this.connections = [];
    for (let i = 1; i < this.nodes.length; i++) {
      this.connections.push({ from: 0, to: i });
      if (i > 1) this.connections.push({ from: i - 1, to: i });
    }

    this.triggerExplosion(w / 2, h / 2);
    this.triggerPulse();
    this.updateStatusText();
  }

  triggerExplosion(x, y) {
    for (let i = 0; i < 25; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 2;
      this.explosions.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: Math.random() * 3.5 + 1.5,
        alpha: 1,
        color: Math.random() > 0.5 ? '#22e1ff' : '#a21cff'
      });
    }
  }

  triggerPulse() {
    this.pulses = [];
    this.connections.forEach(conn => {
      this.pulses.push({
        fromNode: this.nodes[conn.from],
        toNode: this.nodes[conn.to],
        progress: 0,
        speed: (0.025 + Math.random() * 0.015) * this.speedMult
      });
    });
  }

  updateStatusText() {
    const statusEl = document.getElementById('canvas-status');
    if (statusEl) {
      statusEl.textContent = `Active Nodes: ${this.nodes.length} | Constellations: ${this.connections.length}`;
    }
  }

  handleMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    this.hoveredNode = null;
    for (let n of this.nodes) {
      if (Math.hypot(n.x - mx, n.y - my) < 16) {
        this.hoveredNode = n;
        this.canvas.style.cursor = 'pointer';
        return;
      }
    }
    this.canvas.style.cursor = 'default';
  }

  handleClick(e) {
    if (this.hoveredNode) {
      this.selectedNode = this.hoveredNode;
      this.showInspector(this.selectedNode);
    }
  }

  showInspector(node) {
    if (!this.inspector) return;
    const idEl = document.getElementById('inspector-node-id');
    const typeEl = document.getElementById('inspector-node-type');
    const codeEl = document.getElementById('inspector-node-code');
    
    if (idEl) idEl.textContent = node.id;
    if (typeEl) typeEl.textContent = node.type;
    if (codeEl) codeEl.textContent = node.code;

    this.inspector.classList.remove('hidden');
  }

  hideInspector() {
    if (this.inspector) this.inspector.classList.add('hidden');
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Update explosions
    for (let i = this.explosions.length - 1; i >= 0; i--) {
      const p = this.explosions[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.02;

      if (p.alpha <= 0) {
        this.explosions.splice(i, 1);
        continue;
      }

      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = p.alpha;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fill();
    }
    this.ctx.globalAlpha = 1.0;

    // Draw Connections
    this.connections.forEach(conn => {
      const nA = this.nodes[conn.from];
      const nB = this.nodes[conn.to];
      if (!nA || !nB) return;

      this.ctx.strokeStyle = 'rgba(34, 225, 255, 0.45)';
      this.ctx.lineWidth = 1.6;
      this.ctx.beginPath();
      this.ctx.moveTo(nA.x, nA.y);
      this.ctx.lineTo(nB.x, nB.y);
      this.ctx.stroke();
    });

    // Draw Pulses
    for (let i = this.pulses.length - 1; i >= 0; i--) {
      const p = this.pulses[i];
      p.progress += p.speed * this.speedMult;

      if (p.progress >= 1) {
        this.pulses.splice(i, 1);
        continue;
      }

      const px = p.fromNode.x + (p.toNode.x - p.fromNode.x) * p.progress;
      const py = p.fromNode.y + (p.toNode.y - p.fromNode.y) * p.progress;

      this.ctx.fillStyle = '#ffffff';
      this.ctx.shadowColor = '#22e1ff';
      this.ctx.shadowBlur = 14;
      this.ctx.beginPath();
      this.ctx.arc(px, py, 4.5, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.shadowBlur = 0;
    }

    // Draw Nodes
    this.nodes.forEach(node => {
      node.pulse += 0.045 * this.speedMult;
      
      // Floating oscillation around base position
      node.x = node.baseX + Math.cos(node.pulse) * (this.gravity * 0.8);
      node.y = node.baseY + Math.sin(node.pulse) * (this.gravity * 0.8);

      const isHover = (this.hoveredNode === node);
      const isSelect = (this.selectedNode === node);
      const radius = node.radius + (isHover ? 4 : 0) + Math.sin(node.pulse) * 1.5;

      // Glow halo
      const grad = this.ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, radius * 4);
      grad.addColorStop(0, isSelect ? 'rgba(255, 43, 209, 0.9)' : (isHover ? 'rgba(34, 225, 255, 0.9)' : 'rgba(162, 28, 255, 0.6)'));
      grad.addColorStop(1, 'transparent');

      this.ctx.fillStyle = grad;
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, radius * 4, 0, Math.PI * 2);
      this.ctx.fill();

      // Node Core
      this.ctx.fillStyle = isSelect ? '#ff2bd1' : (isHover ? '#22e1ff' : '#ffffff');
      this.ctx.beginPath();
      this.ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
      this.ctx.fill();

      // Label snippet
      this.ctx.fillStyle = isHover ? '#ffffff' : '#94a3b8';
      this.ctx.font = '11px "Fira Code", monospace';
      this.ctx.fillText(node.id, node.x + 14, node.y + 4);
    });

    requestAnimationFrame(() => this.animate());
  }
}
