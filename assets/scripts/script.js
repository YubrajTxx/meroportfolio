document.addEventListener('DOMContentLoaded', () => {
    const spotlight = document.getElementById('spotlight');
    const navLinks = document.querySelectorAll('.nav a');
    const sections = document.querySelectorAll('section');
    const contactForm = document.getElementById('contact-form');

    // Smoother Spotlight effect using requestAnimationFrame
    let mouseX = 0, mouseY = 0;
    let spotlightX = 0, spotlightY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function updateSpotlight() {
        if (window.innerWidth >= 1024) {
            // Adding easing: spotlight follows mouse with a slight lag for smoothness
            const easing = 0.15;
            spotlightX += (mouseX - spotlightX) * easing;
            spotlightY += (mouseY - spotlightY) * easing;

            spotlight.style.setProperty('--x', `${spotlightX}px`);
            spotlight.style.setProperty('--y', `${spotlightY}px`);
            spotlight.style.opacity = '1';
        }
        requestAnimationFrame(updateSpotlight);
    }
    updateSpotlight();

    // Intersection Observer for ScrollSpy and Reveal effects
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -20% 0px',
        threshold: 0.1
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // ScrollSpy Logic
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
                
                // Reveal Logic for Sections
                entry.target.classList.add('revealed');
            }
        });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));

    // Reveal Observer for Cards and other elements
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.card, .contact-content, .sticky-section-title').forEach(el => {
        revealObserver.observe(el);
    });

    // Smooth scroll for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const offset = window.innerWidth >= 1024 ? 0 : 80;
                window.scrollTo({
                    top: targetSection.offsetTop - offset,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Contact Form Handling
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalBtnContent = submitBtn.innerHTML;

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Sending...</span> <i class="fa-solid fa-circle-notch fa-spin"></i>';

            setTimeout(() => {
                alert('Thank you for your message! Your message has been sent successfully.');
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnContent;
            }, 1500);
        });
    }
});

