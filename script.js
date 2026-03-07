function login() {
    document.getElementById('').classList.toggle('');
}

function options() {
    document.getElementById('option-menu').classList.toggle('hidden');
    document.getElementById('backdrop1').classList.toggle('backdrop0');
}

// Close modals when clicking on backdrop
document.getElementById('backdrop1').addEventListener('click', function() {
    document.getElementById('option-menu').classList.add('hidden');
    document.getElementById('game-select-modal').classList.add('hidden');
    document.getElementById('difficulty-modal').classList.add('hidden');
    document.getElementById('lb-modal').classList.add('hidden');
    document.getElementById('auth-modal').classList.add('hidden');
    document.getElementById('backdrop1').classList.add('backdrop0');
});

const themeToggle = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;
const STORAGE_KEY = 'user-theme';

function setTheme(themeName) {
    htmlElement.setAttribute('data-theme', themeName);
    localStorage.setItem(STORAGE_KEY, themeName);
    if (themeToggle) {
        themeToggle.checked = (themeName === 'dark');
    }
}

function handleThemeChange(event) {
    const newTheme = event.target.checked ? 'dark' : 'light';
    setTheme(newTheme);
}

if (themeToggle) {
    themeToggle.addEventListener('change', handleThemeChange);
}

document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem(STORAGE_KEY);
    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = prefersDark ? 'dark' : 'light';
        setTheme(initialTheme);
    }
});
