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

    // --- Unified Chat Demo Slideshow with Streaming Effect ---
    const chatSlides = document.querySelectorAll('.chat-slide');
    const navDots = document.querySelectorAll('.nav-dot');
    let currentSlide = 0;
    let streaming = false;

    // Define the chat messages for each slide
    const chatDemos = [
        [
            { type: 'user', text: 'What patents does Archer own that cover propulsion systems?' },
            { type: 'system', text: 'Searching patents owned by Archer Aviation, Inc.' },
            { type: 'system', text: 'Found 43 potentially relevant patents and applications' },
            { type: 'system', text: 'Analyzing US Patent Nos. US12024304B2, US11661180B2, and 41 others…' },
            { type: 'ai', text: "Based on my initial review, Archer owns several patents related to propulsion systems, including tilt rotor design and EVTOL systems, including the '304 and '180 patents.\n\nWould you like more specific information about the scope of the claims?", yesno: true }
        ],
        [
            { type: 'user', text: 'What companies have patents covering MRNA platforms?' },
            { type: 'system', text: 'Searching for companies with MRNA patents' },
            { type: 'ai', text: 'I found 62 companies with at least 5 MRNA-related patents. Would you like me to expand my search to companies with less than 5 MRNA-related patents?', yesno: true },
            { type: 'system', text: 'Analyzing US Patent Nos. US10272150B2, US12150980B2, and 277 others…' },
            { type: 'ai', text: "Based on my initial review, Moderna, Novartis, University of Pennsylvania, and University of California are holders of foundational patents covering MRNA vaccine technology. Would you like more specific information about the platforms or corresponding clinical trials?", yesno: true }
        ],
        [
            { type: 'user', text: 'Can you analyze the validity of US10566289B2 in view of US10468746B2 or similar patents?' },
            { type: 'ai', text: 'Yes, I will begin by creating a list of all the claims in US10566289B2, and will identify relevant claim language in US10468746B2 and similar patents that matches the meaning of the claims using semantic searching.' },
            { type: 'system', text: 'Searchihing for disclosures in US10566289B2 that are relevant to independent claims 1, 5, and 9' },
            { type: 'system', text: 'Mapping the claim language to the disclosures.' },
            { type: 'system', text: 'Analyzing the initial results to determine the strength of the invalidity argument.' },
            { type: 'ai', text: 'I have prepared a claim chart covering the invalidity of independent claims 1, 5, and 9 of US10566289B2 in view of US10468746B2. Would you like more specific information about the claims or the mapping results?', yesno: true }
        ]
    ];

    // Function to show a specific slide and stream its messages
    function showSlide(index) {
        streaming = false; // Cancel any ongoing streaming
        chatSlides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
            // Clear previous messages
            const chatMessages = slide.querySelector('.chat-messages');
            if (chatMessages) chatMessages.innerHTML = '';
        });
        navDots.forEach(dot => dot.classList.remove('active'));
        navDots[index].classList.add('active');
        currentSlide = index;
        streamChatMessages(index);
    }

    // Streaming/typing effect for each slide's messages
    function streamChatMessages(slideIndex) {
        streaming = true;
        const chatMessages = chatSlides[slideIndex].querySelector('.chat-messages');
        const messages = chatDemos[slideIndex];
        let msgIdx = 0;
        function typeMessage(msg, idx, cb) {
            if (!streaming) return;
            if (!msg || typeof msg.text !== 'string') {
                console.error('Invalid message object:', msg, 'at idx:', idx);
                if (cb) cb();
                return;
            }
            const msgDiv = document.createElement('div');
            msgDiv.className = `chat-message ${msg.type}`;
            if (msg.type === 'user' && idx === 0) {
                msgDiv.classList.add('first');
            }
            let bubble = document.createElement('div');
            bubble.className = 'bubble';
            let icon = null;
            let textNode = null;
            if (msg.type === 'system') {
                icon = document.createElement('span');
                icon.className = 'system-icon';
                if (msg.text.toLowerCase().includes('searching')) {
                    icon.innerHTML = `<svg width="20" height="20" fill="none" viewBox="0 0 20 20"><circle cx="9" cy="9" r="7" stroke="#888" stroke-width="2"/><path d="M15.5 15.5L13 13" stroke="#888" stroke-width="2" stroke-linecap="round"/></svg>`;
                } else if (msg.text.toLowerCase().includes('found')) {
                    icon.innerHTML = `<svg width="20" height="20" fill="none" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" stroke="#888" stroke-width="2"/><rect x="9" y="5" width="2" height="6" rx="1" fill="#888"/><rect x="9" y="13" width="2" height="2" rx="1" fill="#888"/></svg>`;
                } else if (msg.text.toLowerCase().includes('analyzing')) {
                    icon.innerHTML = `<svg width="20" height="20" fill="none" viewBox="0 0 20 20"><rect x="3" y="5" width="14" height="10" rx="2" stroke="#888" stroke-width="2"/><path d="M7 9h6" stroke="#888" stroke-width="2" stroke-linecap="round"/></svg>`;
                } else {
                    icon.innerHTML = `<svg width="20" height="20" fill="none" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" stroke="#888" stroke-width="2"/></svg>`;
                }
                bubble.appendChild(icon);
                textNode = document.createElement('span');
                bubble.appendChild(textNode);
            }
            msgDiv.appendChild(bubble);
            chatMessages.appendChild(msgDiv);
            let i = 0;
            function typeChar() {
                if (!streaming) return;
                if (i <= msg.text.length) {
                    if (msg.type === 'system') {
                        textNode.innerHTML = msg.text.slice(0, i) + '<span class="blink">|</span>';
                    } else {
                        bubble.innerHTML = msg.text.slice(0, i) + '<span class="blink">|</span>';
                    }
                    i++;
                    setTimeout(typeChar, 14 + Math.random() * 18);
                } else {
                    if (msg.type === 'system') {
                        textNode.innerHTML = msg.text.replace(/\n/g, '<br>');
                    } else {
                        bubble.innerHTML = msg.text.replace(/\n/g, '<br>');
                    }
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
            if (!streaming) return;
            if (msgIdx < messages.length) {
                typeMessage(messages[msgIdx], msgIdx, () => {
                    msgIdx++;
                    nextMsg();
                });
            }
        }
        nextMsg();
    }

    // Navigation dots
    navDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
        });
    });

    // Manual navigation with Previous/Next buttons
    const prevBtn = document.getElementById('prev-slide');
    const nextBtn = document.getElementById('next-slide');
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            let prev = currentSlide - 1;
            if (prev < 0) prev = chatSlides.length - 1;
            showSlide(prev);
        });
        nextBtn.addEventListener('click', () => {
            let next = (currentSlide + 1) % chatSlides.length;
            showSlide(next);
        });
    }

    // Initialize the first slide on page load
    showSlide(0);
}); 