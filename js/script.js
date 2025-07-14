document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('#navbar .nav-links a');
    const sections = document.querySelectorAll('section');
    const mobileMenu = document.getElementById('mobile-menu');
    const navbarUl = document.querySelector('#navbar .nav-links');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const typedDescription = document.querySelector('.typed-description');
    // Phrases for the typing effect - customize these!
    const phrases = [
        "a Web Developer.",
        "a Game Developer.",
        "a Windows Developer.",
        "a Problem Solver.",
        "a Creator."
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 100; // Speed of typing (ms per character)
    const deletingSpeed = 60; // Speed of deleting (ms per character)
    const delayBetweenPhrases = 1500; // Pause before typing next phrase (ms)

    const skillTabButtons = document.querySelectorAll('.tab-button');
    const skillCategories = document.querySelectorAll('.skills-category');
    const progressBars = document.querySelectorAll('.progress');

    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    const projectModal = document.getElementById('project-modal');
    const closeModalBtn = document.querySelector('.close-button');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalTechnologies = document.getElementById('modal-technologies');
    const modalLiveDemo = document.getElementById('modal-live-demo');
    const modalGitHub = document.getElementById('modal-github');
    const modalAdditionalLink = document.getElementById('modal-additional-link'); // New element for custom links
    const projectGalleryContainer = document.getElementById('project-gallery');
    let swiperInstance = null; // To store the Swiper instance

    const scrollToTopBtn = document.getElementById('scroll-to-top');

    // --- Preloader Logic ---
    window.addEventListener('load', () => {
        const preloader = document.getElementById('preloader');
        preloader.classList.add('hide-preloader');
        setTimeout(() => {
            preloader.remove(); // Remove preloader from DOM after transition
        }, 500); // Matches CSS transition duration
    });

    // --- Set Current Year in Footer ---
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // --- Dark/Light Mode Toggle ---
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.setAttribute('data-theme', savedTheme);
        // Adjust icon based on saved theme
        darkModeToggle.querySelector('i').classList.toggle('fa-sun', savedTheme === 'dark');
        darkModeToggle.querySelector('i').classList.toggle('fa-moon', savedTheme === 'light');
    }

    darkModeToggle.addEventListener('click', () => {
        if (body.getAttribute('data-theme') === 'dark') {
            body.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            darkModeToggle.querySelector('i').classList.replace('fa-sun', 'fa-moon');
        } else {
            body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            darkModeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
        }
    });

    // --- Sticky Navbar & Background Change on Scroll ---
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) { // Threshold for adding 'scrolled' class
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- Smooth Scroll & Active Link Highlighting ---
    function highlightActiveLink() {
        let currentSectionId = '';
        sections.forEach(section => {
            // Adjust for sticky header height
            const sectionTop = section.offsetTop - navbar.offsetHeight - 1; // -1 for slight buffer
            // Check if scroll position is within the current section
            if (pageYOffset >= sectionTop) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active'); // Remove active from all links
            // Add active class to the link matching the current section
            if (link.href.includes(currentSectionId)) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', highlightActiveLink);
    highlightActiveLink(); // Call on load to set initial active link based on scroll position

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault(); // Prevent default anchor link behavior
            const targetId = this.getAttribute('href').substring(1); // Get section ID from href
            const targetSection = document.getElementById(targetId);

            window.scrollTo({
                top: targetSection.offsetTop - navbar.offsetHeight + 1, // Scroll to section, accounting for sticky header
                behavior: 'smooth' // Smooth scroll animation
            });

            // Close mobile menu if open after clicking a link
            if (navbarUl.classList.contains('active')) {
                navbarUl.classList.remove('active');
                mobileMenu.classList.remove('active');
            }
        });
    });

    // --- Mobile Menu Toggle (Burger Icon) ---
    mobileMenu.addEventListener('click', () => {
        navbarUl.classList.toggle('active'); // Toggle visibility of nav links
        mobileMenu.classList.toggle('active'); // Toggle burger icon animation
    });

    // --- Typing Effect for Hero Description ---
    function type() {
        const currentPhrase = phrases[phraseIndex];
        if (isDeleting) {
            typedDescription.textContent = currentPhrase.substring(0, charIndex--);
        } else {
            typedDescription.textContent = currentPhrase.substring(0, charIndex++);
        }

        let typeSpeed = typingSpeed;
        if (isDeleting) {
            typeSpeed /= 2; // Delete faster
        }

        // Check if phrase is fully typed
        if (!isDeleting && charIndex === currentPhrase.length + 1) {
            typeSpeed = delayBetweenPhrases;
            isDeleting = true; // Start deleting
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false; // Stop deleting
            phraseIndex = (phraseIndex + 1) % phrases.length; // Move to next phrase
            typeSpeed = typingSpeed; // Resume typing speed
        }

        setTimeout(type, typeSpeed); // Call function recursively
    }
    type(); // Start the typing animation when the page loads

    // --- Scroll Animations (Intersection Observer API) ---
    const observerOptions = {
        root: null, // Observe changes in the viewport
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% of the target is visible
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate'); // Add 'animate' class to trigger CSS animation
                // observer.unobserve(entry.target); // Uncomment this line if you want the animation to play only once
            } else {
                // entry.target.classList.remove('animate'); // Uncomment this line if you want elements to re-animate when scrolling back up
            }
        });
    }, observerOptions);

    // Observe all sections and timeline items for scroll animations
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
    // Also observe timeline items separately for their specific slide animations
    document.querySelectorAll('.timeline-item').forEach(item => {
        sectionObserver.observe(item);
    });


    // --- Animate Skill Progress Bars ---
    const aboutSection = document.getElementById('about');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                progressBars.forEach(bar => {
                    const progress = bar.dataset.progress;
                    bar.style.width = progress + '%'; // Set width to trigger CSS transition
                });
                skillObserver.unobserve(aboutSection); // Stop observing once animated (optional)
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.4 // Trigger when 40% of the about section is visible
    });
    skillObserver.observe(aboutSection);

    // --- Skills Tab Functionality ---
    skillTabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Deactivate all tab buttons
            skillTabButtons.forEach(btn => btn.classList.remove('active'));
            // Activate the clicked button
            button.classList.add('active');

            const category = button.dataset.category;
            // Hide all skill categories
            skillCategories.forEach(cat => {
                cat.classList.remove('active');
            });
            // Show the selected skill category
            document.querySelector(`.skills-category.${category}`).classList.add('active');

            // Re-trigger skill bar animation for the active tab for a fresh animation (optional)
            const activeCategoryProgressBars = document.querySelector(`.skills-category.${category}`).querySelectorAll('.progress');
            activeCategoryProgressBars.forEach(bar => {
                bar.style.width = '0%'; // Reset width to 0%
                setTimeout(() => {
                    bar.style.width = bar.dataset.progress + '%'; // Animate to full width
                }, 100); // Small delay to allow CSS reset to take effect
            });
        });
    });
    // Set the first tab as active and trigger its animation on page load
    document.querySelector('.tab-button[data-category="webdev"]').click();


    // --- Project Filtering ---
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Deactivate all filter buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Activate the clicked button
            button.classList.add('active');

            const filter = button.dataset.filter; // Get filter category (e.g., 'web', 'game', 'all')

            projectCards.forEach(card => {
                const projectCategory = card.dataset.category; // Get project's category
                if (filter === 'all' || projectCategory === filter) {
                    card.style.display = 'flex'; // Show card (using flex display from CSS)
                } else {
                    card.style.display = 'none'; // Hide card
                }
            });
        });
    });

    // --- Project Modal Logic ---
    // Centralized project data (add all your project details here!)
    const allProjectDetails = {
        'web-ecommerce': {
            title: 'E-commerce Platform',
            images: [
                '<iframe width="560" height="315" src="https://www.youtube.com/embed/zarBTvwGTaE?si=_lpNNfgZqKYyr55p" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
                'images/winall1.png',
                'images/winall2.png',
                'images/winall3.png',
            ],
            description: ', I built a product-selling web application using Laravel for the backend and Vue.js for the frontend. I developed a comprehensive product category system, enabling dynamic management of categories and subcategories, and implemented filtering functionality to enhance user experience. My work included building RESTful APIs for product listings, user roles, cart and order management, and integrating secure authentication with Laravel Sanctum. I also created an admin panel for managing inventory, pricing, and product images',
            technologies: ['Laravel', 'Ajax', 'MySQL', 'Bootstrap', 'Hostinger Deployment'],
            liveDemo: 'images/winall.png',
        },
        'web-hyip': {
            title: 'Hyip Monitor Platform',
            images: [
                '<iframe width="560" height="315" src="https://www.youtube.com/embed/suxF_zyv9Aw?si=N1MyWwpUVc4EYGr-" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
                'images/trading-hyips1.png',
                'images/trading-hyips2.png',
                'images/trading-hyips3.png',
            ],
            description: 'Dashboard statistics: active HYIPs, user signups, recent reviews, and click tracking. Multi-language support and currency conversion API (optional). Cron jobs to auto-update HYIP statuses and check uptime or payment status via APIs or manual admin review.',
            technologies: ['Laravel', 'Ajax', 'MySQL', 'Bootstrap', 'Hostinger Deployment'],
            liveDemo: 'images/winall.png', // Replace with actual live demo link
            github: '' // Replace with actual GitHub link
        },
        'web-invest-hyip': {
            title: 'Invest Hyip Website Platform',
            images: [
                'images/tradeforyou1.png',
                'images/tradeforyou2.png',
                'images/tradeforyou3.png',
                'images/tradeforyou4.png',
                'images/tradeforyou5.png',
                'images/tradeforyou6.png',
                'images/tradeforyou7.png',
                'images/tradeforyou8.png',
                'images/tradeforyou9.png',
            ],
            description: 'Admin approval system for manual bank transfers or untracked crypto deposits.Admin panel shows pending deposit requests for approval/rejection.Referral system with commission tracking.Cryptocurrency Integration (e.g., BTC, LTC, ETH) using external APIs (e.g., NowPayments, CoinPayments, or Block.io) with unique wallet generation and webhook-based payment confirmation.Countdown timers showing when next earnings are due.Secure dashboard showing investment history, earning logs, active plans, and wallet balances.',
            technologies: ['Laravel', 'Ajax', 'MySQL', 'Bootstrap', 'Hostinger Deployment'],
            liveDemo: 'images/tradeforyou9.png', // Replace with actual live demo link
            github: '' // Replace with actual GitHub link
        },
        'web-pos': {
            title: 'POS Web System',
            images: [
                '<iframe width="560" height="315" src="https://www.youtube.com/embed/QDNtGms1fOY?si=na4s95oa3K30zD8J" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
                'images/pizza5.png',
                'images/pizza6.png',
                'images/pizza1.png',
                'images/pizza2.png',
                'images/pizza3.png',
                'images/pizza4.png',
            ],
            description: `
                A modern Point of Sale (POS) web application built using React JS (Vite) for the frontend and Laravel API for the backend.
                This system allows shop owners or cashiers to manage daily sales, inventory, and customers efficiently.
                The dashboard features real-time product listing, order management, sales summary, and printed receipts.
                Products are categorized for easy browsing, with search and filter functionality.
                
                The admin panel provides inventory control (add/edit/delete products and categories),
                user account management (cashier roles), and detailed reporting (daily/weekly/monthly sales reports).
                Customers can be tracked with their purchase history, and discounts or tax can be applied per order.
                
                The system is optimized for both desktop and tablet usage, ideal for restaurants, retail shops, and small businesses.
            `,
            technologies: [
                'React JS (Vite)',
                'Laravel RESTful API',
                'Tailwind CSS',
                'Axios',
                'MySQL',
                'Laravel Sanctum (Auth)',
                'PDF Receipt Generator',
                'Chart.js / Recharts (Analytics)',
                'Hostinger Deployment'
            ],
            liveDemo: 'images/pizza5.png', // Replace with your actual live demo link, e.g., 'https://pos-demo.yoursite.com'
            github: '' // Optional: Insert your GitHub repo link if public
        },


        'web-bg-remover': {
            title: 'Background Remover',
            images: [
                '<iframe width="560" height="315" src="https://www.youtube.com/embed/QDNtGms1fOY?si=na4s95oa3K30zD8J" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
                'images/bg-remover2.png',
                'images/bg_remover1.png',
            ],
            description: `
                Through this project, I gained experience working with image processing tools and third-party APIs, improved my frontend/backend integration skills, and focused on delivering a smooth user experience through responsive design and real-time previews.
            `,
            technologies: [
                'Nuxt js',
                'Tailwind CSS',
                'Python',
            ],
        },

        'web-image-upscaler': {
            title: 'Image Upscaler',
            images: [
                '<iframe width="560" height="315" src="https://www.youtube.com/embed/QDNtGms1fOY?si=na4s95oa3K30zD8J" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
                'images/image-upscaler1.png',
                'images/image-upscaler2.png',
                'images/image-upscaler3.png',
            ],
            description: `
                This web-based Image Upscaler allows users to increase the resolution of their images without losing quality by using AI-based enhancement techniques. The backend, written in Python, handles the upscaling using advanced models or third-party APIs, while the frontend built with Nuxt.js and Tailwind CSS provides a clean and responsive interface. Users can select their preferred upscale level (2×, 4×), view real-time previews, and download the upscaled image in high quality. This project helped me strengthen my understanding of image processing, frontend-backend integration, and UX optimization.
            `,
            technologies: [
                'Nuxt js',
                'Tailwind CSS',
                'Python',
            ],
        },


        'web-tiktok-download': {
            title: 'Tiktok downloader',
            images: [
                '<iframe width="560" height="315" src="https://www.youtube.com/embed/QDNtGms1fOY?si=na4s95oa3K30zD8J" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
                'images/tiktok-download1.png',
                'images/tiktok-download2.png',
                'images/tiktok-download3.png',
                'images/tiktok-download4.png',
            ],
            description: `
                 The TikTok Downloader project is a tool that enables users to download videos from TikTok without the watermark, providing a cleaner version of the content for reuse or archiving. Users can paste a TikTok link, and the system fetches the video using backend Python logic—either through direct scraping or third-party APIs—then returns a downloadable MP4 file. The frontend is built with Nuxt.js and Tailwind CSS, designed to be mobile-friendly and fast. This project helped me explore web scraping, API integration, and user experience optimization while handling video processing efficiently on the backend.
            `,
            technologies: [
                'Nuxt js',
                'Tailwind CSS',
                'Python',
            ],
        },

        'web-facebook-download': {
            title: 'Facebook downloader',
            images: [
                '<iframe width="560" height="315" src="https://www.youtube.com/embed/QDNtGms1fOY?si=na4s95oa3K30zD8J" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
                'images/facebook-download1.png',
                'images/facebook-download2.png',
                'images/facebook-download3.png',
                'images/facebook-download4.png',
            ],
            description: `
                 This Facebook Video Downloader allows users to easily fetch and download videos from Facebook by entering a public video URL. The system is built with Python on the backend using "yt_dlp" or custom scraping logic to extract video links in both HD and SD quality. The frontend is developed using Nuxt.js and Tailwind CSS, designed for responsiveness and ease of use. This project gave me hands-on experience with video extraction, handling Facebook’s dynamic content structure, and building a seamless user interface that simplifies the download process without any third-party tools or browser plugins.
            `,
            technologies: [
                'Nuxt js',
                'Tailwind CSS',
                'Python',
            ],
        },

        
        'web-youtube-download': {
            title: 'Youtube downloader',
            images: [
                '<iframe width="560" height="315" src="https://www.youtube.com/embed/QDNtGms1fOY?si=na4s95oa3K30zD8J" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
                'images/youtube-download1.png',
                'images/youtube-download2.png',
                'images/youtube-download3.png',
                'images/youtube-download4.png',
                'images/youtube-download5.png',
                'images/youtube-download6.png',
                'images/youtube-download7.png',
            ],
            description: `
                  This YouTube Video Downloader lets users fetch and download videos or audio from YouTube by simply pasting the video URL. The backend is powered by Python and uses the powerful "pytubefix" library to extract direct video and audio streams, allowing users to choose resolution options (e.g., 360p, 720p, 1080p) or audio-only MP3 downloads. The frontend, developed using Nuxt.js and styled with Tailwind CSS, provides a responsive and fast interface for both desktop and mobile devices. This project gave me practical experience in working with video processing tools, command-line utilities like ffmpeg, API-style service architecture, and building a user-friendly download experience.
            `,
            technologies: [
                'Nuxt js',
                'Tailwind CSS',
                'Python',
            ],
        },




        'web-u888': {
            title: 'U888 Template',
            images: [
                'images/u8881.png',
                'images/u8882.png',
                'images/u8883.png',
            ],
            description: `
             A responsive and modern web design template created using Tailwind CSS, focused on clean UI/UX principles.
        The template includes pre-designed sections such as hero banners, feature grids, testimonials, pricing tables,
        and contact forms. Built with a mobile-first approach, it ensures seamless experience across all devices.
        
        Ideal for startups, portfolios, SaaS landing pages, and marketing websites. Easily customizable with utility-first
        Tailwind classes and reusable components. Designed with accessibility, performance, and scalability in mind.
               `,
            technologies: [
                'Tailwind CSS',
            ],
            liveDemo: 'images/pizza5.png', // Replace with your actual live demo link, e.g., 'https://pos-demo.yoursite.com'
            github: '' // Optional: Insert your GitHub repo link if public
        },
        'web-hay88vn': {
            title: 'Hay88vn Template',
            images: [
                'images/hay88vn1.png',
                'images/hay88vn2.png',
                'images/hay88vn3.png',
            ],
            description: `
                A responsive and modern web design template created using Tailwind CSS, focused on clean UI/UX principles.
            The template includes pre-designed sections such as hero banners, feature grids, testimonials, pricing tables,
            and contact forms. Built with a mobile-first approach, it ensures seamless experience across all devices.
            
            Ideal for startups, portfolios, SaaS landing pages, and marketing websites. Easily customizable with utility-first
            Tailwind classes and reusable components. Designed with accessibility, performance, and scalability in mind.
                `,
            technologies: [
                'Tailwind CSS',
            ],
            liveDemo: 'images/pizza5.png', // Replace with your actual live demo link, e.g., 'https://pos-demo.yoursite.com'
            github: '' // Optional: Insert your GitHub repo link if public
        },
        'web-galaxy': {
            title: 'Galaxy6623 Template',
            images: [
                'images/gallaxy1.png',
                'images/gallaxy2.png',
                'images/gallaxy3.png',
            ],
            description: `
                A responsive and modern web design template created using Tailwind CSS, focused on clean UI/UX principles.
            The template includes pre-designed sections such as hero banners, feature grids, testimonials, pricing tables,
            and contact forms. Built with a mobile-first approach, it ensures seamless experience across all devices.
            
            Ideal for startups, portfolios, SaaS landing pages, and marketing websites. Easily customizable with utility-first
            Tailwind classes and reusable components. Designed with accessibility, performance, and scalability in mind.
                `,
            technologies: [
                'Tailwind CSS',
            ],
            liveDemo: 'images/pizza5.png', // Replace with your actual live demo link, e.g., 'https://pos-demo.yoursite.com'
            github: '' // Optional: Insert your GitHub repo link if public
        },
        'web-bong99': {
            title: 'Bong99 Template',
            images: [
                'images/bong991.png',
                'images/bong992.png',
                'images/bong99.png',
            ],
            description: `
                A responsive and modern web design template created using Tailwind CSS, focused on clean UI/UX principles.
            The template includes pre-designed sections such as hero banners, feature grids, testimonials, pricing tables,
            and contact forms. Built with a mobile-first approach, it ensures seamless experience across all devices.
            
            Ideal for startups, portfolios, SaaS landing pages, and marketing websites. Easily customizable with utility-first
            Tailwind classes and reusable components. Designed with accessibility, performance, and scalability in mind.
                `,
            technologies: [
                'Tailwind CSS',
            ],
            liveDemo: 'images/pizza5.png', // Replace with your actual live demo link, e.g., 'https://pos-demo.yoursite.com'
            github: '' // Optional: Insert your GitHub repo link if public
        },
        'web-88van': {
            title: '88Wanvin Template',
            images: [
                'images/88van1.png',
                'images/88van2.png',
                'images/88van.png',
            ],
            description: `
                A responsive and modern web design template created using Tailwind CSS, focused on clean UI/UX principles.
            The template includes pre-designed sections such as hero banners, feature grids, testimonials, pricing tables,
            and contact forms. Built with a mobile-first approach, it ensures seamless experience across all devices.
            
            Ideal for startups, portfolios, SaaS landing pages, and marketing websites. Easily customizable with utility-first
            Tailwind classes and reusable components. Designed with accessibility, performance, and scalability in mind.
                `,
            technologies: [
                'Tailwind CSS',
            ],
            liveDemo: 'images/pizza5.png', // Replace with your actual live demo link, e.g., 'https://pos-demo.yoursite.com'
            github: '' // Optional: Insert your GitHub repo link if public
        },
        'web-v6bet': {
            title: '88Wanvin Template',
            images: [
                'images/v6bet.png',
                'images/v6bet2.png',
                'images/v6bet3.png',
                'images/v6bet4.png',
            ],
            description: `
                A responsive and modern web design template created using Tailwind CSS, focused on clean UI/UX principles.
            The template includes pre-designed sections such as hero banners, feature grids, testimonials, pricing tables,
            and contact forms. Built with a mobile-first approach, it ensures seamless experience across all devices.
            
            Ideal for startups, portfolios, SaaS landing pages, and marketing websites. Easily customizable with utility-first
            Tailwind classes and reusable components. Designed with accessibility, performance, and scalability in mind.
                `,
            technologies: [
                'Tailwind CSS',
            ],
            liveDemo: 'images/pizza5.png', // Replace with your actual live demo link, e.g., 'https://pos-demo.yoursite.com'
            github: '' // Optional: Insert your GitHub repo link if public
        },
        'web-happyluke': {
            title: 'Happyluke Template',
            images: [
                'images/happyluke.png',
                'images/happyluke2.png',
                'images/happyluke3.png',
                'images/happyluke4.png',
                'images/happyluke5.png',
            ],
            description: `
                A responsive and modern web design template created using Tailwind CSS, focused on clean UI/UX principles.
            The template includes pre-designed sections such as hero banners, feature grids, testimonials, pricing tables,
            and contact forms. Built with a mobile-first approach, it ensures seamless experience across all devices.
            
            Ideal for startups, portfolios, SaaS landing pages, and marketing websites. Easily customizable with utility-first
            Tailwind classes and reusable components. Designed with accessibility, performance, and scalability in mind.
                `,
            technologies: [
                'Tailwind CSS',
            ],
            liveDemo: 'images/pizza5.png', // Replace with your actual live demo link, e.g., 'https://pos-demo.yoursite.com'
            github: '' // Optional: Insert your GitHub repo link if public
        },
        'web-coin2gate': {
            title: 'U888 Template',
            images: [
                'images/coin2gate1.png',
                'images/coin2gate2.png',
                'images/coin2gate.png',
            ],
            description: `
             A responsive and modern web design template created using Tailwind CSS, focused on clean UI/UX principles.
        The template includes pre-designed sections such as hero banners, feature grids, testimonials, pricing tables,
        and contact forms. Built with a mobile-first approach, it ensures seamless experience across all devices.
        
        Ideal for startups, portfolios, SaaS landing pages, and marketing websites. Easily customizable with utility-first
        Tailwind classes and reusable components. Designed with accessibility, performance, and scalability in mind.
               `,
            technologies: [
                'Tailwind CSS',
            ],
            liveDemo: 'images/pizza5.png', // Replace with your actual live demo link, e.g., 'https://pos-demo.yoursite.com'
            github: '' // Optional: Insert your GitHub repo link if public
        },
        'web-coinapex': {
            title: 'CoinApex Template',
            images: [
                'images/coinapex.png',
                'images/coinapex1.png',
                'images/coinapex2.png',
                'images/coinapex3.png',
                'images/coinapex4.png',
                'images/coinapex5.png',
                'images/coinapex6.png',
            ],
            description: `
             A responsive and modern web design template created using Tailwind CSS, focused on clean UI/UX principles.
        The template includes pre-designed sections such as hero banners, feature grids, testimonials, pricing tables,
        and contact forms. Built with a mobile-first approach, it ensures seamless experience across all devices.
        
        Ideal for startups, portfolios, SaaS landing pages, and marketing websites. Easily customizable with utility-first
        Tailwind classes and reusable components. Designed with accessibility, performance, and scalability in mind.
               `,
            technologies: [
                'Tailwind CSS',
            ],
            liveDemo: 'images/pizza5.png', // Replace with your actual live demo link, e.g., 'https://pos-demo.yoursite.com'
            github: '' // Optional: Insert your GitHub repo link if public
        },
        'web-coin': {
            title: 'CoinApex Template',
            images: [
                'images/coin.png',
                'images/coin2.png',
                'images/coin3.png',
                'images/coin4.png',
                'images/coin5.png',
                'images/coin6.png',
                'images/coin7.png',
            ],
            description: `
             A responsive and modern web design template created using Tailwind CSS, focused on clean UI/UX principles.
        The template includes pre-designed sections such as hero banners, feature grids, testimonials, pricing tables,
        and contact forms. Built with a mobile-first approach, it ensures seamless experience across all devices.
        
        Ideal for startups, portfolios, SaaS landing pages, and marketing websites. Easily customizable with utility-first
        Tailwind classes and reusable components. Designed with accessibility, performance, and scalability in mind.
               `,
            technologies: [
                'Tailwind CSS',
            ],
            liveDemo: 'images/pizza5.png', // Replace with your actual live demo link, e.g., 'https://pos-demo.yoursite.com'
            github: '' // Optional: Insert your GitHub repo link if public
        },
        'web-buycoin': {
            title: 'CoinApex Template',
            images: [
                'images/buycoin.png',
                'images/buycoin2.png',
                'images/buycoin3.png',
                'images/buycoin4.png',
                'images/buycoin5.png',
                'images/buycoin6.png',
            ],
            description: `
             A responsive and modern web design template created using Tailwind CSS, focused on clean UI/UX principles.
        The template includes pre-designed sections such as hero banners, feature grids, testimonials, pricing tables,
        and contact forms. Built with a mobile-first approach, it ensures seamless experience across all devices.
        
        Ideal for startups, portfolios, SaaS landing pages, and marketing websites. Easily customizable with utility-first
        Tailwind classes and reusable components. Designed with accessibility, performance, and scalability in mind.
               `,
            technologies: [
                'Tailwind CSS',
            ],
            liveDemo: 'images/pizza5.png', // Replace with your actual live demo link, e.g., 'https://pos-demo.yoursite.com'
            github: '' // Optional: Insert your GitHub repo link if public
        },

        'game-madmonkey': {
            title: 'Mad Monkey',
            images: [
                '<iframe width="560" height="315" src="https://www.youtube.com/embed/G9tiMG29xc8?si=Ej0c7ygdGUnH5wjW" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
                'images/madmonkey.png',
                'images/madmonkey1.png',
                'images/madmonkey2.png',
                'images/madmonkey3.png',
                'images/madmonkey4.png',
                'images/madmonkey5.png',
                'images/madmonkey6.png',
                'images/madmonkey7.png',
                'images/madmonkey8.png',
                'images/madmonkey9.png',
                'images/madmonkey10.png',
            ],
            description: `Mad Monkey is a fast-paced, endless action arcade game developed in Godot and designed specifically for Telegram using WebGL. Players control a determined monkey who must defend the jungle from mischievous birds by launching a variety of fruits as weapons. The game combines reactive strategy and quick reflexes, with progression tied to enemy difficulty, unlockable fruit types, and real-time power-ups. Integrated with PlayFab for leaderboard, player data, and currency store.

                    **Gameplay Highlights**:
                    • The monkey auto-runs through the jungle while players tap on birds to throw fruits.
                    • Enemy speed and obstacle density increase over time, enhancing difficulty.
                    • Birds fly in random patterns; some carry power-ups or drop bonuses.
                    • Special birds require more hits but reward players with valuable skills or boosts.

                    **Fruit System**:
                    • Multiple fruit types, each with unique effects and cooldowns.
                    • Unlock and upgrade fruits to increase damage or trigger special effects.

                    **Power-Ups**:
                    • Speed Boost: Temporarily increases movement speed.
                    • Shield: Grants temporary invulnerability.
                    • Banana Storm: Launches a barrage of fruits for high area damage.

                    **Back-End Integration**:
                    • PlayFab is used for real-time leaderboards, cloud saves, and currency/store systems.
                    • The game runs inside Telegram via a bot using WebGL, with a lightweight and smooth interface.`,

            technologies: ['Godot', 'GDScript', 'JavaScript', 'Telegram Bot API', 'PlayFab'],
            liveDemo: 'https://t.me/MadMonkey_game_bot',
        },

        'game-shooter': {
            title: 'Shooting Fish',
            images: [
                '<iframe width="560" height="315" src="https://www.youtube.com/embed/f88rt3eHFO8?si=-vdIgm8Cb3c0UGCo" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
                'images/shootingfish.png',
                'images/shootingfish1.png',
                'images/shootingfish2.png',
                'images/shootingfish3.png',
            ],
            description: `Shooting Fish is a fast-paced arcade-style 2D shooter game where players control a cannon to shoot various types of fish. The goal is to earn coins by shooting fish, with each fish type having different health and coin rewards. The game includes real-time interactions, animated fish behavior, net and coin effects, and dynamic difficulty as the game progresses.`,
            technologies: ['Unity Engine', 'C#'],
        },




        'windows-tools': {
            title: 'Tools Automations Manage Accounts and create Account',
            images: [
                '<iframe width="560" height="315" src="https://www.youtube.com/embed/nZxHxR82L3Q?si=D71i249Otyo2EYHL" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
                'images/tools.png',
                'images/tools1.png',
                'images/tools2.png',
            ],
            description: 'A robust desktop application built using WPF (Windows Presentation Foundation) for efficient inventory, customer, and order management. Features a clean, modern UI, seamless data persistence with SQL Server, advanced search and filtering capabilities, and extensive reporting functions. Designed for business environments.',
            technologies: ['Python', 'PyQty5', 'Rest API'],
        },

        // Add more project objects as needed following the same structure
    };

    document.querySelectorAll('.view-details-btn').forEach(button => {
        button.addEventListener('click', () => {
            const projectId = button.dataset.projectId; // Get the ID from the button's data-project-id
            const project = allProjectDetails[projectId]; // Retrieve project data from the object

            if (project) {
                // Populate modal content
                modalTitle.textContent = project.title;
                modalDescription.textContent = project.description;

                // Populate technologies
                modalTechnologies.innerHTML = ''; // Clear previous technologies
                project.technologies.forEach(tech => {
                    const span = document.createElement('span');
                    span.textContent = tech;
                    modalTechnologies.appendChild(span);
                });

                // Set primary and secondary links
                modalLiveDemo.href = project.liveDemo;
                modalGitHub.href = project.github;

                // Handle the optional third link
                if (project.additionalLinkText && project.additionalLinkText !== "") {
                    modalAdditionalLink.style.display = 'inline-block'; // Show the button
                    modalAdditionalLink.textContent = project.additionalLinkText;
                    modalAdditionalLink.href = project.liveDemo; // Use liveDemo for this as well, or a specific additionalLink if available
                    modalLiveDemo.style.display = 'none'; // Hide the default "Live Demo" button if custom one is used
                } else {
                    modalAdditionalLink.style.display = 'none'; // Hide the button
                    modalLiveDemo.style.display = 'inline-block'; // Ensure default "Live Demo" is visible
                }


                // Populate Swiper slides dynamically
                const swiperWrapper = projectGalleryContainer.querySelector('.swiper-wrapper');
                swiperWrapper.innerHTML = ''; // Clear existing slides

                project.images.forEach(item => {
                    const slide = document.createElement('div');
                    slide.classList.add('swiper-slide');

                    // Check if the item is an iframe string or an image URL
                    if (item.trim().startsWith('<iframe')) {
                        // If it's an iframe, set the innerHTML of the slide directly
                        slide.innerHTML = item;
                    } else {
                        // Otherwise, create an <img> element for the image
                        const img = document.createElement('img');
                        img.src = item;
                        img.alt = project.title; // Add alt text for accessibility
                        slide.appendChild(img);
                    }

                    swiperWrapper.appendChild(slide);
                });


                // --- DEBUGGING VERSION ---

                // Destroy existing Swiper instance if it exists
                if (swiperInstance) {
                    swiperInstance.destroy(true, true);
                }

                console.log('Initializing Swiper with debug logs...'); // Log: Confirms this code is running

                // Initialize Swiper with new event handlers for autoplay control
                swiperInstance = new Swiper('#project-gallery', {
                    loop: true,
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true
                    },
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },
                    autoplay: {
                        delay: 3000,
                        disableOnInteraction: false,
                    },
                    grabCursor: true,
                    centeredSlides: true,
                    slidesPerView: 1,

                    // --- Event handlers with logging ---
                    on: {
                        init: function (swiper) {
                            console.log('Swiper event: init'); // Log: Checks if init event fires
                            const activeSlide = swiper.slides[swiper.activeIndex];
                            // Check if the active slide contains an iframe
                            if (activeSlide && activeSlide.querySelector('iframe')) {
                                console.log('Result: Iframe FOUND on initial slide. Stopping autoplay.'); // Log
                                swiper.autoplay.stop();
                            } else {
                                console.log('Result: No iframe on initial slide. Autoplay will continue.'); // Log
                            }
                        },
                        slideChange: function (swiper) {
                            console.log(`Swiper event: slideChange. New index: ${swiper.activeIndex}`); // Log: Checks if slideChange fires
                            const activeSlide = swiper.slides[swiper.activeIndex];
                            // Check if the new slide contains an iframe
                            if (activeSlide && activeSlide.querySelector('iframe')) {
                                console.log('Result: Iframe FOUND on this slide. Stopping autoplay.'); // Log
                                swiper.autoplay.stop();
                            } else {
                                console.log('Result: No iframe on this slide. Starting autoplay.'); // Log
                                swiper.autoplay.start();
                            }
                        },
                    }
                });

                projectModal.style.display = 'flex';
                body.classList.add('no-scroll');
            }
        });
    });

    // Close modal when close button is clicked
    closeModalBtn.addEventListener('click', () => {
        projectModal.style.display = 'none';
        body.classList.remove('no-scroll'); // Re-enable background scrolling
        if (swiperInstance) {
            swiperInstance.autoplay.stop(); // Stop autoplay when modal closes
        }
    });

    // Close modal when clicking outside of modal content
    window.addEventListener('click', (e) => {
        if (e.target === projectModal) {
            projectModal.style.display = 'none';
            body.classList.remove('no-scroll');
            if (swiperInstance) {
                swiperInstance.autoplay.stop();
            }
        }
    });

    // --- Basic Form Validation (Client-Side) ---
    const contactForm = document.querySelector('.contact-form');
    contactForm.addEventListener('submit', function (e) {
        const nameInput = this.querySelector('#name');
        const emailInput = this.querySelector('#email');
        const messageInput = this.querySelector('#message');

        let isValid = true;

        if (nameInput.value.trim() === '') {
            alert('Please enter your name.');
            isValid = false;
        } else if (!emailInput.value.includes('@') || !emailInput.value.includes('.')) {
            alert('Please enter a valid email address.');
            isValid = false;
        } else if (messageInput.value.trim().length < 10) { // Example: minimum 10 characters for message
            alert('Message must be at least 10 characters long.');
            isValid = false;
        }

        if (!isValid) {
            e.preventDefault(); // Stop form submission if validation fails
        } else {
            e.preventDefault();

            emailjs.init("JeS-NbGpaTs7Sqw3v"); // Replace with your actual Public Key

            emailjs.sendForm("service_enbgjfq", "template_7d39eyv", this)
                .then(() => {
                    alert("Email sent successfully!");
                    this.reset();
                }, (error) => {
                    console.error("Failed to send email:", error);
                });

            // alert('Message sent successfully! I will get back to you soon.');
        }
    });

    // --- Scroll-to-Top Button Logic ---
    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) { // Show button after scrolling down 400px
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // Smooth scroll to the top
        });
    });
});

