// Rolagem suave nos links do menu
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

// Menu no celular
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

if (navToggle && navLinks) {
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
}

// Cards aparecem ao rolar
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

const navbar = document.querySelector('.navbar');

// Destaca no menu a seção atual
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

// Tema claro/escuro
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const icon = themeToggle ? themeToggle.querySelector('i') : null;

const skillsContent = document.getElementById('skillsContent');
const projectsContent = document.getElementById('projectsContent');

function renderHeroImage(heroData) {
    const heroVisual = document.getElementById('heroVisual');
    if (!heroVisual || !heroData) return;

    heroVisual.innerHTML = '';

    if (heroData.video) {
        const video = document.createElement('video');
        video.src = heroData.video;
        video.autoplay = true;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.controls = false;
        video.preload = 'auto';
        video.style.width = '100%';
        video.style.height = '100%';
        video.style.objectFit = 'cover';
        video.style.display = 'block';
        video.style.borderRadius = 'inherit';
        heroVisual.appendChild(video);
        video.play().catch(() => {});
        return;
    }

    const imageSrc = heroData.image || heroData.logo || heroData.icon;
    if (!imageSrc) return;

    heroVisual.style.backgroundImage = `url('${imageSrc}')`;
    heroVisual.style.backgroundSize = 'contain';
    heroVisual.style.backgroundPosition = 'center';
    heroVisual.style.backgroundRepeat = 'no-repeat';
    heroVisual.style.backgroundColor = 'transparent';
    heroVisual.style.filter = 'drop-shadow(0 18px 40px rgba(15, 23, 42, 0.28)) saturate(0.95) contrast(1.04) brightness(1.02)';
    heroVisual.style.boxShadow = 'none';
}

function renderSkills(categories) {
    if (!skillsContent) return;
    skillsContent.innerHTML = '';

    categories.forEach((category, index) => {
        const categoryWrapper = document.createElement('div');
        categoryWrapper.className = index === 0 ? 'skill-category' : 'skill-category-1';

        const categoryTitle = document.createElement('h3');
        categoryTitle.className = 'category-title';
        categoryTitle.textContent = category.title;
        categoryWrapper.appendChild(categoryTitle);

        const skillsGrid = document.createElement('div');
        skillsGrid.className = 'skills-grid';

        category.items.forEach(skill => {
            const skillCard = document.createElement('div');
            skillCard.className = 'skill-card';

            const skillIcon = document.createElement('div');
            skillIcon.className = 'skill-icon';
            skillIcon.innerHTML = `<i class="${skill.icon}"></i>`;

            const skillName = document.createElement('h4');
            skillName.textContent = skill.name;

            const skillLevel = document.createElement('span');
            skillLevel.className = 'skill-level';
            skillLevel.textContent = skill.tier;

            skillCard.appendChild(skillIcon);
            skillCard.appendChild(skillName);
            skillCard.appendChild(skillLevel);
            skillsGrid.appendChild(skillCard);
        });

        categoryWrapper.appendChild(skillsGrid);
        skillsContent.appendChild(categoryWrapper);
    });
}

function setupProjectsCarousel() {
    const projectsGrid = document.getElementById('projectsContent');
    const carouselHint = document.getElementById('projectsCarouselHint');
    const carouselBack = document.getElementById('projectsCarouselBack');
    const carousel = projectsGrid?.closest('.projects-carousel');

    if (!projectsGrid || !carouselHint || !carouselBack || !carousel) return;

    const updateCarouselState = () => {
        const maxScrollLeft = Math.max(projectsGrid.scrollWidth - projectsGrid.clientWidth, 0);
        const hasOverflow = maxScrollLeft > 12;
        const atStart = projectsGrid.scrollLeft <= 12;
        const atEnd = projectsGrid.scrollLeft >= maxScrollLeft - 12;

        const nextState = {
            hasOverflow,
            atStart,
            atEnd,
            showLeftFade: hasOverflow && !atStart,
            showRightFade: hasOverflow && !atEnd,
        };

        const previousState = carousel.dataset.carouselState;
        const stateChanged = !previousState || previousState !== JSON.stringify(nextState);

        if (!stateChanged) {
            return;
        }

        carousel.dataset.carouselState = JSON.stringify(nextState);

        carouselHint.hidden = !hasOverflow || atEnd;
        carouselBack.hidden = !hasOverflow || atStart;

        carouselHint.classList.toggle('visible', nextState.showRightFade);
        carouselBack.classList.toggle('visible', nextState.showLeftFade);

        carousel.classList.toggle('has-overflow', hasOverflow);
        carousel.classList.toggle('show-left-fade', nextState.showLeftFade);
        carousel.classList.toggle('show-right-fade', nextState.showRightFade);

        if (!hasOverflow) {
            projectsGrid.scrollLeft = 0;
        }
    };

    carouselHint.addEventListener('click', () => {
        const nextStep = Math.min(projectsGrid.clientWidth * 0.85, 300);
        projectsGrid.scrollBy({ left: nextStep, behavior: 'smooth' });
    });

    carouselBack.addEventListener('click', () => {
        const prevStep = Math.min(projectsGrid.clientWidth * 0.85, 300);
        projectsGrid.scrollBy({ left: -prevStep, behavior: 'smooth' });
    });

    projectsGrid.addEventListener('scroll', updateCarouselState);
    window.addEventListener('resize', updateCarouselState);

    requestAnimationFrame(updateCarouselState);
    setTimeout(updateCarouselState, 150);
}

function renderProjects(projects) {
    if (!projectsContent) return;
    projectsContent.innerHTML = '';

    projects.forEach(project => {
        const showWebsiteButton = project.showWebsiteButton !== false;
        const showProjectButton = project.showProjectButton !== false;
        const websiteButtonLabel = project.websiteButtonLabel || 'Ver Site';

        const verSiteButton = showWebsiteButton && project.url
            ? `
        <a href="${project.url}"
           class="projeto-link secondary"
           target="_blank"
           rel="noopener noreferrer">
            ${websiteButtonLabel} <i class="fas fa-external-link-alt"></i>
        </a>
      `
            : "";

        const hasProjectPage = Boolean(project.page) && showProjectButton;
        const projectAction = hasProjectPage
            ? `<a href="${project.page}"
                    class="projeto-link"
                    ${project.page ? '' : 'target="_blank" rel="noopener noreferrer"'}>
                    Mais sobre <i class="fas fa-arrow-right"></i>
                </a>`
            : '';

        const icon = project.icon.endsWith('.png') ||
                     project.icon.endsWith('.jpg') ||
                     project.icon.endsWith('.jpeg') ||
                     project.icon.endsWith('.svg') ||
                     project.icon.endsWith('.webp')
            ? `<img src="${project.icon}" class="projeto-logo" alt="${project.title}">`
            : `<i class="${project.icon}"></i>`;

        const projectCard = document.createElement('div');
        projectCard.className = 'projeto-card';

        projectCard.innerHTML = `
            <div class="projeto-image">
                <div class="projeto-icon">
                    ${icon}
                </div>
            </div>
            <div class="projeto-content">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="projeto-tech">
                    ${project.tech.map(tag => `<span class="tech-tag">${tag}</span>`).join('')}
                </div>
                <div class="project-actions">
                    ${projectAction}
                    ${verSiteButton}
                </div>
            </div>
        `;

        projectsContent.appendChild(projectCard);
    });
}



function loadPortfolioData() {
    return fetch('./data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('JSON não encontrado');
            }
            return response.json();
        })
        .then(data => {
            if (data.hero) renderHeroImage(data.hero);
            if (data.skills) renderSkills(data.skills);
            if (data.projects) {
                renderProjects(data.projects);
                setupProjectsCarousel();
            }
        })
        .catch(error => {
            console.warn('Não foi possível carregar data.json:', error);
        });
}

document.addEventListener("DOMContentLoaded", async () => {
    await loadPortfolioData();

    if (window.location.hash) {
        document.querySelector(window.location.hash)?.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
});
// Carrega o tema salvo (padrão: dark)
const savedTheme = localStorage.getItem('theme') || 'dark';
if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    if (icon) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }
}

// Borda na navbar depois de rolar
window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
});

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');

        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
            if (icon) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            }
        } else {
            localStorage.setItem('theme', 'light');
            if (icon) {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        }
    });
}
