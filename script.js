document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Hamburger menu toggle for mobile
    const hamburger = document.getElementById('hamburger-menu');
    const navLinks = document.getElementById('nav-links');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('open');
        });
        // Optional: close menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
            });
        });
    }

    // Custom Formspree AJAX handler for hero form
    const heroForm = document.getElementById('hero-contact-form');
    const heroSuccessMsg = document.getElementById('hero-form-success-message');
    if (heroForm) {
        heroForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(heroForm);
            const response = await fetch(heroForm.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });
            if (response.ok) {
                heroForm.reset();
                heroSuccessMsg.style.display = 'block';
            } else {
                alert('There was a problem submitting your form. Please try again.');
            }
        });
    }

    // Add scroll-based header styling
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
            } else {
                header.style.boxShadow = 'none';
            }
        });
    }

    // AI Demo Chat Streaming Effect
    const chatMessages = [
        { type: 'user', text: 'What patents does Archer own that cover propulsion systems?' },
        { type: 'system', text: 'Searching patents owned by Archer Aviation, Inc.' },
        { type: 'system', text: 'Found 43 potentially relevant patents and applications' },
        { type: 'system', text: 'Analyzing US Patent Nos. US12024304B2, US11661180B2, and 41 others…' },
        { type: 'ai', text: "Based on my initial review, Archer owns several patents related to propulsion systems, including tilt rotor design and EVTOL system, including the '304 and '180 patents.\n\nWould you like more specific information about the scope of the claims?", yesno: true }
    ];

    const chatContainer = document.querySelector('.chat-container');
    if (chatContainer) {
        let msgIdx = 0;
        function typeMessage(msg, cb) {
            const msgDiv = document.createElement('div');
            msgDiv.className = `chat-message ${msg.type}`;
            let avatar = document.createElement('div');
            avatar.className = 'avatar ' + msg.type;
            avatar.innerText = msg.type === 'user' ? '🧑' : (msg.type === 'ai' ? '🤖' : '');
            if (msg.type !== 'system') msgDiv.appendChild(avatar);
            let bubble = document.createElement('div');
            bubble.className = 'bubble';
            msgDiv.appendChild(bubble);
            if (msg.type === 'system') bubble.style.marginLeft = '2.2rem';
            chatContainer.appendChild(msgDiv);
            let i = 0;
            function typeChar() {
                if (i <= msg.text.length) {
                    bubble.innerHTML = msg.text.slice(0, i) + '<span class="blink">|</span>';
                    i++;
                    setTimeout(typeChar, 14 + Math.random() * 18);
                } else {
                    bubble.innerHTML = msg.text.replace(/\n/g, '<br>');
                    if (msg.yesno) {
                        const row = document.createElement('div');
                        row.className = 'yesno-row';
                        const yes = document.createElement('button');
                        yes.className = 'yesno-btn';
                        yes.innerText = 'Yes';
                        const no = document.createElement('button');
                        no.className = 'yesno-btn';
                        no.innerText = 'No';
                        row.appendChild(yes);
                        row.appendChild(no);
                        bubble.appendChild(row);
                    }
                    if (cb) setTimeout(cb, 500);
                }
            }
            typeChar();
        }
        function nextMsg() {
            if (msgIdx < chatMessages.length) {
                typeMessage(chatMessages[msgIdx], () => {
                    msgIdx++;
                    nextMsg();
                });
            }
        }
        nextMsg();
    }
}); 