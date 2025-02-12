// Mobile menu functionality
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle?.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (menuToggle && !menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
    }
});

// Smooth scroll functionality
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            navLinks.classList.remove('active');
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for scroll animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            if (entry.target.classList.contains('once')) {
                observer.unobserve(entry.target);
            }
        }
    });
}, observerOptions);

// Observe elements with animation classes
document.querySelectorAll('.fade-in, .scale-in, .calculator').forEach(el => {
    observer.observe(el);
});

// Calculator functionality
const display = document.getElementById('display');
const buttons = document.querySelectorAll('.calculator button');
let currentValue = '';
let operator = '';
let previousValue = '';

// Handle calculator button clicks with animations
buttons.forEach(button => {
    button.addEventListener('click', () => {
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 100);

        const value = button.textContent;
        
        if (value === 'C') {
            currentValue = '';
            operator = '';
            previousValue = '';
            display.value = '0';
            animateDisplay();
        } else if ('0123456789.'.includes(value)) {
            if (value === '.' && currentValue.includes('.')) return;
            currentValue += value;
            display.value = currentValue;
            animateDisplay();
        } else if ('+-*/'.includes(value)) {
            if (currentValue === '') return;
            operator = value;
            previousValue = currentValue;
            currentValue = '';
            animateDisplay();
        } else if (value === '=') {
            if (currentValue === '' || previousValue === '' || operator === '') return;
            try {
                currentValue = String(eval(previousValue + operator + currentValue));
                display.value = currentValue;
                operator = '';
                previousValue = '';
                animateDisplay();
            } catch (error) {
                display.value = 'Error';
                currentValue = '';
                operator = '';
                previousValue = '';
                animateDisplay();
            }
        }
        
        // Add haptic feedback for mobile devices
        if (window.navigator.vibrate) {
            window.navigator.vibrate(50);
        }
    });
});

// Animate display value changes
function animateDisplay() {
    display.style.transform = 'scale(0.98)';
    display.style.opacity = '0.8';
    setTimeout(() => {
        display.style.transform = 'scale(1)';
        display.style.opacity = '1';
    }, 100);
}

// Handle keyboard input
document.addEventListener('keydown', (e) => {
    const key = e.key;
    const button = Array.from(buttons).find(btn => btn.textContent === key);
    if (button) {
        button.click();
        button.classList.add('active');
        setTimeout(() => button.classList.remove('active'), 100);
    } else if (key === 'Enter') {
        const equalsButton = Array.from(buttons).find(btn => btn.textContent === '=');
        if (equalsButton) equalsButton.click();
    } else if (key === 'Escape') {
        const clearButton = Array.from(buttons).find(btn => btn.textContent === 'C');
        if (clearButton) clearButton.click();
    }
});

// Prevent zoom on double tap for iOS
let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// Add parallax effect to hero section
const hero = document.querySelector('.hero');
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    if (hero) {
        hero.style.backgroundPositionY = scrolled * 0.5 + 'px';
    }
});

// Dark Mode Toggle
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  themeToggle.textContent = document.body.classList.contains('dark-mode') ? 'Light Mode' : 'Dark Mode';
});
