document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Theme Toggle Logic (Dark/Light Mode) ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const themeToggleMobile = document.getElementById('theme-toggle-mobile');
    const themeIconMobile = document.getElementById('theme-icon-mobile');
    const htmlElement = document.documentElement;

    // Update Icon based on current theme
    function updateIcon() {
        const isDark = htmlElement.classList.contains('dark');
        // Desktop
        if (themeIcon) {
            if (isDark) {
                themeIcon.classList.remove('fa-moon', 'text-amber-400');
                themeIcon.classList.add('fa-sun');
            } else {
                themeIcon.classList.remove('fa-sun', 'text-amber-400');
                themeIcon.classList.add('fa-moon');
            }
        }
        // Mobile
        if (themeIconMobile) {
            if (isDark) {
                themeIconMobile.classList.remove('fa-moon', 'text-amber-400');
                themeIconMobile.classList.add('fa-sun');
            } else {
                themeIconMobile.classList.remove('fa-sun', 'text-amber-400');
                themeIconMobile.classList.add('fa-moon');
            }
        }
    }
    
    updateIcon(); // Run on load

    function applyThemeChange() {
        htmlElement.classList.toggle('dark');
        
        if (htmlElement.classList.contains('dark')) {
            localStorage.theme = 'dark';
        } else {
            localStorage.theme = 'light';
        }
        updateIcon();
    }

    let themeTransitionActive = false;

    async function toggleTheme(event) {
        if (themeTransitionActive) return;

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduceMotion || !document.startViewTransition) {
            applyThemeChange();
            return;
        }

        const trigger = event.currentTarget;
        const rect = trigger.getBoundingClientRect();
        const originX = rect.left + rect.width / 2 - 10;
        const originY = rect.top + rect.height / 2;
        const originXPercent = (originX / document.documentElement.clientWidth) * 100;
        const originYPercent = (originY / document.documentElement.clientHeight) * 100;

        themeTransitionActive = true;
        let themeApplied = false;

        try {
            htmlElement.classList.add('theme-switching');
            const transition = document.startViewTransition(() => {
                applyThemeChange();
                themeApplied = true;
            });

            await transition.ready;

            const reveal = htmlElement.animate(
                {
                    clipPath: [
                        `circle(0 at ${originXPercent}% ${originYPercent}%)`,
                        `circle(150vmax at ${originXPercent}% ${originYPercent}%)`
                    ]
                },
                {
                    duration: 720,
                    easing: 'cubic-bezier(0.76, 0, 0.24, 1)',
                    fill: 'both',
                    pseudoElement: '::view-transition-new(root)'
                }
            );

            await reveal.finished;
            await transition.finished;
        } catch (error) {
            if (!themeApplied) applyThemeChange();
        } finally {
            htmlElement.classList.remove('theme-switching');
            themeTransitionActive = false;
        }
    }

    if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);
    if (themeToggleMobile) themeToggleMobile.addEventListener('click', toggleTheme);

    // --- Mobile Menu Toggle ---
    const menuToggle = document.getElementById('menu-toggle');
    const menuIcon = document.getElementById('menu-icon');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            if (mobileMenu.classList.contains('hidden')) {
                menuIcon.classList.remove('fa-xmark');
                menuIcon.classList.add('fa-bars');
            } else {
                menuIcon.classList.remove('fa-bars');
                menuIcon.classList.add('fa-xmark');
            }
        });

        // Close mobile menu when clicking a link
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                menuIcon.classList.remove('fa-xmark');
                menuIcon.classList.add('fa-bars');
            });
        });
    }


    // --- 2. Render Skills Dynamically ---
    const skillsContainer = document.getElementById('skills-container');
    const offsetToCss = (steps) => {
        if (steps === 0) return '0px';
        const distance = Math.abs(steps);
        const sign = steps < 0 ? '-' : '';
        return `calc(${sign}${distance * 100}% ${steps < 0 ? '-' : '+'} ${distance * 0.75}rem)`;
    };

    const directionVectors = {
        U: [0, -1], D: [0, 1], L: [-1, 0], R: [1, 0]
    };
    const desktopPuzzles = [
        ['DLD', 'UUU', 'UUL', 'UUR', 'UDL', 'ULU'],
        ['UDD', 'ULD', 'UDR', 'ULL', 'URU', 'DUL'],
        ['URD', 'DUU', 'URR'],
        ['DUR', 'DDD', 'DDL', 'DLU', 'DDR', 'DLL'],
        ['DRU', 'DRD', 'DRR']
    ];
    const mobilePuzzles = [
        ['DLD', 'UUU', 'UUR', 'UUL', 'UDD', 'ULU'],
        ['UDL', 'ULD', 'UDR', 'ULL', 'URU', 'URD'],
        ['URR', 'DUU', 'DUR'],
        ['DUL', 'DDD', 'DDR', 'DDL', 'DLU', 'DLL'],
        ['DRU', 'DRD', 'DRR']
    ];
    const desktopSchedules = [
        [[1,2,3],[1,2,3],[1,2,3],[1,2,3],[1,2,4],[2,3,5]],
        [[1,2,3],[1,3,4],[1,2,3],[1,2,3],[1,2,4],[1,2,3]],
        [[1,2,3],[1,2,4],[1,2,3]],
        [[1,2,3],[1,2,3],[1,2,3],[1,2,4],[1,2,3],[1,2,3]],
        [[1,2,3],[2,3,4],[1,2,3]]
    ];
    const mobileSchedules = [
        [[1,2,3],[1,2,3],[1,2,4],[1,2,4],[1,2,3],[2,3,4]],
        [[1,2,3],[1,3,4],[1,2,3],[1,2,4],[1,2,3],[1,2,3]],
        [[1,2,3],[1,2,3],[1,2,3]],
        [[1,2,3],[1,2,4],[1,2,3],[1,2,3],[1,2,3],[1,2,3]],
        [[1,2,3],[1,2,3],[1,3,4]]
    ];

    const getFramesFromMoves = (moves) => {
        const vectors = [...moves].map(move => directionVectors[move]);
        const start = vectors.reduce((position, [x, y]) => [position[0] - x, position[1] - y], [0, 0]);
        const offsets = [start];
        vectors.forEach(([x, y]) => {
            const previous = offsets[offsets.length - 1];
            offsets.push([previous[0] + x, previous[1] + y]);
        });
        return offsets.map(([x, y]) => [offsetToCss(x), offsetToCss(y)]);
    };

    const getScheduledTimeline = (frames, moveTicks) => {
        return Array.from({ length: 6 }, (_, tick) => {
            const completedMoves = moveTicks.filter(moveTick => moveTick <= tick).length;
            return frames[completedMoves];
        });
    };

    skillsData.forEach((group, groupIndex) => {
        const category = document.createElement('section');
        category.className = 'skill-category section-reveal';

        const toolsHtml = group.tools.map((tool, toolIndex) => {
            const desktopFrames = getFramesFromMoves(desktopPuzzles[groupIndex][toolIndex]);
            const mobileFrames = getFramesFromMoves(mobilePuzzles[groupIndex][toolIndex]);
            const desktopTimeline = getScheduledTimeline(desktopFrames, desktopSchedules[groupIndex][toolIndex]);
            const mobileTimeline = getScheduledTimeline(mobileFrames, mobileSchedules[groupIndex][toolIndex]);
            const iconHtml = tool.icon
                ? `<i class="${tool.icon} ${tool.tone ? `tool-tone-${tool.tone}` : ''}" aria-hidden="true"></i>`
                : `<span class="tool-letter tool-tone-${tool.tone}">${tool.fallback}</span>`;
            const desktopStyle = desktopTimeline.map((frame, frameIndex) => `--d${frameIndex}x:${frame[0]};--d${frameIndex}y:${frame[1]}`).join(';');
            const mobileStyle = mobileTimeline.map((frame, frameIndex) => `--m${frameIndex}x:${frame[0]};--m${frameIndex}y:${frame[1]}`).join(';');
            const animationDelay = '--puzzle-delay:250ms';

            return `<article class="skill-tile" style="${desktopStyle};${mobileStyle};${animationDelay}" tabindex="0" aria-label="${tool.name} skill">
                <span class="skill-tile-icon">${iconHtml}</span>
                <span class="skill-tile-name">${tool.name}</span>
            </article>`;
        }).join('');

        category.innerHTML = `
            <header class="skill-category-header">
                <span class="skill-category-symbol"><i class="fa-solid ${group.icon}" aria-hidden="true"></i></span>
                <div><h3>${group.category}</h3></div>
            </header>
            <div class="skill-tool-grid">${toolsHtml}</div>
        `;
        skillsContainer.appendChild(category);
    });
    // Keep the static Rust Guard stage in the open sixth grid cell.
    skillsContainer.appendChild(skillsContainer.querySelector('[data-rust-guard]'));

    // --- 3. Render Projects Dynamically (Alternating Layout) ---
    const projectsContainer = document.getElementById('projects-container');
    projectsData.forEach((project, index) => {
        const isEven = index % 2 === 0;
        const projectElement = document.createElement('div');
        const projectNumber = String(index + 1).padStart(2, '0');
        projectElement.className = `project-showcase section-reveal ${isEven ? '' : 'project-showcase-reverse'}`;
        if (project.title === 'Neon Outpost') projectElement.setAttribute('data-neon-project', '');
        
        // Generate Tech Badges
        const techBadges = project.tech.map(t => `<span class="project-tech-badge">${t}</span>`).join('');
        
        // Generate image carousel
        const carouselId = `carousel-${index}`;
        let imagesHtml = project.images.map((img, i) => `
            <div class="carousel-slide ${i === 0 ? 'active' : ''}" data-carousel="${carouselId}" data-index="${i}">
                <img src="${img}" alt="${project.title}" class="w-full h-full object-contain" onerror="this.parentElement.innerHTML='<div class=flex items-center justify-center h-full><i class=\\'fa-solid fa-image text-5xl text-slate-400\\'></i><span class=ml-2 text-slate-400>Image unavailable</span></div>'">
            </div>
        `).join('');

        // Navigation dots
        let dotsHtml = project.images.map((_, i) => `
            <button class="carousel-dot ${i === 0 ? 'is-active' : ''}" data-carousel="${carouselId}" data-index="${i}" aria-label="Show image ${i + 1}"></button>
        `).join('');

        const videoPreviewHtml = project.video ? `
            <video class="project-hover-video" muted loop playsinline preload="metadata" aria-label="${project.title} gameplay preview">
                <source src="${project.video}" type="video/mp4">
            </video>
        ` : '';

        const projectActionHtml = project.playUrl ? `
            <a class="project-play-link" href="${project.playUrl}" target="_blank" rel="noopener noreferrer" ${project.title === 'Neon Outpost' ? 'data-neon-play-link' : ''} aria-label="${project.playLabel || 'Open project'} in a new tab">
                <span><i class="fa-solid fa-gamepad"></i> ${project.playLabel || 'OPEN PROJECT'}</span>
                <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i>
            </a>
        ` : '';

        const githubActionHtml = project.githubUrl ? `
            <a class="project-github-link" href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" aria-label="View ${project.title} GitHub link in a new tab">
                <i class="fa-brands fa-github" aria-hidden="true"></i>
                <span>VIEW ON GITHUB</span>
                <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i>
            </a>
        ` : '';

        const projectActionsHtml = projectActionHtml || githubActionHtml ? `
            <div class="project-actions">
                ${githubActionHtml}
                ${projectActionHtml}
            </div>
        ` : '';

        // Project media is landscape by default; a future project can opt into portrait mode.
        const isPortraitProject = project.layout === "portrait";
        const aspectClass = isPortraitProject ? 'aspect-[3/5] max-w-xs mx-auto' : 'aspect-video';
        
        const pixelCastHtml = project.title === 'Detention Break Out Mobile & Website Game' ? `
            <div class="project-pixel-cast" data-pixel-cast tabindex="0" aria-label="Hover or focus to animate two pixel characters walking">
                <span class="project-pixel-cast-hint" aria-hidden="true">HOVER TO WALK</span>
                <canvas class="project-pixel-actor" data-pixel-actor="one" width="190" height="260" aria-hidden="true"></canvas>
                <canvas class="project-pixel-actor" data-pixel-actor="two" width="180" height="240" aria-hidden="true"></canvas>
            </div>
        ` : '';

        const imageCol = `
            <div class="project-visual-wrap ${!isEven ? 'lg:order-2' : ''}">
                ${pixelCastHtml}
                <div class="project-visual group">
                    <div class="project-window-bar">
                        <span class="project-window-dots"><i></i><i></i><i></i></span>
                        <span class="project-window-label">case-study/${projectNumber}</span>
                        <span class="project-window-live"><i></i> ${project.video ? 'Video preview' : 'Live preview'}</span>
                    </div>
                    <div id="${carouselId}" class="project-carousel w-full ${aspectClass} relative flex items-center justify-center">
                        ${imagesHtml}
                        ${videoPreviewHtml}
                    </div>
                    <button class="carousel-prev project-carousel-arrow project-carousel-prev" data-carousel="${carouselId}" aria-label="Previous project image">
                        <i class="fa-solid fa-arrow-left"></i>
                    </button>
                    <button class="carousel-next project-carousel-arrow project-carousel-next" data-carousel="${carouselId}" aria-label="Next project image">
                        <i class="fa-solid fa-arrow-right"></i>
                    </button>
                    <div class="project-carousel-dots">
                        ${dotsHtml}
                    </div>
                </div>
                <span class="project-visual-index">${projectNumber}</span>
            </div>
        `;

        const contentCol = `
            <div class="project-copy ${!isEven ? 'lg:order-1' : ''}">
                <div class="project-meta">
                    <span class="project-type">${project.type}</span>
                    <span class="project-date"><i class="fa-regular fa-calendar"></i>${project.date}</span>
                </div>

                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>

                <div class="project-tech-list">
                    ${techBadges}
                </div>

                ${projectActionsHtml}

                <div class="project-card-footer">
                    <span><i class="fa-solid fa-code"></i> Designed &amp; developed</span>
                    <span>${projectNumber} / ${String(projectsData.length).padStart(2, '0')}</span>
                </div>
            </div>
        `;

        projectElement.innerHTML = imageCol + contentCol;
        projectsContainer.appendChild(projectElement);
    });

    // --- Additional Projects Modal ---
    const moreProjectsModal = document.getElementById('more-projects-modal');
    const moreProjectsGrid = document.getElementById('more-projects-grid');
    const openMoreProjectsButton = document.getElementById('open-more-projects');
    const closeMoreProjectsButton = document.getElementById('close-more-projects');
    let modalTrigger = null;
    let additionalCarouselTimer = null;

    if (moreProjectsGrid && Array.isArray(additionalProjectsData)) {
        moreProjectsGrid.innerHTML = additionalProjectsData.map((project, projectIndex) => {
            const badges = project.tech.map((technology) => `<span>${technology}</span>`).join('');
            const carouselId = `additional-carousel-${projectIndex}`;
            const slides = project.images.map((image, imageIndex) => `
                <div class="additional-carousel-slide ${imageIndex === 0 ? 'is-active' : ''}" data-additional-carousel="${carouselId}" data-index="${imageIndex}">
                    <img src="${image}" alt="${project.title} interface screenshot ${imageIndex + 1}">
                </div>
            `).join('');
            const dots = project.images.map((_, imageIndex) => `
                <button class="additional-carousel-dot ${imageIndex === 0 ? 'is-active' : ''}" type="button" data-additional-carousel="${carouselId}" data-index="${imageIndex}" aria-label="Show ${project.title} image ${imageIndex + 1}"></button>
            `).join('');

            return `
                <article class="additional-project-card">
                    <div id="${carouselId}" class="additional-project-image" data-current="0">
                        ${slides}
                        <button class="additional-carousel-arrow additional-carousel-prev" type="button" data-additional-carousel="${carouselId}" aria-label="Previous ${project.title} image">
                            <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
                        </button>
                        <button class="additional-carousel-arrow additional-carousel-next" type="button" data-additional-carousel="${carouselId}" aria-label="Next ${project.title} image">
                            <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
                        </button>
                        <div class="additional-carousel-dots">${dots}</div>
                    </div>
                    <div class="additional-project-content">
                        <p class="additional-project-type">${project.type}</p>
                        <h3>${project.title}</h3>
                        <p class="additional-project-description">${project.description}</p>
                        <div class="additional-project-tech" aria-label="Technologies used">${badges}</div>
                        <a class="additional-project-github" href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" aria-label="View ${project.title} on GitHub in a new tab">
                            <i class="fa-brands fa-github" aria-hidden="true"></i>
                            <span>View on GitHub</span>
                            <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i>
                        </a>
                    </div>
                </article>
            `;
        }).join('');
    }

    function showAdditionalSlide(carouselId, targetIndex) {
        const carousel = document.getElementById(carouselId);
        const slides = document.querySelectorAll(`.additional-carousel-slide[data-additional-carousel="${carouselId}"]`);
        const dots = document.querySelectorAll(`.additional-carousel-dot[data-additional-carousel="${carouselId}"]`);
        if (!carousel || !slides.length) return;

        const normalizedIndex = (targetIndex + slides.length) % slides.length;
        slides.forEach((slide, index) => slide.classList.toggle('is-active', index === normalizedIndex));
        dots.forEach((dot, index) => dot.classList.toggle('is-active', index === normalizedIndex));
        carousel.dataset.current = normalizedIndex;
    }

    function stopAdditionalCarouselAutoplay() {
        if (!additionalCarouselTimer) return;
        clearInterval(additionalCarouselTimer);
        additionalCarouselTimer = null;
    }

    function startAdditionalCarouselAutoplay() {
        stopAdditionalCarouselAutoplay();
        additionalCarouselTimer = setInterval(() => {
            moreProjectsGrid?.querySelectorAll('.additional-project-image').forEach((carousel) => {
                const currentIndex = Number(carousel.dataset.current || 0);
                showAdditionalSlide(carousel.id, currentIndex + 1);
            });
        }, 3500);
    }

    moreProjectsGrid?.querySelectorAll('.additional-carousel-prev').forEach((button) => {
        button.addEventListener('click', () => {
            const carouselId = button.dataset.additionalCarousel;
            const carousel = document.getElementById(carouselId);
            showAdditionalSlide(carouselId, Number(carousel?.dataset.current || 0) - 1);
            startAdditionalCarouselAutoplay();
        });
    });

    moreProjectsGrid?.querySelectorAll('.additional-carousel-next').forEach((button) => {
        button.addEventListener('click', () => {
            const carouselId = button.dataset.additionalCarousel;
            const carousel = document.getElementById(carouselId);
            showAdditionalSlide(carouselId, Number(carousel?.dataset.current || 0) + 1);
            startAdditionalCarouselAutoplay();
        });
    });

    moreProjectsGrid?.querySelectorAll('.additional-carousel-dot').forEach((dot) => {
        dot.addEventListener('click', () => {
            showAdditionalSlide(dot.dataset.additionalCarousel, Number(dot.dataset.index));
            startAdditionalCarouselAutoplay();
        });
    });

    function openMoreProjectsModal() {
        if (!moreProjectsModal) return;
        modalTrigger = document.activeElement;
        moreProjectsModal.classList.remove('hidden');
        document.documentElement.classList.add('modal-open');
        document.body.classList.add('modal-open');
        startAdditionalCarouselAutoplay();
        closeMoreProjectsButton?.focus();
    }

    function closeMoreProjectsModal() {
        if (!moreProjectsModal) return;
        moreProjectsModal.classList.add('hidden');
        document.documentElement.classList.remove('modal-open');
        document.body.classList.remove('modal-open');
        stopAdditionalCarouselAutoplay();
        modalTrigger?.focus();
    }

    openMoreProjectsButton?.addEventListener('click', openMoreProjectsModal);
    closeMoreProjectsButton?.addEventListener('click', closeMoreProjectsModal);
    moreProjectsModal?.addEventListener('click', (event) => {
        if (event.target === moreProjectsModal) closeMoreProjectsModal();
    });
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && moreProjectsModal && !moreProjectsModal.classList.contains('hidden')) {
            closeMoreProjectsModal();
        }
    });

    // --- Carousel Navigation with Auto-Play ---
    function goToSlide(carouselId, targetIndex) {
        const slides = document.querySelectorAll(`.carousel-slide[data-carousel="${carouselId}"]`);
        const dots = document.querySelectorAll(`.carousel-dot[data-carousel="${carouselId}"]`);
        slides.forEach(s => s.classList.remove('active'));
        slides[targetIndex].classList.add('active');
        dots.forEach((d, i) => {
            d.className = `carousel-dot ${i === targetIndex ? 'is-active' : ''}`;
        });
        // Update data attribute for auto-play
        document.getElementById(carouselId).dataset.current = targetIndex;
    }

    function nextSlide(carouselId) {
        const slides = document.querySelectorAll(`.carousel-slide[data-carousel="${carouselId}"]`);
        const current = parseInt(document.getElementById(carouselId).dataset.current || 0);
        const next = (current + 1) % slides.length;
        goToSlide(carouselId, next);
    }

    function prevSlide(carouselId) {
        const slides = document.querySelectorAll(`.carousel-slide[data-carousel="${carouselId}"]`);
        const current = parseInt(document.getElementById(carouselId).dataset.current || 0);
        const prev = (current - 1 + slides.length) % slides.length;
        goToSlide(carouselId, prev);
    }

    // Keep exactly one predictable timer per carousel.
    const CAROUSEL_DELAY = 3000;
    const carouselTimers = {};

    function stopCarouselTimer(carouselId) {
        clearTimeout(carouselTimers[carouselId]);
        delete carouselTimers[carouselId];
    }

    function scheduleCarousel(carouselId) {
        stopCarouselTimer(carouselId);

        carouselTimers[carouselId] = setTimeout(() => {
            nextSlide(carouselId);
            scheduleCarousel(carouselId);
        }, CAROUSEL_DELAY);
    }

    // Initialize and start auto-play for all carousels.
    document.querySelectorAll('[id^="carousel-"]').forEach(container => {
        container.dataset.current = 0;
        const carouselId = container.id;
        scheduleCarousel(carouselId);
    });

    // Previous button
    document.querySelectorAll('.carousel-prev').forEach(btn => {
        btn.addEventListener('click', () => {
            const carouselId = btn.dataset.carousel;
            prevSlide(carouselId);
            scheduleCarousel(carouselId);
        });
    });

    // Next button
    document.querySelectorAll('.carousel-next').forEach(btn => {
        btn.addEventListener('click', () => {
            const carouselId = btn.dataset.carousel;
            nextSlide(carouselId);
            scheduleCarousel(carouselId);
        });
    });

    // Dot navigation
    document.querySelectorAll('.carousel-dot').forEach(dot => {
        dot.addEventListener('click', () => {
            const carouselId = dot.dataset.carousel;
            const targetIndex = parseInt(dot.dataset.index);
            goToSlide(carouselId, targetIndex);
            scheduleCarousel(carouselId);
        });
    });

    // Pause auto-play on hover
    document.querySelectorAll('[id^="carousel-"]').forEach(container => {
        const carouselShell = container.closest('.project-visual');
        if (!carouselShell) return;
        const hoverVideo = container.querySelector('.project-hover-video');
        let previewRequested = false;

        carouselShell.addEventListener('mouseenter', () => {
            if (hoverVideo) {
                previewRequested = true;
                hoverVideo.play().then(() => {
                    if (previewRequested) container.classList.add('is-video-playing');
                }).catch(() => {
                    container.classList.remove('is-video-playing');
                });
            }
        });
        carouselShell.addEventListener('mouseleave', () => {
            previewRequested = false;
            if (hoverVideo) {
                container.classList.remove('is-video-playing');
                hoverVideo.pause();
                hoverVideo.currentTime = 0;
            }
        });
    });

    // --- 4. Navbar Scroll Effect ---
    const navbar = document.getElementById('navbar');
    const scrollProgressBar = document.getElementById('scroll-progress-bar');
    let scrollFrameRequested = false;

    function updateScrollProgress() {
        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollableHeight > 0
            ? Math.min(1, Math.max(0, window.scrollY / scrollableHeight))
            : 0;

        if (scrollProgressBar) {
            scrollProgressBar.style.transform = `scaleX(${progress})`;
        }
        scrollFrameRequested = false;
    }

    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.classList.add('bg-white/80', 'dark:bg-surface-dark/80', 'backdrop-blur-lg', 'shadow-sm', 'border-slate-200', 'dark:border-slate-800');
            navbar.classList.remove('py-5', 'border-transparent');
            navbar.classList.add('py-3');
        } else {
            navbar.classList.remove('bg-white/80', 'dark:bg-surface-dark/80', 'backdrop-blur-lg', 'shadow-sm', 'border-slate-200', 'dark:border-slate-800');
            navbar.classList.add('py-5', 'border-transparent');
            navbar.classList.remove('py-3');
        }

        if (!scrollFrameRequested) {
            scrollFrameRequested = true;
            requestAnimationFrame(updateScrollProgress);
        }
    });
    window.addEventListener('resize', updateScrollProgress, { passive: true });
    updateScrollProgress();

    // --- 5. Typewriter Effect ---
    const words = ["Web Development.", "Game Development.", "System Architecture.", "UI/UX Design."];
    let i = 0;
    let timer;

    function typingEffect() {
        let word = words[i].split("");
        var loopTyping = function() {
            if (word.length > 0) {
                document.getElementById('typewriter').innerHTML += word.shift();
            } else {
                setTimeout(deletingEffect, 2000);
                return false;
            }
            timer = setTimeout(loopTyping, 100);
        };
        loopTyping();
    }

    function deletingEffect() {
        let word = words[i].split("");
        var loopDeleting = function() {
            if (word.length > 0) {
                word.pop();
                document.getElementById('typewriter').innerHTML = word.join("");
            } else {
                if (words.length > (i + 1)) {
                    i++;
                } else {
                    i = 0;
                }
                typingEffect();
                return false;
            }
            timer = setTimeout(loopDeleting, 50);
        };
        loopDeleting();
    }
    setTimeout(typingEffect, 1000); // Start after 1 second

    // --- Contact Form Submission (EmailJS) ---
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = document.getElementById('btn-text');

    // Initialize EmailJS with your Public Key when the CDN is available.
    // A temporary network failure must not stop the rest of the portfolio.
    if (window.emailjs) {
        window.emailjs.init('FV0_W5XoBs6UAetV4');
    }

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Disable button and show loading
            submitBtn.disabled = true;
            btnText.textContent = 'Sending...';
            submitBtn.classList.add('opacity-75', 'cursor-not-allowed');
            
            const formData = {
                from_name: contactForm.from_name.value,
                from_email: contactForm.from_email.value,
                subject: contactForm.subject.value,
                message: contactForm.message.value
            };
            
            try {
                if (!window.emailjs) throw new Error('Email service is unavailable');

                const result = await window.emailjs.send(
                    'service_44qhtyf',    // Service ID
                    'template_pyxws4z',   // Template ID
                    formData
                );
                
                if (result.status === 200) {
                    // Hide form, show success
                    contactForm.classList.add('hidden');
                    formSuccess.classList.remove('hidden');
                } else {
                    throw new Error('Failed to send message');
                }
            } catch (error) {
                // Re-enable button
                submitBtn.disabled = false;
                btnText.textContent = 'Send Message';
                submitBtn.classList.remove('opacity-75', 'cursor-not-allowed');
                alert('Oops! Something went wrong. Please try again.');
            }
        });
    }

    // Tilt each tech icon toward the pointer without interrupting its crawler-synced float.
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        document.querySelectorAll(".profile-tech-icon").forEach((icon) => {
            const updateTilt = (event) => {
                if (event.pointerType === "touch") return;
                const rect = icon.getBoundingClientRect();
                const x = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width - 0.5) * 2));
                const y = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height - 0.5) * 2));
                icon.style.transform = `perspective(450px) rotateX(${-y * 14}deg) rotateY(${x * 14}deg) scale(1.1)`;
            };
            const resetTilt = () => { icon.style.transform = ""; };
            icon.addEventListener("pointerenter", updateTilt, { passive: true });
            icon.addEventListener("pointermove", updateTilt, { passive: true });
            icon.addEventListener("pointerleave", resetTilt);
            icon.addEventListener("pointercancel", resetTilt);
        });
    }

    // --- 6. Scroll Reveal Observer ---
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section-reveal').forEach((section) => {
        observer.observe(section);
    });

    // --- 7. Hero Staggered Load ---
    setTimeout(() => {
        document.querySelectorAll('.stagger-element').forEach((el, index) => {
            setTimeout(() => {
                el.style.transition = 'all 0.8s cubic-bezier(0.5, 0, 0, 1)';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }, 100);
});
