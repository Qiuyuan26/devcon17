/**
 * DEVCON17 Registration Modal & Particle Burst Effect
 */

export function initRegistrationModal() {
  const modal = document.getElementById('register-modal');
  const openBtns = [
    document.getElementById('open-register-btn'),
    document.getElementById('hero-register-btn'),
    document.getElementById('cta-register-btn')
  ].filter(Boolean);

  const closeBtn = document.getElementById('close-modal-btn');
  const form = document.getElementById('registration-form');
  const successState = document.getElementById('registration-success');
  const doneBtn = document.getElementById('success-done-btn');

  if (!modal) return;

  function openModal() {
    modal.classList.remove('hidden');
    if (form) form.classList.remove('hidden');
    if (successState) successState.classList.add('hidden');
  }

  function closeModal() {
    modal.classList.add('hidden');
  }

  openBtns.forEach(btn => btn.addEventListener('click', openModal));
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (doneBtn) doneBtn.addEventListener('click', closeModal);

  // Close when clicking outside backdrop
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Handle Form Submission
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
        submitBtn.disabled = true;
      }

      setTimeout(() => {
        form.classList.add('hidden');
        if (successState) successState.classList.remove('hidden');
        if (submitBtn) {
          submitBtn.innerHTML = '<i class="fa-solid fa-sparkles"></i> Complete Registration';
          submitBtn.disabled = false;
        }

        // Trigger celebratory particle burst
        createParticleBurst();
      }, 1000);
    });
  }
}

function createParticleBurst() {
  const modalCard = document.querySelector('.modal-card');
  if (!modalCard) return;

  const count = 40;
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'burst-particle';
    
    const colors = ['#4cc9f0', '#7209b7', '#f72585', '#ffb703', '#ffffff'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    particle.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      width: ${Math.random() * 8 + 4}px;
      height: ${Math.random() * 8 + 4}px;
      background: ${color};
      border-radius: 50%;
      pointer-events: none;
      box-shadow: 0 0 10px ${color};
      z-index: 999;
      transform: translate(-50%, -50%);
      transition: all 0.8s cubic-bezier(0.1, 0.8, 0.3, 1);
    `;

    modalCard.appendChild(particle);

    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * 250 + 50;
    const tx = Math.cos(angle) * dist;
    const ty = Math.sin(angle) * dist;

    requestAnimationFrame(() => {
      particle.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0)`;
      particle.style.opacity = '0';
    });

    setTimeout(() => particle.remove(), 900);
  }
}
