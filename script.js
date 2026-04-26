let translations = {};
let currentLang = localStorage.getItem('language') || 'it';

async function loadTranslations(lang) {
    try {
        const response = await fetch(`translations/${lang}.yaml`);
        const yamlText = await response.text();
        translations = jsyaml.load(yamlText);
        updatePageContent();
        updateFormMessages();
    } catch (error) {
        console.error('Error loading translations:', error);
    }
}

function updatePageContent() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = getNestedTranslation(key);
        if (translation) {
            element.textContent = translation;
        }
    });
    
    document.documentElement.lang = currentLang;
}

function getNestedTranslation(key) {
    return key.split('.').reduce((obj, k) => obj && obj[k], translations);
}

function updateFormMessages() {
    const formMessage = document.getElementById('formMessage');
    if (formMessage && formMessage.classList.contains('success')) {
        formMessage.textContent = getNestedTranslation('contact.form_success');
    } else if (formMessage && formMessage.classList.contains('error')) {
        formMessage.textContent = getNestedTranslation('contact.form_error');
    }
}

function switchLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('language', lang);
    loadTranslations(lang);
    
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    loadTranslations(currentLang);
    
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === currentLang);
        btn.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            switchLanguage(lang);
        });
    });
    
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        
        const spans = hamburger.querySelectorAll('span');
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            const spans = hamburger.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });
    
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const project = document.getElementById('project').value;
        
        if (name && email && project) {
            formMessage.textContent = getNestedTranslation('contact.form_success');
            formMessage.className = 'form-message success';
            contactForm.reset();
            
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
        } else {
            formMessage.textContent = getNestedTranslation('contact.form_error');
            formMessage.className = 'form-message error';
        }
    });
    
    const navbarHeight = document.querySelector('.navbar').offsetHeight;
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const targetPosition = targetElement.offsetTop - navbarHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    
    if (!lightbox || !lightboxImg || !lightboxClose) {
        console.error('Lightbox elements not found!');
        return;
    }
    
    const projectImages = document.querySelectorAll('.project-image img');
    console.log('Lightbox initialized. Found', projectImages.length, 'images');
    
    projectImages.forEach((img, index) => {
        console.log('Adding click listener to image', index + 1);
        img.style.cursor = 'pointer';
        img.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Image clicked!', this.src);
            lightbox.style.display = 'flex';
            lightbox.style.alignItems = 'center';
            lightbox.style.justifyContent = 'center';
            lightboxImg.src = this.src;
            lightboxImg.alt = this.alt;
            document.body.style.overflow = 'hidden';
            console.log('Lightbox should be visible now');
        });
    });
    
    function closeLightbox() {
        console.log('Closing lightbox');
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    if (lightboxClose) {
        lightboxClose.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            closeLightbox();
        });
    }
    
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox || e.target === lightboxClose) {
            closeLightbox();
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.style.display !== 'none') {
            closeLightbox();
        }
    });
});

window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.backgroundColor = 'rgba(44, 62, 80, 0.98)';
    } else {
        navbar.style.backgroundColor = 'rgba(44, 62, 80, 0.95)';
    }
});
