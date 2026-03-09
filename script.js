/* ============================================
   AI ENGINEER PORTFOLIO — Interactive Scripts
   ============================================ */

// ─── Neural Network Particle Animation ───
class ParticleNetwork {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null, radius: 150 };
        this.animationId = null;
        this.particleCount = 80;
        this.maxDistance = 150;
        this.colors = ['rgba(16, 185, 129, ', 'rgba(245, 158, 11, ', 'rgba(20, 184, 166, '];

        this.init();
        this.bindEvents();
        this.animate();
    }

    init() {
        this.resize();
        this.createParticles();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        this.particles = [];
        const count = window.innerWidth < 768 ? 40 : this.particleCount;
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 0.5,
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                opacity: Math.random() * 0.5 + 0.2,
            });
        }
    }

    bindEvents() {
        window.addEventListener('resize', () => {
            this.resize();
            this.createParticles();
        });

        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        window.addEventListener('mouseout', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }

    drawParticle(p) {
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = p.color + p.opacity + ')';
        this.ctx.fill();
    }

    drawConnection(p1, p2, distance) {
        const opacity = (1 - distance / this.maxDistance) * 0.15;
        this.ctx.beginPath();
        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.lineTo(p2.x, p2.y);
        this.ctx.strokeStyle = `rgba(16, 185, 129, ${opacity})`;
        this.ctx.lineWidth = 0.5;
        this.ctx.stroke();
    }

    update() {
        for (const p of this.particles) {
            // Mouse interaction
            if (this.mouse.x !== null && this.mouse.y !== null) {
                const dx = this.mouse.x - p.x;
                const dy = this.mouse.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < this.mouse.radius) {
                    const force = (this.mouse.radius - dist) / this.mouse.radius;
                    p.vx -= (dx / dist) * force * 0.02;
                    p.vy -= (dy / dist) * force * 0.02;
                }
            }

            p.x += p.vx;
            p.y += p.vy;

            // Damping
            p.vx *= 0.999;
            p.vy *= 0.999;

            // Bounce off edges
            if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

            // Keep in bounds
            p.x = Math.max(0, Math.min(this.canvas.width, p.x));
            p.y = Math.max(0, Math.min(this.canvas.height, p.y));
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw connections
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < this.maxDistance) {
                    this.drawConnection(this.particles[i], this.particles[j], distance);
                }
            }
        }

        // Draw particles
        for (const p of this.particles) {
            this.drawParticle(p);
        }
    }

    animate() {
        this.update();
        this.draw();
        this.animationId = requestAnimationFrame(() => this.animate());
    }
}

// ─── Typed Text Effect ───
class TypedText {
    constructor(elementId, texts, speed = 80, deleteSpeed = 40, pauseTime = 2000) {
        this.element = document.getElementById(elementId);
        if (!this.element) return;
        this.texts = texts;
        this.speed = speed;
        this.deleteSpeed = deleteSpeed;
        this.pauseTime = pauseTime;
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;

        this.type();
    }

    type() {
        const currentText = this.texts[this.textIndex];

        if (this.isDeleting) {
            this.element.textContent = currentText.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.element.textContent = currentText.substring(0, this.charIndex + 1);
            this.charIndex++;
        }

        let timeout = this.isDeleting ? this.deleteSpeed : this.speed;

        if (!this.isDeleting && this.charIndex === currentText.length) {
            timeout = this.pauseTime;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.textIndex = (this.textIndex + 1) % this.texts.length;
            timeout = 400;
        }

        setTimeout(() => this.type(), timeout);
    }
}

// ─── Counter Animation ───
class CounterAnimation {
    constructor(element, target, duration = 2000) {
        this.element = element;
        this.target = target;
        this.duration = duration;
        this.startTime = null;
        this.started = false;
    }

    start() {
        if (this.started) return;
        this.started = true;
        this.startTime = performance.now();
        this.animate();
    }

    animate() {
        const now = performance.now();
        const elapsed = now - this.startTime;
        const progress = Math.min(elapsed / this.duration, 1);

        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * this.target);

        this.element.textContent = current;

        if (progress < 1) {
            requestAnimationFrame(() => this.animate());
        } else {
            this.element.textContent = this.target;
        }
    }
}

// ─── Initialize on DOM Ready ───
document.addEventListener('DOMContentLoaded', () => {

    // --- Particle Network ---
    new ParticleNetwork('particle-canvas');

    // --- Typed Text ---
    new TypedText('typed-text', [
        'AI Engineer',
        'ML Systems Architect',
        'LLM Developer',
        'MLOps Engineer',
        'Data Scientist',
    ], 80, 50, 2200);

    // --- Mobile Navigation ---
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu on link click
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // --- Navbar Scroll Effect ---
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    });

    // --- Active Navigation Highlighting ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const activateNavLink = () => {
        const scrollY = window.pageYOffset + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', activateNavLink);

    // --- Smooth Scroll ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
            }
        });
    });

    // --- Scroll Reveal Animations ---
    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    // Don't unobserve so we can re-trigger if needed
                }
            });
        },
        {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px',
        }
    );

    // Auto-apply reveal class to animatable elements
    const revealSelectors = [
        '.section-header',
        '.about-text',
        '.about-metrics',
        '.timeline-item',
        '.skill-card',
        '.project-card',
        '.contact-info-cards',
        '.contact-form',
        '.metric-card',
    ];

    revealSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            el.classList.add('reveal');
            revealObserver.observe(el);
        });
    });

    // Stagger animations for grids
    document.querySelectorAll('.skills-grid, .projects-grid').forEach(grid => {
        grid.classList.add('reveal-stagger');
        revealObserver.observe(grid);
    });

    // --- Counter Animations ---
    const counterObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const card = entry.target;
                    const target = parseInt(card.dataset.count, 10);
                    const counterEl = card.querySelector('.counter');
                    if (counterEl && target) {
                        new CounterAnimation(counterEl, target, 1800).start();
                    }
                    counterObserver.unobserve(card);
                }
            });
        },
        { threshold: 0.5 }
    );

    document.querySelectorAll('.metric-card[data-count]').forEach(card => {
        counterObserver.observe(card);
    });

    // --- Contact Form with EmailJS ---
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const submitText = document.getElementById('submit-text');
    const submitIcon = document.getElementById('submit-icon');
    const formMessage = document.getElementById('form-message');

    // Initialize EmailJS
    // Setup instructions: See CONTACT_FORM_SETUP.md
    // Get your keys from: https://www.emailjs.com/
    const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY'; // Replace with your EmailJS Public Key
    const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID'; // Replace with your EmailJS Service ID
    const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'; // Replace with your EmailJS Template ID
    
    // Check if EmailJS is configured
    const isEmailJSConfigured = EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY' && 
                                 EMAILJS_SERVICE_ID !== 'YOUR_SERVICE_ID' && 
                                 EMAILJS_TEMPLATE_ID !== 'YOUR_TEMPLATE_ID';
    
    if (isEmailJSConfigured) {
        emailjs.init(EMAILJS_PUBLIC_KEY);
    }

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = contactForm.querySelector('#name').value.trim();
            const email = contactForm.querySelector('#email').value.trim();
            const subject = contactForm.querySelector('#subject').value.trim();
            const message = contactForm.querySelector('#message').value.trim();

            // Validation
            if (!name || !email || !subject || !message) {
                showMessage('Please fill in all fields.', 'error');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showMessage('Please enter a valid email address.', 'error');
                return;
            }

            // Show loading state
            setLoadingState(true);
            hideMessage();

            try {
                // Send email using EmailJS
                // Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with your actual IDs
                await emailjs.send(
                    'YOUR_SERVICE_ID',  // Replace with your EmailJS Service ID
                    'YOUR_TEMPLATE_ID', // Replace with your EmailJS Template ID
                    {
                        from_name: name,
                        from_email: email,
                        subject: subject,
                        message: message,
                        to_email: 'karthi311kumar@gmail.com'
                    }
                );

                // Success
                showMessage('Message sent successfully! I\'ll get back to you soon.', 'success');
                contactForm.reset();
                
            } catch (error) {
                console.error('EmailJS Error:', error);
                // Fallback to mailto if EmailJS fails
                const mailtoEmail = 'karthi311kumar@gmail.com';
                const body = `Hi Karthikeyan,%0D%0A%0D%0A${encodeURIComponent(message)}%0D%0A%0D%0ABest regards,%0D%0A${encodeURIComponent(name)}%0D%0AEmail: ${encodeURIComponent(email)}`;
                const mailtoLink = `mailto:${mailtoEmail}?subject=${encodeURIComponent(subject)}&body=${body}`;
                
                showMessage('Opening your email client...', 'info');
                setTimeout(() => {
                    window.location.href = mailtoLink;
                }, 500);
            } finally {
                setLoadingState(false);
            }
        });
    }

    function setLoadingState(loading) {
        if (loading) {
            submitBtn.disabled = true;
            submitText.textContent = 'Sending...';
            submitIcon.className = 'fas fa-spinner fa-spin';
        } else {
            submitBtn.disabled = false;
            submitText.textContent = 'Send Message';
            submitIcon.className = 'fas fa-paper-plane';
        }
    }

    function showMessage(text, type = 'info') {
        formMessage.textContent = text;
        formMessage.className = `form-message form-message-${type}`;
        formMessage.style.display = 'block';
        
        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                hideMessage();
            }, 5000);
        }
    }

    function hideMessage() {
        formMessage.style.display = 'none';
        formMessage.textContent = '';
    }
});
