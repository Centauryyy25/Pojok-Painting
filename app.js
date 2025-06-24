// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupNavigation();
    setupPriceCalculator();
    setupProcessTimeline();
    setupGallery();
    setupSmoothScrolling();
    setupWhatsAppButtons();
    setupFAQAccordion();
}

// Navigation Setup
function setupNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Animate hamburger
            const spans = navToggle.querySelectorAll('span');
            spans.forEach((span, index) => {
                if (navMenu.classList.contains('active')) {
                    if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
                    if (index === 1) span.style.opacity = '0';
                    if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
                } else {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                }
            });
        });
        
        // Close menu when clicking on links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    navMenu.classList.remove('active');
                    const spans = navToggle.querySelectorAll('span');
                    spans.forEach(span => {
                        span.style.transform = 'none';
                        span.style.opacity = '1';
                    });
                }
            });
        });
    }
}

// WhatsApp Buttons Setup
function setupWhatsAppButtons() {
    // Ensure all WhatsApp buttons have proper click handlers
    const whatsappButtons = document.querySelectorAll('a[href*="whatsapp.com"]');
    
    whatsappButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Let the default behavior work, but add some visual feedback
            this.style.transform = 'translate(3px, 3px) scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
}

// Price Calculator Setup
function setupPriceCalculator() {
    const motorType = document.getElementById('motorType');
    const serviceType = document.getElementById('serviceType');
    const additionalServices = document.querySelectorAll('input[type="checkbox"]');
    const totalPriceElement = document.getElementById('totalPrice');
    const getQuoteBtn = document.getElementById('getQuote');
    
    if (!motorType || !serviceType || !totalPriceElement || !getQuoteBtn) return;
    
    function calculateTotal() {
        let basePrice = 0;
        let multiplier = 1;
        let additionalCost = 0;
        
        // Get base service price
        const selectedService = serviceType.options[serviceType.selectedIndex];
        if (selectedService && selectedService.dataset.price) {
            basePrice = parseInt(selectedService.dataset.price);
        }
        
        // Get motor type multiplier
        const selectedMotor = motorType.options[motorType.selectedIndex];
        if (selectedMotor && selectedMotor.dataset.multiplier) {
            multiplier = parseFloat(selectedMotor.dataset.multiplier);
        }
        
        // Calculate additional services cost
        additionalServices.forEach(checkbox => {
            if (checkbox.checked && checkbox.dataset.price) {
                additionalCost += parseInt(checkbox.dataset.price);
            }
        });
        
        // Calculate total
        const total = (basePrice * multiplier) + additionalCost;
        
        // Update display
        if (total > 0 && motorType.value && serviceType.value) {
            totalPriceElement.textContent = formatCurrency(total);
            getQuoteBtn.disabled = false;
            getQuoteBtn.style.opacity = '1';
            getQuoteBtn.style.cursor = 'pointer';
            
            // Update WhatsApp message and make button clickable
            updateQuoteWhatsAppMessage(total, selectedService, selectedMotor, additionalServices);
        } else {
            totalPriceElement.textContent = 'Rp 0';
            getQuoteBtn.disabled = true;
            getQuoteBtn.style.opacity = '0.5';
            getQuoteBtn.style.cursor = 'not-allowed';
            getQuoteBtn.removeAttribute('href');
        }
    }
    
    function updateQuoteWhatsAppMessage(total, service, motor, additionalServices) {
        const serviceName = service ? service.textContent : '';
        const motorName = motor ? motor.textContent : '';
        
        // Get selected additional services
        let additionalServicesText = '';
        additionalServices.forEach(checkbox => {
            if (checkbox.checked) {
                const label = checkbox.parentElement.textContent.trim();
                additionalServicesText += `• ${label}\n`;
            }
        });
        
        let message = `Halo MOTOR REPAINT PRO, saya tertarik dengan penawaran berikut:

📋 Detail Pesanan:
• Layanan: ${serviceName}
• Jenis Motor: ${motorName}`;

        if (additionalServicesText) {
            message += `\n• Layanan Tambahan:\n${additionalServicesText}`;
        }

        message += `\n💰 Estimasi Harga: ${formatCurrency(total)}

Bisa diproses lebih lanjut?`;
        
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://api.whatsapp.com/send?phone=6285782842306&text=${encodedMessage}`;
        
        // Convert button to link and set href
        getQuoteBtn.setAttribute('href', whatsappUrl);
        getQuoteBtn.setAttribute('target', '_blank');
        getQuoteBtn.style.textDecoration = 'none';
        
        // Remove any existing click handlers and add new one
        getQuoteBtn.onclick = null;
        getQuoteBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.open(whatsappUrl, '_blank');
        });
    }
    
    function formatCurrency(amount) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    }
    
    // Event listeners
    motorType.addEventListener('change', calculateTotal);
    serviceType.addEventListener('change', calculateTotal);
    additionalServices.forEach(checkbox => {
        checkbox.addEventListener('change', calculateTotal);
    });
    
    // Initial calculation
    calculateTotal();
}

// Process Timeline Setup
function setupProcessTimeline() {
    const processSteps = document.querySelectorAll('.process-step');
    
    processSteps.forEach((step, index) => {
        // Initial setup - make descriptions collapsed by default
        const description = step.querySelector('.step-description');
        if (description && index > 0) { // Keep first step expanded
            description.style.maxHeight = '60px';
            description.style.overflow = 'hidden';
        }
        
        step.addEventListener('click', function() {
            // Remove active class from all steps
            processSteps.forEach(s => {
                s.classList.remove('active');
                const desc = s.querySelector('.step-description');
                if (desc) {
                    desc.style.maxHeight = '60px';
                    desc.style.overflow = 'hidden';
                }
            });
            
            // Add active class to clicked step
            this.classList.add('active');
            
            // Add some visual feedback
            const stepNumber = this.querySelector('.step-number');
            if (stepNumber) {
                const originalBg = stepNumber.style.backgroundColor;
                
                stepNumber.style.backgroundColor = '#25D366';
                stepNumber.style.transform = 'scale(1.1)';
                
                setTimeout(() => {
                    stepNumber.style.backgroundColor = '';
                    stepNumber.style.transform = 'scale(1)';
                }, 300);
            }
            
            // Expand description for active step
            const description = this.querySelector('.step-description');
            if (description) {
                description.style.maxHeight = 'none';
                description.style.overflow = 'visible';
                this.classList.add('expanded');
            }
        });
        
        // Add hover effects
        step.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'translate(2px, 2px) scale(1.02)';
            }
        });
        
        step.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = '';
            }
        });
    });
    
    // Set first step as active by default
    if (processSteps.length > 0) {
        processSteps[0].click();
    }
}

// Gallery Setup
function setupGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            const overlay = this.querySelector('.gallery-overlay');
            
            if (img) {
                createLightbox(img.src, overlay ? overlay.querySelector('h4').textContent : '');
            }
        });
        
        // Add loading effect
        const img = item.querySelector('img');
        if (img) {
            img.addEventListener('load', function() {
                this.style.opacity = '1';
                this.style.transform = 'scale(1)';
            });
            
            // Only apply loading effect if image isn't already loaded
            if (!img.complete) {
                img.style.opacity = '0';
                img.style.transform = 'scale(0.9)';
                img.style.transition = 'all 0.3s ease';
            }
        }
    });
}

// FAQ Accordion Setup
function setupFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = item.querySelector('.faq-icon');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all items first
            faqItems.forEach(faq => {
                faq.classList.remove('active');
                const otherAnswer = faq.querySelector('.faq-answer');
                otherAnswer.style.maxHeight = '0';
                const otherIcon = faq.querySelector('.faq-icon');
                otherIcon.textContent = '+';
            });
            
            // Toggle current item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                icon.textContent = '×';
            }
        });
    });
    
    // Open first FAQ by default
    if (faqItems.length > 0) {
        faqItems[0].click();
    }
}

function createLightbox(imageSrc, title) {
    // Remove existing lightbox if any
    const existingLightbox = document.querySelector('.lightbox-overlay');
    if (existingLightbox) {
        existingLightbox.remove();
    }
    
    // Create lightbox overlay
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox-overlay';
    lightbox.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
        cursor: pointer;
    `;
    
    // Create image container
    const imageContainer = document.createElement('div');
    imageContainer.style.cssText = `
        position: relative;
        max-width: 90vw;
        max-height: 90vh;
        border: 4px solid #FF6B35;
        box-shadow: 6px 6px 0px #000;
        cursor: default;
    `;
    
    // Prevent container clicks from closing lightbox
    imageContainer.addEventListener('click', function(e) {
        e.stopPropagation();
    });
    
    // Create image
    const img = document.createElement('img');
    img.src = imageSrc;
    img.style.cssText = `
        width: 100%;
        height: 100%;
        max-width: 80vw;
        max-height: 80vh;
        object-fit: contain;
        display: block;
    `;
    
    // Create title
    if (title) {
        const titleElement = document.createElement('div');
        titleElement.textContent = title;
        titleElement.style.cssText = `
            position: absolute;
            bottom: -50px;
            left: 0;
            right: 0;
            background: #FF6B35;
            color: white;
            padding: 12px;
            font-weight: 700;
            text-align: center;
            border: 4px solid #000;
            font-size: 14px;
        `;
        imageContainer.appendChild(titleElement);
    }
    
    // Create close button
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '✕';
    closeBtn.style.cssText = `
        position: absolute;
        top: -50px;
        right: 0;
        background: #000;
        color: white;
        border: 4px solid #FF6B35;
        width: 40px;
        height: 40px;
        font-size: 20px;
        font-weight: bold;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    // Close functionality
    function closeLightbox() {
        lightbox.style.opacity = '0';
        setTimeout(() => {
            if (lightbox.parentElement) {
                document.body.removeChild(lightbox);
            }
        }, 300);
    }
    
    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', closeLightbox);
    
    // Escape key close
    const escapeHandler = function(e) {
        if (e.key === 'Escape') {
            closeLightbox();
            document.removeEventListener('keydown', escapeHandler);
        }
    };
    document.addEventListener('keydown', escapeHandler);
    
    // Assemble lightbox
    imageContainer.appendChild(img);
    imageContainer.appendChild(closeBtn);
    lightbox.appendChild(imageContainer);
    document.body.appendChild(lightbox);
    
    // Show lightbox
    setTimeout(() => {
        lightbox.style.opacity = '1';
    }, 10);
}

// Smooth Scrolling Setup
function setupSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            e.preventDefault();
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Additional Interactive Features
document.addEventListener('DOMContentLoaded', function() {
    // Add loading animation to service cards
    const serviceCards = document.querySelectorAll('.service-card');
    
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) rotate(-1deg)';
                }
            });
        }, observerOptions);
        
        serviceCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(50px) rotate(-1deg)';
            card.style.transition = `all 0.6s ease ${index * 0.1}s`;
            observer.observe(card);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        serviceCards.forEach(card => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) rotate(-1deg)';
        });
    }
    
    // Add click effects to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            this.style.transform = 'translate(3px, 3px) scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    // Floating WhatsApp button animation
    const floatingWhatsApp = document.querySelector('.whatsapp-float');
    if (floatingWhatsApp) {
        let isAnimating = false;
        
        setInterval(() => {
            if (!isAnimating) {
                isAnimating = true;
                floatingWhatsApp.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    floatingWhatsApp.style.transform = 'scale(1)';
                    setTimeout(() => {
                        isAnimating = false;
                    }, 200);
                }, 200);
            }
        }, 3000);
    }
    
    // Add scroll-triggered animations
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.hero-image');
        
        if (parallax) {
            const speed = scrolled * 0.1; // Reduced speed for better performance
            parallax.style.transform = `translateY(${speed}px) rotate(2deg)`;
        }
        
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });
    
    // Form validation enhancement
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.style.boxShadow = '0 0 0 3px #FF6B35';
                this.style.borderColor = '#FF6B35';
            });
            
            input.addEventListener('blur', function() {
                this.style.boxShadow = '';
                this.style.borderColor = '';
            });
        });
    });
});

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}