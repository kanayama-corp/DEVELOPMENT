// DOM要素を取得
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-menu a');
const faqItems = document.querySelectorAll('.faq-item');

// ヒーローセクション要素を取得
const heroSection = document.querySelector('.hero');

// ナビゲーションバーのスクロール効果
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ハンバーガーメニューの切り替え
if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ナビゲーションリンクのクリック処理
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        
        // ハッシュリンクの場合はスムーススクロール
        if (href.startsWith('#')) {
            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // ナビゲーションバーの高さを考慮してスクロール
                const navbarHeight = navbar.offsetHeight;
                const elementPosition = targetElement.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: elementPosition,
                    behavior: 'smooth'
                });
            }
            
            // モバイルメニューを閉じる
            if (navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                const spans = hamburger.querySelectorAll('span');
                spans.forEach(span => span.classList.remove('active'));
            }
        }
    });
});

// FAQアコーディオン機能
faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // 他のFAQアイテムを閉じる
        faqItems.forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('active');
            }
        });
        
        // クリックされたアイテムの開閉を切り替え
        if (isActive) {
            item.classList.remove('active');
        } else {
            item.classList.add('active');
        }
    });
});

// スムーススクロール（全体のリンクに対応）
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            const navbarHeight = navbar ? navbar.offsetHeight : 0;
            const elementPosition = targetElement.offsetTop - navbarHeight - 20;
            
            window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
            });
        }
    });
});

// アクティブなナビゲーションリンクのハイライト
const sections = document.querySelectorAll('section[id]');

const highlightNavigation = () => {
    const scrollPos = window.scrollY + 200;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            // 現在のアクティブリンクを削除
            navLinks.forEach(link => link.classList.remove('active'));
            
            // 対応するナビゲーションリンクをアクティブにする
            const activeLink = document.querySelector(`.nav-menu a[href="#${sectionId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });
};

window.addEventListener('scroll', highlightNavigation);

// 料金カードのホバー効果の強化
const pricingCards = document.querySelectorAll('.pricing-card');
pricingCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-15px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        if (card.classList.contains('featured')) {
            card.style.transform = 'scale(1.05)';
        } else {
            card.style.transform = 'translateY(0) scale(1)';
        }
    });
});

// レビューカードの視差効果
const reviewCards = document.querySelectorAll('.review-card');
const handleScroll = () => {
    reviewCards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const inView = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (inView) {
            const scrollProgress = (window.innerHeight - rect.top) / window.innerHeight;
            const translateY = (scrollProgress - 0.5) * 20;
            card.style.transform = `translateY(${translateY}px)`;
        }
    });
};

window.addEventListener('scroll', handleScroll);

// フォームの入力検証（将来的に予約フォームを追加した場合）
const validateForm = (form) => {
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('error');
            isValid = false;
        } else {
            input.classList.remove('error');
        }
    });
    
    return isValid;
};

// 電話番号のフォーマット
const formatPhoneNumber = (input) => {
    let value = input.value.replace(/\D/g, '');
    if (value.length >= 3 && value.length <= 6) {
        value = value.replace(/^(\d{3})(\d+)/, '$1-$2');
    } else if (value.length >= 7) {
        value = value.replace(/^(\d{3})(\d{4})(\d+)/, '$1-$2-$3');
    }
    input.value = value;
};

// メールアドレスの検証
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// スクロールインジケーターのクリック処理
const scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
        const featuresSection = document.getElementById('features');
        if (featuresSection) {
            const navbarHeight = navbar ? navbar.offsetHeight : 0;
            const elementPosition = featuresSection.offsetTop - navbarHeight;
            
            window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
            });
        }
    });
}

// 画像の遅延読み込み
const observerOptions = {
    threshold: 0.1,
    rootMargin: '50px'
};

const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        }
    });
}, observerOptions);

// data-srcを持つ画像を監視
document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
});

// ページロード時のアニメーション
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // ヒーローセクションの追加アニメーション
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        setTimeout(() => {
            heroContent.classList.add('animate');
        }, 500);
    }
});

// リサイズ時の処理
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // アニメーションの再計算
        highlightNavigation();
    }, 250);
});

// タッチデバイスでのホバー効果の調整
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

if (isTouchDevice) {
    document.body.classList.add('touch-device');
    
    // タッチデバイスでのカードタップ処理
    const cards = document.querySelectorAll('.feature-card, .pricing-card, .review-card');
    cards.forEach(card => {
        card.addEventListener('touchstart', () => {
            card.classList.add('touched');
        });
        
        card.addEventListener('touchend', () => {
            setTimeout(() => {
                card.classList.remove('touched');
            }, 300);
        });
    });
}

// 予約ボタンのクリック処理
const reservationButtons = document.querySelectorAll('a[href="#reservation"], .btn-primary, .btn-line');
reservationButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const href = button.getAttribute('href');
        
        // 外部リンクや電話番号でない場合
        if (href && href.startsWith('#')) {
            e.preventDefault();
            const targetElement = document.querySelector(href);
            
            if (targetElement) {
                const navbarHeight = navbar ? navbar.offsetHeight : 0;
                const elementPosition = targetElement.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: elementPosition,
                    behavior: 'smooth'
                });
                
                // 予約セクションにフォーカスクラスを追加
                targetElement.classList.add('focused');
                setTimeout(() => {
                    targetElement.classList.remove('focused');
                }, 3000);
            }
        }
    });
});



// Light Reflection Effect after Cinematic Reveal
const addLightReflection = () => {
    const heroLine1 = document.querySelector('.hero-line1');
    if (!heroLine1) return;
    
    const lightElement = document.createElement('div');
    lightElement.className = 'light-reflection';
    heroLine1.appendChild(lightElement);
    
    // Remove the element after animation completes
    setTimeout(() => {
        if (lightElement.parentNode) {
            lightElement.parentNode.removeChild(lightElement);
        }
    }, 2500);
};

// Initialize light reflection effect after cinematic reveal
document.addEventListener('DOMContentLoaded', () => {
    // Add light reflection after cinematic reveal completes (3.5s delay)
    setTimeout(addLightReflection, 3500);
});

// エラーハンドリング
window.addEventListener('error', (e) => {
    console.log('エラーが発生しましたが、サイトは正常に動作します:', e.message);
});

// パフォーマンス最適化：requestAnimationFrame を使用
let ticking = false;

const updateAnimations = () => {
    highlightNavigation();
    handleScroll();
    ticking = false;
};

const requestTick = () => {
    if (!ticking) {
        requestAnimationFrame(updateAnimations);
        ticking = true;
    }
};

// スクロールイベントの最適化
window.addEventListener('scroll', requestTick, { passive: true });

// モバイルデバイス判定
const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           window.innerWidth <= 768;
};

// モバイル最適化機能
const initMobileOptimizations = () => {
    // タッチイベントの最適化
    if ('ontouchstart' in window) {
        // タッチデバイスでのホバー効果を無効化
        document.body.classList.add('touch-device');
        
        // タッチ開始時のフィードバック
        document.addEventListener('touchstart', (e) => {
            if (e.target.closest('.btn, .feature-card, .pricing-card, .review-card')) {
                e.target.style.transform = 'scale(0.98)';
            }
        }, { passive: true });
        
        // タッチ終了時の復元
        document.addEventListener('touchend', (e) => {
            if (e.target.closest('.btn, .feature-card, .pricing-card, .review-card')) {
                setTimeout(() => {
                    e.target.style.transform = '';
                }, 150);
            }
        }, { passive: true });
    }
    
    // 画面サイズ変更時の最適化
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // レイアウトの再計算
            if (window.innerWidth <= 768) {
                // モバイル表示時の最適化
                disableAnimations();
            } else {
                // デスクトップ表示時の復元
                enableAnimations();
            }
        }, 250);
    });
};

// アニメーション制御
const disableAnimations = () => {
    document.body.classList.add('reduced-motion');
};

const enableAnimations = () => {
    document.body.classList.remove('reduced-motion');
};

// 遅延読み込み機能
const initLazyLoading = () => {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // フォールバック: IntersectionObserverがサポートされていない場合
        images.forEach(img => {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
        });
    }
};

// 初期化時にモバイル最適化を実行
document.addEventListener('DOMContentLoaded', () => {
    initMobileOptimizations();
    initLazyLoading();
});

console.log('LUXE HEALING VOICE - Website loaded successfully'); 