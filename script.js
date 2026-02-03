document.addEventListener('DOMContentLoaded', () => {

    // --- 1. THE NEURAL NETWORK CANVAS ---
    const canvas = document.getElementById('neural-canvas');
    const ctx = canvas.getContext('2d');

    let w, h;
    let nodes = [];
    const nodeCount = 70; // High density
    const connectionDist = 180;

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }

    class Node {
        constructor() {
            this.x = Math.random() * w;
            this.y = Math.random() * h;
            this.vx = (Math.random() - 0.5) * 1.5; // Faster mvmt
            this.vy = (Math.random() - 0.5) * 1.5;
            this.size = Math.random() * 2 + 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off walls
            if (this.x < 0 || this.x > w) this.vx *= -1;
            if (this.y < 0 || this.y > h) this.vy *= -1;
        }

        draw() {
            ctx.fillStyle = '#00f3ff';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function init() {
        nodes = [];
        for (let i = 0; i < nodeCount; i++) nodes.push(new Node());
    }

    function loop() {
        ctx.clearRect(0, 0, w, h);

        // Update & Draw Nodes
        for (let i = 0; i < nodes.length; i++) {
            nodes[i].update();
            nodes[i].draw();

            // Draw connections
            for (let j = i + 1; j < nodes.length; j++) {
                let dx = nodes[i].x - nodes[j].x;
                let dy = nodes[i].y - nodes[j].y;
                let dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connectionDist) {
                    ctx.strokeStyle = `rgba(0, 243, 255, ${1 - dist / connectionDist})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(loop);
    }

    window.addEventListener('resize', () => { resize(); init(); });
    resize();
    init();
    loop();


    // --- 2. FORM HANDLING ---
    const contactForm = document.getElementById('contact-form');

    // !!! PLEASE SET YOUR URL HERE !!!
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzoiduNxCuYZs8HFaNRa9hKXTGooqjv-p7EscNalYhpCZemKlGD5116h39Sfx-ttPocBA/exec';

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('send-btn');
            const status = document.getElementById('form-status');
            const originalText = btn.innerHTML;
            const modal = document.getElementById('success-modal');
            const closeModal = document.getElementById('close-modal');

            // Modal Logic
            closeModal.addEventListener('click', () => {
                modal.classList.remove('active');
            });
            window.addEventListener('click', (e) => {
                if (e.target === modal) modal.classList.remove('active');
            });

            // Email Validation
            const emailInput = contactForm.querySelector('input[name="email"]');
            const emailValue = emailInput.value.trim();
            // Regex: At least one character, '@', at least one character, '.', at least 2 characters at end
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

            if (!emailPattern.test(emailValue)) {
                status.innerText = "Error: Invalid Email Address (must contain '@' and domain like .com, .in).";
                status.style.color = "#ff5f56"; // Red color

                // Shake effect for visual feedback
                emailInput.parentElement.style.animation = "shake 0.3s ease-in-out";
                setTimeout(() => { emailInput.parentElement.style.animation = ""; }, 300);

                return;
            }

            if (SCRIPT_URL.includes('INSERT_YOUR')) {
                status.innerText = "Error: Script URL not configured.";
                status.style.color = "red";
                return;
            }

            btn.innerHTML = "Sending...";
            btn.disabled = true;

            const formData = new FormData(contactForm);

            try {
                await fetch(SCRIPT_URL, {
                    method: 'POST',
                    body: formData,
                    mode: 'no-cors'
                });

                // Show Modal on Success
                modal.classList.add('active');

                // Reset form
                contactForm.reset();
                status.innerText = "";

            } catch (err) {
                status.innerText = "Transmission Failed.";
                status.style.color = "red";
            } finally {
                btn.disabled = false;
                btn.innerHTML = originalText;
            }
        });
    }

    // --- 3. SMOOTH SCROLL & REVEAL ANIMATIONS ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Reveal on Scroll
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- 4. 3D SKILLS GLOBE ---
    const globeContainer = document.getElementById('tag-cloud');
    if (globeContainer) {
        const skills = [
            { name: 'C', icon: 'fas fa-copyright', color: '#A8B9CC' },
            { name: 'C++', icon: 'fas fa-code', color: '#00599C' },
            { name: 'Python', icon: 'fab fa-python', color: '#3776AB' },
            { name: 'Java', icon: 'fab fa-java', color: '#007396' },
            { name: 'HTML', icon: 'fab fa-html5', color: '#E34F26' },
            { name: 'CSS', icon: 'fab fa-css3-alt', color: '#1572B6' },
            { name: 'JavaScript', icon: 'fab fa-js', color: '#F7DF1E' },
            { name: 'React', icon: 'fab fa-react', color: '#61DAFB' },
            { name: 'Node.js', icon: 'fab fa-node-js', color: '#339933' },
            { name: 'DBMS', icon: 'fas fa-database', color: '#f29111' },
            { name: 'Canva', icon: 'fas fa-palette', color: '#00C4CC' },
            { name: 'Adobe', icon: 'fab fa-adobe', color: '#FF0000' },
            { name: 'Figma', icon: 'fab fa-figma', color: '#F24E1E' },
            { name: 'Antigravity', icon: 'fas fa-rocket', color: '#FFD700' },
            { name: 'Google AI', icon: 'fab fa-google', color: '#4285F4' },
            { name: 'Claude', icon: 'fas fa-robot', color: '#D97757' },
            { name: 'GitHub', icon: 'fab fa-github', color: '#ffffff' },
            { name: 'Git', icon: 'fab fa-git-alt', color: '#F05032' }
        ];

        const radius = 250;
        let mouseX = 0;
        let mouseY = 0;
        let tags = [];

        // create tags
        skills.forEach(skill => {
            const el = document.createElement('div');
            el.className = 'skill-tag';
            el.innerHTML = `<i class="${skill.icon}" style="--skill-color: ${skill.color}; color: var(--skill-color);"></i><span>${skill.name}</span>`;
            globeContainer.appendChild(el);

            // Random initial position on sphere
            const phi = Math.acos(-1 + (2 * tags.length) / skills.length);
            const theta = Math.sqrt(skills.length * Math.PI) * phi;

            tags.push({
                el: el,
                x: radius * Math.cos(theta) * Math.sin(phi),
                y: radius * Math.sin(theta) * Math.sin(phi),
                z: radius * Math.cos(phi)
            });
        });

        function rotateGlobe() {
            // Auto rotation + mouse influence
            const rotationSpeed = 0.002;
            const cx = rotationSpeed + (mouseX * 0.0001);
            const cy = rotationSpeed + (mouseY * 0.0001);

            // Rotation Matrices
            tags.forEach(tag => {
                // Rotate around X
                let y = tag.y * Math.cos(cx) - tag.z * Math.sin(cx);
                let z = tag.y * Math.sin(cx) + tag.z * Math.cos(cx);
                tag.y = y;
                tag.z = z;

                // Rotate around Y
                let x = tag.x * Math.cos(cy) - tag.z * Math.sin(cy);
                z = tag.x * Math.sin(cy) + tag.z * Math.cos(cy);
                tag.x = x;
                tag.z = z;

                // Project to 2D
                const scale = 300 / (300 + tag.z);
                const alpha = (tag.z + radius) / (2 * radius);

                // tag.x is centered at 0,0. Container is 600x600. Center is 300,300.
                const left = tag.x + 300;
                const top = tag.y + 300;

                tag.el.style.transform = `translate3d(${left}px, ${top}px, 0) scale(${scale})`;
                tag.el.style.opacity = Math.max(0.5, alpha + 0.3);
                tag.el.style.zIndex = Math.floor(tag.z + 1000);
            });

            requestAnimationFrame(rotateGlobe);
        }

        // Mouse interaction
        globeContainer.parentElement.addEventListener('mousemove', (e) => {
            const rect = globeContainer.getBoundingClientRect();
            mouseX = e.clientX - (rect.left + rect.width / 2);
            mouseY = e.clientY - (rect.top + rect.height / 2);
        });

        // Reset when mouse leaves
        globeContainer.parentElement.addEventListener('mouseleave', () => {
            mouseX = 0;
            mouseY = 0;
        });

        rotateGlobe();
    }
});
