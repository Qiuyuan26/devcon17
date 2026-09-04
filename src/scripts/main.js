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

  // 13. Dual Tilted Speaker Card Switcher
  const speakerData = {
    '1': {
      name: 'AMY ARANETA',
      role: 'Software Engineer II @ Propeller',
      img: '/speaker/amy.JPEG',
      desc: 'Amy Araneta is a Software Engineer II at Propeller, where she builds mining analytics solutions that turn complex 3D and survey data into practical tools. She is also a tech content creator and builder who shares practical lessons on software engineering, AI, and career growth. She recently built Stackinfolio, a build-in-public platform now used by over 1,000 developers.'
    },
    '2': {
      name: 'MARIA ALEANA DE LEON',
      role: 'AI & Automation Specialist · Founder, Resumie.io',
      img: '/speaker/maria.PNG',
      desc: 'Maria Aleana De Leon is a third-year Mechanical Engineering student, AI and automation specialist, and founder of Resumie.io. She currently works as Chief of Staff at AlgaTrop and as a Medical-Legal Operations Manager for Dr. Patel Medical Corporation in Canada. Her work spans AI, automation, legal and healthcare operations, biotechnology, digital product development, and business systems. She also builds practical AI-powered tools and workflows designed to make complex work simpler and more efficient.'
    },
    '3': {
      name: 'DOM FERNANDEZ',
      role: 'Test Automation Engineering Specialist · IT Instructor',
      img: '/speaker/domfernandez.jpg',
      desc: 'Dom Fernandez is a Test Automation Engineering Specialist and Quality Engineering practitioner with 8+ years of experience in software quality, test automation, and enterprise technology. Experienced in building QA strategies, leading quality initiatives, and applying AI-driven approaches to testing. Also an IT Instructor passionate about responsible AI adoption and sharing industry practices with the next generation of technology professionals.'
    },
    '4': {
      name: 'DANIEL LUIS SAHAGUN',
      role: 'Full Stack Engineer Intern · BS IT (System Development)',
      img: '/speaker/Daniel-luis.JPG',
      desc: 'Daniel Luis Sahagun is a fourth-year BS Information Technology student majoring in System Development at De La Salle Lipa, currently working as a Software Development Intern at Dayou, and will be joining Manulife IT Delivery Center Asia as a Full Stack Engineer Intern. Beyond software development, he previously served as the Executive President of the Junior Philippine Computer Society – De La Salle Lipa Chapter. His work focuses on full-stack development and AI-assisted software engineering workflows, and he is also a two-time national hackathon finalist, including a Top 30 finish at the eGovPH Hackathon 2026.'
    }
  };

  const speakerTabBtns = document.querySelectorAll('.speaker-tab-btn');
  const activeNameEl = document.getElementById('active-speaker-name');
  const activeRoleEl = document.getElementById('active-speaker-role');
  const activeImgEl = document.getElementById('active-speaker-img');
  const activeDescEl = document.getElementById('active-speaker-desc');

  // Preload every speaker photo up front so switching tabs is instant (no lag/delay).
  Object.values(speakerData).forEach(d => {
    if (d.img) { const im = new Image(); im.src = d.img; }
  });
  if (activeImgEl) activeImgEl.decoding = 'async';

  speakerTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const spId = btn.getAttribute('data-speaker');
      if (!speakerData[spId]) return;

      speakerTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const data = speakerData[spId];
      if (activeNameEl) activeNameEl.textContent = data.name;
      if (activeRoleEl) activeRoleEl.textContent = data.role;
      if (activeImgEl) activeImgEl.src = data.img;
      if (activeDescEl) activeDescEl.textContent = data.desc;
    });
  });
});

