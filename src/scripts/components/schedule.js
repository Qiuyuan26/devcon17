/**
 * DEVCON17 Schedule & Agenda Timeline Component
 */

const SCHEDULE_DATA = {
  day1: [
    {
      id: 's101',
      time: '09:00 - 10:30 AM',
      room: 'Constellation Main Hall',
      title: 'Keynote: Dream it. Code it. Build the Future.',
      speaker: 'Dr. Lyra Vance & Marcus Chen',
      track: 'keynote',
      trackName: 'KEYNOTE',
      trackColor: '#4cc9f0'
    },
    {
      id: 's102',
      time: '11:00 - 12:15 PM',
      room: 'Nebula Stage A',
      title: 'Autonomous Code Agents & AST Constellations',
      speaker: 'Marcus Chen',
      track: 'ai',
      trackName: 'AI & AGENTS',
      trackColor: '#7209b7'
    },
    {
      id: 's103',
      time: '01:30 - 02:45 PM',
      room: 'Quantum Stage B',
      title: 'Designing Resilient Cloud Node Architectures',
      speaker: 'Aria Sterling',
      track: 'arch',
      trackName: 'SYSTEMS',
      trackColor: '#f72585'
    },
    {
      id: 's104',
      time: '03:15 - 04:30 PM',
      room: 'Cosmic Lab 1',
      title: 'Interactive Workshop: Building AI Code Synthesis Pipelines',
      speaker: 'Kairos Thorne',
      track: 'ai',
      trackName: 'AI & AGENTS',
      trackColor: '#7209b7'
    }
  ],
  day2: [
    {
      id: 's201',
      time: '09:30 - 10:45 AM',
      room: 'Constellation Main Hall',
      title: 'Next-Gen Developer Environments & Synthetics',
      speaker: 'Dr. Lyra Vance',
      track: 'arch',
      trackName: 'SYSTEMS',
      trackColor: '#f72585'
    },
    {
      id: 's202',
      time: '11:15 - 12:30 PM',
      room: 'Nebula Stage A',
      title: 'Zero-Trust Cyber Resilience in AI-Generated Code',
      speaker: 'Kairos Thorne',
      track: 'arch',
      trackName: 'SYSTEMS',
      trackColor: '#f72585'
    },
    {
      id: 's203',
      time: '02:00 - 03:30 PM',
      room: 'Quantum Stage B',
      title: 'Quantum Algorithms & High-Speed Data Constellations',
      speaker: 'Aria Sterling',
      track: 'ai',
      trackName: 'AI & AGENTS',
      trackColor: '#7209b7'
    }
  ],
  day3: [
    {
      id: 's301',
      time: '10:00 - 11:30 AM',
      room: 'Nebula Stage A',
      title: 'Open Source Governance & Ethical AI Alignment',
      speaker: 'Panel Discussion',
      track: 'keynote',
      trackName: 'KEYNOTE',
      trackColor: '#4cc9f0'
    },
    {
      id: 's302',
      time: '01:00 - 02:30 PM',
      room: 'Cosmic Lab 1',
      title: 'The Future of Coding: 2027 to 2030 Vision',
      speaker: 'Dr. Lyra Vance & Guest Visionaries',
      track: 'keynote',
      trackName: 'KEYNOTE',
      trackColor: '#4cc9f0'
    },
    {
      id: 's303',
      time: '03:00 - 05:00 PM',
      room: 'Constellation Main Hall',
      title: 'DEVCON17 Grand Hackathon Finale & Closing Ceremony',
      speaker: 'DEVCON Committee',
      track: 'keynote',
      trackName: 'GRAND FINALE',
      trackColor: '#ffb703'
    }
  ]
};

export function initSchedule() {
  const container = document.getElementById('schedule-container');
  if (!container) return;

  let currentDay = 'day1';
  let currentFilter = 'all';
  const bookmarked = new Set();

  function render() {
    const sessions = SCHEDULE_DATA[currentDay] || [];
    const filtered = sessions.filter(s => currentFilter === 'all' || s.track === currentFilter);

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="glass-card text-center" style="padding: 40px;">
          <p style="color: var(--text-muted);">No sessions found matching the selected filter.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(s => `
      <div class="session-card glass-card">
        <div class="session-time">
          <span class="time-val">${s.time}</span>
          <span class="room-val"><i class="fa-solid fa-location-dot"></i> ${s.room}</span>
        </div>
        <div class="session-details">
          <span class="session-track-badge" style="background: rgba(76, 201, 240, 0.15); color: ${s.trackColor}; border-color: ${s.trackColor};">
            ${s.trackName}
          </span>
          <h3 class="session-title">${s.title}</h3>
          <span class="session-speaker"><i class="fa-solid fa-user-astronaut"></i> ${s.speaker}</span>
        </div>
        <div class="session-action">
          <button class="bookmark-btn ${bookmarked.has(s.id) ? 'bookmarked' : ''}" data-id="${s.id}" title="${bookmarked.has(s.id) ? 'Bookmarked' : 'Add to My Schedule'}">
            <i class="fa-solid fa-bookmark"></i>
          </button>
        </div>
      </div>
    `).join('');

    // Attach bookmark click handlers
    container.querySelectorAll('.bookmark-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (bookmarked.has(id)) {
          bookmarked.delete(id);
        } else {
          bookmarked.add(id);
        }
        render();
      });
    });
  }

  // Day Tab Clicks
  document.querySelectorAll('.schedule-tabs .tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.schedule-tabs .tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentDay = btn.getAttribute('data-day');
      render();
    });
  });

  // Filter Pill Clicks
  document.querySelectorAll('.filter-pills .filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-pills .filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-filter');
      render();
    });
  });

  render();
}
