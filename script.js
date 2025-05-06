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

    // Chat Demo Slideshow
    const chatSlides = document.querySelectorAll('.chat-slide');
    const navDots = document.querySelectorAll('.nav-dot');
    let currentSlide = 0;

    // Chat demo content for each slide
    const chatDemos = [
        [
            { type: 'user', text: 'What is Palisade?' },
            { type: 'system', text: 'Palisade is an AI-powered platform that helps you analyze and understand complex documents. It can extract key information, identify patterns, and provide insights from your documents in seconds.' },
            { type: 'user', text: 'How does it work?' },
            { type: 'system', text: 'Simply upload your documents, and our AI will process them to extract relevant information. You can ask questions about the content, and Palisade will provide accurate answers based on the document context.' }
        ],
        [
            { type: 'user', text: 'Can I use Palisade for legal documents?' },
            { type: 'system', text: 'Yes! Palisade is particularly effective for legal documents. It can help identify key clauses, extract important dates, and summarize complex legal language in a way that\'s easy to understand.' },
            { type: 'user', text: 'What about financial reports?' },
            { type: 'system', text: 'Absolutely. Palisade can analyze financial reports, extract key metrics, identify trends, and help you understand complex financial data quickly and accurately.' }
        ],
        [
            { type: 'user', text: 'How accurate is Palisade?' },
            { type: 'system', text: 'Palisade uses advanced AI models trained on millions of documents to ensure high accuracy. It continuously learns and improves from user interactions to provide increasingly precise results.' },
            { type: 'user', text: 'Is my data secure?' },
            { type: 'system', text: 'Yes, security is our top priority. All documents are encrypted, and we maintain strict data privacy standards. Your information is never shared with third parties without your explicit consent.' }
        ]
    ];

    // Function to show a specific slide
    function showSlide(index) {
        chatSlides.forEach(slide => slide.classList.remove('active'));
        navDots.forEach(dot => dot.classList.remove('active'));
        
        chatSlides[index].classList.add('active');
        navDots[index].classList.add('active');
        currentSlide = index;
    }

    // Initialize chat demos for each slide
    function initializeChatDemos() {
        chatSlides.forEach((slide, index) => {
            const chatMessages = slide.querySelector('.chat-messages');
            const messages = chatDemos[index];
            
            messages.forEach((message, msgIndex) => {
                setTimeout(() => {
                    typeMessage(chatMessages, message.text, message.type, msgIndex === 0);
                }, msgIndex * 2000);
            });
        });
    }

    // Add click handlers for navigation dots
    navDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
        });
    });

    // Auto-advance slides every 10 seconds
    setInterval(() => {
        const nextSlide = (currentSlide + 1) % chatSlides.length;
        showSlide(nextSlide);
    }, 10000);

    // Initialize the chat demos when the page loads
    initializeChatDemos();

    // AI Demo Chat Streaming Effect
    const chatMessages = [
        { type: 'user', text: 'What patents does Archer own that cover propulsion systems?' },
        { type: 'system', text: 'Searching patents owned by Archer Aviation, Inc.' },
        { type: 'system', text: 'Found 43 potentially relevant patents and applications' },
        { type: 'system', text: 'Analyzing US Patent Nos. US12024304B2, US11661180B2, and 41 others…' },
        { type: 'ai', text: "Based on my initial review, Archer owns several patents related to propulsion systems, including tilt rotor design and EVTOL systems, including the '304 and '180 patents.\n\nWould you like more specific information about the scope of the claims?", yesno: true }
    ];

    const chatMessagesWrapper = document.querySelector('.chat-messages');
    if (chatMessagesWrapper) {
        let msgIdx = 0;
        function typeMessage(msg, cb) {
            const msgDiv = document.createElement('div');
            msgDiv.className = `chat-message ${msg.type}`;
            if (msg.type === 'user' && msgIdx === 0) {
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
            chatMessagesWrapper.appendChild(msgDiv);
            let i = 0;
            function typeChar() {
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