/**
 * ĐỨC HOÀNG - Industrial B2B Landing Page
 * JavaScript Functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initScrollEffects();
    initAnimations();
    initFormValidation();
    initBackToTop();
});

/**
 * Navigation functionality
 */
function initNavigation() {
    const header = document.getElementById('header');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navBackdrop = document.getElementById('nav-backdrop');
    const navLinks = document.querySelectorAll('.nav-link');

    // Function to close mobile menu
    function closeMenu() {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        if (navBackdrop) navBackdrop.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Function to open mobile menu
    function openMenu() {
        navToggle.classList.add('active');
        navMenu.classList.add('active');
        if (navBackdrop) navBackdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        if (navMenu.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Close menu on backdrop click
    if (navBackdrop) {
        navBackdrop.addEventListener('click', closeMenu);
    }

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });

    // Close menu on window resize (if switching to desktop)
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });

    // Header scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Scroll-based effects
 */
function initScrollEffects() {
    // Active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveLink() {
        const scrollPos = window.pageYOffset + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', throttle(updateActiveLink, 100));
}

/**
 * Animation on scroll
 */
function initAnimations() {
    // Elements to animate
    const animateElements = document.querySelectorAll(
        '.section-header, .about-content, .about-image, ' +
        '.capability-card, .tech-card, .tech-image, ' +
        '.product-card, .quality-item, .industry-card, ' +
        '.cta-content, .cta-form-wrapper'
    );

    // Add animation classes based on element type
    animateElements.forEach((el, index) => {
        if (el.classList.contains('about-content') || 
            el.classList.contains('cta-content')) {
            el.classList.add('slide-in-left');
        } else if (el.classList.contains('about-image') || 
                   el.classList.contains('cta-form-wrapper')) {
            el.classList.add('slide-in-right');
        } else {
            el.classList.add('fade-in');
        }
    });

    // Intersection Observer for animations
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animateElements.forEach(el => observer.observe(el));

    // Stagger animation for grid items
    const gridContainers = document.querySelectorAll(
        '.capabilities-grid, .technology-grid, .products-grid, .quality-list'
    );

    gridContainers.forEach(container => {
        const items = container.children;
        Array.from(items).forEach((item, index) => {
            item.classList.add('stagger-item');
            item.style.transitionDelay = `${index * 0.1}s`;
        });
    });

    const staggerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const items = entry.target.querySelectorAll('.stagger-item');
                items.forEach(item => item.classList.add('visible'));
                staggerObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    gridContainers.forEach(container => staggerObserver.observe(container));

    // Counter animation for stats
    const statNumbers = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => statsObserver.observe(stat));
}

/**
 * Counter animation
 */
function animateCounter(element) {
    const text = element.textContent;
    const hasPlus = text.includes('+');
    const hasPercent = text.includes('%');
    const numericValue = parseFloat(text.replace(/[^0-9.]/g, ''));
    
    if (isNaN(numericValue)) return;

    const duration = 2000;
    const start = performance.now();
    const startValue = 0;

    function update(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = easeOutQuart(progress);
        const currentValue = startValue + (numericValue - startValue) * easeProgress;

        let displayValue;
        if (numericValue % 1 !== 0) {
            displayValue = currentValue.toFixed(1);
        } else {
            displayValue = Math.floor(currentValue);
        }

        element.textContent = displayValue + (hasPercent ? '%' : '') + (hasPlus ? '+' : '');

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

/**
 * Easing function
 */
function easeOutQuart(x) {
    return 1 - Math.pow(1 - x, 4);
}

/**
 * Form validation
 */
function initFormValidation() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form fields
        const name = form.querySelector('#name');
        const email = form.querySelector('#email');
        const phone = form.querySelector('#phone');
        const message = form.querySelector('#message');

        // Reset previous errors
        clearErrors(form);

        // Validate
        let isValid = true;

        if (!name.value.trim()) {
            showError(name, 'Vui lòng nhập họ và tên');
            isValid = false;
        }

        if (!isValidEmail(email.value)) {
            showError(email, 'Vui lòng nhập email hợp lệ');
            isValid = false;
        }

        if (!isValidPhone(phone.value)) {
            showError(phone, 'Vui lòng nhập số điện thoại hợp lệ');
            isValid = false;
        }

        if (!message.value.trim()) {
            showError(message, 'Vui lòng nhập nội dung yêu cầu');
            isValid = false;
        }

        if (isValid) {
            // Show success message
            showSuccessMessage(form);
            form.reset();
        }
    });

    // Real-time validation
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });

        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

function validateField(field) {
    clearFieldError(field);

    switch (field.id) {
        case 'name':
            if (!field.value.trim()) {
                showError(field, 'Vui lòng nhập họ và tên');
            }
            break;
        case 'email':
            if (!isValidEmail(field.value)) {
                showError(field, 'Vui lòng nhập email hợp lệ');
            }
            break;
        case 'phone':
            if (!isValidPhone(field.value)) {
                showError(field, 'Vui lòng nhập số điện thoại hợp lệ');
            }
            break;
        case 'message':
            if (!field.value.trim()) {
                showError(field, 'Vui lòng nhập nội dung yêu cầu');
            }
            break;
    }
}

function showError(field, message) {
    field.classList.add('error');
    const errorEl = document.createElement('span');
    errorEl.className = 'error-message';
    errorEl.textContent = message;
    errorEl.style.cssText = 'color: #ef4444; font-size: 0.75rem; margin-top: 0.25rem; display: block;';
    field.parentNode.appendChild(errorEl);
}

function clearFieldError(field) {
    field.classList.remove('error');
    const errorEl = field.parentNode.querySelector('.error-message');
    if (errorEl) {
        errorEl.remove();
    }
}

function clearErrors(form) {
    form.querySelectorAll('.error-message').forEach(el => el.remove());
    form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
}

function showSuccessMessage(form) {
    const successEl = document.createElement('div');
    successEl.className = 'success-message';
    successEl.innerHTML = `
        <div style="background: #10b981; color: white; padding: 1rem; border-radius: 8px; text-align: center; margin-bottom: 1rem;">
            <i class="fas fa-check-circle" style="margin-right: 0.5rem;"></i>
            Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong 24h.
        </div>
    `;
    form.insertBefore(successEl, form.firstChild);

    setTimeout(() => {
        successEl.remove();
    }, 5000);
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function isValidPhone(phone) {
    const re = /^[0-9+\-\s()]{9,15}$/;
    return re.test(phone);
}

/**
 * Back to top button
 */
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    if (!backToTop) return;

    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Throttle function
 */
function throttle(func, limit) {
    let lastFunc;
    let lastRan;
    return function() {
        const context = this;
        const args = arguments;
        if (!lastRan) {
            func.apply(context, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(function() {
                if ((Date.now() - lastRan) >= limit) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    };
}

/**
 * Debounce function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add error styling for form validation
const errorStyles = document.createElement('style');
errorStyles.textContent = `
    .form-group input.error,
    .form-group textarea.error {
        border-color: #ef4444 !important;
        background-color: #fef2f2 !important;
    }
    
    .form-group input.error:focus,
    .form-group textarea.error:focus {
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
    }
`;
document.head.appendChild(errorStyles);
