// ==========================================
// SMOOTH SCROLL NAVIGATION
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Fecha o menu mobile se estiver aberto
            document.getElementById('navLinks').classList.remove('active');
            document.getElementById('navToggle').classList.remove('active');
        }
    });
});

// ==========================================
// MOBILE MENU TOGGLE
// ==========================================
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Fecha o menu ao clicar fora
document.addEventListener('click', (e) => {
    if (!e.target.closest('.navbar')) {
        navLinks.classList.remove('active');
        navToggle.classList.remove('active');
    }
});

// ==========================================
// SCROLL ANIMATIONS
// ==========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Anima cards ao scroll
document.querySelectorAll('.projeto-card, .skill-card, .sobre-card, .contato-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    observer.observe(el);
});

// ==========================================
// NAVBAR SCROLL EFFECT
// ==========================================
let lastScrollY = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    lastScrollY = window.scrollY;
    
    if (lastScrollY > 50) {
        navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
    }
});

// ==========================================
// ACTIVE NAV LINK HIGHLIGHTING
// ==========================================
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(item => {
        item.style.color = '';
        if (item.getAttribute('href').slice(1) === current) {
            item.style.color = 'var(--primary)';
        }
    });
});

// ==========================================
// PARALLAX EFFECT
// ==========================================
window.addEventListener('scroll', () => {
    const blobs = document.querySelectorAll('.blob');
    const scrollY = window.scrollY;
    
    blobs.forEach((blob, index) => {
        blob.style.transform = `translateY(${scrollY * (0.5 + index * 0.1)}px)`;
    });
});

// ==========================================
// NUMERO COUNTER ANIMATION
// ==========================================
function animateCounter(element, target, duration = 2000) {
    let current = 0;
    const increment = target / (duration / 16);
    
    const counter = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(counter);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Anima números quando chegam na viewport
const counters = document.querySelectorAll('[data-counter]');
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = parseInt(entry.target.getAttribute('data-counter'));
            animateCounter(entry.target, target);
            counterObserver.unobserve(entry.target);
        }
    });
});

counters.forEach(counter => counterObserver.observe(counter));

// ==========================================
// RIPPLE EFFECT ON BUTTONS
// ==========================================
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// ==========================================
// FORM VALIDATION (se tiver formulário)
// ==========================================
const form = document.querySelector('form');
if (form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        // Aqui você pode adicionar validação do formulário
        console.log('Formulário enviado!');
    });
}

// ==========================================
// LAZY LOADING IMAGES
// ==========================================
if ('IntersectionObserver' in window) {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    images.forEach(img => imageObserver.observe(img));
}

// ==========================================
// THEME TOGGLE (Modo Escuro) com transição em elipse
// Sequência: expandir overlay → trocar tema → retrair overlay
// ==========================================
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const icon = themeToggle.querySelector('i');
const reveal = document.getElementById('theme-reveal');

const LIGHT_BG = '#ffffff';
const DARK_BG = '#0f172a';
let animating = false;

// Carrega o tema salvo
const savedTheme = localStorage.getItem('theme') || 'light';
if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    icon.classList.remove('fa-moon');
    icon.classList.add('fa-sun');
}

themeToggle.addEventListener('click', (e) => {
    if (animating) return; // evita reentrância
    animating = true;

    // calcula posição do clique para centro da elipse
    const x = e.clientX + 'px';
    const y = e.clientY + 'px';
    reveal.style.setProperty('--x', x);
    reveal.style.setProperty('--y', y);
    const willBeDark = !body.classList.contains('dark-mode');

    // ajusta cor do reveal para combinar com o novo tema
    reveal.style.background = willBeDark ? DARK_BG : LIGHT_BG;

    // Ao começar a expansão (primeira onda), trocamos o tema imediatamente
    const onExpandStart = (ev) => {
        // some browsers pass propertyName, tolerate both
        if (ev.propertyName && ev.propertyName !== 'clip-path') return;
        reveal.removeEventListener('transitionstart', onExpandStart);

        if (willBeDark) {
            body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    };

    reveal.addEventListener('transitionstart', onExpandStart);

    // inicia expansão
    reveal.classList.remove('reveal-hide');
    reveal.classList.add('reveal-expand');

    // quando a expansão terminar, faz só o fade sem retrair o clip-path
    const onExpandEnd = (ev) => {
        if (ev.propertyName !== 'clip-path') return;
        reveal.removeEventListener('transitionend', onExpandEnd);

        // mantém o clip-path (classe reveal-expand) e inicia apenas fade
        reveal.classList.remove('reveal-fade');
        // força reflow
        void reveal.offsetWidth;
        reveal.classList.add('reveal-fade');

        const onFadeEnd = (ev2) => {
            if (ev2.propertyName !== 'opacity') return;
            reveal.removeEventListener('transitionend', onFadeEnd);

            // Reset clip-path instantly WITHOUT animation to prepare para próxima vez
            // 1) disable transitions inline
            const prevTransition = reveal.style.transition;
            reveal.style.transition = 'none';
            // 2) set clip-path to 0% instantly
            reveal.style.clipPath = `circle(0% at ${getComputedStyle(reveal).getPropertyValue('--x')} ${getComputedStyle(reveal).getPropertyValue('--y')})`;
            // force reflow
            void reveal.offsetWidth;
            // 3) remove inline styles so CSS classes control transitions again
            reveal.style.transition = prevTransition || '';
            reveal.style.clipPath = '';

            // limpa classes e sinaliza fim
            reveal.classList.remove('reveal-fade');
            reveal.classList.remove('reveal-expand');
            animating = false;
        };

        reveal.addEventListener('transitionend', onFadeEnd);
    };

    reveal.addEventListener('transitionend', onExpandEnd);
});

// ==========================================
// CONSOLE MESSAGE
// ==========================================
console.log('%c✨ Bem-vindo ao portfólio de Deivid Figueiredo!', 'color: #6366f1; font-size: 16px; font-weight: bold;');
console.log('%cCuriosidade? Veja o código-fonte!', 'color: #ec4899; font-size: 12px;');

// ==========================================
// INICIALIZAÇÃO
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Portfólio carregado com sucesso!');
    
    // Adiciona classe de carregamento ao body
    document.body.classList.add('loaded');
});