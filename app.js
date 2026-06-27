/* ----------------------------------------------------
 * Intelloworks Application Logic
 * Interactive Simulators, Theme Toggles, Portfolio Filters, FAQ Actions
 * ---------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initMobileMenu();
    initSimulatorTabs();
    initWorkflowSimulator();
    initCRMPipeline();
    initInboxSimulator();
    initReviewsSimulator();
    initPortfolioFilters();
    initFAQAccordion();
    initContactFormConsole();
});

/* ==========================================
 * 1. Dark/Light Theme Switching
 * ========================================== */
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const htmlEl = document.documentElement;

    // Check system preference or localStorage
    const savedTheme = localStorage.getItem('theme') || 'dark';
    htmlEl.setAttribute('data-theme', savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlEl.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlEl.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}

/* ==========================================
 * 2. Mobile Navigation Menu
 * ========================================== */
function initMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    mobileMenuToggle.addEventListener('click', () => {
        mobileMenuToggle.classList.toggle('open');
        navMenu.classList.toggle('open');
    });

    // Close menu when clicking links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuToggle.classList.remove('open');
            navMenu.classList.remove('open');
        });
    });
}

/* ==========================================
 * 3. Simulator Tabs System
 * ========================================== */
function initSimulatorTabs() {
    const tabButtons = document.querySelectorAll('.sim-tab-btn');
    const panels = document.querySelectorAll('.sim-panel');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetSim = btn.getAttribute('data-sim');

            // Set active button
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Set active panel
            panels.forEach(panel => {
                panel.classList.remove('active');
                if (panel.id === `sim-${targetSim}`) {
                    panel.classList.add('active');
                }
            });
        });
    });
}

/* ==========================================
 * 4. Tab 1: IntelloFlow Workflow Simulator
 * ========================================== */
function initWorkflowSimulator() {
    const btnRun = document.getElementById('btnRunWorkflow');
    const log = document.getElementById('workflowLog');
    
    // Nodes
    const nodeCrm = document.getElementById('node-crm');
    const nodeSms = document.getElementById('node-sms');
    const nodeEmail = document.getElementById('node-email');

    let isRunning = false;

    btnRun.addEventListener('click', () => {
        if (isRunning) return;
        isRunning = true;
        btnRun.disabled = true;
        btnRun.innerText = "Simulation Running...";

        // Reset elements
        nodeCrm.classList.remove('active-flow');
        nodeSms.classList.add('disabled-flow');
        nodeSms.classList.remove('active-flow');
        nodeEmail.classList.add('disabled-flow');
        nodeEmail.classList.remove('active-flow');

        // Step 1: Trigger Submitted
        log.innerHTML = `<span class="font-green">➔ [0.0s] Trigger Fired: Form submitted by lead "Jane Doe".</span>`;
        
        // Step 2: CRM Update
        setTimeout(() => {
            nodeCrm.classList.add('active-flow');
            log.innerHTML += `<br><span class="text-blue">➔ [1.0s] Action Executed: Lead added to IntelloCRM pipeline in Stage 'New Inquiry'.</span>`;
            log.scrollTop = log.scrollHeight;
        }, 1000);

        // Step 3: SMS Outbound
        setTimeout(() => {
            nodeSms.classList.remove('disabled-flow');
            nodeSms.classList.add('active-flow');
            log.innerHTML += `<br><span class="text-purple">➔ [2.2s] Action Executed: Welcome SMS sent via IntelloFlow: "Hey Jane! Thanks for matching..."</span>`;
            log.scrollTop = log.scrollHeight;
        }, 2200);

        // Step 4: Email Nurture
        setTimeout(() => {
            nodeEmail.classList.remove('disabled-flow');
            nodeEmail.classList.add('active-flow');
            log.innerHTML += `<br><span class="text-orange">➔ [3.5s] Action Executed: Nurture email queued to jane@domain.com. Flow complete.</span>`;
            log.scrollTop = log.scrollHeight;
            
            // Finish
            btnRun.disabled = false;
            btnRun.innerText = "Run Flow Simulation";
            isRunning = false;
        }, 3500);
    });
}

/* ==========================================
 * 5. Tab 2: IntelloCRM Pipeline Simulator
 * ========================================== */
function initCRMPipeline() {
    const columns = {
        inquiry: document.querySelector('[data-stage="inquiry"]'),
        contacted: document.querySelector('[data-stage="contacted"]'),
        booked: document.querySelector('[data-stage="booked"]'),
        closed: document.querySelector('[data-stage="closed"]')
    };

    const log = document.getElementById('crmLog');
    const cards = document.querySelectorAll('.crm-card');

    cards.forEach(card => {
        const btnAdvance = card.querySelector('.btn-advance-card');

        btnAdvance.addEventListener('click', () => {
            const currentColumn = card.parentElement.parentElement;
            const currentStage = currentColumn.getAttribute('data-stage');
            
            let nextStage = '';
            let triggerLogMsg = '';

            switch (currentStage) {
                case 'inquiry':
                    nextStage = 'contacted';
                    triggerLogMsg = `[CRM Event] Moved "${card.querySelector('.card-title').innerText}" to Contacted. IntelloFlow: Automated introductory email dispatched.`;
                    break;
                case 'contacted':
                    nextStage = 'booked';
                    triggerLogMsg = `[CRM Event] Moved "${card.querySelector('.card-title').innerText}" to Appointment Booked. Calendar sync activated. Automated SMS reminder scheduled.`;
                    break;
                case 'booked':
                    nextStage = 'closed';
                    triggerLogMsg = `[CRM Event] Deal Closed for "${card.querySelector('.card-title').innerText}"! 🎉 Value: ${card.querySelector('.card-value').innerText} synced to dashboard analytics.`;
                    break;
                case 'closed':
                    nextStage = 'inquiry';
                    triggerLogMsg = `[CRM Event] Recycled "${card.querySelector('.card-title').innerText}" back to New Inquiries stage for future cross-sell loops.`;
                    break;
            }

            // Move the card HTML
            const targetContainer = columns[nextStage].querySelector('.crm-cards-container');
            targetContainer.appendChild(card);

            // Update text on button
            if (nextStage === 'closed') {
                btnAdvance.innerHTML = `Recycle <i class="bi bi-arrow-repeat"></i>`;
            } else {
                btnAdvance.innerHTML = `Advance <i class="bi bi-chevron-right"></i>`;
            }

            // Update counters
            updatePipelineCounters();

            // Print log message
            log.innerHTML = `<span class="text-purple">${triggerLogMsg}</span>`;
        });
    });

    function updatePipelineCounters() {
        Object.keys(columns).forEach(stage => {
            const container = columns[stage];
            const cardsCount = container.querySelectorAll('.crm-card').length;
            container.querySelector('.count').innerText = cardsCount;
        });
    }
}

/* ==========================================
 * 6. Tab 3: Unified Inbox Simulator
 * ========================================== */
function initInboxSimulator() {
    const sidebarItems = document.querySelectorAll('.sidebar-chat-item');
    const chatTitle = document.getElementById('activeChatName');
    const scrollArea = document.getElementById('chatScrollArea');
    const channelBadge = document.querySelector('.badge-medium');
    const quickReplyButtons = document.querySelectorAll('.btn-quick-reply');

    // Data for different chats
    const chatData = {
        "David L. (La Cressida)": {
            channel: 'Instagram DM',
            badgeClass: 'bg-instagram',
            badgeIcon: 'bi-instagram',
            messages: [
                { type: 'received', text: "Hi Intelloworks team! We're launching our premium jewelry catalog for La Cressida next month. Do you guys provide CRM integration and Facebook ad management alongside the ecommerce web setup?", time: "10:42 AM" },
                { type: 'sent', text: "Absolutely! We manage all ad campaigns, set up social content automations, and sync every customer profile directly to your Intelloworks CRM pipeline. Are you looking to launch on Shopify?", time: "10:44 AM" },
                { type: 'received', text: "Yes, Shopify. What is the pricing structure for this full setup?", time: "10:45 AM" }
            ],
            replies: {
                intro: "Our packages for custom Shopify design & GHL automation integration start from $397/mo. We build the store and set up the lead flow pipelines completely.",
                book: "Let's align on a strategy call! Here is our booking calendar link: intelloworks.com/book-meeting. What time works best?",
                portfolio: "Sure! Check out our Shopify builds and social campaigns for La Cressida at: intelloworks.com/#case-studies."
            }
        },
        "Sarah K. (Fomyo)": {
            channel: 'SMS Text',
            badgeClass: 'bg-sms',
            badgeIcon: 'bi-chat-dots-fill',
            messages: [
                { type: 'received', text: "Hello! We have been getting a lot of abandoned carts on Fomyo.com recently. Can Intelloworks build an automated SMS recovery sequence?", time: "Yesterday" },
                { type: 'sent', text: "Yes, definitely. We integrate your cart directly into the Intelloworks CRM platform. When a cart is abandoned, we trigger an SMS text to the user 30 minutes later with a custom discount link.", time: "Yesterday" },
                { type: 'received', text: "That sounds awesome. Let's set it up on our workspace.", time: "9:15 AM" }
            ],
            replies: {
                intro: "Great! Our tech team can configure the cart integration in under 48 hours. Let's finalize your discount strategy.",
                book: "Sounds like a plan! Book a slot on our scheduling board here so we can configure your credentials: intelloworks.com/book-meeting",
                portfolio: "We launched similar automations for Fomyo and La Cressida which recovered up to 22% of abandoned carts. Read details here: intelloworks.com/#case-studies"
            }
        },
        "Emma Watson (BVSS)": {
            channel: 'Email Message',
            badgeClass: 'bg-email',
            badgeIcon: 'bi-envelope-fill',
            messages: [
                { type: 'received', text: "Hi team, we're planning our next regional accounting conference for BVSS. Can we set up a automated email registration ticket loop using the membership platform?", time: "June 25" },
                { type: 'sent', text: "Hello Emma, yes. We can create the registration form, automate confirmation emails containing QR tickets, and place registrants in a 'Conference Attendant' pipeline.", time: "June 25" },
                { type: 'received', text: "Perfect. I'll send over the event brochure.", time: "11:02 AM" }
            ],
            replies: {
                intro: "Received! We will load the brochure assets, create the templates, and launch the registration form on your portal.",
                book: "Let's review the ticketing setup together. Hop on a quick call via: intelloworks.com/book-meeting",
                portfolio: "See our work on membership databases and registration forms here: intelloworks.com/#case-studies"
            }
        }
    };

    let activeSender = "David L. (La Cressida)";

    // Sidebar items click event
    sidebarItems.forEach(item => {
        item.addEventListener('click', () => {
            sidebarItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            const sender = item.getAttribute('data-sender');
            activeSender = sender;
            loadChat(sender);
        });
    });

    // Handle Quick Replies
    quickReplyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const replyKey = btn.getAttribute('data-reply');
            const replyText = chatData[activeSender].replies[replyKey];

            if (!replyText) return;

            // 1. Add Sent Message
            appendMessage('sent', replyText, getCurrentTimeText());
            
            // Disable buttons temporarily
            quickReplyButtons.forEach(b => b.disabled = true);

            // 2. Simulated Customer typing and response
            setTimeout(() => {
                let customerResponse = "Awesome, that works for me. Thank you!";
                if (replyKey === 'book') {
                    customerResponse = "Just selected a time on your calendar. Talk to you soon!";
                } else if (replyKey === 'portfolio') {
                    customerResponse = "Wow, these designs look beautiful. Exactly what we need.";
                }
                
                appendMessage('received', customerResponse, getCurrentTimeText());
                quickReplyButtons.forEach(b => b.disabled = false);
            }, 1500);
        });
    });

    function loadChat(sender) {
        const data = chatData[sender];
        chatTitle.innerText = sender;
        
        // Update badge
        channelBadge.className = `badge-medium ${data.badgeClass}`;
        channelBadge.innerHTML = `<i class="bi ${data.badgeIcon}"></i> ${data.channel}`;

        // Load messages
        scrollArea.innerHTML = '';
        data.messages.forEach(msg => {
            appendMessage(msg.type, msg.text, msg.time);
        });
    }

    function appendMessage(type, text, time) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-msg ${type}`;
        msgDiv.innerHTML = `
            <div class="msg-bubble">
                <p>${text}</p>
                <span class="time">${time}</span>
            </div>
        `;
        scrollArea.appendChild(msgDiv);
        scrollArea.scrollTop = scrollArea.scrollHeight;
    }

    function getCurrentTimeText() {
        const now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // key '0' is '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        return `${hours}:${minutes} ${ampm}`;
    }
}

/* ==========================================
 * 7. Tab 4: Reputation Simulator (Reviews)
 * ========================================== */
function initReviewsSimulator() {
    const btnSend = document.getElementById('btnSendReviewReq');
    const clientNameInput = document.getElementById('revClientName');
    const clientEmailInput = document.getElementById('revClientEmail');
    const successText = document.getElementById('reviewSentText');
    const reviewsList = document.getElementById('reviewsPreviewList');
    
    btnSend.addEventListener('click', () => {
        const name = clientNameInput.value.trim();
        const contact = clientEmailInput.value.trim();

        if (!name || !contact) {
            alert("Please provide both name and contact information.");
            return;
        }

        btnSend.disabled = true;
        btnSend.innerText = "Sending Request...";

        // 1. Success feedback
        setTimeout(() => {
            successText.innerText = `✓ Request dispatched via API loop to ${contact}. Status: Waiting response.`;
            btnSend.innerText = "Request Sent";
            
            // Clear inputs
            clientNameInput.value = '';
            clientEmailInput.value = '';
        }, 800);

        // 2. Automated response delay (customer leaves review)
        setTimeout(() => {
            const newReview = document.createElement('div');
            newReview.className = 'live-review-item';
            newReview.innerHTML = `
                <div class="item-header">
                    <strong>${name}</strong>
                    <span class="rating-stars text-yellow">
                        <i class="bi bi-star-fill"></i>
                        <i class="bi bi-star-fill"></i>
                        <i class="bi bi-star-fill"></i>
                        <i class="bi bi-star-fill"></i>
                        <i class="bi bi-star-fill"></i>
                    </span>
                </div>
                <p>"Loved working with Intelloworks. They streamlined our scheduling and built our website. Outstanding automation support!"</p>
            `;
            
            // Prepend new review
            reviewsList.insertBefore(newReview, reviewsList.firstChild);
            reviewsList.scrollTop = 0;
            
            // Clear success message
            successText.innerText = `🎉 New 5-Star Google Review collected from ${name}!`;
            
            // Reset button
            btnSend.disabled = false;
            btnSend.innerText = "Send Automated Request";
        }, 3000);
    });
}

/* ==========================================
 * 8. Portfolio Filters & Grid Sorting
 * ========================================== */
function initPortfolioFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioCards = document.querySelectorAll('.portfolio-item-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filterValue = btn.getAttribute('data-filter');

            // Toggle active button class
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            portfolioCards.forEach(card => {
                const cardCat = card.getAttribute('data-category');
                
                if (filterValue === 'all' || cardCat === filterValue) {
                    card.style.display = 'block';
                    // Animation trigger
                    card.style.opacity = '0';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

/* ==========================================
 * 9. FAQ Accordions Toggles
 * ========================================== */
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all items
            faqItems.forEach(i => i.classList.remove('active'));

            // Toggle active state
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

/* ==========================================
 * 10. Contact Form CRM Simulation Logger
 * ========================================== */
function initContactFormConsole() {
    const form = document.getElementById('contactForm');
    const btnSubmit = document.getElementById('btnSubmitForm');
    const consoleOutput = document.getElementById('consoleOutput');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('formName').value.trim();
        const email = document.getElementById('formEmail').value.trim();
        const phone = document.getElementById('formPhone').value.trim();
        const company = document.getElementById('formCompany').value.trim() || 'Not Specified';
        const service = document.getElementById('formServices').value;

        if (!name || !email || !phone) return;

        btnSubmit.disabled = true;
        btnSubmit.innerText = "Processing CRM Automations...";
        consoleOutput.innerHTML = `[INITIALIZING] Connecting to Intelloworks API nodes...`;

        // Sequential fake terminal output simulation
        const logLines = [
            `[CRM API] Establish connection to active workspace DB.`,
            `[DB SUCCESS] Created lead profile for "${name}" (${email})`,
            `[CRM ENGINE] Moving deal to pipeline stage: "New Inquiries"`,
            `[LOGIC ENGINE] Running workflow rules for service target: "${service}"`,
            `[SMS WORKFLOW] Dispatching SMS payload via Twilio Integration to ${phone}...`,
            `[SMS SUCCESS] Text sent: "Hi ${name}, welcome to Intelloworks! A consultant will call you shortly."`,
            `[EMAIL PIPELINE] Queued welcome materials & brochure PDF to ${email}`,
            `[NOTIFY] Sent Slack/Discord push alert to sales operations team.`,
            `[COMPLETE] Workspace CRM Flow finished successfully. Lead synchronized. ✅`
        ];

        let index = 0;
        const intervalId = setInterval(() => {
            if (index < logLines.length) {
                consoleOutput.innerHTML += `\n${logLines[index]}`;
                consoleOutput.scrollTop = consoleOutput.scrollHeight;
                index++;
            } else {
                clearInterval(intervalId);
                btnSubmit.innerText = "Form Submitted Successfully";
                
                // Reset form fields
                form.reset();
                
                // Allow submitting again after a few seconds
                setTimeout(() => {
                    btnSubmit.disabled = false;
                    btnSubmit.innerText = "Submit Form & Trigger CRM Flow";
                }, 5000);
            }
        }, 600);
    });
}
