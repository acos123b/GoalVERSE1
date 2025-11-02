// GoalVERSE - Main JavaScript (Phase 1)

// ========== HELPER FUNCTIONS ==========

// Escape HTML to prevent injection attacks
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Get data from localStorage (temporary database for Phase 1)
function getStorage(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

// Save data to localStorage
function setStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Generate unique ID
function generateId() {
  return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// ========== SAMPLE DATA (for Phase 1 testing) ==========

// Sample players (will be replaced with API data later)
const SAMPLE_PLAYERS = [
  { id: 'p1', name: 'Lionel Messi', club: 'Inter Miami', nation: 'Argentina', position: 'Forward' },
  { id: 'p2', name: 'Cristiano Ronaldo', club: 'Al Nassr', nation: 'Portugal', position: 'Forward' },
  { id: 'p3', name: 'Kylian Mbappé', club: 'Real Madrid', nation: 'France', position: 'Forward' },
  { id: 'p4', name: 'Erling Haaland', club: 'Manchester City', nation: 'Norway', position: 'Forward' },
  { id: 'p5', name: 'Kevin De Bruyne', club: 'Manchester City', nation: 'Belgium', position: 'Midfielder' },
  { id: 'p6', name: 'Vinícius Jr', club: 'Real Madrid', nation: 'Brazil', position: 'Forward' },
  { id: 'p7', name: 'Mohamed Salah', club: 'Liverpool', nation: 'Egypt', position: 'Forward' },
  { id: 'p8', name: 'Harry Kane', club: 'Bayern Munich', nation: 'England', position: 'Forward' },
  { id: 'p9', name: 'Jude Bellingham', club: 'Real Madrid', nation: 'England', position: 'Midfielder' },
  { id: 'p10', name: 'Neymar Jr', club: 'Al Hilal', nation: 'Brazil', position: 'Forward' },
  { id: 'p11', name: 'Luka Modrić', club: 'Real Madrid', nation: 'Croatia', position: 'Midfielder' },
  { id: 'p12', name: 'Robert Lewandowski', club: 'Barcelona', nation: 'Poland', position: 'Forward' }
];

// Sample clubs
const SAMPLE_CLUBS = [
  { id: 'c1', name: 'Manchester City', country: 'England', league: 'Premier League' },
  { id: 'c2', name: 'Real Madrid', country: 'Spain', league: 'La Liga' },
  { id: 'c3', name: 'Bayern Munich', country: 'Germany', league: 'Bundesliga' },
  { id: 'c4', name: 'Barcelona', country: 'Spain', league: 'La Liga' },
  { id: 'c5', name: 'Liverpool', country: 'England', league: 'Premier League' },
  { id: 'c6', name: 'Paris Saint-Germain', country: 'France', league: 'Ligue 1' },
  { id: 'c7', name: 'Inter Milan', country: 'Italy', league: 'Serie A' },
  { id: 'c8', name: 'Arsenal', country: 'England', league: 'Premier League' },
  { id: 'c9', name: 'Juventus', country: 'Italy', league: 'Serie A' },
  { id: 'c10', name: 'Borussia Dortmund', country: 'Germany', league: 'Bundesliga' },
  { id: 'c11', name: 'Atletico Madrid', country: 'Spain', league: 'La Liga' },
  { id: 'c12', name: 'AC Milan', country: 'Italy', league: 'Serie A' }
];

// Sample nations
const SAMPLE_NATIONS = [
  { id: 'n1', name: 'Brazil', code: 'BR' },
  { id: 'n2', name: 'Argentina', code: 'AR' },
  { id: 'n3', name: 'England', code: 'GB-ENG' },
  { id: 'n4', name: 'France', code: 'FR' },
  { id: 'n5', name: 'Germany', code: 'DE' },
  { id: 'n6', name: 'Spain', code: 'ES' },
  { id: 'n7', name: 'Portugal', code: 'PT' },
  { id: 'n8', name: 'Italy', code: 'IT' },
  { id: 'n9', name: 'Belgium', code: 'BE' },
  { id: 'n10', name: 'Netherlands', code: 'NL' },
  { id: 'n11', name: 'India', code: 'IN' },
  { id: 'n12', name: 'Croatia', code: 'HR' }
];

// Sample matches (for demo)
const SAMPLE_MATCHES = [
  {
    id: 'm1',
    homeTeam: 'Manchester City',
    awayTeam: 'Liverpool',
    homeScore: 2,
    awayScore: 1,
    status: 'LIVE',
    minute: 67,
    league: 'Premier League'
  },
  {
    id: 'm2',
    homeTeam: 'Real Madrid',
    awayTeam: 'Barcelona',
    homeScore: 1,
    awayScore: 1,
    status: 'LIVE',
    minute: 82,
    league: 'La Liga'
  },
  {
    id: 'm3',
    homeTeam: 'Bayern Munich',
    awayTeam: 'Borussia Dortmund',
    homeScore: 0,
    awayScore: 0,
    status: 'SCHEDULED',
    kickoff: '18:30',
    league: 'Bundesliga'
  }
];

// ========== STATE MANAGEMENT ==========

let currentUser = null;
let selectedIdol = null;
let selectedClub = null;
let selectedNation = null;

// ========== DOM ELEMENTS ==========

// Landing page
const getStartedBtn = document.getElementById('getStartedBtn');
const exploreDemoBtn = document.getElementById('exploreDemoBtn');
const loginBtn = document.getElementById('loginBtn');
const getStartedModal = document.getElementById('getStartedModal');
const closeModal = document.getElementById('closeModal');

// Login
const signupBtn = document.getElementById('signupBtn');
const loginSubmitBtn = document.getElementById('loginSubmitBtn');
const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');

// Onboarding
const onboardingModal = document.getElementById('onboardingModal');
const chatBubble = document.getElementById('chatBubble');
const chatText = document.getElementById('chatText');

// Wizard steps
const idolGrid = document.getElementById('idolGrid');
const clubGrid = document.getElementById('clubGrid');
const nationGrid = document.getElementById('nationGrid');
const idolNextBtn = document.getElementById('idolNextBtn');
const clubNextBtn = document.getElementById('clubNextBtn');
const finishBtn = document.getElementById('finishBtn');

// Congratulations
const congratsModal = document.getElementById('congratsModal');
const startExploringBtn = document.getElementById('startExploringBtn');

// App
const appContainer = document.getElementById('appContainer');
const heroSection = document.getElementById('heroSection');
const mainHeader = document.getElementById('mainHeader');

// ========== CHAT SEQUENCE ==========

const chatMessages = [
  "Hi! I'm Kick — I'll guide you. Let's log you in to save your coins.",
  "Choose your idol, favourite club, and nation — I'll help set up your profile.",
  "After that I'll show how to vote and earn coins!"
];

let chatIndex = 0;

function showNextChatMessage() {
  if (chatIndex < chatMessages.length) {
    chatText.textContent = chatMessages[chatIndex];
    chatBubble.style.animation = 'bubblePop 0.3s ease-out';
    chatIndex++;
    
    // Show next message after delay
    if (chatIndex < chatMessages.length) {
      setTimeout(showNextChatMessage, chatIndex === 1 ? 3200 : 2800);
    }
  }
}

// ========== EVENT LISTENERS ==========

// Get Started button
getStartedBtn.addEventListener('click', () => {
  getStartedModal.classList.add('active');
  chatIndex = 0;
  showNextChatMessage();
});

// Explore Demo (for Phase 1, just shows message)
exploreDemoBtn.addEventListener('click', () => {
  alert('Demo mode coming soon! Click "Get Started" to try the platform.');
});

// Close modal
closeModal.addEventListener('click', () => {
  getStartedModal.classList.remove('active');
});

// Login button (header)
loginBtn.addEventListener('click', () => {
  getStartedModal.classList.add('active');
  chatIndex = 0;
  showNextChatMessage();
});

// Sign Up
signupBtn.addEventListener('click', () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  
  // Simple validation
  if (!email || !email.includes('@')) {
    alert('Please enter a valid email address.');
    return;
  }
  
  if (password.length < 6) {
    alert('Password must be at least 6 characters long.');
    return;
  }
  
  // Create user (stored in localStorage for Phase 1)
  currentUser = {
    id: generateId(),
    email: escapeHTML(email),
    displayName: email.split('@')[0],
    coins: 500, // Starting bonus
    createdAt: new Date().toISOString()
  };
  
  setStorage('currentUser', currentUser);
  
  // Close login modal and show onboarding
  getStartedModal.classList.remove('active');
  setTimeout(() => {
    onboardingModal.classList.add('active');
    loadOnboardingData();
  }, 300);
});

// Login (existing user)
loginSubmitBtn.addEventListener('click', () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  
  if (!email || !password) {
    alert('Please enter both email and password.');
    return;
  }
  
  // Check if user exists (Phase 1: simple check)
  const storedUser = getStorage('currentUser');
  
  if (storedUser && storedUser.email === email) {
    currentUser = storedUser;
    
    // Check if onboarding completed
    if (currentUser.favouritePlayerId) {
      // Skip onboarding, go to app
      getStartedModal.classList.remove('active');
      showApp();
    } else {
      // Show onboarding
      getStartedModal.classList.remove('active');
      setTimeout(() => {
        onboardingModal.classList.add('active');
        loadOnboardingData();
      }, 300);
    }
  } else {
    alert('User not found. Please sign up first!');
  }
});

// ========== ONBOARDING ==========

function loadOnboardingData() {
  // Load players
  idolGrid.innerHTML = '';
  SAMPLE_PLAYERS.forEach(player => {
    const item = createGridItem(player, 'player');
    idolGrid.appendChild(item);
  });
  
  // Load clubs
  clubGrid.innerHTML = '';
  SAMPLE_CLUBS.forEach(club => {
    const item = createGridItem(club, 'club');
    clubGrid.appendChild(item);
  });
  
  // Load nations
  nationGrid.innerHTML = '';
  SAMPLE_NATIONS.forEach(nation => {
    const item = createGridItem(nation, 'nation');
    nationGrid.appendChild(item);
  });
  
  // Search functionality
  setupSearch('idolSearch', idolGrid);
  setupSearch('clubSearch', clubGrid);
  setupSearch('nationSearch', nationGrid);
}

function createGridItem(data, type) {
  const div = document.createElement('div');
  div.className = 'grid-item';
  div.dataset.id = data.id;
  
  // Create placeholder image (colored circle with initials)
  const initials = data.name.split(' ').map(w => w[0]).join('').substring(0, 2);
  const color = generateColor(data.name);
  
  div.innerHTML = `
    <div class="grid-item-img" style="background: ${color}; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 24px;">
      ${initials}
    </div>
    <div class="grid-item-name">${escapeHTML(data.name)}</div>
    <div class="grid-item-detail">${escapeHTML(data.club || data.country || data.code || '')}</div>
  `;
  
  div.addEventListener('click', () => selectGridItem(div, type));
  
  return div;
}

function generateColor(str) {
  // Generate consistent color based on string
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 60%, 50%)`;
}

function selectGridItem(element, type) {
  const container = element.parentElement;
  container.querySelectorAll('.grid-item').forEach(item => item.classList.remove('selected'));
  element.classList.add('selected');
  
  const id = element.dataset.id;
  
  if (type === 'player') {
    selectedIdol = SAMPLE_PLAYERS.find(p => p.id === id);
    idolNextBtn.disabled = false;
  } else if (type === 'club') {
    selectedClub = SAMPLE_CLUBS.find(c => c.id === id);
    clubNextBtn.disabled = false;
  } else if (type === 'nation') {
    selectedNation = SAMPLE_NATIONS.find(n => n.id === id);
    finishBtn.disabled = false;
  }
}

function setupSearch(inputId, grid) {
  const input = document.getElementById(inputId);
  input.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const items = grid.querySelectorAll('.grid-item');
    
    items.forEach(item => {
      const name = item.querySelector('.grid-item-name').textContent.toLowerCase();
      if (name.includes(query)) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  });
}

// Wizard navigation
idolNextBtn.addEventListener('click', () => {
  document.getElementById('wizardStep1').classList.add('hidden');
  document.getElementById('wizardStep2').classList.remove('hidden');
  document.querySelectorAll('.wizard-step')[1].classList.add('active');
});

clubNextBtn.addEventListener('click', () => {
  document.getElementById('wizardStep2').classList.add('hidden');
  document.getElementById('wizardStep3').classList.remove('hidden');
  document.querySelectorAll('.wizard-step')[2].classList.add('active');
});

finishBtn.addEventListener('click', () => {
  // Save user preferences
  currentUser.favouritePlayerId = selectedIdol.id;
  currentUser.favouriteClubId = selectedClub.id;
  currentUser.favouriteNationId = selectedNation.id;
  setStorage('currentUser', currentUser);
  
  // Show congratulations
  onboardingModal.classList.remove('active');
  setTimeout(() => {
    congratsModal.classList.add('active');
  }, 300);
});

startExploringBtn.addEventListener('click', () => {
  congratsModal.classList.remove('active');
  showApp();
});

// ========== SHOW APP ==========

function showApp() {
  // Hide landing page
  heroSection.style.display = 'none';
  document.querySelector('.features-section').style.display = 'none';
  document.querySelector('.footer').style.display = 'none';
  mainHeader.style.display = 'none';
  
  // Show app
  appContainer.classList.remove('hidden');
  
  // Update user info
  const initials = currentUser.displayName.substring(0, 2).toUpperCase();
  document.getElementById('avatarInitials').textContent = initials;
  document.getElementById('coinAmount').textContent = currentUser.coins;
  
  // Load home page data
  loadHomePage();
  
  // Setup navigation
  setupNavigation();
  
  // Update last updated time
  updateLastUpdatedTime();
}

function updateLastUpdatedTime() {
  const now = new Date();
  const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  document.getElementById('lastUpdated').textContent = `Last updated: ${timeString}`;
}

// ========== LOAD HOME PAGE ==========

function loadHomePage() {
  const todayMatches = document.getElementById('todayMatches');
  
  // Clear skeleton
  todayMatches.innerHTML = '';
  
  // Show sample matches
  SAMPLE_MATCHES.forEach(match => {
    const card = createMatchCard(match);
    todayMatches.appendChild(card);
  });
  
  // Load team snapshot
  loadTeamSnapshot();
}

function createMatchCard(match) {
  const div = document.createElement('div');
  div.className = 'card';
  div.style.cssText = 'min-width: 280px; padding: 20px; margin-right: 16px;';
  
  const statusBadge = match.status === 'LIVE' 
    ? '<span style="background: #e74c3c; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600;">LIVE \'${match.minute}</span>'
    : '<span style="background: #3498db; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600;">Kickoff: ${match.kickoff}</span>';
  
  div.innerHTML = `
    <div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 8px;">${escapeHTML(match.league)}</div>
    ${statusBadge}
    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 12px;">
      <div style="flex: 1;">
        <div style="font-weight: 600; font-size: 14px;">${escapeHTML(match.homeTeam)}</div>
      </div>
      <div style="font-size: 24px; font-weight: 700; padding: 0 16px;">
        ${match.status === 'LIVE' ? match.homeScore + ' - ' + match.awayScore : 'vs'}
      </div>
      <div style="flex: 1; text-align: right;">
        <div style="font-weight: 600; font-size: 14px;">${escapeHTML(match.awayTeam)}</div>
      </div>
    </div>
  `;
  
  return div;
}

function loadTeamSnapshot() {
  const snapshot = document.getElementById('teamSnapshot');
  
  if (selectedIdol && selectedClub && selectedNation) {
    snapshot.innerHTML = `
      <div style="margin-bottom: 12px;">
        <div style="font-size: 12px; color: var(--text-secondary);">My Idol</div>
        <div style="font-weight: 600; color: var(--text-primary);">${escapeHTML(selectedIdol.name)}</div>
      </div>
      <div style="margin-bottom: 12px;">
        <div style="font-size: 12px; color: var(--text-secondary);">My Club</div>
        <div style="font-weight: 600; color: var(--text-primary);">${escapeHTML(selectedClub.name)}</div>
      </div>
      <div>
        <div style="font-size: 12px; color: var(--text-secondary);">My Nation</div>
        <div style="font-weight: 600; color: var(--text-primary);">${escapeHTML(selectedNation.name)}</div>
      </div>
    `;
  }
}

// ========== NAVIGATION ==========

function setupNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Update active state
      navItems.forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');
      
      // Show corresponding page
      const page = item.dataset.page;
      showPage(page);
    });
  });
}

function showPage(pageName) {
  // Hide all pages
  document.querySelectorAll('.page-content').forEach(page => {
    page.classList.add('hidden');
  });
  
  // Show selected page
  const targetPage = document.getElementById(pageName + 'Page');
  if (targetPage) {
    targetPage.classList.remove('hidden');
    
    // Load page data
    if (pageName === 'leagues') {
      loadLeaguesPage();
    }
  }
}

function loadLeaguesPage() {
  const leaguesGrid = document.getElementById('leaguesGrid');
  
  const LEAGUES = [
    { name: 'Premier League', country: 'England' },
    { name: 'La Liga', country: 'Spain' },
    { name: 'Serie A', country: 'Italy' },
    { name: 'Bundesliga', country: 'Germany' },
    { name: 'Ligue 1', country: 'France' },
    { name: 'Champions League', country: 'Europe' },
    { name: 'Europa League', country: 'Europe' },
    { name: 'Conference League', country: 'Europe' },
    { name: 'Primeira Liga', country: 'Portugal' },
    { name: 'Eredivisie', country: 'Netherlands' },
    { name: 'Championship', country: 'England' },
    { name: 'ISL (seasonal highlight)', country: 'India' }
  ];
  
  leaguesGrid.innerHTML = '';
  leaguesGrid.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 20px;';
  
  LEAGUES.forEach(league => {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.cssText = 'cursor: pointer; transition: transform 0.2s;';
    
    card.innerHTML = `
      <div style="font-size: 18px; font-weight: 700; margin-bottom: 8px;">${escapeHTML(league.name)}</div>
      <div style="font-size: 14px; color: var(--text-secondary);">${escapeHTML(league.country)}</div>
    `;
    
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-4px)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
    });
    
    leaguesGrid.appendChild(card);
  });
}

// ========== INITIALIZE ==========

// Check if user is already logged in
window.addEventListener('DOMContentLoaded', () => {
  const storedUser = getStorage('currentUser');
  
  if (storedUser && storedUser.favouritePlayerId) {
    currentUser = storedUser;
    
    // Load user's selections
    selectedIdol = SAMPLE_PLAYERS.find(p => p.id === storedUser.favouritePlayerId);
    selectedClub = SAMPLE_CLUBS.find(c => c.id === storedUser.favouriteClubId);
    selectedNation = SAMPLE_NATIONS.find(n => n.id === storedUser.favouriteNationId);
    
    // Skip to app
    showApp();
  }
  
  // Make logo work if not uploaded yet
  const logoImg = document.getElementById('logoImg');
  logoImg.onerror = function() {
    this.style.display = 'none';
    // Show fallback text logo
    const logoSection = document.querySelector('.logo-section');
    logoSection.innerHTML = '<span style="width: 48px; height: 48px; border-radius: 50%; background: var(--color-primary); color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 20px;">GV</span><span class="site-name">GoalVERSE</span>';
  };
});

console.log('✅ GoalVERSE Phase 1 loaded successfully!');