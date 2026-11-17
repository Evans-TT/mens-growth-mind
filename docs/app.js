const CREDENTIALS = { email: 'demo@mgm.co.za', password: 'Grow2026!' };

const books = [
  {
    id: 'atomic', title: 'Atomic Habits', author: 'James Clear', price: 50,
    image: './assets/atomic-habits.jpg', category: 'Habits', points: 500,
    reward: 'R300 microwave voucher', rewardShort: 'Microwave voucher', code: 'MGM-MICRO-300', icon: '◫', rewardImage: './assets/reward-microwave.png',
    description: 'Build systems that make everyday progress feel automatic.',
    pages: [
      ['Small moves, big identity', 'Growth rarely arrives as one grand decision. It is built in tiny votes for the person you are becoming.', 'When the action is small enough to repeat, consistency becomes more powerful than intensity.', 'What is one two-minute action your future self would thank you for?'],
      ['Make it obvious', 'Your environment often decides before your willpower gets a vote. Put the useful cue where your eyes naturally land.', 'A prepared desk, a visible book or a filled water bottle can turn an intention into a default.', 'Which cue could you place in your environment today?'],
      ['Make it easy', 'Reduce the distance between you and the good choice. Friction is not a character flaw; it is a design problem.', 'Prepare the first step in advance. The easier it is to begin, the more likely momentum will carry you forward.', 'What can you prepare tonight to make tomorrow easier?'],
      ['Track the evidence', 'A visible record turns effort into proof. Each completed action becomes evidence that you can trust yourself.', 'Do not chase perfection. Protect the chain, learn from misses and return quickly.', 'How will you record your next seven small wins?'],
      ['Become the system', 'The deepest change is not what you achieve but who your repeated choices teach you to become.', 'Choose one identity, one cue and one tiny action. Then repeat until the action feels like yours.', 'Complete the book to bank 500 points and reveal your reward.']
    ]
  },
  {
    id: 'rich-dad', title: 'Rich Dad Poor Dad', author: 'Robert T. Kiyosaki', price: 150,
    image: './assets/rich-dad-poor-dad.png', category: 'Money', points: 1500,
    reward: 'R1,000 washing machine voucher', rewardShort: 'Washing machine voucher', code: 'MGM-WASH-1000', icon: '▦', rewardImage: './assets/reward-washing-machine.png',
    description: 'Reframe how you think about money, assets and opportunity.',
    pages: [
      ['Money is a language', 'Financial confidence starts when money stops being mysterious. Learn the words behind income, expenses, assets and obligations.', 'Clarity gives you more options. A simple monthly view is often more useful than a complicated plan you avoid.', 'Which money number have you been avoiding?'],
      ['Pay attention to flow', 'A salary can feel secure while quietly disappearing. The question is not only what comes in, but what remains and what it builds.', 'Name every recurring outflow. Then decide which costs serve your future and which simply repeat the past.', 'What one expense can you redirect toward a goal?'],
      ['Build useful assets', 'An asset should add capacity: knowledge, income, time, resilience or opportunity. Start with what you understand.', 'The strongest first asset may be a skill you can practise and offer before spending large amounts of money.', 'Which existing skill could become more valuable?'],
      ['Learn before you leap', 'Good decisions combine courage with evidence. Ask what could go right, what could go wrong and how much you can afford to learn.', 'A small experiment can answer questions more cheaply than a big commitment.', 'Design one low-risk experiment for an idea you have.'],
      ['Choose ownership', 'Ownership begins before any purchase. It is the habit of taking responsibility for what you know, decide and repeat.', 'Write a one-page plan for the next thirty days: earn, protect, learn and build.', 'Finish this reading to unlock the highest-value reward in the MGM demo.']
    ]
  },
  {
    id: 'think-grow', title: 'Think & Grow Rich', author: 'Napoleon Hill', price: 10,
    image: './assets/think-and-grow-rich.jpg', category: 'Mindset', points: 100,
    reward: '10% MGM store discount', rewardShort: 'Store discount', code: 'MGM-GROW-10', icon: '◇', rewardImage: './assets/reward-discount.png',
    description: 'Turn a clear intention into focused, persistent action.',
    pages: [
      ['Give the goal a shape', 'A vague wish is difficult to act on. A clear goal has a measure, a reason and a next step.', 'Write it plainly enough that you can tell whether today moved you closer.', 'What does success look like in one sentence?'],
      ['Direct your attention', 'Attention is a limited resource. What you rehearse becomes easier to notice and more likely to influence your choices.', 'Begin each day with the one outcome that deserves your best energy.', 'What deserves your first focused hour tomorrow?'],
      ['Turn belief into practice', 'Confidence grows through kept promises. Choose commitments you can honour, then increase the challenge as your evidence grows.', 'The point is not to feel ready; it is to build a history of showing up.', 'Which promise can you keep for seven days?'],
      ['Borrow better perspective', 'Progress accelerates when you invite useful minds into the room. Seek people who question your blind spots and strengthen your ideas.', 'A good circle combines honesty, skill and encouragement.', 'Who could give you one candid piece of advice?'],
      ['Persist with intelligence', 'Persistence is not repeating a broken method. It is staying loyal to the goal while remaining flexible about the route.', 'Review the evidence, adjust the method and take the next useful step.', 'Complete this final page to unlock your MGM store discount.']
    ]
  }
];

const defaultState = () => ({
  loggedIn: false,
  activeView: 'home',
  progress: { atomic: 1, 'rich-dad': 0, 'think-grow': 0 },
  completed: [], purchased: [], claimed: [], points: 120,
  streak: 3, referrals: 0, pagesRead: 1,
  activity: [
    { icon: '↗', title: 'Started Atomic Habits', detail: 'Your reading journey is underway', time: 'Today' },
    { icon: '◆', title: 'Welcome bonus', detail: '+120 MGM points added', time: 'Today' }
  ]
});

let state = loadState();
let currentReader = null;
let searchTerm = '';
let filter = 'All';
let theme = localStorage.getItem('mgm-theme') || 'dark';
let transitionInProgress = false;
let readerTurning = false;
document.documentElement.dataset.theme = theme;

function loadState() {
  try { return { ...defaultState(), ...JSON.parse(localStorage.getItem('mgm-demo-state') || '{}') }; }
  catch { return defaultState(); }
}

function saveState() { localStorage.setItem('mgm-demo-state', JSON.stringify(state)); }
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function render() {
  document.body.classList.toggle('logged-in', state.loggedIn);
  $('#app').innerHTML = state.loggedIn ? appTemplate() : loginTemplate();
  bindEvents();
}

function loginTemplate() {
  return `<main class="login-shell">
    <section class="login-visual">
      <div class="brand"><img src="./assets/mgm-logo.jpg" alt="Men's Growth Mind logo"><div>MEN'S GROWTH MIND<small>READ. REFLECT. GROW.</small></div></div>
      <div class="login-copy">
        <span class="eyebrow">A READING REWARDS EXPERIENCE</span>
        <h1>Unlock your <span>next chapter.</span></h1>
        <p>Read powerful ideas, build visible momentum and turn every finished book into a reward you can use in the real world.</p>
        <div class="login-steps">${['Join','Read','Verify','Earn','Redeem'].map((x,i)=>`<div class="login-step"><b>0${i+1}</b>${x}</div>`).join('')}</div>
      </div>
      <span class="muted" style="position:relative;z-index:1;font-size:.75rem">Interactive prototype · All data stays in this browser</span>
    </section>
    <section class="login-panel">
      <button class="theme-toggle login-theme-toggle" type="button" data-theme-toggle aria-label="Switch colour theme">${theme === 'dark' ? '☀' : '☾'} <span>${theme === 'dark' ? 'Light' : 'Dark'} mode</span></button>
      <form class="login-card" id="login-form">
        <span class="eyebrow">MEMBER ACCESS</span>
        <h2>Welcome back.</h2>
        <p>Continue your reading journey and see what your progress has unlocked.</p>
        <div class="field"><label for="email">Email address</label><input id="email" type="email" autocomplete="username" placeholder="name@example.com" required></div>
        <div class="field"><label for="password">Password</label><div class="password-wrap"><input id="password" type="password" autocomplete="current-password" placeholder="Enter password" required><button class="text-button" type="button" id="show-password">Show</button></div></div>
        <p class="login-error" id="login-error" role="alert"></p>
        <button class="primary" type="submit">Enter your library →</button>
        <div class="demo-credentials"><span>Demo login</span><div class="credential-row"><label>Email</label><code>${CREDENTIALS.email}</code></div><div class="credential-row"><label>Password</label><code>${CREDENTIALS.password}</code></div><button type="button" class="text-button" id="fill-demo" style="margin-top:10px;padding:0">Use demo details</button></div>
      </form>
    </section>
  </main>`;
}

function appTemplate() {
  return `<div class="app-shell">
    ${topbar()}
    <main id="main-content">${viewTemplate()}</main>
    ${mobileNav()}
    ${footerTemplate()}
    <div id="modal-root"></div>
  </div>`;
}

const navItems = [ ['home','Home'], ['library','Library'], ['rewards','Rewards'], ['profile','Profile'] ];
function topbar() {
  return `<header class="topbar">
    <button class="brand" data-view="home" style="border:0;background:none;color:inherit;padding:0"><img src="./assets/mgm-logo.jpg" alt="MGM"><div>MGM<small>MEN'S GROWTH MIND</small></div></button>
    <nav class="nav" aria-label="Primary">${navItems.map(([id,label])=>`<button data-view="${id}" class="${state.activeView===id?'active':''}">${label}</button>`).join('')}</nav>
    <button class="theme-toggle" type="button" data-theme-toggle aria-label="Switch colour theme">${theme === 'dark' ? '☀' : '☾'} <span>${theme === 'dark' ? 'Light' : 'Dark'}</span></button>
    <button class="secondary" id="refer-button">Refer a friend</button>
    <button class="profile-chip" data-view="profile"><span class="avatar">TM</span><span>Thabo M.</span></button>
  </header>`;
}

function mobileNav() {
  const items = [ ['home','⌂','Home'], ['library','▤','Library'], ['rewards','◇','Rewards'], ['profile','○','Profile'] ];
  return `<nav class="mobile-nav" aria-label="Mobile navigation">${items.map(([id,icon,label])=>`<button data-view="${id}" class="${state.activeView===id?'active':''}"><span>${icon}</span>${label}</button>`).join('')}<button id="mobile-refer"><span>↗</span>Refer</button></nav>`;
}

function footerTemplate() {
  return `<footer class="footer"><div><strong style="color:#a5b0b6">MGM prototype</strong><br>Browser-local demo · No real payments or vouchers</div><div class="footer-actions"><button class="secondary" id="reset-demo">↺ Reset demo</button><button class="text-button" id="logout">Log out</button></div></footer>`;
}

function viewTemplate() {
  if (state.activeView === 'library') return libraryView();
  if (state.activeView === 'rewards') return rewardsView();
  if (state.activeView === 'profile') return profileView();
  return homeView();
}

function homeView() {
  const nextBook = books.find(b => !state.completed.includes(b.id)) || books[0];
  const progress = state.progress[nextBook.id] || 0;
  const completion = Math.round((state.completed.length / books.length) * 100);
  return `<div class="page">
    <section class="hero-grid">
      <div class="hero-card" style="--book-image:url('${nextBook.image}')">
        <div class="hero-content"><span class="eyebrow">${progress ? 'CONTINUE YOUR JOURNEY' : 'YOUR NEXT READ'}</span><h1>${nextBook.title}</h1><p>${nextBook.description} ${progress ? `You are on page ${progress + 1} of this five-page interactive sample.` : 'You are ready to begin this five-page interactive sample.'}</p><div class="hero-actions"><button class="primary" data-read="${nextBook.id}">${progress ? 'Continue reading' : 'Start reading'} →</button><button class="secondary" data-view="library">Browse library</button></div></div>
      </div>
      <aside class="status-card"><div><span class="eyebrow">YOUR MOMENTUM</span><h3>${completion === 100 ? 'Challenge complete' : '3-book growth challenge'}</h3><p class="muted">Complete all three books to fill the ring.</p></div><div class="ring-wrap"><div class="progress-ring" style="--progress:${completion}%"><strong>${completion}%</strong></div></div><div class="mini-stat-row"><div class="mini-stat"><strong>${state.streak} days</strong><span>Current streak</span></div><div class="mini-stat"><strong>${state.points.toLocaleString()}</strong><span>MGM points</span></div></div></aside>
    </section>
    <div class="section-title"><h2>Your growth at a glance</h2><button class="link-button" data-view="profile">View analytics →</button></div>
    <section class="stat-grid">${statCards()}</section>
    <div class="section-title"><h2>Choose your next chapter</h2><button class="link-button" data-view="library">See all books →</button></div>
    <section class="book-grid">${books.map(bookCard).join('')}</section>
    <div class="section-title"><h2>How MGM works</h2></div>
    <section class="journey">${[['Join','Sign in to your member library'],['Read','Turn five immersive sample pages'],['Verify','Reach the final reflection'],['Earn','Bank points and unlock a reward'],['Redeem','Reveal your demo voucher']].map((x,i)=>`<div class="journey-step"><b>0${i+1}</b><strong>${x[0]}</strong><span>${x[1]}</span></div>`).join('')}</section>
  </div>`;
}

function statCards() {
  return [ ['◷',state.pagesRead,'Pages read'], ['✓',state.completed.length,'Books completed'], ['◇',state.points.toLocaleString(),'Points earned'], ['↗',state.referrals,'Friends referred'] ].map(x=>`<article class="stat"><span class="icon">${x[0]}</span><strong>${x[1]}</strong><span>${x[2]}</span></article>`).join('');
}

function bookCard(book) {
  const page = state.progress[book.id] || 0;
  const done = state.completed.includes(book.id);
  const purchased = state.purchased.includes(book.id);
  const pct = done ? 100 : Math.round((page / 5) * 100);
  return `<article class="book-card" data-book-card="${book.id}"><div class="book-cover"><img src="${book.image}" alt="${book.title} cover">${done?'<span class="completed-tag">✓ Completed</span>':''}<span class="price-tag">R${book.price}</span></div><div class="book-body"><h3>${book.title}</h3><span class="book-author">${book.author}</span><div class="book-meta"><span>${book.category} · 5-page sample</span><span>${done?'Finished':page?`Page ${page + 1}`:'Not started'}</span></div><div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div><div class="book-actions"><button class="primary" data-read="${book.id}">${done?'Read again':page?'Continue':'Read sample'}</button><button class="secondary" data-buy="${book.id}">${purchased?'✓ Purchased':'Buy · R'+book.price}</button></div></div></article>`;
}

function libraryView() {
  const filtered = books.filter(book => (filter === 'All' || book.category === filter) && `${book.title} ${book.author}`.toLowerCase().includes(searchTerm.toLowerCase()));
  return `<div class="page"><header class="page-heading"><div><span class="eyebrow">THE MGM LIBRARY</span><h1>Books that move<br>you forward.</h1></div><p>Read a five-page interactive sample, track your progress, buy a title in the mock store and finish to unlock a reward.</p></header><div class="library-toolbar"><label class="search"><span>⌕</span><input id="book-search" value="${escapeHtml(searchTerm)}" placeholder="Search by title or author" aria-label="Search books"></label><div class="filter-pills">${['All','Habits','Money','Mindset'].map(x=>`<button data-filter="${x}" class="${filter===x?'active':''}">${x}</button>`).join('')}</div></div><section class="book-grid" id="library-grid">${filtered.length?filtered.map(bookCard).join(''):'<p class="muted">No books match that search.</p>'}</section></div>`;
}

function rewardsView() {
  const nextTier = Math.max(0, 2500 - state.points);
  const tierPct = Math.min(100, Math.round(state.points / 25));
  return `<div class="page"><header class="page-heading"><div><span class="eyebrow">REWARDS WALLET</span><h1>Growth pays<br>forward.</h1></div><p>The more you invest in your reading, the bigger the demo reward. Finish a book to reveal its voucher code.</p></header><section class="rewards-hero"><div class="wallet-card"><h2>Available balance</h2><div class="points">${state.points.toLocaleString()}</div><strong>MGM points</strong><p>Points are added automatically when you complete a book or make a successful referral.</p></div><div class="tier-card"><span class="eyebrow">YOUR STATUS</span><h2>${state.points >= 2500 ? 'Legacy tier' : state.points >= 1000 ? 'Momentum tier' : 'Starter tier'}</h2><p class="muted">${nextTier ? `${nextTier.toLocaleString()} points to reach Legacy tier.` : 'You have reached the highest prototype tier.'}</p><div class="tier-progress"><div class="tier-labels"><span>Starter</span><span>Momentum</span><span>Legacy</span></div><div class="progress-track"><div class="progress-fill" style="width:${tierPct}%"></div></div></div><button class="secondary" id="reward-how">How rewards work</button></div></section><div class="section-title"><h2>Your unlocks</h2><span class="muted">${state.completed.length} of ${books.length} unlocked</span></div><section class="reward-grid">${books.map(rewardCard).join('')}</section></div>`;
}

function rewardCard(book) {
  const unlocked = state.completed.includes(book.id);
  const claimed = state.claimed.includes(book.id);
  return `<article class="reward-card ${unlocked?'':'locked'}"><div class="reward-visual"><img src="${book.rewardImage}" alt="${book.rewardShort}"><span class="reward-state">${unlocked?'UNLOCKED':'LOCKED'}</span></div><div class="reward-card-content"><span class="reward-icon">${unlocked?book.icon:'⌑'}</span><h3>${book.reward}</h3><p>Complete <strong>${book.title}</strong> to ${unlocked?'use this prototype reward':'unlock this reward'}.</p><footer>${unlocked?`<div class="voucher-code">${claimed?'CLAIMED · ':''}${book.code}</div><button class="${claimed?'secondary':'primary'}" data-claim="${book.id}" style="width:100%;margin-top:10px" ${claimed?'disabled':''}>${claimed?'Reward claimed':'Claim reward'}</button>`:`<span class="locked-label">🔒 ${book.points} points + voucher</span>`}</footer></div></article>`;
}

function profileView() {
  const chart = [18,34,22,56,42,78,Math.min(96,30+state.pagesRead*7)];
  return `<div class="page"><header class="page-heading"><div><span class="eyebrow">MEMBER PROFILE</span><h1>Your growth,<br>made visible.</h1></div><p>See your reading behaviour, milestones and reward activity—all simulated locally for this prototype.</p></header><section class="profile-layout"><aside class="profile-card profile-main"><div class="avatar">TM</div><h2>Thabo Mokoena</h2><p>demo@mgm.co.za</p><span class="level-badge">${state.points>=1000?'MOMENTUM MEMBER':'STARTER MEMBER'}</span><div class="profile-detail"><span>Member since</span><strong>Nov 2026</strong></div><div class="profile-detail"><span>Books owned</span><strong>${state.purchased.length}</strong></div><div class="profile-detail"><span>Rewards unlocked</span><strong>${state.completed.length}</strong></div><div class="profile-detail"><span>Referral code</span><strong>MGM-THABO</strong></div><button class="primary" id="profile-refer" style="width:100%;margin-top:18px">Refer a friend</button></aside><div class="profile-content"><div class="analytics-grid">${statCards()}</div><article class="chart-card"><div class="chart-head"><div><span class="eyebrow">READING ACTIVITY</span><h3>Minutes read this week</h3></div><strong>${chart.reduce((a,b)=>a+b,0)} min</strong></div><div class="bars">${chart.map((h,i)=>`<div class="bar-col"><div class="bar" style="height:${h}%"></div><span>${['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i]}</span></div>`).join('')}</div></article><article class="chart-card"><div class="chart-head"><div><span class="eyebrow">RECENT ACTIVITY</span><h3>Your latest milestones</h3></div></div><div class="activity-list">${state.activity.slice(0,6).map(x=>`<div class="activity"><span class="activity-icon">${x.icon}</span><div><strong>${x.title}</strong><span>${x.detail}</span></div><time>${x.time}</time></div>`).join('')}</div></article></div></section></div>`;
}

function bindEvents() {
  $('#login-form')?.addEventListener('submit', handleLogin);
  $('#fill-demo')?.addEventListener('click', () => { $('#email').value=CREDENTIALS.email; $('#password').value=CREDENTIALS.password; });
  $('#show-password')?.addEventListener('click', e => { const input=$('#password'); input.type=input.type==='password'?'text':'password'; e.target.textContent=input.type==='password'?'Show':'Hide'; });
  $$('[data-theme-toggle]').forEach(el => el.addEventListener('click', toggleTheme));
  $$('[data-view]').forEach(el => el.addEventListener('click', () => navigate(el.dataset.view)));
  $$('[data-read]').forEach(el => el.addEventListener('click', () => openReader(el.dataset.read)));
  $$('[data-buy]').forEach(el => el.addEventListener('click', () => openCheckout(el.dataset.buy)));
  $$('[data-claim]').forEach(el => el.addEventListener('click', () => claimReward(el.dataset.claim)));
  $$('[data-filter]').forEach(el => el.addEventListener('click', () => { filter=el.dataset.filter; render(); }));
  $('#book-search')?.addEventListener('input', e => { searchTerm=e.target.value; updateLibraryGrid(); });
  $('#refer-button')?.addEventListener('click', openReferral);
  $('#mobile-refer')?.addEventListener('click', openReferral);
  $('#profile-refer')?.addEventListener('click', openReferral);
  $('#reward-how')?.addEventListener('click', rewardsInfo);
  $('#logout')?.addEventListener('click', () => { state.loggedIn=false; saveState(); render(); window.scrollTo(0,0); });
  $('#reset-demo')?.addEventListener('click', confirmReset);
}

function handleLogin(event) {
  event.preventDefault();
  const email=$('#email').value.trim().toLowerCase();
  const password=$('#password').value;
  if (email===CREDENTIALS.email && password===CREDENTIALS.password) {
    state.loggedIn=true; state.activeView='home'; saveState(); render(); toast('Welcome back, Thabo','Your library is ready.');
  } else { $('#login-error').textContent='Those details do not match the demo login shown below.'; }
}

function navigate(view) {
  if (view === state.activeView || transitionInProgress) return;
  transitionInProgress = true;
  const labels = { home: 'Opening your dashboard', library: 'Curating your library', rewards: 'Unlocking your rewards', profile: 'Mapping your progress' };
  const splash = document.createElement('div');
  splash.className = 'page-splash';
  splash.innerHTML = `<div class="splash-orbit"><img src="./assets/mgm-logo.jpg" alt=""></div><span class="eyebrow">MEN'S GROWTH MIND</span><strong>${labels[view] || 'Turning the page'}</strong><div class="splash-line"><i></i></div>`;
  document.body.appendChild(splash);
  requestAnimationFrame(() => splash.classList.add('active'));
  setTimeout(() => {
    state.activeView=view; saveState(); render(); window.scrollTo({top:0,behavior:'auto'});
    splash.classList.add('leaving');
    setTimeout(() => { splash.remove(); transitionInProgress=false; }, 360);
  }, 560);
}

function toggleTheme() {
  theme = theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('mgm-theme', theme);
  document.documentElement.dataset.theme = theme;
  render();
  toast(`${theme === 'dark' ? 'Dark' : 'Light'} mode on`, 'Your colour preference is saved for this browser.');
}
function updateLibraryGrid() {
  const filtered=books.filter(book => (filter==='All'||book.category===filter)&&`${book.title} ${book.author}`.toLowerCase().includes(searchTerm.toLowerCase()));
  $('#library-grid').innerHTML=filtered.length?filtered.map(bookCard).join(''):'<p class="muted">No books match that search.</p>';
  $$('[data-read]', $('#library-grid')).forEach(el=>el.addEventListener('click',()=>openReader(el.dataset.read)));
  $$('[data-buy]', $('#library-grid')).forEach(el=>el.addEventListener('click',()=>openCheckout(el.dataset.buy)));
}

function openReader(id, page = null) {
  const book=books.find(b=>b.id===id);
  currentReader={ id, page: page ?? Math.min(state.progress[id] || 0, 4) };
  document.body.style.overflow='hidden';
  document.body.insertAdjacentHTML('beforeend', readerTemplate(book,currentReader.page));
  bindReader();
}

function readerTemplate(book,index) {
  const page=book.pages[index];
  return `<section class="reader-overlay" id="reader" aria-label="Book reader"><header class="reader-topbar"><button class="secondary" id="close-reader">← Library</button><div class="reader-title"><strong>${book.title}</strong><span>${book.author} · Demo reader</span></div><button class="text-button" id="reader-bookmark">Bookmark</button></header><div class="reader-layout"><aside class="reader-aside"><img src="${book.image}" alt="${book.title} cover"><div class="reader-pages-nav">${book.pages.map((p,i)=>`<button class="page-dot ${i===index?'active':''}" data-page="${i}"><b>${i+1}</b>${p[0]}</button>`).join('')}</div></aside><main class="reader-stage"><article class="book-page"><span class="page-number">Page ${index+1} of 5 · MGM sample</span><h1>${page[0]}</h1><p class="lead">${page[1]}</p><div class="pull-quote">${page[2]}</div><div class="reflection"><strong>Reflection prompt</strong><p>${page[3]}</p></div><div class="reader-controls"><button class="secondary" id="prev-page" ${index===0?'disabled':''}>← Previous</button><div class="reader-progress"><span>${Math.round(((index+1)/5)*100)}% complete</span><div class="progress-track"><div class="progress-fill" style="width:${((index+1)/5)*100}%"></div></div></div>${index===4?`<button class="primary" id="finish-book">Finish book ✓</button>`:`<button class="primary" id="next-page">Next →</button>`}</div></article></main></div></section>`;
}

function bindReader() {
  $('#close-reader').addEventListener('click', closeReader);
  $('#next-page')?.addEventListener('click',()=>setReaderPage(currentReader.page+1));
  $('#prev-page')?.addEventListener('click',()=>setReaderPage(currentReader.page-1));
  $('#finish-book')?.addEventListener('click',()=>finishBook(currentReader.id));
  $('#reader-bookmark').addEventListener('click',()=>{ updateReadingProgress(); toast('Bookmark saved',`Page ${currentReader.page+1} is waiting for you.`); });
  $$('[data-page]', $('#reader')).forEach(el=>el.addEventListener('click',()=>setReaderPage(Number(el.dataset.page))));
  window.addEventListener('keydown', readerKeys);
}

function readerKeys(e) {
  if (!currentReader) return;
  if (e.key==='Escape') closeReader();
  if (e.key==='ArrowRight'&&currentReader.page<4) setReaderPage(currentReader.page+1);
  if (e.key==='ArrowLeft'&&currentReader.page>0) setReaderPage(currentReader.page-1);
}

function setReaderPage(page) {
  if (readerTurning) return;
  const nextPage=Math.max(0,Math.min(4,page));
  if (nextPage === currentReader.page) return;
  readerTurning=true;
  const direction = nextPage > currentReader.page ? 'next' : 'prev';
  const oldPage=$('.book-page');
  oldPage.classList.add(`page-turn-out-${direction}`);
  setTimeout(() => {
    currentReader.page=nextPage;
    updateReadingProgress();
    const book=books.find(b=>b.id===currentReader.id);
    $('#reader').outerHTML=readerTemplate(book,currentReader.page);
    const newPage=$('.book-page');
    newPage.classList.add(`page-turn-in-${direction}`);
    bindReader();
    setTimeout(()=>{ newPage.classList.remove(`page-turn-in-${direction}`); readerTurning=false; },500);
  }, 330);
}

function updateReadingProgress() {
  const previous=state.progress[currentReader.id] || 0;
  if (currentReader.page>previous) { state.progress[currentReader.id]=currentReader.page; state.pagesRead += currentReader.page-previous; saveState(); }
}

function closeReader() {
  updateReadingProgress();
  $('#reader')?.remove(); currentReader=null; document.body.style.overflow=''; window.removeEventListener('keydown',readerKeys); render();
}

function finishBook(id) {
  const book=books.find(b=>b.id===id);
  const first=!state.completed.includes(id);
  state.progress[id]=5;
  if (first) {
    state.completed.push(id); state.points+=book.points; state.pagesRead+=1;
    state.activity.unshift({icon:'✓',title:`Completed ${book.title}`,detail:`+${book.points} points · ${book.rewardShort} unlocked`,time:'Just now'});
  }
  saveState();
  $('#reader')?.remove(); currentReader=null; document.body.style.overflow=''; window.removeEventListener('keydown',readerKeys);
  render();
  showConfetti();
  openModal(`<div class="center"><div class="success-mark">✓</div><span class="eyebrow">BOOK COMPLETE</span><h2>You turned pages into progress.</h2><div class="reward-reveal"><img src="${book.rewardImage}" alt="${book.rewardShort}"><span>JUST UNLOCKED</span></div><p>${first?`You earned <strong style="color:var(--cyan)">${book.points.toLocaleString()} points</strong> and unlocked a <strong>${book.reward}</strong>.`:'This title is already complete, but a reread is always a good investment.'}</p><div class="voucher-code" style="margin:24px 0">${book.code}</div><div class="modal-actions" style="justify-content:center"><button class="secondary" data-close-modal>Back home</button><button class="primary" id="view-rewards">View reward →</button></div></div>`);
  $('#view-rewards').addEventListener('click',()=>{ closeModal(); navigate('rewards'); });
}

function openCheckout(id) {
  const book=books.find(b=>b.id===id);
  if (state.purchased.includes(id)) { toast('Already in your collection','This book has already been purchased in the demo.'); return; }
  openModal(`<span class="eyebrow">DEMO CHECKOUT</span><h2>Make this book yours.</h2><p>This is a front-end simulation. No payment details are collected and no charge will be made.</p><div class="order-summary"><img src="${book.image}" alt=""><div><strong>${book.title}</strong><span>${book.author}<br>Digital reading edition</span></div><b>R${book.price}</b></div><div class="field"><label for="payment-method">Payment method</label><select id="payment-method"><option>Visa ending in 4242 (demo)</option><option>Instant EFT (demo)</option><option>MGM Wallet (demo)</option></select></div><div class="field"><label for="buyer-name">Name on order</label><input id="buyer-name" value="Thabo Mokoena"></div><div class="modal-actions"><button class="secondary" data-close-modal>Cancel</button><button class="primary" id="confirm-purchase">Pay R${book.price} (demo)</button></div>`);
  $('#confirm-purchase').addEventListener('click',()=>completePurchase(book));
}

function completePurchase(book) {
  state.purchased.push(book.id); state.activity.unshift({icon:'▣',title:`Purchased ${book.title}`,detail:`Demo order · R${book.price}`,time:'Just now'}); saveState();
  openModal(`<div class="center"><div class="success-mark">✓</div><span class="eyebrow">ORDER CONFIRMED</span><h2>${book.title} is yours.</h2><p>Your mock receipt is <strong style="color:#fff">MGM-${Date.now().toString().slice(-6)}</strong>. You can start the sample reader now.</p><div class="modal-actions" style="justify-content:center"><button class="secondary" data-close-modal>Keep browsing</button><button class="primary" id="read-purchase">Start reading →</button></div></div>`);
  $('#read-purchase').addEventListener('click',()=>{ closeModal(); openReader(book.id,0); });
}

function openReferral() {
  openModal(`<span class="eyebrow">REFER A FRIEND</span><h2>Grow better, together.</h2><p>Invite a friend to the MGM community. This demo awards 250 points when you send the simulated invite.</p><div class="field"><label for="friend-name">Friend's first name</label><input id="friend-name" placeholder="e.g. Sipho"></div><div class="field"><label for="friend-email">Friend's email</label><input id="friend-email" type="email" placeholder="friend@example.com"></div><div class="voucher-code">mgm.co.za/join/MGM-THABO</div><div class="modal-actions"><button class="secondary" id="copy-link">Copy link</button><button class="primary" id="send-referral">Send demo invite →</button></div>`);
  $('#copy-link').addEventListener('click', async()=>{ try{await navigator.clipboard.writeText('https://mgm.co.za/join/MGM-THABO');toast('Link copied','Your referral link is ready to share.');}catch{toast('Referral link','mgm.co.za/join/MGM-THABO');} });
  $('#send-referral').addEventListener('click',()=>{
    const name=$('#friend-name').value.trim(), email=$('#friend-email').value.trim();
    if(!name||!email.includes('@')) { toast('Add valid details','Enter your friend’s name and email to continue.'); return; }
    state.referrals+=1; state.points+=250; state.activity.unshift({icon:'↗',title:`Referred ${name}`,detail:'+250 points · Demo invite sent',time:'Just now'}); saveState(); closeModal(); render(); toast('Referral sent',`Your demo invite to ${name} added 250 points.`);
  });
}

function claimReward(id) {
  const book=books.find(b=>b.id===id);
  if (!state.claimed.includes(id)) state.claimed.push(id);
  state.activity.unshift({icon:'◇',title:`Claimed ${book.rewardShort}`,detail:`Voucher ${book.code}`,time:'Just now'}); saveState(); render(); toast('Reward claimed',`${book.code} is saved to your wallet.`);
}

function rewardsInfo() {
  openModal(`<span class="eyebrow">REWARDS EXPLAINED</span><h2>Read more. Unlock more.</h2><p>Each five-page demo ends with a completion check. The reward value scales with the book price:</p><div class="activity-list">${books.slice().sort((a,b)=>b.price-a.price).map(b=>`<div class="activity"><span class="activity-icon">${b.icon}</span><div><strong>R${b.price} book · ${b.points} points</strong><span>${b.reward}</span></div></div>`).join('')}</div><div class="modal-actions"><button class="primary" data-close-modal>Got it</button></div>`);
}

function confirmReset() {
  openModal(`<span class="eyebrow">RESET PROTOTYPE</span><h2>Start the demo from the beginning?</h2><p>This clears all reading progress, purchases, rewards and referrals stored in this browser. You will return to the login screen.</p><div class="modal-actions"><button class="secondary" data-close-modal>Keep my progress</button><button class="secondary danger-button" id="confirm-reset">Reset everything</button></div>`);
  $('#confirm-reset').addEventListener('click',()=>{ localStorage.removeItem('mgm-demo-state'); localStorage.removeItem('mgm-theme'); theme='dark'; document.documentElement.dataset.theme=theme; state=defaultState(); closeModal(); render(); window.scrollTo(0,0); toast('Demo reset','All prototype data is back to its starting state.'); });
}

function openModal(content) {
  let root=$('#modal-root');
  if(!root){ root=document.createElement('div'); root.id='modal-root'; document.body.appendChild(root); }
  root.innerHTML=`<div class="modal-backdrop" role="dialog" aria-modal="true"><div class="modal"><button class="modal-close" data-close-modal aria-label="Close">×</button>${content}</div></div>`;
  $$('[data-close-modal]',root).forEach(el=>el.addEventListener('click',closeModal));
  $('.modal-backdrop',root).addEventListener('click',e=>{ if(e.target.classList.contains('modal-backdrop'))closeModal(); });
}
function closeModal(){ const root=$('#modal-root'); if(root)root.innerHTML=''; }

function toast(title,message) {
  const el=document.createElement('div'); el.className='toast'; el.innerHTML=`<strong>${escapeHtml(title)}</strong>${escapeHtml(message)}`; $('#toast-region').appendChild(el); setTimeout(()=>el.remove(),3600);
}
function showConfetti() {
  const el=document.createElement('div'); el.className='confetti'; el.innerHTML=Array.from({length:70},(_,i)=>`<i style="--x:${Math.random()*100}%;--d:${1.8+Math.random()*2}s;--r:${Math.random()*180}deg;--c:${['#78e8ff','#fff','#f3c979','#19d5fa'][i%4]}"></i>`).join(''); document.body.appendChild(el); setTimeout(()=>el.remove(),4200);
}
function escapeHtml(value=''){ return value.replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[c])); }

render();
