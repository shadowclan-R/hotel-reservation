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
            this.header.style.background = 'rgba(255, 252, 252, 0.95)';
            this.header.style.backdropFilter = 'blur(10px)';
        } else {
            this.header.style.background = 'linear-gradient(135deg,rgb(255, 255, 255) 0%,rgb(211, 211, 211) 100%)';
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
        this.galleryItems = [];
        this.isAnimating = false;
        this.init();
    }

    init() {
        this.galleryItems = document.querySelectorAll('.gallery-item');
        this.bindTabEvents();
        this.bindImageEvents();
        this.initializeFilters();
        this.showFilteredItems('all');
    }

    initializeFilters() {
        // Add data-count attributes to tabs
        const categories = {
            'all': this.galleryItems.length,
            'rooms': document.querySelectorAll('[data-category="rooms"]').length,
            'restaurants': document.querySelectorAll('[data-category="restaurants"]').length,
            'facilities': document.querySelectorAll('[data-category="facilities"]').length,
            'views': document.querySelectorAll('[data-category="views"]').length
        };

        Object.entries(categories).forEach(([category, count]) => {
            const tab = document.querySelector(`[data-category="${category}"]`);
            if (tab) {
                tab.setAttribute('data-count', count);
            }
        });
    }

    bindTabEvents() {
        const tabBtns = document.querySelectorAll('.tab-btn');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                
                if (this.isAnimating) return;
                
                // Remove active class from all tabs
                tabBtns.forEach(tab => tab.classList.remove('active'));
                // Add active class to clicked tab
                btn.classList.add('active');

                const category = btn.getAttribute('data-category');
                this.currentFilter = category;
                this.showFilteredItems(category);
                
                // Visual feedback
                this.addClickFeedback(btn);
            });
        });
    }

    addClickFeedback(btn) {
        btn.style.transform = 'scale(0.95)';
        btn.style.background = 'linear-gradient(135deg, #8b4513, #daa520)';
        btn.style.color = 'white';
        
        setTimeout(() => {
            btn.style.transform = 'scale(1)';
            if (!btn.classList.contains('active')) {
                btn.style.background = 'white';
                btn.style.color = '#2c3e50';
            }
        }, 150);
    }

    showFilteredItems(category) {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        const galleryGrid = document.getElementById('galleryGrid');
        
        // Add loading effect
        galleryGrid.style.opacity = '0.5';
        galleryGrid.style.transform = 'scale(0.98)';
        
        setTimeout(() => {
            let visibleCount = 0;
            const itemsToShow = [];
            const itemsToHide = [];
            
            // Categorize items
            this.galleryItems.forEach((item) => {
                const itemCategory = item.getAttribute('data-category');
                
                if (category === 'all' || itemCategory === category) {
                    itemsToShow.push(item);
                } else {
                    itemsToHide.push(item);
                }
            });
            
            // Hide items first
            itemsToHide.forEach((item, index) => {
                setTimeout(() => {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(-20px) scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }, index * 50);
            });
            
            // Show items with stagger
            setTimeout(() => {
                itemsToShow.forEach((item, index) => {
                    item.style.display = 'block';
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(30px) scale(0.9)';
                    
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0) scale(1)';
                        item.style.transition = 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                    }, index * 100);
                    
                    visibleCount++;
                });
                
                // Reset grid
                setTimeout(() => {
                    galleryGrid.style.opacity = '1';
                    galleryGrid.style.transform = 'scale(1)';
                    this.isAnimating = false;
                }, itemsToShow.length * 100 + 200);
                
                // Update stats
                this.updateStats(category, visibleCount);
                
            }, itemsToHide.length * 50 + 200);
            
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
            this.animateCounterChange(statNumber, newCount);
        }
    }

    animateCounterChange(element, newValue) {
        element.style.transform = 'scale(1.3)';
        element.style.color = '#8b4513';
        
        setTimeout(() => {
            element.textContent = newValue;
            element.style.transform = 'scale(1)';
            element.style.color = '#2c3e50';
        }, 200);
    }

    bindImageEvents() {
        this.galleryItems.forEach((item, index) => {
            // Click event for lightbox
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const img = item.querySelector('img');
                const title = item.querySelector('h4').textContent;
                const description = item.querySelector('p').textContent;
                this.openLightbox(img.src, title, description, index);
            });

            // Enhanced hover effects
            item.addEventListener('mouseenter', () => {
                if (!this.isAnimating) {
                    item.style.transform = 'scale(1.05) translateY(-8px)';
                    item.style.zIndex = '10';
                    item.style.boxShadow = '0 20px 40px rgba(139, 69, 19, 0.3)';
                }
            });

            item.addEventListener('mouseleave', () => {
                if (!this.isAnimating) {
                    item.style.transform = 'scale(1) translateY(0)';
                    item.style.zIndex = '1';
                    item.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
                }
            });
        });
    }

    openLightbox(src, title, description, currentIndex) {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox-overlay';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <span class="lightbox-close">&times;</span>
                <div class="lightbox-navigation">
                    <button class="lightbox-nav prev-btn" onclick="galleryManager.navigateLightbox(-1)">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <button class="lightbox-nav next-btn" onclick="galleryManager.navigateLightbox(1)">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
                <img src="${src}" alt="${title}" class="lightbox-image">
                <div class="lightbox-info">
                    <h4>${title}</h4>
                    <p>${description}</p>
                    <div class="lightbox-counter">
                        <span>${currentIndex + 1} / ${this.getVisibleItemsCount()}</span>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(lightbox);
        document.body.style.overflow = 'hidden';
        
        this.currentLightboxIndex = currentIndex;
        this.lightboxElement = lightbox;

        // Animation entrance
        lightbox.style.opacity = '0';
        setTimeout(() => {
            lightbox.style.opacity = '1';
            lightbox.style.transition = 'opacity 0.4s ease';
        }, 10);

        // Bind close events
        this.bindLightboxEvents(lightbox);
        
        // Add enhanced lightbox CSS
        this.addLightboxStyles();
    }

    getVisibleItemsCount() {
        return Array.from(this.galleryItems).filter(item => 
            item.style.display !== 'none' && 
            (this.currentFilter === 'all' || item.getAttribute('data-category') === this.currentFilter)
        ).length;
    }

    navigateLightbox(direction) {
        const visibleItems = Array.from(this.galleryItems).filter(item => 
            item.style.display !== 'none' && 
            (this.currentFilter === 'all' || item.getAttribute('data-category') === this.currentFilter)
        );
        
        this.currentLightboxIndex += direction;
        
        if (this.currentLightboxIndex >= visibleItems.length) {
            this.currentLightboxIndex = 0;
        } else if (this.currentLightboxIndex < 0) {
            this.currentLightboxIndex = visibleItems.length - 1;
        }
        
        const currentItem = visibleItems[this.currentLightboxIndex];
        const img = currentItem.querySelector('img');
        const title = currentItem.querySelector('h4').textContent;
        const description = currentItem.querySelector('p').textContent;
        
        // Update lightbox content
        const lightboxImg = this.lightboxElement.querySelector('.lightbox-image');
        const lightboxTitle = this.lightboxElement.querySelector('h4');
        const lightboxDesc = this.lightboxElement.querySelector('p');
        const lightboxCounter = this.lightboxElement.querySelector('.lightbox-counter span');
        
        // Fade out
        lightboxImg.style.opacity = '0.5';
        setTimeout(() => {
            lightboxImg.src = img.src;
            lightboxImg.alt = title;
            lightboxTitle.textContent = title;
            lightboxDesc.textContent = description;
            lightboxCounter.textContent = `${this.currentLightboxIndex + 1} / ${visibleItems.length}`;
            
            // Fade in
            lightboxImg.style.opacity = '1';
        }, 200);
    }

    bindLightboxEvents(lightbox) {
        const closeBtn = lightbox.querySelector('.lightbox-close');
        closeBtn.addEventListener('click', () => this.closeLightbox(lightbox));
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                this.closeLightbox(lightbox);
            }
        });

        // Keyboard navigation
        const keyHandler = (e) => {
            switch(e.key) {
                case 'Escape':
                    this.closeLightbox(lightbox);
                    break;
                case 'ArrowLeft':
                    this.navigateLightbox(-1);
                    break;
                case 'ArrowRight':
                    this.navigateLightbox(1);
                    break;
            }
        };
        
        document.addEventListener('keydown', keyHandler);
        lightbox.keyHandler = keyHandler; // Store for cleanup
    }

    closeLightbox(lightbox) {
        lightbox.style.opacity = '0';
        setTimeout(() => {
            document.body.style.overflow = 'auto';
            document.removeEventListener('keydown', lightbox.keyHandler);
            lightbox.remove();
            this.lightboxElement = null;
        }, 300);
    }

    addLightboxStyles() {
        if (!document.getElementById('enhanced-lightbox-styles')) {
            const style = document.createElement('style');
            style.id = 'enhanced-lightbox-styles';
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
                    animation: lightboxSlideIn 0.5s ease;
                }
                
                .lightbox-navigation {
                    position: absolute;
                    top: 50%;
                    left: 0;
                    right: 0;
                    transform: translateY(-50%);
                    display: flex;
                    justify-content: space-between;
                    pointer-events: none;
                    z-index: 10;
                }
                
                .lightbox-nav {
                    background: rgba(139, 69, 19, 0.8);
                    color: white;
                    border: none;
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    pointer-events: auto;
                    backdrop-filter: blur(10px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .lightbox-nav:hover {
                    background: rgba(218, 165, 32, 0.9);
                    transform: scale(1.1);
                }
                
                .lightbox-image {
                    max-width: 100%;
                    max-height: 70vh;
                    border-radius: 15px;
                    box-shadow: 0 25px 50px rgba(0,0,0,0.7);
                    transition: all 0.3s ease;
                }
                
                .lightbox-info {
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(15px);
                    margin-top: 1.5rem;
                    padding: 2rem;
                    border-radius: 15px;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }
                
                .lightbox-info h4 {
                    color: white;
                    margin-bottom: 0.8rem;
                    font-family: 'Cairo', sans-serif;
                    font-size: 1.5rem;
                    font-weight: 700;
                }
                
                .lightbox-info p {
                    color: rgba(255, 255, 255, 0.9);
                    margin-bottom: 1rem;
                    font-family: 'Cairo', sans-serif;
                    line-height: 1.6;
                }
                
                .lightbox-counter {
                    background: rgba(139, 69, 19, 0.8);
                    color: white;
                    padding: 0.5rem 1rem;
                    border-radius: 20px;
                    display: inline-block;
                    font-family: 'Cairo', sans-serif;
                    font-weight: 600;
                }
                
                .lightbox-close {
                    position: absolute;
                    top: -60px;
                    right: 0;
                    color: white;
                    font-size: 2.5rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    background: rgba(139, 69, 19, 0.8);
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    backdrop-filter: blur(10px);
                }
                
                .lightbox-close:hover {
                    transform: scale(1.2) rotate(90deg);
                    background: rgba(218, 165, 32, 0.9);
                }
                
                @keyframes lightboxSlideIn {
                    from { 
                        opacity: 0;
                        transform: scale(0.7) translateY(100px);
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
                    
                    .lightbox-nav {
                        width: 40px;
                        height: 40px;
                    }
                    
                    .lightbox-info {
                        padding: 1.5rem;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Enhanced Reservation Manager with multi-step form
class EnhancedReservationManager extends ReservationManager {
    constructor() {
        super();
        this.currentStep = 1;
        this.totalSteps = 3;
        this.currentBooking = null;
        this.initializeEnhancedFeatures();
    }

    initializeEnhancedFeatures() {
        this.bindSummaryUpdates();
        this.bindStepNavigation();
        this.initializeFormValidation();
    }

    bindSummaryUpdates() {
        // Update summary when form values change
        const form = document.getElementById('reservationForm');
        if (form) {
            form.addEventListener('input', () => this.updateBookingSummary());
            form.addEventListener('change', () => this.updateBookingSummary());
        }
    }

    bindStepNavigation() {
        // Override form submission to handle steps
        const form = document.getElementById('reservationForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                if (this.currentStep === this.totalSteps) {
                    this.handleFinalSubmit(e);
                }
            });
        }
    }

    updateBookingSummary() {
        const hotelSelect = document.getElementById('hotel');
        const checkinInput = document.getElementById('checkin');
        const checkoutInput = document.getElementById('checkout');
        const guestsSelect = document.getElementById('guests');
        const roomsSelect = document.getElementById('rooms');

        // Update hotel
        const selectedHotel = hotelSelect.value;
        const hotelText = hotelSelect.options[hotelSelect.selectedIndex]?.text || 'لم يتم الاختيار';
        document.getElementById('summaryHotel').textContent = 
            selectedHotel ? hotelText.split(' - ')[0] : 'لم يتم الاختيار';

        // Update dates and calculate nights
        const checkinDate = checkinInput.value;
        const checkoutDate = checkoutInput.value;
        
        if (checkinDate && checkoutDate) {
            const checkin = new Date(checkinDate);
            const checkout = new Date(checkoutDate);
            const nights = Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24));
            
            document.getElementById('summaryDates').textContent = 
                `${checkin.toLocaleDateString('ar-SA')} - ${checkout.toLocaleDateString('ar-SA')}`;
            document.getElementById('summaryNights').textContent = `${nights} ليلة`;

            // Calculate total cost
            if (selectedHotel && nights > 0) {
                const pricePerNight = parseInt(hotelSelect.options[hotelSelect.selectedIndex]?.dataset.price || 0);
                const roomCount = parseInt(roomsSelect.value || 1);
                const totalCost = pricePerNight * nights * roomCount;
                document.getElementById('summaryTotal').textContent = `$${totalCost.toLocaleString()}`;
            }
        } else {
            document.getElementById('summaryDates').textContent = 'لم يتم الاختيار';
            document.getElementById('summaryNights').textContent = '0';
        }

        // Update guests and rooms
        document.getElementById('summaryGuests').textContent = 
            guestsSelect.value ? `${guestsSelect.value} ضيف` : 'لم يتم الاختيار';
        document.getElementById('summaryRooms').textContent = 
            roomsSelect.value ? `${roomsSelect.value} غرفة` : 'لم يتم الاختيار';
    }

    initializeFormValidation() {
        const inputs = document.querySelectorAll('#reservationForm input[required], #reservationForm select[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const isValid = field.checkValidity();

        if (!isValid || !value) {
            this.showFieldError(field, this.getErrorMessage(field));
            return false;
        } else {
            this.clearFieldError(field);
            return true;
        }
    }

    showFieldError(field, message) {
        this.clearFieldError(field);
        field.style.borderColor = '#e74c3c';
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            color: #e74c3c;
            font-size: 0.85rem;
            margin-top: 0.25rem;
            font-family: 'Cairo', sans-serif;
        `;
        
        field.parentNode.appendChild(errorDiv);
    }

    clearFieldError(field) {
        field.style.borderColor = '#e9ecef';
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    getErrorMessage(field) {
        const fieldName = field.getAttribute('name');
        const messages = {
            'name': 'يرجى إدخال اسم صحيح',
            'email': 'يرجى إدخال بريد إلكتروني صحيح',
            'phone': 'يرجى إدخال رقم هاتف صحيح',
            'checkin': 'يرجى اختيار تاريخ الوصول',
            'checkout': 'يرجى اختيار تاريخ المغادرة',
            'guests': 'يرجى اختيار عدد الضيوف',
            'rooms': 'يرجى اختيار عدد الغرف',
            'hotel': 'يرجى اختيار الفندق'
        };
        return messages[fieldName] || 'يرجى إدخال قيمة صحيحة';
    }

    validateCurrentStep() {
        const currentStepElement = document.querySelector(`.form-step[data-step="${this.currentStep}"]`);
        const requiredFields = currentStepElement.querySelectorAll('input[required], select[required]');
        
        let isValid = true;
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        // Additional validation for dates
        if (this.currentStep === 2) {
            const checkinDate = new Date(document.getElementById('checkin').value);
            const checkoutDate = new Date(document.getElementById('checkout').value);
            
            if (checkinDate >= checkoutDate) {
                this.showFieldError(document.getElementById('checkout'), 'تاريخ المغادرة يجب أن يكون بعد تاريخ الوصول');
                isValid = false;
            }
        }

        return isValid;
    }

    async handleFinalSubmit(e) {
        if (!this.validateCurrentStep()) {
            return;
        }

        const submitBtn = e.target.querySelector('.submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const spinner = submitBtn.querySelector('.loading-spinner');
        
        // Show loading state
        btnText.style.display = 'none';
        spinner.style.display = 'flex';
        submitBtn.disabled = true;
        
        try {
            const formData = new FormData(e.target);
            const reservation = this.createEnhancedReservation(formData);
            
            await this.simulateApiCall();
            
            this.reservations.push(reservation);
            this.currentBooking = reservation;
            
            this.showConfirmationModal(reservation);
            this.resetForm();
            
        } catch (error) {
            this.showErrorMessage(error.message);
        } finally {
            btnText.style.display = 'flex';
            spinner.style.display = 'none';
            submitBtn.disabled = false;
        }
    }

    createEnhancedReservation(formData) {
        // Get selected services
        const services = Array.from(formData.getAll('services[]'));
        
        const reservation = {
            id: this.generateId(),
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            checkin: formData.get('checkin'),
            checkout: formData.get('checkout'),
            guests: formData.get('guests'),
            rooms: formData.get('rooms'),
            hotel: formData.get('hotel'),
            roomType: formData.get('room-type'),
            viewPreference: formData.get('view-preference'),
            services: services,
            requests: formData.get('requests') || 'لا توجد طلبات خاصة',
            timestamp: new Date().toISOString(),
            status: 'pending',
            totalCost: this.calculateTotalCost(formData)
        };

        return reservation;
    }

    calculateTotalCost(formData) {
        const hotelSelect = document.getElementById('hotel');
        const selectedOption = hotelSelect.options[hotelSelect.selectedIndex];
        const pricePerNight = parseInt(selectedOption?.dataset.price || 0);
        const nights = this.calculateNights(formData.get('checkin'), formData.get('checkout'));
        const rooms = parseInt(formData.get('rooms') || 1);
        
        return pricePerNight * nights * rooms;
    }

    showConfirmationModal(reservation) {
        const modal = document.getElementById('confirmationModal');
        const detailsContainer = document.getElementById('confirmationDetails');
        
        detailsContainer.innerHTML = this.generateConfirmationHTML(reservation);
        modal.style.display = 'flex';
        
        // Add animation
        setTimeout(() => {
            modal.querySelector('.modal-content').style.opacity = '1';
        }, 10);
    }

    generateConfirmationHTML(reservation) {
        const hotelNames = {
            'four-seasons': 'فور سيزونز البوسفور',
            'ritz-carlton': 'ريتز كارلتون إسطنبول',
            'shangri-la': 'شانغريلا البوسفور',
            'swissotel': 'سويس أوتيل البوسفور',
            'hyatt-regency': 'حياة ريجنسي إسطنبول',
            'conrad': 'كونراد إسطنبول',
            'radisson-blu': 'راديسون بلو إسطنبول',
            'intercontinental': 'إنتركونتيننتال إسطنبول'
        };

        return `
            <div class="confirmation-details">
                <div class="detail-group">
                    <h4><i class="fas fa-user"></i> معلومات المسافر</h4>
                    <p><strong>الاسم:</strong> ${reservation.name}</p>
                    <p><strong>البريد الإلكتروني:</strong> ${reservation.email}</p>
                    <p><strong>رقم الهاتف:</strong> ${reservation.phone}</p>
                </div>
                
                <div class="detail-group">
                    <h4><i class="fas fa-building"></i> تفاصيل الحجز</h4>
                    <p><strong>رقم الحجز:</strong> ${reservation.id}</p>
                    <p><strong>الفندق:</strong> ${hotelNames[reservation.hotel] || reservation.hotel}</p>
                    <p><strong>تاريخ الوصول:</strong> ${new Date(reservation.checkin).toLocaleDateString('ar-SA')}</p>
                    <p><strong>تاريخ المغادرة:</strong> ${new Date(reservation.checkout).toLocaleDateString('ar-SA')}</p>
                    <p><strong>عدد الليالي:</strong> ${this.calculateNights(reservation.checkin, reservation.checkout)}</p>
                    <p><strong>عدد الضيوف:</strong> ${reservation.guests}</p>
                    <p><strong>عدد الغرف:</strong> ${reservation.rooms}</p>
                </div>
                
                ${reservation.services.length > 0 ? `
                <div class="detail-group">
                    <h4><i class="fas fa-concierge-bell"></i> الخدمات الإضافية</h4>
                    <ul>
                        ${reservation.services.map(service => `<li>${this.getServiceName(service)}</li>`).join('')}
                    </ul>
                </div>
                ` : ''}
                
                <div class="detail-group total-cost">
                    <h4><i class="fas fa-dollar-sign"></i> إجمالي التكلفة</h4>
                    <p class="total-amount">$${reservation.totalCost.toLocaleString()}</p>
                </div>
                
                <div class="next-steps">
                    <h4><i class="fas fa-info-circle"></i> الخطوات التالية</h4>
                    <ul>
                        <li>سيتم التواصل معكم خلال 24 ساعة لتأكيد الحجز</li>
                        <li>ستصلكم رسالة تأكيد على البريد الإلكتروني</li>
                        <li>يمكنكم تحميل تفاصيل الحجز للاحتفاظ بها</li>
                    </ul>
                </div>
            </div>
        `;
    }

    getServiceName(service) {
        const serviceNames = {
            'airport-transfer': 'نقل من المطار',
            'spa': 'حجز السبا',
            'restaurant': 'حجز المطعم',
            'tour-guide': 'مرشد سياحي'
        };
        return serviceNames[service] || service;
    }

    downloadBooking() {
        if (this.currentBooking) {
            const content = this.formatEnhancedReservationText(this.currentBooking);
            this.saveToFile(this.currentBooking, content);
        }
    }

    formatEnhancedReservationText(reservation) {
        const hotelNames = {
            'four-seasons': 'فور سيزونز البوسفور',
            'ritz-carlton': 'ريتز كارلتون إسطنبول',
            'shangri-la': 'شانغريلا البوسفور',
            'swissotel': 'سويس أوتيل البوسفور',
            'hyatt-regency': 'حياة ريجنسي إسطنبول',
            'conrad': 'كونراد إسطنبول',
            'radisson-blu': 'راديسون بلو إسطنبول',
            'intercontinental': 'إنتركونتيننتال إسطنبول'
        };

        return `
==============================================
           تفاصيل حجز فندقي - روقا للحجوزات
==============================================

رقم الحجز: ${reservation.id}
تاريخ الطلب: ${new Date(reservation.timestamp).toLocaleString('ar-SA')}
حالة الحجز: قيد المراجعة

==============================================
               معلومات المسافر
==============================================
الاسم الكامل: ${reservation.name}
البريد الإلكتروني: ${reservation.email}
رقم الهاتف: ${reservation.phone}

==============================================
                تفاصيل الحجز
==============================================
الفندق: ${hotelNames[reservation.hotel] || reservation.hotel}
تاريخ الوصول: ${new Date(reservation.checkin).toLocaleDateString('ar-SA')}
تاريخ المغادرة: ${new Date(reservation.checkout).toLocaleDateString('ar-SA')}
عدد الليالي: ${this.calculateNights(reservation.checkin, reservation.checkout)}
عدد الضيوف: ${reservation.guests}
عدد الغرف: ${reservation.rooms}
نوع الغرفة: ${reservation.roomType || 'غير محدد'}
الإطلالة المفضلة: ${reservation.viewPreference || 'غير محدد'}

${reservation.services.length > 0 ? `
==============================================
               الخدمات الإضافية
==============================================
${reservation.services.map(service => `- ${this.getServiceName(service)}`).join('\n')}
` : ''}

==============================================
                الطلبات الخاصة
==============================================
${reservation.requests}

==============================================
              معلومات التكلفة
==============================================
إجمالي التكلفة: $${reservation.totalCost.toLocaleString()}
* الأسعار تشمل الضرائب والرسوم

==============================================
               معلومات الاتصال
==============================================
هاتف: +90 534 399 20 80
بريد إلكتروني: booking@roqa-hotels.com
متاح 24/7

==============================================
شكراً لاختياركم روقا للحجوزات الفندقية
سيتم التواصل معكم خلال 24 ساعة لتأكيد الحجز
==============================================
        `.trim();
    }

    saveToFile(reservation, content) {
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

    resetForm() {
        document.getElementById('reservationForm').reset();
        this.currentStep = 1;
        this.updateStepDisplay();
        this.updateBookingSummary();
    }

    updateStepDisplay() {
        // Hide all steps
        document.querySelectorAll('.form-step').forEach(step => {
            step.classList.remove('active');
        });
        
        // Show current step
        document.querySelector(`.form-step[data-step="${this.currentStep}"]`).classList.add('active');
        
        // Update progress indicators
        document.querySelectorAll('.progress-step').forEach((step, index) => {
            if (index + 1 <= this.currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
        
        // Update navigation buttons
        const prevBtn = document.querySelector('.btn-prev');
        const nextBtn = document.querySelector('.btn-next');
        const submitBtn = document.querySelector('.submit-btn');
        
        prevBtn.style.display = this.currentStep > 1 ? 'flex' : 'none';
        nextBtn.style.display = this.currentStep < this.totalSteps ? 'flex' : 'none';
        submitBtn.style.display = this.currentStep === this.totalSteps ? 'flex' : 'none';
    }
}

// Global functions for step navigation
function nextStep() {
    const manager = window.enhancedReservationManager;
    if (manager.validateCurrentStep() && manager.currentStep < manager.totalSteps) {
        manager.currentStep++;
        manager.updateStepDisplay();
    }
}

function previousStep() {
    const manager = window.enhancedReservationManager;
    if (manager.currentStep > 1) {
        manager.currentStep--;
        manager.updateStepDisplay();
    }
}

function closeModal() {
    const modal = document.getElementById('confirmationModal');
    modal.style.display = 'none';
}

function downloadBooking() {
    window.enhancedReservationManager.downloadBooking();
}

// Initialize all managers when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const enhancedReservationManager = new EnhancedReservationManager();
    const headerManager = new HeaderManager();
    const scrollAnimations = new ScrollAnimations();
    const galleryManager = new GalleryManager();
    
    // Newsletter functionality
    initNewsletter();
    
    // Make managers globally accessible
    window.enhancedReservationManager = enhancedReservationManager;
    window.galleryManager = galleryManager;
    
    console.log('All enhanced managers initialized successfully!');
});

// Newsletter functionality
function initNewsletter() {
    const form = document.querySelector('.newsletter-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = form.querySelector('input[type="email"]').value;
            
            // Simulate API call
            const btn = form.querySelector('button');
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            btn.disabled = true;
            
            setTimeout(() => {
                alert(`شكراً لك! تم تسجيل ${email} في النشرة الإخبارية بنجاح.`);
                form.reset();
                btn.innerHTML = originalHTML;
                btn.disabled = false;
            }, 2000);
        });
    }
}