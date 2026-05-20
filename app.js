/* =====================================================
   IDDA LEADERBOARD — APPLICATION LOGIC
   ===================================================== */

// ── CONSTANTS ──────────────────────────────────────────────
const LS_KEY = 'idda_leaderboard_seen';
const TOAST_DURATION = 5500; // ms

const RANK_TITLES = [
  { min: 0,    label: 'Newcomer' },
  { min: 500,  label: 'Code Explorer' },
  { min: 700,  label: 'Algorithm Apprentice' },
  { min: 900,  label: 'Digital Warrior' },
  { min: 1000,  label: 'Code Samurai' },
  { min: 2000, label: 'Legend' }
];

const AVATAR_COLORS = [
  ['#7c3aed','#06b6d4'],
  ['#ec4899','#f59e0b'],
  ['#10b981','#06b6d4'],
  ['#f59e0b','#ef4444'],
  ['#6366f1','#a855f7'],
  ['#14b8a6','#22c55e'],
  ['#f43f5e','#7c3aed'],
  ['#3b82f6','#10b981'],
];

// ── STATE ──────────────────────────────────────────────────
let rankedPlayers = [];
let achievementsMap = {};
let unseenKeys = [];

// ── BOOT ───────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  if (typeof LEADERBOARD_DATA === 'undefined') {
    document.body.innerHTML = '<p style="color:#ef4444;padding:40px;font-family:monospace">Error: data.js not found or failed to load.</p>';
    return;
  }

  // Build achievement lookup map
  LEADERBOARD_DATA.achievements.forEach(a => { achievementsMap[a.id] = a; });

  // Apply meta
  document.title = `${LEADERBOARD_DATA.meta.cohort} achievements`;
  const subtitle = document.getElementById('cohort-subtitle');
  if (subtitle) subtitle.textContent = LEADERBOARD_DATA.meta.subtitle;

  // Compute scores and sort
  rankedPlayers = computeRankedPlayers();

  // Render everything
  renderStats();
  renderPodium();
  renderGrid();

  // Notifications
  unseenKeys = getUnseenKeys();
  updateNotifBadge(unseenKeys.length);
  showToasts(unseenKeys.slice(0, 5));

  // Wire up UI events
  document.getElementById('ach-btn').addEventListener('click', openAchievementsModal);
  document.getElementById('stat-players-item').addEventListener('click', () => {
    document.getElementById('players-grid').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  document.getElementById('stat-ach-item').addEventListener('click', openAchievementsModal);
  document.getElementById('stat-unlocked-item').addEventListener('click', openUnlockedModal);
  document.getElementById('ach-modal-close').addEventListener('click', closeAchievementsModal);
  document.getElementById('ach-modal-overlay').addEventListener('click', e => {
    if (e.target === document.getElementById('ach-modal-overlay')) closeAchievementsModal();
  });
  document.getElementById('notif-btn').addEventListener('click', toggleNotifPanel);
  document.getElementById('mark-all-read').addEventListener('click', markAllRead);
  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.getElementById('modal-overlay').addEventListener('click', e => {
    if (e.target === document.getElementById('modal-overlay')) closeModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeModal(); closeAchievementsModal(); }
  });
});

// ── DATA HELPERS ───────────────────────────────────────────
function computeRankedPlayers() {
  const sorted = LEADERBOARD_DATA.players
    .map(player => {
      const earned = (player.earnedAchievements || [])
        .filter(ea => achievementsMap[ea.id]);
      const points = earned.reduce((sum, ea) => sum + achievementsMap[ea.id].points, 0);
      return { ...player, earnedAchievements: earned, computedPoints: points };
    })
    .sort((a, b) => b.computedPoints - a.computedPoints || a.name.localeCompare(b.name));

  let rank = 1;
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i].computedPoints < sorted[i - 1].computedPoints) rank = i + 1;
    sorted[i].rank = rank;
  }
  return sorted;
}

function getPlayerTitle(player) {
  if (player.title && player.title.trim()) return player.title;
  const pts = player.computedPoints;
  let title = RANK_TITLES[0].label;
  for (const t of RANK_TITLES) { if (pts >= t.min) title = t.label; }
  return title;
}

function playerInitials(name) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

function avatarGradient(index) {
  const [a, b] = AVATAR_COLORS[index % AVATAR_COLORS.length];
  return `linear-gradient(135deg, ${a}, ${b})`;
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ── AVATAR HTML ────────────────────────────────────────────
function avatarHTML(player, size) {
  const pIndex = rankedPlayers.findIndex(p => p.id === player.id);
  const style = `background:${avatarGradient(pIndex)};width:${size}px;height:${size}px;`;
  return `
    <img
      src="${player.avatar}"
      alt="${player.name}"
      onerror="this.style.display='none';this.nextElementSibling.style.display='flex';"
    />
    <div class="avatar-initials" style="${style};display:none">${playerInitials(player.name)}</div>
  `;
}

// ── STATS BAR ──────────────────────────────────────────────
function renderStats() {
  const totalUnlocked = rankedPlayers.reduce((s, p) => s + p.earnedAchievements.length, 0);
  document.getElementById('stat-players').textContent = rankedPlayers.length;
  document.getElementById('stat-achievements').textContent = LEADERBOARD_DATA.achievements.length;
  animateCounter('stat-unlocked', totalUnlocked);
}

function animateCounter(id, target) {
  const el = document.getElementById(id);
  if (el) animateEl(el, target);
}

function animateEl(el, target) {
  const duration = 900;
  const start = performance.now();
  const step = ts => {
    const pct = Math.min((ts - start) / duration, 1);
    el.textContent = Math.round(pct * target);
    if (pct < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// ── PODIUM ─────────────────────────────────────────────────
function renderPodium() {
  const container = document.getElementById('podium');
  const section  = document.getElementById('podium-section');
  const total    = LEADERBOARD_DATA.achievements.length;

  // Tie for #1 — skip the podium entirely
  const rank1Players = rankedPlayers.filter(p => p.rank === 1);
  if (rank1Players.length > 1) {
    section.setAttribute('hidden', '');
    return;
  }
  section.removeAttribute('hidden');

  const crowns     = { 1: '👑', 2: '🥈', 3: '🥉' };
  const rankLabels = { 1: '#1 CHAMPION', 2: '#2 RUNNER UP', 3: '#3 THIRD PLACE' };

  const first       = rankedPlayers[0];
  const rank2Players = rankedPlayers.filter(p => p.rank === 2);

  // Build display order: left, centre (#1), right
  let slots;
  if (rank2Players.length >= 2) {
    slots = [
      { player: rank2Players[0], rank: 2 },
      { player: first,           rank: 1 },
      { player: rank2Players[1], rank: 2 },
    ];
  } else {
    const second = rankedPlayers[1];
    const third  = rankedPlayers[2];
    slots = [
      second ? { player: second, rank: 2 } : null,
      { player: first, rank: 1 },
      third  ? { player: third,  rank: 3 } : null,
    ].filter(Boolean);
  }

  container.innerHTML = slots.map(({ player, rank }) => {
    const pct = total > 0 ? (player.earnedAchievements.length / total) * 100 : 0;
    return `
      <div class="podium-slot" data-rank="${rank}" data-id="${player.id}">
        <div class="podium-card">
          ${rank === 1 ? `<div class="podium-crown">${crowns[1]}</div>` : ''}
          <div class="podium-avatar">${avatarHTML(player, 80)}</div>
          <div class="podium-rank-badge">${rankLabels[rank]}</div>
          <div class="podium-name">${escHtml(player.name)}</div>
          <div class="podium-title">${escHtml(getPlayerTitle(player))}</div>
          <div class="podium-points"><span data-pts="${player.computedPoints}">0</span> <span style="font-size:12px;color:var(--text-2)">PTS</span></div>
          <div class="podium-prog">
            <div class="podium-prog-bar" style="width:${pct}%"></div>
          </div>
          <div class="podium-ach-count">${player.earnedAchievements.length}/${total} achievements</div>
        </div>
      </div>
    `;
  }).join('');

  container.querySelectorAll('.podium-slot').forEach(slot => {
    slot.addEventListener('click', () => openModal(slot.dataset.id));
  });

  container.querySelectorAll('.podium-points [data-pts]').forEach(el => {
    animateEl(el, parseInt(el.dataset.pts));
  });
}

// ── PLAYERS GRID ───────────────────────────────────────────
function renderGrid() {
  const container = document.getElementById('players-grid');
  const total = LEADERBOARD_DATA.achievements.length;

  container.innerHTML = rankedPlayers.map(player => {
    const rank = player.rank;
    const pct = total > 0 ? (player.earnedAchievements.length / total) * 100 : 0;
    const rankClass = rank <= 3 ? `rank-${rank}` : '';
    return `
      <div class="player-row" data-id="${player.id}">
        <div class="rank-num ${rankClass}">${rank}</div>
        <div class="row-avatar">${avatarHTML(player, 48)}</div>
        <div class="row-info">
          <div class="row-name">${escHtml(player.name)}</div>
          <div class="row-title">${escHtml(getPlayerTitle(player))}</div>
          <div class="row-prog-wrap">
            <div class="row-prog">
              <div class="row-prog-bar" style="width:${pct}%"></div>
            </div>
            <span class="row-prog-label">${player.earnedAchievements.length}/${total}</span>
          </div>
        </div>
        <div class="row-right">
          <div class="row-points" data-pts="${player.computedPoints}">0</div>
          <div class="row-pts-label">PTS</div>
        </div>
      </div>
    `;
  }).join('');

  container.querySelectorAll('.player-row').forEach(row => {
    row.addEventListener('click', () => openModal(row.dataset.id));
  });

  container.querySelectorAll('.row-points[data-pts]').forEach(el => {
    animateEl(el, parseInt(el.dataset.pts));
  });
}

// ── MODAL ──────────────────────────────────────────────────
function openModal(playerId) {
  const player = rankedPlayers.find(p => p.id === playerId);
  if (!player) return;

  const rank = player.rank;
  const total = LEADERBOARD_DATA.achievements.length;
  const earned = player.earnedAchievements;
  const pct = total > 0 ? (earned.length / total) * 100 : 0;
  const earnedSet = new Set(earned.map(e => e.id));
  const earnedMap = Object.fromEntries(earned.map(e => [e.id, e]));

  const achHTML = LEADERBOARD_DATA.achievements.map(ach => {
    const isUnlocked = earnedSet.has(ach.id);
    const earnedEntry = earnedMap[ach.id];
    const rarityClass = `rarity-${ach.rarity}`;
    const unlockedClass = isUnlocked ? 'unlocked' : 'locked';
    const dateHtml = isUnlocked && earnedEntry?.earnedAt
      ? `<div class="ach-date">Earned ${formatDate(earnedEntry.earnedAt)}</div>`
      : isUnlocked ? ''
      : `<div class="ach-locked-label">LOCKED</div>`;
    return `
      <div class="ach-card ${unlockedClass} ${rarityClass}" title="${escHtml(ach.description)}">
        <div class="ach-icon">${ach.icon}</div>
        <div class="ach-name">${escHtml(ach.name)}</div>
        <div class="ach-rarity ${rarityClass}">${ach.rarity}</div>
        <div class="ach-points">+${ach.points} pts</div>
        ${dateHtml}
      </div>
    `;
  }).join('');

  document.getElementById('modal-body').innerHTML = `
    <div class="modal-header">
      <div class="modal-avatar">${avatarHTML(player, 100)}</div>
      <div class="modal-player-info">
        <div class="modal-player-name" id="modal-player-name">${escHtml(player.name)}</div>
        <div class="modal-player-title">${escHtml(getPlayerTitle(player))}</div>
        <div class="modal-player-rank">Rank #${rank} of ${rankedPlayers.length}</div>
      </div>
      <div class="modal-points-block">
        <div class="modal-points-val">${player.computedPoints}</div>
        <div class="modal-points-lbl">Total Points</div>
      </div>
    </div>
    <div class="modal-prog-section">
      <div class="modal-prog-bar-track">
        <div class="modal-prog-bar-fill" style="width:${pct}%"></div>
      </div>
      <div class="modal-prog-label">${earned.length} of ${total} achievements unlocked (${Math.round(pct)}%)</div>
    </div>
    <div class="modal-ach-section">
      <div class="modal-ach-heading">Achievements</div>
      <div class="modal-ach-grid">${achHTML}</div>
    </div>
  `;

  const overlay = document.getElementById('modal-overlay');
  overlay.removeAttribute('hidden');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modal-overlay').setAttribute('hidden', '');
  document.body.style.overflow = '';
}

function openAchievementsModal() {
  const achHTML = LEADERBOARD_DATA.achievements.map(ach => {
    const rarityClass = `rarity-${ach.rarity}`;
    const lockedClass = ach.locked ? ' ach-catalog-locked' : '';
    const lockOverlay = ach.locked
      ? `<div class="ach-lock-overlay">
           <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
             <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
             <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
           </svg>
         </div>`
      : '';
    return `
      <div class="ach-card unlocked ${rarityClass}${lockedClass}" title="${escHtml(ach.description)}">
        ${lockOverlay}
        <div class="ach-icon">${ach.icon}</div>
        <div class="ach-name">${escHtml(ach.name)}</div>
        <div class="ach-rarity ${rarityClass}">${ach.rarity}</div>
        <div class="ach-points">+${ach.points} pts</div>
        <div class="ach-desc">${escHtml(ach.description)}</div>
      </div>
    `;
  }).join('');

  document.getElementById('ach-modal-body').innerHTML = `
    <div class="modal-ach-section ach-catalog-section">
      <h2 class="modal-ach-heading" id="ach-modal-title">All Achievements</h2>
      <div class="modal-ach-grid">${achHTML}</div>
    </div>
  `;

  document.getElementById('ach-modal-overlay').removeAttribute('hidden');
  document.body.style.overflow = 'hidden';
}

function closeAchievementsModal() {
  document.getElementById('ach-modal-overlay').setAttribute('hidden', '');
  document.body.style.overflow = '';
}


function openUnlockedModal() {
  const activeAchs = LEADERBOARD_DATA.achievements.filter(a => !a.locked);
  const total = rankedPlayers.length;

  const rows = activeAchs.map(ach => {
    const count = rankedPlayers.filter(p =>
      p.earnedAchievements.some(ea => ea.id === ach.id)
    ).length;
    const pct = total > 0 ? (count / total) * 100 : 0;
    const rarityClass = `rarity-${ach.rarity}`;
    return `
      <div class="ach-breakdown-row ${rarityClass}">
        <div class="ach-breakdown-icon">${ach.icon}</div>
        <div>
          <div class="ach-breakdown-name">${escHtml(ach.name)}</div>
          <div class="ach-rarity ${rarityClass}">${ach.rarity} · +${ach.points} pts</div>
          <div class="ach-breakdown-bar-wrap">
            <div class="ach-breakdown-bar">
              <div class="ach-breakdown-bar-fill ${rarityClass}" style="width:${pct}%"></div>
            </div>
          </div>
        </div>
        <div class="ach-breakdown-count">
          <span class="ach-breakdown-num">${count}</span>
          <span class="ach-breakdown-total">/ ${total}</span>
        </div>
      </div>
    `;
  }).join('');

  document.getElementById('ach-modal-body').innerHTML = `
    <div class="modal-ach-section ach-catalog-section">
      <h2 class="modal-ach-heading" id="ach-modal-title">Achievement Breakdown</h2>
      <div class="ach-breakdown-list">${rows}</div>
    </div>
  `;

  document.getElementById('ach-modal-overlay').removeAttribute('hidden');
  document.body.style.overflow = 'hidden';
}

// ── NOTIFICATIONS ──────────────────────────────────────────
function getSeenSet() {
  try {
    return new Set(JSON.parse(localStorage.getItem(LS_KEY) || '[]'));
  } catch { return new Set(); }
}

function saveSeenSet(set) {
  localStorage.setItem(LS_KEY, JSON.stringify([...set]));
}

function getUnseenKeys() {
  const seen = getSeenSet();
  const unseen = [];
  for (const player of rankedPlayers) {
    for (const ea of player.earnedAchievements) {
      const key = `${player.id}:${ea.id}`;
      if (!seen.has(key)) unseen.push({ key, earnedAt: ea.earnedAt || '' });
    }
  }
  unseen.sort((a, b) => b.earnedAt.localeCompare(a.earnedAt));
  return unseen.map(u => u.key);
}

function updateNotifBadge(count) {
  const badge = document.getElementById('notif-count');
  if (count > 0) {
    badge.textContent = count > 99 ? '99+' : count;
    badge.removeAttribute('hidden');
  } else {
    badge.setAttribute('hidden', '');
  }
}

function buildNotifPayloads(keys) {
  return keys.map(key => {
    const [playerId, achId] = key.split(':');
    const player = rankedPlayers.find(p => p.id === playerId);
    const ach = achievementsMap[achId];
    if (!player || !ach) return null;
    const ea = player.earnedAchievements.find(e => e.id === achId);
    return { key, player, ach, earnedAt: ea?.earnedAt };
  }).filter(Boolean);
}

// Toast queue
let toastQueue = [];
let activeToasts = 0;
const MAX_TOASTS = 4;

function showToasts(keys) {
  const payloads = buildNotifPayloads(keys);
  toastQueue.push(...payloads);
  drainToastQueue();
}

function drainToastQueue() {
  while (toastQueue.length > 0 && activeToasts < MAX_TOASTS) {
    showToast(toastQueue.shift());
  }
}

function showToast(payload) {
  const { key, player, ach, earnedAt } = payload;
  const container = document.getElementById('toast-container');
  const pIndex = rankedPlayers.findIndex(p => p.id === player.id);

  const el = document.createElement('div');
  el.className = `toast rarity-${ach.rarity}`;
  el.innerHTML = `
    <div class="toast-avatar">${avatarHTML(player, 36)}</div>
    <div class="toast-icon">${ach.icon}</div>
    <div class="toast-text">
      <div class="toast-title"><strong>${escHtml(player.name)}</strong> earned <strong>${escHtml(ach.name)}</strong></div>
      <div class="toast-sub">${ach.rarity} · +${ach.points} pts${earnedAt ? ' · ' + formatDate(earnedAt) : ''}</div>
    </div>
  `;

  container.appendChild(el);
  activeToasts++;

  const dismiss = () => {
    el.classList.add('toast-out');
    el.addEventListener('animationend', () => {
      el.remove();
      activeToasts--;
      // Mark this one as seen
      const seen = getSeenSet();
      seen.add(key);
      saveSeenSet(seen);
      drainToastQueue();
    }, { once: true });
  };

  const timer = setTimeout(dismiss, TOAST_DURATION);
  el.addEventListener('click', () => { clearTimeout(timer); dismiss(); });
}

// Notification panel
function toggleNotifPanel() {
  const panel = document.getElementById('notif-panel');
  const btn = document.getElementById('notif-btn');
  const isHidden = panel.hasAttribute('hidden');

  if (isHidden) {
    renderNotifPanel();
    panel.removeAttribute('hidden');
    btn.classList.add('active');
    // Close on outside click
    setTimeout(() => {
      document.addEventListener('click', outsideClickClose, { once: true });
    }, 0);
  } else {
    panel.setAttribute('hidden', '');
    btn.classList.remove('active');
  }
}

function outsideClickClose(e) {
  const panel = document.getElementById('notif-panel');
  const btn = document.getElementById('notif-btn');
  // Bell button click is handled by toggleNotifPanel — don't interfere
  if (btn.contains(e.target)) return;
  if (!panel.contains(e.target)) {
    panel.setAttribute('hidden', '');
    btn.classList.remove('active');
  } else {
    // Re-attach listener if click was inside the panel
    document.addEventListener('click', outsideClickClose, { once: true });
  }
}

function renderNotifPanel() {
  const list = document.getElementById('notif-list');
  const empty = document.getElementById('notif-empty');

  const allKeys = [];
  for (const player of rankedPlayers) {
    for (const ea of player.earnedAchievements) {
      allKeys.push(`${player.id}:${ea.id}`);
    }
  }

  if (allKeys.length === 0) {
    list.innerHTML = '';
    empty.removeAttribute('hidden');
    return;
  }

  empty.setAttribute('hidden', '');
  const seen = getSeenSet();
  const payloads = buildNotifPayloads(allKeys);
  payloads.sort((a, b) => (b.earnedAt || '').localeCompare(a.earnedAt || ''));

  list.innerHTML = payloads.map(({ key, player, ach, earnedAt }) => {
    const readClass = seen.has(key) ? ' read' : '';
    return `
      <li class="notif-item rarity-${ach.rarity}${readClass}" data-key="${escHtml(key)}">
        <div class="notif-item-icon">${ach.icon}</div>
        <div class="notif-item-text">
          <div class="notif-item-title">${escHtml(player.name)}: ${escHtml(ach.name)}</div>
          <div class="notif-item-sub">${ach.rarity} · +${ach.points} pts${earnedAt ? ' · ' + formatDate(earnedAt) : ''}</div>
        </div>
      </li>
    `;
  }).join('');

  list.querySelectorAll('.notif-item').forEach(item => {
    item.addEventListener('click', () => {
      const [playerId] = item.dataset.key.split(':');
      document.getElementById('notif-panel').setAttribute('hidden', '');
      document.getElementById('notif-btn').classList.remove('active');
      openModal(playerId);
    });
  });
}

function markAllRead() {
  const seen = getSeenSet();
  for (const key of getUnseenKeys()) seen.add(key);
  saveSeenSet(seen);
  unseenKeys = [];
  updateNotifBadge(0);
  renderNotifPanel();
}

// ── UTILITIES ──────────────────────────────────────────────
function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
