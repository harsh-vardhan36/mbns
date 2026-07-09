/* ==========================================================================
   Manav Bharti National School (MBNS) - Interactivity Script
   Designed and Developed by Harsh Vardhan
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. Theme Configuration (Dark / Light Mode)
    // ==========================================
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const htmlElement = document.documentElement;
    const themeIcon = themeToggleBtn.querySelector('i');

    // Retrieve saved theme or default to system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        setTheme(systemPrefersDark ? 'dark' : 'light');
    }

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });

    function setTheme(theme) {
        htmlElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);

        // Update theme toggle icon
        if (theme === 'dark') {
            themeIcon.className = 'fa-solid fa-sun';
        } else {
            themeIcon.className = 'fa-solid fa-moon';
        }
    }

    // ==========================================
    // 2. Navigation Header & Scroll Behaviors
    // ==========================================
    const header = document.querySelector('.main-header');
    const backToTopBtn = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        // Sticky Header visual adjustments
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Back-to-top button show/hide
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }

        // Active navigation link tracking on scroll
        updateActiveNavLinks();
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Update active state in nav menu depending on scroll position
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    function updateActiveNavLinks() {
        let scrollPosition = window.scrollY + 120; // Offset for header

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // ==========================================
    // 3. Mobile Navigation Drawer
    // ==========================================
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const drawerOverlay = document.getElementById('drawerOverlay');
    const closeDrawerBtn = document.getElementById('closeDrawerBtn');
    const drawerLinks = document.querySelectorAll('.drawer-link');

    hamburgerMenu.addEventListener('click', openDrawer);
    closeDrawerBtn.addEventListener('click', closeDrawer);
    drawerOverlay.addEventListener('click', closeDrawer);

    drawerLinks.forEach(link => {
        link.addEventListener('click', closeDrawer);
    });

    function openDrawer() {
        mobileDrawer.classList.add('open');
        drawerOverlay.classList.add('open');
        document.body.style.overflow = 'hidden'; // Stop page scrolling background
    }

    function closeDrawer() {
        mobileDrawer.classList.remove('open');
        drawerOverlay.classList.remove('open');
        document.body.style.overflow = ''; // Resume background scrolling
    }

    // ==========================================
    // 4. Scroll-Triggered Reveal Animations
    // ==========================================
    const revealElements = document.querySelectorAll('.scroll-reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // Stats counter animation (simple numerical increment)
    const statNumbers = document.querySelectorAll('.stat-number');
    const statsSection = document.querySelector('.stats-bar');

    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    function animateStats() {
        statNumbers.forEach(stat => {
            const targetAttr = stat.getAttribute('data-target');
            if (!targetAttr) return; // Skip non-numeric stats like "CBSE"

            const target = parseInt(targetAttr, 10);
            const duration = 2000; // 2 seconds
            const stepTime = Math.abs(Math.floor(duration / target));
            let current = 0;

            const increment = target > 500 ? 10 : 1;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    stat.textContent = targetAttr.includes('+') ? target + '+' : target;
                    clearInterval(timer);
                } else {
                    stat.textContent = targetAttr.includes('+') ? current + '+' : current;
                }
            }, target > 500 ? stepTime * 10 : stepTime);
        });
    }

    // ==========================================
    // 5. Interactive Photo Gallery & Lightbox
    // ==========================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxDesc = document.getElementById('lightboxDesc');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');

    let currentGalleryIndex = 0;
    let visibleGalleryItems = [];

    // Filter Logic
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button styling
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });

            // Re-map visible gallery items for index sync inside Lightbox
            updateVisibleItems();
        });
    });

    function updateVisibleItems() {
        visibleGalleryItems = Array.from(galleryItems).filter(item => !item.classList.contains('hidden'));
    }

    // Initialize visible items array
    updateVisibleItems();

    // Attach click events to item zoom buttons for lightbox loading
    galleryItems.forEach((item, index) => {
        const viewBtn = item.querySelector('.view-btn');
        const img = item.querySelector('img');
        const title = item.querySelector('.gallery-overlay h4').textContent;
        const desc = item.querySelector('.gallery-overlay p').textContent;

        const openHandler = () => {
            updateVisibleItems();
            currentGalleryIndex = visibleGalleryItems.indexOf(item);
            loadLightboxImage(img.src, title, desc);
            openLightbox();
        };

        // Click on view button
        if (viewBtn) {
            viewBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                openHandler();
            });
        }

        // Also support click anywhere on the card
        item.addEventListener('click', openHandler);
    });

    function loadLightboxImage(src, title, desc) {
        lightboxImg.src = src;
        lightboxTitle.textContent = title;
        lightboxDesc.textContent = desc;
    }

    function openLightbox() {
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Lightbox Navigations
    lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        navigateLightbox(-1);
    });

    lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        navigateLightbox(1);
    });

    function navigateLightbox(direction) {
        if (visibleGalleryItems.length <= 1) return;

        currentGalleryIndex += direction;

        if (currentGalleryIndex < 0) {
            currentGalleryIndex = visibleGalleryItems.length - 1;
        } else if (currentGalleryIndex >= visibleGalleryItems.length) {
            currentGalleryIndex = 0;
        }

        const nextItem = visibleGalleryItems[currentGalleryIndex];
        const img = nextItem.querySelector('img');
        const title = nextItem.querySelector('.gallery-overlay h4').textContent;
        const desc = nextItem.querySelector('.gallery-overlay p').textContent;

        loadLightboxImage(img.src, title, desc);
    }

    // Keyboard support for Lightbox and drawer escape
    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('open')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') navigateLightbox(1);
            if (e.key === 'ArrowLeft') navigateLightbox(-1);
        }
        if (mobileDrawer.classList.contains('open')) {
            if (e.key === 'Escape') closeDrawer();
        }
    });

    // ==========================================
    // 6. Interactive Contact Form Validation
    // ==========================================
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const toast = document.getElementById('toast');
    const toastClose = document.getElementById('toastClose');

    const fields = {
        name: {
            input: document.getElementById('name'),
            error: document.getElementById('nameError'),
            validate: (val) => val.trim().length > 0
        },
        email: {
            input: document.getElementById('email'),
            error: document.getElementById('emailError'),
            validate: (val) => {
                const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return regex.test(val.trim());
            }
        },
        phone: {
            input: document.getElementById('phone'),
            error: document.getElementById('phoneError'),
            validate: (val) => {
                const cleanVal = val.replace(/\D/g, '');
                return cleanVal.length === 10;
            }
        },
        message: {
            input: document.getElementById('message'),
            error: document.getElementById('messageError'),
            validate: (val) => val.trim().length > 0
        }
    };

    // Live validation input event listeners
    Object.keys(fields).forEach(key => {
        const field = fields[key];
        field.input.addEventListener('input', () => {
            const isValid = field.validate(field.input.value);
            if (isValid) {
                field.input.closest('.form-group').classList.remove('has-error');
            }
        });
    });

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let formValid = true;

        // Perform full validation check
        Object.keys(fields).forEach(key => {
            const field = fields[key];
            const isValid = field.validate(field.input.value);
            if (!isValid) {
                field.input.closest('.form-group').classList.add('has-error');
                formValid = false;
            } else {
                field.input.closest('.form-group').classList.remove('has-error');
            }
        });

        if (formValid) {
            // Mock API submit with loading button state
            const origBtnHTML = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<span class="btn-text">Submitting...</span> <i class="fa-solid fa-spinner fa-spin"></i>`;

            // Save submission to localStorage
            const nameVal = fields.name.input.value;
            const emailVal = fields.email.input.value;
            const phoneVal = fields.phone.input.value;
            const msgVal = fields.message.input.value;
            const timeStamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

            const savedMsg = JSON.parse(localStorage.getItem('mbns_enquiries') || '[]');
            savedMsg.push({
                name: nameVal,
                email: emailVal,
                phone: phoneVal,
                message: msgVal,
                date: timeStamp
            });
            localStorage.setItem('mbns_enquiries', JSON.stringify(savedMsg));

            setTimeout(() => {
                // Success state simulation
                submitBtn.disabled = false;
                submitBtn.innerHTML = origBtnHTML;
                contactForm.reset();
                showToast();
            }, 1500);
        }
    });

    function showToast() {
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 5000); // Auto hide after 5 seconds
    }

    toastClose.addEventListener('click', () => {
        toast.classList.remove('show');
    });

    // ==========================================
    // 7. Staff Portal / Admin Dashboard Control
    // ==========================================
    const staffPortalLink = document.getElementById('staffPortalLink');
    const adminModal = document.getElementById('adminModal');
    const adminModalClose = document.getElementById('adminModalClose');
    const adminLoginForm = document.getElementById('adminLoginForm');
    const passcodeField = document.getElementById('passcode');
    const passcodeError = document.getElementById('passcodeError');
    const adminModalContent = adminModal.querySelector('.admin-modal-content');

    const adminLoginState = document.getElementById('adminLoginState');
    const adminDashboardState = document.getElementById('adminDashboardState');

    const messagesTable = document.getElementById('messagesTable');
    const messagesTableBody = document.getElementById('messagesTableBody');
    const noMessagesText = document.getElementById('noMessagesText');
    const clearAllMessagesBtn = document.getElementById('clearAllMessagesBtn');
    const adminLogoutBtn = document.getElementById('adminLogoutBtn');

    // Open Staff Portal
    staffPortalLink.addEventListener('click', (e) => {
        e.preventDefault();
        openStaffPortal();
    });

    adminModalClose.addEventListener('click', closeStaffPortal);

    // Hide staff modal when clicking on layout overlay
    adminModal.addEventListener('click', (e) => {
        if (e.target === adminModal) {
            closeStaffPortal();
        }
    });

    function openStaffPortal() {
        // Reset state
        adminModalContent.classList.remove('wide');
        adminLoginState.classList.remove('hidden');
        adminDashboardState.classList.add('hidden');
        passcodeField.value = '';
        passcodeField.closest('.form-group').classList.remove('has-error');

        // Show modal
        adminModal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeStaffPortal() {
        adminModal.classList.remove('open');
        // If not viewing lightbox, restore body scrolling
        if (!lightbox.classList.contains('open') && !mobileDrawer.classList.contains('open')) {
            document.body.style.overflow = '';
        }
    }

    // Verify Passcode Submit
    adminLoginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const code = passcodeField.value.trim();

        if (code === '3656') {
            // Correct Passcode
            passcodeField.closest('.form-group').classList.remove('has-error');
            showAdminDashboard();
        } else {
            // Incorrect Passcode
            passcodeField.closest('.form-group').classList.add('has-error');
            passcodeField.value = '';
            passcodeField.focus();
        }
    });

    function showAdminDashboard() {
        adminLoginState.classList.add('hidden');
        adminDashboardState.classList.remove('hidden');
        adminModalContent.classList.add('wide');
        renderEnquiriesTable();
    }

    function renderEnquiriesTable() {
        const enquiries = JSON.parse(localStorage.getItem('mbns_enquiries') || '[]');

        if (enquiries.length === 0) {
            noMessagesText.classList.remove('hidden');
            messagesTable.classList.add('hidden');
            return;
        }

        noMessagesText.classList.add('hidden');
        messagesTable.classList.remove('hidden');
        messagesTableBody.innerHTML = '';

        // Render from newest to oldest
        enquiries.slice().reverse().forEach((msg, idx) => {
            // Calculate original index in the main storage array
            const originalIndex = enquiries.length - 1 - idx;

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><span class="msg-date">${msg.date}</span></td>
                <td><span class="msg-sender">${escapeHTML(msg.name)}</span></td>
                <td>
                    <div class="msg-meta-info">
                        <p><i class="fa-solid fa-envelope"></i> ${escapeHTML(msg.email)}</p>
                        <p><i class="fa-solid fa-phone"></i> ${escapeHTML(msg.phone)}</p>
                    </div>
                </td>
                <td><div class="msg-text-body">${escapeHTML(msg.message)}</div></td>
                <td>
                    <button class="btn-delete-msg" data-index="${originalIndex}" title="Delete message">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </td>
            `;
            messagesTableBody.appendChild(tr);
        });

        // Add event listeners to delete buttons
        const deleteButtons = messagesTableBody.querySelectorAll('.btn-delete-msg');
        deleteButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetIndex = parseInt(btn.getAttribute('data-index'), 10);
                deleteEnquiry(targetIndex);
            });
        });
    }

    function deleteEnquiry(index) {
        if (confirm("Are you sure you want to delete this enquiry message?")) {
            const enquiries = JSON.parse(localStorage.getItem('mbns_enquiries') || '[]');
            enquiries.splice(index, 1);
            localStorage.setItem('mbns_enquiries', JSON.stringify(enquiries));
            renderEnquiriesTable();
        }
    }

    // Clear All
    clearAllMessagesBtn.addEventListener('click', () => {
        const enquiries = JSON.parse(localStorage.getItem('mbns_enquiries') || '[]');
        if (enquiries.length === 0) return;

        if (confirm("Are you sure you want to delete ALL message enquiries permanently? This action cannot be undone.")) {
            localStorage.setItem('mbns_enquiries', JSON.stringify([]));
            renderEnquiriesTable();
        }
    });

    // Logout Control
    adminLogoutBtn.addEventListener('click', () => {
        adminModalContent.classList.remove('wide');
        adminDashboardState.classList.add('hidden');
        adminLoginState.classList.remove('hidden');
        passcodeField.value = '';
    });

    // Helper function to prevent HTML injection in dashboard
    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g,
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }
});
