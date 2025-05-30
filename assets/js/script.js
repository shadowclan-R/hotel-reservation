// Reservation Management System - Object-Oriented Approach
class ReservationManager {
    constructor() {
        this.reservations = [];
        this.init();
    }

    init() {
        this.bindEvents();
        this.setMinDate();
    }

    bindEvents() {
        const form = document.getElementById('reservationForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        }

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Date validation
        const checkinInput = document.getElementById('checkin');
        const checkoutInput = document.getElementById('checkout');
        
        if (checkinInput && checkoutInput) {
            checkinInput.addEventListener('change', () => this.validateDates());
            checkoutInput.addEventListener('change', () => this.validateDates());
        }
    }

    setMinDate() {
        const today = new Date().toISOString().split('T')[0];
        const checkinInput = document.getElementById('checkin');
        const checkoutInput = document.getElementById('checkout');
        
        if (checkinInput) checkinInput.min = today;
        if (checkoutInput) checkoutInput.min = today;
    }

    validateDates() {
        const checkinInput = document.getElementById('checkin');
        const checkoutInput = document.getElementById('checkout');
        
        if (checkinInput && checkoutInput) {
            const checkinDate = new Date(checkinInput.value);
            const checkoutDate = new Date(checkoutInput.value);
            
            if (checkinDate && checkoutDate && checkinDate >= checkoutDate) {
                alert('تاريخ المغادرة يجب أن يكون بعد تاريخ الوصول');
                checkoutInput.value = '';
            }
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const submitBtn = e.target.querySelector('.submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const spinner = submitBtn.querySelector('.loading-spinner');
        
        // Show loading state
        btnText.style.display = 'none';
        spinner.style.display = 'block';
        submitBtn.disabled = true;
        
        try {
            const formData = new FormData(e.target);
            const reservation = this.createReservation(formData);
            
            // Simulate API call
            await this.simulateApiCall();
            
            this.reservations.push(reservation);
            this.saveToFile(reservation);
            this.showSuccessMessage();
            e.target.reset();
            
        } catch (error) {
            this.showErrorMessage(error.message);
        } finally {
            // Hide loading state
            btnText.style.display = 'block';
            spinner.style.display = 'none';
            submitBtn.disabled = false;
        }
    }

    createReservation(formData) {
        return {
            id: this.generateId(),
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            checkin: formData.get('checkin'),
            checkout: formData.get('checkout'),
            guests: formData.get('guests'),
            hotel: formData.get('hotel'),
            requests: formData.get('requests') || 'لا توجد طلبات خاصة',
            timestamp: new Date().toISOString(),
            status: 'pending'
        };
    }

    generateId() {
        return 'RES-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }

    async simulateApiCall() {
        return new Promise(resolve => setTimeout(resolve, 2000));
    }

    saveToFile(reservation) {
        const content = this.formatReservationText(reservation);
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `reservation-${reservation.id}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    formatReservationText(reservation) {
        const hotelNames = {
            'four-seasons': 'فور سيزونز البوسفور',
            'ritz-carlton': 'ريتز كارلتون إسطنبول',
            'shangri-la': 'شانغريلا البوسفور'
        };

        return `
===========================================
        تفاصيل حجز فندقي - روقا للحجوزات
===========================================

رقم الحجز: ${reservation.id}
تاريخ الطلب: ${new Date(reservation.timestamp).toLocaleDateString('ar-SA')}

معلومات العميل:
-----------------
الاسم: ${reservation.name}
البريد الإلكتروني: ${reservation.email}
رقم الهاتف: ${reservation.phone}

تفاصيل الحجز:
--------------
الفندق: ${hotelNames[reservation.hotel] || reservation.hotel}
تاريخ الوصول: ${new Date(reservation.checkin).toLocaleDateString('ar-SA')}
تاريخ المغادرة: ${new Date(reservation.checkout).toLocaleDateString('ar-SA')}
عدد الضيوف: ${reservation.guests}
عدد الليالي: ${this.calculateNights(reservation.checkin, reservation.checkout)}

الطلبات الخاصة:
----------------
${reservation.requests}

حالة الحجز: ${reservation.status === 'pending' ? 'قيد المراجعة' : reservation.status}

===========================================
شكراً لاختياركم روقا للحجوزات الفندقية
سيتم التواصل معكم خلال 24 ساعة
===========================================
        `.trim();
    }

    calculateNights(checkin, checkout) {
        const checkinDate = new Date(checkin);
        const checkoutDate = new Date(checkout);
        const timeDiff = checkoutDate.getTime() - checkinDate.getTime();
        return Math.ceil(timeDiff / (1000 * 3600 * 24));
    }

    showSuccessMessage() {
        alert('تم إرسال طلب الحجز بنجاح! سيتم التواصل معكم قريباً.\nتم حفظ تفاصيل الحجز في ملف نصي.');
    }

    showErrorMessage(message) {
        alert('حدث خطأ أثناء إرسال الطلب: ' + message);
    }

    // Public method to get all reservations
    getAllReservations() {
        return this.reservations;
    }

    // Public method to get reservation by ID
    getReservationById(id) {
        return this.reservations.find(res => res.id === id);
    }
}

// Header scroll effect
class HeaderManager {
    constructor() {
        this.header = document.querySelector('.header');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.handleScroll());
    }

    handleScroll() {
        if (window.scrollY > 100) {
            this.header.style.background = 'rgba(26, 35, 126, 0.95)';
            this.header.style.backdropFilter = 'blur(10px)';
        } else {
            this.header.style.background = 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)';
            this.header.style.backdropFilter = 'none';
        }
    }
}

// Animation on scroll
class ScrollAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.observeElements();
    }

    observeElements() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.hotel-card, .service-item').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s ease';
            observer.observe(el);
        });
    }
}

// Enhanced Gallery functionality
class GalleryManager {
    constructor() {
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.bindTabEvents();
        this.bindImageEvents();
        this.showFilteredItems('all'); // Show all items initially
    }

    bindTabEvents() {
        const tabBtns = document.querySelectorAll('.tab-btn');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove active class from all tabs
                tabBtns.forEach(tab => tab.classList.remove('active'));
                // Add active class to clicked tab
                btn.classList.add('active');

                const category = btn.getAttribute('data-category');
                this.currentFilter = category;
                this.showFilteredItems(category);
                
                // Add visual feedback
                btn.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    btn.style.transform = 'scale(1)';
                }, 150);
            });
        });
    }

    showFilteredItems(category) {
        const galleryItems = document.querySelectorAll('.gallery-item');
        const galleryGrid = document.getElementById('galleryGrid');
        
        // Add loading effect
        galleryGrid.style.opacity = '0.5';
        
        setTimeout(() => {
            let visibleCount = 0;
            
            galleryItems.forEach((item, index) => {
                const itemCategory = item.getAttribute('data-category');
                
                if (category === 'all' || itemCategory === category) {
                    item.style.display = 'block';
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px) scale(0.9)';
                    
                    // Stagger animation
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0) scale(1)';
                        item.style.transition = 'all 0.4s ease';
                    }, visibleCount * 100);
                    
                    visibleCount++;
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(-20px) scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
            
            galleryGrid.style.opacity = '1';
            
            // Update stats based on filter
            this.updateStats(category, visibleCount);
            
        }, 200);
    }

    updateStats(category, count) {
        const statNumber = document.querySelector('.stat-number');
        if (statNumber) {
            let newCount;
            switch(category) {
                case 'rooms':
                    newCount = '150+';
                    break;
                case 'restaurants':
                    newCount = '100+';
                    break;
                case 'facilities':
                    newCount = '200+';
                    break;
                case 'views':
                    newCount = '80+';
                    break;
                default:
                    newCount = '500+';
            }
            
            // Animate number change
            statNumber.style.transform = 'scale(1.2)';
            statNumber.style.color = '#8b4513';
            setTimeout(() => {
                statNumber.textContent = newCount;
                statNumber.style.transform = 'scale(1)';
                statNumber.style.color = '#2c3e50';
            }, 200);
        }
    }

    bindImageEvents() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        galleryItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const img = item.querySelector('img');
                const title = item.querySelector('h4').textContent;
                const description = item.querySelector('p').textContent;
                this.openLightbox(img.src, title, description);
            });

            // Add hover sound effect (optional)
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'scale(1.05) translateY(-5px)';
                item.style.transition = 'all 0.3s ease';
            });

            item.addEventListener('mouseleave', () => {
                item.style.transform = 'scale(1) translateY(0)';
            });
        });
    }

    openLightbox(src, title, description) {
        // Create lightbox overlay
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox-overlay';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <span class="lightbox-close">&times;</span>
                <img src="${src}" alt="${title}" class="lightbox-image">
                <div class="lightbox-info">
                    <h4>${title}</h4>
                    <p>${description}</p>
                    <div class="lightbox-actions">
                        <button class="lightbox-btn prev-btn">
                            <i class="fas fa-chevron-left"></i>
                            السابقة
                        </button>
                        <button class="lightbox-btn next-btn">
                            التالية
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(lightbox);
        document.body.style.overflow = 'hidden';

        // Animation entrance
        lightbox.style.opacity = '0';
        setTimeout(() => {
            lightbox.style.opacity = '1';
            lightbox.style.transition = 'opacity 0.3s ease';
        }, 10);

        // Close lightbox events
        const closeBtn = lightbox.querySelector('.lightbox-close');
        closeBtn.addEventListener('click', () => this.closeLightbox(lightbox));
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                this.closeLightbox(lightbox);
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeLightbox(lightbox);
            }
        });

        // Add enhanced lightbox CSS
        this.addLightboxStyles();
    }

    closeLightbox(lightbox) {
        lightbox.style.opacity = '0';
        setTimeout(() => {
            document.body.style.overflow = 'auto';
            lightbox.remove();
        }, 300);
    }

    addLightboxStyles() {
        if (!document.getElementById('lightbox-styles')) {
            const style = document.createElement('style');
            style.id = 'lightbox-styles';
            style.textContent = `
                .lightbox-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.95);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                    backdrop-filter: blur(5px);
                }
                
                .lightbox-content {
                    position: relative;
                    max-width: 90%;
                    max-height: 90%;
                    text-align: center;
                    animation: slideIn 0.4s ease;
                }
                
                .lightbox-image {
                    max-width: 100%;
                    max-height: 70vh;
                    border-radius: 10px;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.5);
                    transition: transform 0.3s ease;
                }
                
                .lightbox-image:hover {
                    transform: scale(1.02);
                }
                
                .lightbox-info {
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(10px);
                    margin-top: 1rem;
                    padding: 1.5rem;
                    border-radius: 10px;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }
                
                .lightbox-info h4 {
                    color: white;
                    margin-bottom: 0.5rem;
                    font-family: 'Cairo', sans-serif;
                    font-size: 1.3rem;
                }
                
                .lightbox-info p {
                    color: rgba(255, 255, 255, 0.8);
                    margin-bottom: 1rem;
                    font-family: 'Cairo', sans-serif;
                }
                
                .lightbox-actions {
                    display: flex;
                    gap: 1rem;
                    justify-content: center;
                    flex-wrap: wrap;
                }
                
                .lightbox-btn {
                    background: linear-gradient(135deg, #8b4513, #daa520);
                    color: white;
                    border: none;
                    padding: 0.8rem 1.5rem;
                    border-radius: 25px;
                    cursor: pointer;
                    font-family: 'Cairo', sans-serif;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    transition: all 0.3s ease;
                }
                
                .lightbox-btn:hover {
                    background: linear-gradient(135deg, #a0522d, #f4a460);
                    transform: translateY(-2px);
                }
                
                .lightbox-close {
                    position: absolute;
                    top: -50px;
                    right: 0;
                    color: white;
                    font-size: 2.5rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    background: rgba(255, 255, 255, 0.1);
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    backdrop-filter: blur(10px);
                }
                
                .lightbox-close:hover {
                    transform: scale(1.2) rotate(90deg);
                    background: rgba(255, 255, 255, 0.2);
                }
                
                @keyframes slideIn {
                    from { 
                        opacity: 0;
                        transform: scale(0.8) translateY(50px);
                    }
                    to { 
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }
                
                @media (max-width: 768px) {
                    .lightbox-content {
                        max-width: 95%;
                        padding: 1rem;
                    }
                    
                    .lightbox-image {
                        max-height: 50vh;
                    }
                    
                    .lightbox-actions {
                        flex-direction: column;
                        align-items: center;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Initialize all managers when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const reservationManager = new ReservationManager();
    const headerManager = new HeaderManager();
    const scrollAnimations = new ScrollAnimations();
    const galleryManager = new GalleryManager();
    
    // Make managers globally accessible
    window.reservationManager = reservationManager;
    window.galleryManager = galleryManager;
    
    console.log('Gallery Manager initialized successfully!');
});

// Mobile menu toggle (if needed in future)
class MobileMenu {
    constructor() {
        this.init();
    }

    init() {
        // Future implementation for mobile hamburger menu
        console.log('Mobile menu initialized');
    }
}