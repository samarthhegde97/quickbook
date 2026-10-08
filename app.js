// Initialize Icons
lucide.createIcons();

const authScreen = document.getElementById('authScreen');
const mainApp = document.getElementById('mainApp');
const loginForm = document.getElementById('loginForm');
const settingsModal = document.getElementById('settingsModal');
const settingsOverlay = document.getElementById('settingsOverlay');
const queueGrid = document.getElementById('queueGrid');
const activityGrid = document.getElementById('activityGrid');

let authMode = 'login';
let savesCount = 0;
let selectedRating = 0;
const maxSaves = 5;

// Unified Palette Card Mapping
const cardMap = {
    yellow: { 
        bg: 'bg-amber-100/80 dark:bg-amber-950/30', 
        border: 'border-amber-200/60 dark:border-amber-900/40', 
        text: 'text-amber-950 dark:text-amber-100', 
        pill: 'text-amber-800 dark:text-amber-300' 
    },
    blue: { 
        bg: 'bg-sky-100/80 dark:bg-sky-950/30', 
        border: 'border-sky-200/60 dark:border-sky-900/40', 
        text: 'text-sky-950 dark:text-sky-100', 
        pill: 'text-sky-800 dark:text-sky-300' 
    },
    pink: { 
        bg: 'bg-pink-100/80 dark:bg-pink-950/30', 
        border: 'border-pink-200/60 dark:border-pink-900/40', 
        text: 'text-pink-950 dark:text-pink-100', 
        pill: 'text-pink-800 dark:text-pink-300' 
    }
};

const initialQueue = [
    { title: 'Scale SaaS to $10k MRR', type: 'YouTube', color: 'yellow' },
    { title: 'Next.js 15 UI Architecture', type: 'Article', color: 'blue' }
];

// 1. Auth Mode Switcher
function switchAuthTab(mode) {
    authMode = mode;
    const thumb = document.getElementById('authTabThumb');
    const loginBtn = document.getElementById('tabLoginBtn');
    const signupBtn = document.getElementById('tabSignupBtn');
    const nameGroup = document.getElementById('nameFieldGroup');
    const title = document.getElementById('authTitle');
    const subtitle = document.getElementById('authSubtitle');
    const btnText = document.getElementById('btnText');
    const forgotLink = document.getElementById('forgotPassLink');

    if (mode === 'login') {
        thumb.style.left = '0.5%';
        loginBtn.className = 'relative z-10 w-1/2 text-center font-extrabold text-brand-black dark:text-white';
        signupBtn.className = 'relative z-10 w-1/2 text-center font-extrabold text-gray-400';
        nameGroup.classList.add('hidden');
        title.textContent = 'Welcome back';
        subtitle.textContent = 'Enter your credentials to access your saved queue.';
        btnText.textContent = 'Sign In & Sync';
        forgotLink.style.display = 'block';
    } else {
        thumb.style.left = '50.5%';
        signupBtn.className = 'relative z-10 w-1/2 text-center font-extrabold text-brand-black dark:text-white';
        loginBtn.className = 'relative z-10 w-1/2 text-center font-extrabold text-gray-400';
        nameGroup.classList.remove('hidden');
        title.textContent = 'Create an account';
        subtitle.textContent = 'Get started with intelligent queue management.';
        btnText.textContent = 'Create Free Account';
        forgotLink.style.display = 'none';
    }
}

// Password Visibility
function togglePasswordVisibility() {
    const passwordInput = document.getElementById('passwordInput');
    const eyeIcon = document.getElementById('eyeIcon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.setAttribute('data-lucide', 'eye-off');
    } else {
        passwordInput.type = 'password';
        eyeIcon.setAttribute('data-lucide', 'eye');
    }
    lucide.createIcons();
}

// Auth Submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('emailInput').value;
    const nameInput = document.getElementById('nameInput').value;
    const emailName = email.split('@')[0];
    const rawName = (authMode === 'signup' && nameInput.trim()) ? nameInput.trim() : emailName;
    const formattedName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
    const initials = formattedName.substring(0, 2).toUpperCase();

    const submitBtn = document.getElementById('authSubmitBtn');
    const btnText = document.getElementById('btnText');
    btnText.textContent = 'Syncing Workspace...';
    submitBtn.disabled = true;

    setTimeout(() => {
        document.getElementById('userNameDisplay').textContent = formattedName;
        document.getElementById('mobileNameDisplay').textContent = formattedName;
        document.getElementById('userEmailDisplay').textContent = email;
        document.getElementById('userAvatarText').textContent = initials;
        document.getElementById('mobileAvatarText').textContent = initials;

        authScreen.classList.add('logged-in');

        setTimeout(() => {
            mainApp.classList.remove('opacity-0', 'translate-y-8');
            mainApp.classList.add('dashboard-loaded');
            renderQueue();
            generateStreakHeatmap();
            
            submitBtn.disabled = false;
            btnText.textContent = authMode === 'login' ? 'Sign In & Sync' : 'Create Free Account';
        }, 300);
    }, 600);
});

function quickSocialLogin(provider) {
    document.getElementById('emailInput').value = `demo.${provider.toLowerCase()}@sstar.app`;
    loginForm.dispatchEvent(new Event('submit'));
}

// ================= FULLY FUNCTIONAL SETTINGS LOGIC =================

// Open Settings at specific tab
function openSettings(defaultTab = 'plans') {
    switchSettingsTab(defaultTab);
    
    settingsOverlay.classList.remove('opacity-0', 'pointer-events-none');
    settingsModal.classList.remove('translate-y-full', 'opacity-0', 'pointer-events-none');
    if (window.innerWidth >= 768) {
        settingsModal.classList.remove('md:scale-95');
        settingsModal.classList.add('md:scale-100');
    }
    lucide.createIcons();
}

// Close Settings
function closeSettings() {
    settingsOverlay.classList.add('opacity-0', 'pointer-events-none');
    settingsModal.classList.add('translate-y-full', 'opacity-0', 'pointer-events-none');
    if (window.innerWidth >= 768) {
        settingsModal.classList.remove('md:scale-100');
        settingsModal.classList.add('md:scale-95');
    }
}

// Switch between Settings Sub-Sections
function switchSettingsTab(tabName) {
    const tabs = ['plans', 'notifications', 'rate', 'app'];
    
    tabs.forEach(t => {
        const tabBtn = document.getElementById(`setTab-${t}`);
        const section = document.getElementById(`settingsSection-${t}`);
        
        if (t === tabName) {
            tabBtn?.classList.add('active');
            section?.classList.remove('hidden');
        } else {
            tabBtn?.classList.remove('active');
            section?.classList.add('hidden');
        }
    });
    lucide.createIcons();
}

// Save Notification Preferences
function saveNotificationPref(type, enabled) {
    console.log(`Notification Preference [${type}]:`, enabled);
}

// Interactive Star Rating Logic
function setRating(rating) {
    selectedRating = rating;
    const stars = document.querySelectorAll('.star-btn');
    
    stars.forEach(star => {
        const starNum = parseInt(star.getAttribute('data-star'));
        if (starNum <= rating) {
            star.classList.remove('text-gray-300');
            star.classList.add('text-amber-400');
        } else {
            star.classList.remove('text-amber-400');
            star.classList.add('text-gray-300');
        }
    });
}

// Submit Rate Us Feedback
function submitRating() {
    if (selectedRating === 0) {
        alert('Please select a star rating first!');
        return;
    }
    const btn = document.getElementById('submitRateBtn');
    btn.textContent = 'Thank you for rating QuickBook! ★';
    btn.classList.replace('bg-brand-black', 'bg-green-600');
    btn.classList.replace('dark:bg-white', 'dark:bg-green-600');
    btn.classList.add('text-white');
    
    setTimeout(() => {
        btn.textContent = 'Submit Review';
        btn.classList.replace('bg-green-600', 'bg-brand-black');
        btn.classList.replace('dark:bg-green-600', 'dark:bg-white');
        document.getElementById('rateFeedback').value = '';
        setRating(0);
        closeSettings();
    }, 1500);
}

// Simulate Pro Upgrade
function upgradeToProSim() {
    const upgradeBtn = document.getElementById('upgradeBtn');
    upgradeBtn.textContent = 'Upgrading to QuickBook Pro...';
    
    setTimeout(() => {
        upgradeBtn.textContent = 'Welcome to QuickBook Pro! ★';
        upgradeBtn.classList.replace('bg-brand-red', 'bg-green-600');
        alert('Congratulations! QuickBook Pro is now active on your account.');
    }, 1000);
}

// Logout Handler
function handleLogout() {
    closeSettings();
    setTimeout(() => {
        mainApp.classList.remove('dashboard-loaded');
        mainApp.classList.add('opacity-0', 'translate-y-8');
        authScreen.classList.remove('logged-in');
        loginForm.reset();
        switchAuthTab('login');
    }, 300);
}

// Theme Switcher
function setTheme(mode, index) {
    const thumbDesktop = document.getElementById('glassThumbDesktop');
    const html = document.documentElement;
    const buttons = document.querySelectorAll('.theme-btn');
    
    const pos = `calc(${index * 33.33}% + 1.2%)`;
    if (thumbDesktop) thumbDesktop.style.left = pos;
    
    buttons.forEach((btn, i) => {
        const btnIndex = i % 3;
        btn.style.color = btnIndex === index ? (mode === 'dark' || (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'white' : 'black') : '';
    });

    if (mode === 'dark') {
        html.classList.add('dark');
    } else if (mode === 'light') {
        html.classList.remove('dark');
    } else {
        window.matchMedia('(prefers-color-scheme: dark)').matches ? html.classList.add('dark') : html.classList.remove('dark');
    }
}

// Heatmap Generator
function generateStreakHeatmap() {
    activityGrid.innerHTML = '';
    const totalDays = 84;
    
    for (let i = 0; i < totalDays; i++) {
        const block = document.createElement('div');
        const rand = Math.random();
        let intensity = 'streak-empty';
        
        if (rand > 0.85) intensity = 'streak-high';
        else if (rand > 0.6) intensity = 'streak-med';
        else if (rand > 0.4) intensity = 'streak-low';

        block.className = `streak-block ${intensity}`;
        activityGrid.appendChild(block);
    }
}

// Queue Cards
function createCard(item, isNew = false) {
    const style = cardMap[item.color] || cardMap.yellow;

    const card = document.createElement('div');
    card.className = `${style.bg} p-6 rounded-[1.8rem] space-y-4 flex flex-col justify-between border ${style.border} transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${isNew ? 'animate-slide-up' : ''}`;
    
    card.innerHTML = `
        <div class="flex justify-between items-start">
            <span class="px-3 py-1.5 rounded-full bg-white/70 dark:bg-black/30 backdrop-blur-sm text-[10px] font-extrabold tracking-widest uppercase ${style.pill}">${item.type}</span>
            <button onclick="markWatched(this)" class="p-2 rounded-full bg-white/50 dark:bg-black/20 hover:scale-110 active:scale-90 transition-transform"><i data-lucide="check" class="w-4 h-4 ${style.text}"></i></button>
        </div>
        <div>
            <h4 class="font-extrabold text-base md:text-lg ${style.text} leading-snug line-clamp-2">${item.title}</h4>
            <p class="text-xs opacity-70 mt-2 font-medium ${style.text}">QuickRemind™ Scheduled</p>
        </div>
    `;
    return card;
}

function renderQueue() {
    queueGrid.innerHTML = '';
    savesCount = 0;
    initialQueue.forEach(item => {
        queueGrid.appendChild(createCard(item));
        savesCount++;
    });
    updateCount();
    lucide.createIcons();
}

document.getElementById('quickSaveForm').addEventListener('submit', (e) => {
    e.preventDefault();
    if (savesCount >= maxSaves) {
        openSettings('plans');
        return;
    }
    
    const input = document.getElementById('quickUrl');
    const newItem = { title: input.value, type: 'Bookmark', color: 'pink' };
    
    queueGrid.prepend(createCard(newItem, true));
    lucide.createIcons();
    
    savesCount++;
    updateCount();
    input.value = '';
});

function markWatched(btn) {
    const card = btn.closest('div.rounded-\\[1\\.8rem\\]');
    card.style.opacity = '0.4';
    card.style.transform = 'scale(0.98)';
    card.style.pointerEvents = 'none';
    btn.innerHTML = '<span class="text-xs font-bold px-1">Done</span>';
}

function updateCount() {
    document.getElementById('saveCount').innerText = savesCount;
}

document.addEventListener('DOMContentLoaded', () => setTheme('system', 2));