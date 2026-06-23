document.addEventListener('DOMContentLoaded', () => {
    const spotlight = document.getElementById('spotlight');
    const navLinks = document.querySelectorAll('.nav a');
    const sections = document.querySelectorAll('section');

    // ── Spotlight Effect (smooth cursor follow with easing) ──
    let mouseX = 0, mouseY = 0;
    let spotlightX = 0, spotlightY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function updateSpotlight() {
        if (window.innerWidth >= 1024) {
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

    // ── ScrollSpy & Section Reveal (Intersection Observer) ──
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Update active nav link
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
                // Reveal section
                entry.target.classList.add('revealed');
            }
        });
    }, {
        root: null,
        rootMargin: '-20% 0px -20% 0px',
        threshold: 0.1
    });

    sections.forEach(section => sectionObserver.observe(section));

    // ── Card & Element Reveal (one-time animation) ──
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

    // ── Smooth Scroll for Nav Links ──
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
});
