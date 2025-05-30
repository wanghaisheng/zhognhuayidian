document.addEventListener('DOMContentLoaded', function() {
    // 加载语言文件
    loadLanguage('zh');

    // 语言切换功能
    const languageSelect = document.getElementById('language-select');
    languageSelect.addEventListener('change', function() {
        loadLanguage(this.value);
    });

    // Tab切换功能
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 移除所有tab的active状态
            tabButtons.forEach(btn => btn.classList.remove('active'));
            // 为当前点击的tab添加active状态
            this.classList.add('active');
            
            // 隐藏所有tab内容
            const tabContents = document.querySelectorAll('.tab-content');
            tabContents.forEach(content => content.classList.remove('active'));
            
            // 显示当前tab的内容
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId + '-content').classList.add('active');
        });
    });

    // 轮盘动画效果
    animateWheel();

    // 滚动动画
    scrollAnimations();
});

// 加载语言文件
function loadLanguage(lang) {
    fetch(`/locale/${lang}/index.json`) // Use root-relative path
        .then(response => response.json())
        .then(data => {
            updateContent(data);
        })
        .catch(error => {
            console.error('Error loading language file:', error);
        });
}

// 更新页面内容
function updateContent(langData) {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const keys = element.getAttribute('data-i18n').split('.');
        let value = langData;
        
        for (const key of keys) {
            if (value && value[key]) {
                value = value[key];
            } else {
                value = null;
                break;
            }
        }
        
        if (value) {
            element.textContent = value;
        }
    });
}

// 轮盘动画效果
function animateWheel() {
    const wheelImage = document.querySelector('.hero-image img');
    if (wheelImage) {
        // 添加点击事件，让轮盘旋转
        wheelImage.addEventListener('click', function() {
            this.style.animation = 'none';
            setTimeout(() => {
                this.style.animation = 'spin 3s ease-out';
            }, 10);
        });
    }

    // 添加自定义的旋转动画
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
}

// 滚动动画
function scrollAnimations() {
    // 滚动时的渐入动画
    const fadeElements = document.querySelectorAll('.feature-card, .step, .testimonial-card, .subscription-plan');
    
    // 初始设置为不可见
    fadeElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    });
    
    // 监听滚动事件
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    fadeElements.forEach(el => {
        observer.observe(el);
    });
}

