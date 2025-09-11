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



// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    // Prevent Flash of Unstyled Content (FOUC)
    document.documentElement.classList.add('loaded');
    
    // Add fade-in class to elements that should animate
    const animateElements = document.querySelectorAll('.concept-item, .service-card, .testimonial-card, .gallery-item, .process-step');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });
});

// Gallery image hover effects
document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px)';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Contact form handling
document.querySelector('.contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);
    
    // Simple validation
    if (!data.name || !data.email || !data.message) {
        alert('必須項目をすべて入力してください。');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        alert('正しいメールアドレスを入力してください。');
        return;
    }
    
    // Show success message (in a real application, you would send this to a server)
    const submitButton = this.querySelector('.submit-button');
    const originalText = submitButton.textContent;
    
    submitButton.textContent = '送信中...';
    submitButton.disabled = true;
    
    setTimeout(() => {
        submitButton.textContent = '送信完了';
        submitButton.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
        
        setTimeout(() => {
            alert('お問い合わせありがとうございます。\n2営業日以内にご返信いたします。');
            this.reset();
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            submitButton.style.background = 'linear-gradient(135deg, #d4a574, #e8c5a0)';
        }, 1500);
    }, 2000);
});

// Hero image slideshow - furniture gradually appearing
let currentImageIndex = 0;
const heroImages = [
    'hero-img-1', // 空の部屋
    'hero-img-2', // ソファがある部屋
    'hero-img-3', // 完成したリビング
    'hero-img-4'  // 美しいインテリア
];

function switchHeroImage() {
    // 現在の画像をフェードアウト
    const currentImg = document.getElementById(heroImages[currentImageIndex]);
    if (currentImg) {
        currentImg.classList.remove('active');
        currentImg.classList.add('fade-out');
    }
    
    // 次の画像のインデックスを計算
    currentImageIndex = (currentImageIndex + 1) % heroImages.length;
    
    // 次の画像をフェードイン
    setTimeout(() => {
        const nextImg = document.getElementById(heroImages[currentImageIndex]);
        if (nextImg) {
            // 前の画像のクラスをリセット
            heroImages.forEach(imgId => {
                const img = document.getElementById(imgId);
                if (img) {
                    img.classList.remove('active', 'fade-out');
                }
            });
            
            // 新しい画像をアクティブに
            nextImg.classList.add('active');
        }
    }, 1000); // 1秒後に次の画像を表示
}

// 5秒ごとに画像を切り替え
setInterval(switchHeroImage, 5000);

// 初期化時に最初の画像を表示
document.addEventListener('DOMContentLoaded', function() {
    const firstImg = document.getElementById(heroImages[0]);
    if (firstImg) {
        firstImg.classList.add('active');
    }
});

// Scroll event for other effects
window.addEventListener('scroll', function() {
    // Navigation background effect remains the same
    const nav = document.querySelector('.nav');
    if (window.scrollY > 100) {
        nav.style.background = 'rgba(255, 255, 255, 0.98)';
        nav.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        nav.style.background = 'rgba(255, 255, 255, 0.95)';
        nav.style.boxShadow = 'none';
    }
});

// Add loading animation
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Mobile menu toggle (if needed for smaller screens)
function createMobileMenu() {
    const nav = document.querySelector('.nav-container');
    const menu = document.querySelector('.nav-menu');
    
    if (window.innerWidth <= 768) {
        if (!document.querySelector('.mobile-menu-toggle')) {
            const toggle = document.createElement('button');
            toggle.className = 'mobile-menu-toggle';
            toggle.innerHTML = '☰';
            toggle.style.cssText = `
                background: none;
                border: none;
                font-size: 1.5rem;
                color: #666;
                cursor: pointer;
                display: block;
            `;
            
            toggle.addEventListener('click', function() {
                menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
                menu.style.flexDirection = 'column';
                menu.style.position = 'absolute';
                menu.style.top = '100%';
                menu.style.left = '0';
                menu.style.right = '0';
                menu.style.background = 'white';
                menu.style.padding = '20px';
                menu.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
            });
            
            nav.appendChild(toggle);
        }
    }
}

// Initialize mobile menu on resize
window.addEventListener('resize', createMobileMenu);
createMobileMenu();

// ===== MOBILE OPTIMIZATION FEATURES =====

// Touch event optimization
class TouchOptimizer {
    constructor() {
        this.initTouchEvents();
        this.initPerformanceOptimization();
        this.initAccessibilityFeatures();
    }
    
    initTouchEvents() {
        // Add touch feedback for interactive elements
        const touchElements = document.querySelectorAll('.cta-button, .submit-button, .corporate-button, .gallery-item, .service-card');
        
        touchElements.forEach(element => {
            // Touch start - add pressed state
            element.addEventListener('touchstart', (e) => {
                element.style.transform = 'scale(0.98)';
                element.style.transition = 'transform 0.1s ease';
            }, { passive: true });
            
            // Touch end - remove pressed state
            element.addEventListener('touchend', (e) => {
                setTimeout(() => {
                    element.style.transform = '';
                }, 100);
            }, { passive: true });
            
            // Touch cancel - remove pressed state
            element.addEventListener('touchcancel', (e) => {
                element.style.transform = '';
            }, { passive: true });
        });
        
        // Improve gallery touch interaction
        const galleryItems = document.querySelectorAll('.gallery-item');
        galleryItems.forEach(item => {
            let touchStartY = 0;
            let touchStartX = 0;
            
            item.addEventListener('touchstart', (e) => {
                touchStartY = e.touches[0].clientY;
                touchStartX = e.touches[0].clientX;
            }, { passive: true });
            
            item.addEventListener('touchmove', (e) => {
                const touchY = e.touches[0].clientY;
                const touchX = e.touches[0].clientX;
                const diffY = Math.abs(touchY - touchStartY);
                const diffX = Math.abs(touchX - touchStartX);
                
                // If significant movement, don't trigger hover effect
                if (diffY > 10 || diffX > 10) {
                    item.style.transform = 'translateY(0)';
                }
            }, { passive: true });
        });
    }
    
    initPerformanceOptimization() {
        // Lazy loading for images
        const images = document.querySelectorAll('img');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px'
        });
        
        images.forEach(img => {
            if (img.src && !img.dataset.src) {
                // For existing images, add lazy loading for future optimization
                imageObserver.observe(img);
            }
        });
        
        // Optimize scroll performance
        let ticking = false;
        const optimizedScrollHandler = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    // Navigation background effect
                    const nav = document.querySelector('.nav');
                    if (window.scrollY > 100) {
                        nav.style.background = 'rgba(255, 255, 255, 0.98)';
                        nav.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
                    } else {
                        nav.style.background = 'rgba(255, 255, 255, 0.95)';
                        nav.style.boxShadow = 'none';
                    }
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        // Replace the existing scroll listener with optimized version
        window.removeEventListener('scroll', window.scrollHandler);
        window.addEventListener('scroll', optimizedScrollHandler, { passive: true });
        
        // Optimize animations for mobile
        if (window.innerWidth <= 768) {
            // Reduce animation complexity on mobile
            const style = document.createElement('style');
            style.textContent = `
                .hero-bg-img {
                    transform: none !important;
                    animation: none !important;
                }
                .fade-in, .fade-in-delay, .fade-in-delay-2 {
                    animation-duration: 0.3s !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    initAccessibilityFeatures() {
        // Keyboard navigation support
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });
        
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
        
        // Add focus indicators for keyboard navigation
        const style = document.createElement('style');
        style.textContent = `
            .keyboard-navigation *:focus {
                outline: 2px solid #d4a574 !important;
                outline-offset: 2px !important;
            }
            
            .keyboard-navigation .nav-menu a:focus {
                background: rgba(212, 165, 116, 0.1);
                border-radius: 4px;
            }
        `;
        document.head.appendChild(style);
        
        // Screen reader support
        const srOnlyStyle = document.createElement('style');
        srOnlyStyle.textContent = `
            .sr-only {
                position: absolute !important;
                width: 1px !important;
                height: 1px !important;
                padding: 0 !important;
                margin: -1px !important;
                overflow: hidden !important;
                clip: rect(0, 0, 0, 0) !important;
                white-space: nowrap !important;
                border: 0 !important;
            }
        `;
        document.head.appendChild(srOnlyStyle);
        
        // Add skip link for screen readers
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'メインコンテンツへスキップ';
        skipLink.className = 'sr-only';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: #000;
            color: #fff;
            padding: 8px;
            text-decoration: none;
            z-index: 9999;
            transition: top 0.2s ease;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        // Add main content landmark
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            heroSection.id = 'main-content';
            heroSection.setAttribute('role', 'main');
        }
    }
}

// Device detection and optimization
class DeviceOptimizer {
    constructor() {
        this.detectDevice();
        this.optimizeForDevice();
    }
    
    detectDevice() {
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        this.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        this.isAndroid = /Android/.test(navigator.userAgent);
        this.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        // Add device classes to body
        document.body.classList.add(
            this.isMobile ? 'mobile-device' : 'desktop-device',
            this.isIOS ? 'ios-device' : '',
            this.isAndroid ? 'android-device' : '',
            this.isTouchDevice ? 'touch-device' : 'no-touch-device'
        );
    }
    
    optimizeForDevice() {
        if (this.isMobile) {
            // Mobile-specific optimizations
            this.optimizeForMobile();
        }
        
        if (this.isIOS) {
            // iOS-specific optimizations
            this.optimizeForIOS();
        }
        
        if (this.isAndroid) {
            // Android-specific optimizations
            this.optimizeForAndroid();
        }
    }
    
    optimizeForMobile() {
        // Disable hover effects on mobile
        const style = document.createElement('style');
        style.textContent = `
            @media (hover: none) and (pointer: coarse) {
                .gallery-item:hover,
                .service-card:hover,
                .testimonial-card:hover {
                    transform: none !important;
                }
            }
        `;
        document.head.appendChild(style);
        
        // Optimize form inputs for mobile
        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            if (input.type === 'email') {
                input.setAttribute('inputmode', 'email');
            }
            if (input.type === 'tel') {
                input.setAttribute('inputmode', 'tel');
            }
        });
    }
    
    optimizeForIOS() {
        // iOS Safari specific fixes
        const style = document.createElement('style');
        style.textContent = `
            .ios-device body {
                -webkit-overflow-scrolling: touch;
            }
            
            .ios-device .hero {
                min-height: -webkit-fill-available;
            }
        `;
        document.head.appendChild(style);
        
        // Fix iOS viewport height issue
        const setVH = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };
        
        setVH();
        window.addEventListener('resize', setVH);
        window.addEventListener('orientationchange', () => {
            setTimeout(setVH, 100);
        });
    }
    
    optimizeForAndroid() {
        // Android specific optimizations
        const style = document.createElement('style');
        style.textContent = `
            .android-device input,
            .android-device textarea,
            .android-device select {
                font-size: 16px !important;
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize optimizations when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new TouchOptimizer();
    new DeviceOptimizer();
    
    // Add reduced motion support
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.body.classList.add('reduced-motion');
    }
    
    // Connection-aware loading
    if ('connection' in navigator) {
        const connection = navigator.connection;
        if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
            document.body.classList.add('slow-connection');
            // Disable non-essential animations
            const style = document.createElement('style');
            style.textContent = `
                .slow-connection * {
                    animation: none !important;
                    transition: none !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
});

// Performance monitoring
if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (entry.entryType === 'largest-contentful-paint') {
                console.log('LCP:', entry.startTime);
            }
            if (entry.entryType === 'first-input') {
                console.log('FID:', entry.processingStart - entry.startTime);
            }
        }
    });
    
    observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input'] });
}
