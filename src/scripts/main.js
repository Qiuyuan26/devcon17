/**
 * DEVCON Manila — Code Smarter: Modern Software Development with AI
 * Main Script: Animations, Scroll Spy, Modal, 3D Card Tilt, Schedule, Soundscape, AST Lab
 */

import { StarfieldEngine } from './canvas/starfield.js';
import { initCountdown } from './components/countdown.js';
import { initSchedule } from './components/schedule.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('🌌 DEVCON Manila: Code Smarter — Active.');

  // 1. Background Canvas Engine
  new StarfieldEngine('bg-canvas');

  // 2. Countdown Timer
  initCountdown();

  // 3. Dynamic Program Schedule
  initSchedule();

  // 5. AST Constellation Lab Playground
  const astCanvas = document.getElementById('ast-canvas');
  if (astCanvas) {
    const astLab = new CodeConstellationLab('ast-canvas', 'ast-inspector');
    
    const editorArea = document.getElementById('ide-editor-area');
    const presetSelect = document.getElementById('preset-select');
    const compileBtn = document.getElementById('compile-btn');
    const gravitySlider = document.getElementById('slider-gravity');
    const speedSlider = document.getElementById('slider-speed');
    const closeInspectorBtn = document.getElementById('inspector-close-btn');

    // Code presets for IDE editor
    const codePresets = {
      neural: `class NeuralSkyAgent extends LLM {\n  constructor() {\n    super("SkyNet");\n  }\n  async synthesizeCode(prompt) {\n    await AST.parse(prompt);\n    Stars.connect({ glow: true });\n    return future.build();\n  }\n}`,
      quantum: `function entangleStates() {\n  const q1 = new Qubit(0);\n  const q2 = new Qubit(1);\n  Qubit.entangle(q1, q2);\n  circuit.applyHadamard(q1);\n  return Qubit.measure([q1, q2]);\n}`,
      agent: `while (!goal.reached) {\n  const plan = await Agent.think();\n  const code = await Agent.code(plan);\n  const verified = await TestRunner.verify(code);\n  if (verified) {\n    Devcon.emit("codeSmarter");\n    break;\n  }\n}`,
      dream: `async function dreamFuture() {\n  const dream = compiler.parse(stars);\n  const sound = Audio.playSpacePad();\n  const ast = Constellation.fromCode(dream);\n  return Devcon17.build(ast);\n}`
    };

    if (editorArea && presetSelect) {
      // Set initial code
      editorArea.value = codePresets.neural;
      
      // Preset Selection Change
      presetSelect.addEventListener('change', () => {
        const val = presetSelect.value;
        if (codePresets[val]) {
          editorArea.value = codePresets[val];
          astLab.loadPreset(val);
        }
      });
    }

    if (compileBtn && editorArea) {
      compileBtn.addEventListener('click', () => {
        const code = editorArea.value;
        astLab.parseCodeToNodes(code);
      });
    }

    if (gravitySlider) {
      gravitySlider.addEventListener('input', () => {
        astLab.setGravity(parseFloat(gravitySlider.value));
      });
    }

    if (speedSlider) {
      speedSlider.addEventListener('input', () => {
        astLab.setSpeed(parseFloat(speedSlider.value));
      });
    }

    if (closeInspectorBtn) {
      closeInspectorBtn.addEventListener('click', () => {
        astLab.hideInspector();
      });
    }
  }

  // 6. Scroll Reveal Observer
  const revealElements = document.querySelectorAll('.reveal-init');

  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
        obs.unobserve(entry.target);
      }
    });
  }, { root: null, rootMargin: '0px 0px -60px 0px', threshold: 0.12 });

  revealElements.forEach(el => revealObserver.observe(el));

  // Trigger hero immediately
  setTimeout(() => {
    document.querySelectorAll('#hero .reveal-init').forEach(el => {
      el.classList.add('reveal-active');
    });
  }, 120);

  // 7. Glass Card Mouse Spotlight + 3D Tilt
  document.querySelectorAll('.glass-card, .speaker-card, .engagement-card, .guideline-card, .stat-card, .highlight-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const tiltX = ((y - cy) / rect.height) * -6;
      const tiltY = ((x - cx) / rect.width) * 6;
      card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // 8. Header Scroll Blur
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    header?.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // 10. Active Nav Scroll Spy
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { root: null, rootMargin: '-40% 0px -50% 0px', threshold: 0 });

  sections.forEach(s => spyObserver.observe(s));

  // 11. Mobile Menu Drawer Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mainNav = document.getElementById('main-nav');
  if (mobileMenuBtn && mainNav) {
    mobileMenuBtn.addEventListener('click', () => {
      mainNav.classList.toggle('active');
    });

    // Close on nav link click
    mainNav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => mainNav.classList.remove('active'));
    });
  }

  // 12. FAQ Accordion Toggle
  document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
      const faqItem = button.closest('.faq-item');
      const isOpen = faqItem.classList.contains('active');

      // Close all open FAQs
      document.querySelectorAll('.faq-item').forEach(item => item.classList.remove('active'));

      // Toggle clicked item
      if (!isOpen) {
        faqItem.classList.add('active');
      }
    });
  });
});

