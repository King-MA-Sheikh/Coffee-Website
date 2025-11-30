// customer-script.js
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the customer dashboard
    initCustomerDashboard();
    
    console.log('Customer Dashboard initialized successfully');
});

function initCustomerDashboard() {
    // Navigation
    initNavigation();
    
    // Menu filtering
    initMenuFiltering();
    
    // Gallery filtering
    initGalleryFiltering();
    
    // Shopping cart
    initShoppingCart();
    
    // Forms
    initForms();
    
    // Smooth scrolling for navigation
    initSmoothScrolling();
    
    // Image handling
    initImageHandling();
    
    // Initialize animations
    initAnimations();
}

// Navigation
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            
            // Update active nav link
            navLinks.forEach(nl => nl.classList.remove('active'));
            this.classList.add('active');
            
            // Show target section
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetId) {
                    section.classList.add('active');
                    
                    // Scroll to top of section
                    setTimeout(() => {
                        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
                }
            });
        });
    });
    
    // Update active nav on scroll
    window.addEventListener('scroll', function() {
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

// Smooth scrolling
function initSmoothScrolling() {
    window.scrollToSection = function(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            // Update navigation
            document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
            document.querySelector(`.nav-link[href="#${sectionId}"]`).classList.add('active');
            
            // Show section and scroll to it
            document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
            section.classList.add('active');
            
            setTimeout(() => {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    };
}

// Menu filtering
function initMenuFiltering() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    const menuItems = document.querySelectorAll('.menu-item');
    
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Update active button
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter menu items
            menuItems.forEach(item => {
                if (category === 'all' || item.getAttribute('data-category') === category) {
                    item.style.display = 'flex';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Gallery filtering
function initGalleryFiltering() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter gallery items
            galleryItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 100);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
    
    // Add click to enlarge functionality
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            if (img && img.src) {
                openImageModal(img.src, img.alt);
            }
        });
    });
}

// Image Modal
function openImageModal(src, alt) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('imageModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'imageModal';
        modal.className = 'image-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <img src="${src}" alt="${alt}">
                <div class="image-caption">${alt}</div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Add modal styles
        if (!document.querySelector('#modal-styles')) {
            const styles = document.createElement('style');
            styles.id = 'modal-styles';
            styles.textContent = `
                .image-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.9);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 3000;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }
                .image-modal.active {
                    opacity: 1;
                }
                .modal-content {
                    position: relative;
                    max-width: 90%;
                    max-height: 90%;
                }
                .modal-content img {
                    max-width: 100%;
                    max-height: 80vh;
                    border-radius: 8px;
                }
                .close-modal {
                    position: absolute;
                    top: -40px;
                    right: 0;
                    color: white;
                    font-size: 2rem;
                    cursor: pointer;
                    background: none;
                    border: none;
                }
                .image-caption {
                    color: white;
                    text-align: center;
                    margin-top: 1rem;
                    font-size: 1.1rem;
                }
            `;
            document.head.appendChild(styles);
        }
        
        // Close modal functionality
        modal.querySelector('.close-modal').addEventListener('click', closeImageModal);
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeImageModal();
            }
        });
        
        // Close on ESC key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeImageModal();
            }
        });
    }
    
    // Update modal content and show
    modal.querySelector('img').src = src;
    modal.querySelector('img').alt = alt;
    modal.querySelector('.image-caption').textContent = alt;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeImageModal() {
    const modal = document.getElementById('imageModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
        document.body.style.overflow = '';
    }
}

// Shopping Cart with Database Persistence
function initShoppingCart() {
    let cart = [];
    const cartIcon = document.querySelector('.cart-icon');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const cartOverlay = document.querySelector('.cart-overlay');
    const closeCart = document.querySelector('.close-cart');
    
    // Load cart from database on page load
    loadCartFromDatabase();

    // Update cart count
    function updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        if (totalItems > 0) {
            cartIcon.style.animation = 'bounce 0.5s ease';
            setTimeout(() => {
                cartIcon.style.animation = '';
            }, 500);
        }
    }

    // Load cart from database
    function loadCartFromDatabase() {
        console.log('Attempting to load cart from database...');
        
        const formData = new URLSearchParams();
        formData.append('action', 'get_cart');
        
        fetch('cart_operations.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData
        })
        .then(response => {
            console.log('Response status:', response.status);
            
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            
            return response.text();
        })
        .then(text => {
            console.log('Raw response text:', text);
            
            if (!text || text.trim() === '') {
                throw new Error('Empty response from server');
            }
            
            try {
                const data = JSON.parse(text);
                console.log('Parsed JSON data:', data);
                
                if (data.success) {
                    cart = data.cart || [];
                    updateCartCount();
                    updateCartDisplay();
                    console.log('Cart loaded successfully:', cart);
                } else {
                    console.error('Server returned error:', data.message);
                    loadFromLocalStorage();
                }
            } catch (parseError) {
                console.error('JSON parse error:', parseError);
                loadFromLocalStorage();
            }
        })
        .catch(error => {
            console.error('Error loading cart:', error);
            loadFromLocalStorage();
        });
    }

    // Fallback to local storage
    function loadFromLocalStorage() {
        const localCart = JSON.parse(localStorage.getItem('coffeeCart')) || [];
        if (localCart.length > 0) {
            cart = localCart;
            updateCartCount();
            updateCartDisplay();
            console.log('Loaded cart from local storage:', cart);
        } else {
            console.log('Cart is empty in both database and local storage');
        }
    }

    // Update cart display
    function updateCartDisplay() {
        const cartItems = document.querySelector('.cart-items');
        const cartTotal = document.querySelector('#cartTotal');
        
        cartItems.innerHTML = '';
        
        if (cart.length === 0) {
            cartItems.innerHTML = '<p style="text-align: center; color: var(--text-light); padding: 2rem;">Your cart is empty</p>';
            cartTotal.textContent = '0.00';
            return;
        }
        
        let total = 0;
        
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image || 'media/coffee1.jpg'}" alt="${item.name}" onerror="this.style.display='none'">
                    <div class="image-fallback">
                        <i class="fas fa-coffee"></i>
                    </div>
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                </div>
                <div class="cart-item-actions">
                    <button class="quantity-btn minus" data-id="${item.id || index}">-</button>
                    <span class="item-quantity">${item.quantity}</span>
                    <button class="quantity-btn plus" data-id="${item.id || index}">+</button>
                    <button class="remove-item" data-id="${item.id || index}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });
        
        cartTotal.textContent = total.toFixed(2);
        
        // Add event listeners to cart item buttons
        document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
            btn.addEventListener('click', function() {
                const itemId = this.getAttribute('data-id');
                updateQuantityInDatabase(itemId, -1);
            });
        });
        
        document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
            btn.addEventListener('click', function() {
                const itemId = this.getAttribute('data-id');
                updateQuantityInDatabase(itemId, 1);
            });
        });
        
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', function() {
                const itemId = this.getAttribute('data-id');
                removeFromCartInDatabase(itemId);
            });
        });
    }

    // Add to cart with database persistence
    function addToCart(itemName, itemPrice, itemImage = '') {
        const formData = new URLSearchParams();
        formData.append('action', 'add_to_cart');
        formData.append('item_name', itemName);
        formData.append('item_price', itemPrice);
        formData.append('item_image', itemImage);
        formData.append('quantity', 1);

        fetch('cart_operations.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(text => {
            console.log('Add to cart response:', text);
            try {
                const data = JSON.parse(text);
                if (data.success) {
                    // Reload cart from database to get updated data with IDs
                    loadCartFromDatabase();
                    showNotification(`<strong>${itemName}</strong> added to cart!`, 'success');
                    
                    // Auto-open cart sidebar for first item
                    if (cart.length === 0) {
                        setTimeout(openCartSidebar, 500);
                    }
                } else {
                    console.error('Failed to add to cart:', data.message);
                    addToLocalCart(itemName, itemPrice, itemImage);
                }
            } catch (error) {
                console.error('JSON parse error in addToCart:', error);
                addToLocalCart(itemName, itemPrice, itemImage);
            }
        })
        .catch(error => {
            console.error('Error adding to cart:', error);
            addToLocalCart(itemName, itemPrice, itemImage);
        });
    }

    // Fallback: Add to local storage cart
    function addToLocalCart(itemName, itemPrice, itemImage = '') {
        let localCart = JSON.parse(localStorage.getItem('coffeeCart')) || [];
        const existingItem = localCart.find(item => item.name === itemName);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            localCart.push({
                name: itemName,
                price: parseFloat(itemPrice),
                image: itemImage,
                quantity: 1
            });
        }
        
        localStorage.setItem('coffeeCart', JSON.stringify(localCart));
        cart = localCart;
        updateCartCount();
        updateCartDisplay();
        showNotification(`<strong>${itemName}</strong> added to cart!`, 'success');
        
        if (cart.length === 1) {
            setTimeout(openCartSidebar, 500);
        }
    }

    // Update quantity in database
    function updateQuantityInDatabase(itemId, change) {
        // Check if itemId is a number (database ID) or string (local storage index)
        if (isNaN(itemId)) {
            updateQuantityInLocalStorage(parseInt(itemId), change);
            return;
        }

        const formData = new URLSearchParams();
        formData.append('action', 'update_quantity');
        formData.append('item_id', itemId);
        formData.append('change', change);

        fetch('cart_operations.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(text => {
            try {
                const data = JSON.parse(text);
                if (data.success) {
                    loadCartFromDatabase(); // Reload cart to get updated quantities
                } else {
                    console.warn('Database update failed, using local storage:', data.message);
                    updateQuantityInLocalStorage(parseInt(itemId), change);
                }
            } catch (error) {
                console.error('JSON parse error in updateQuantity:', error);
                updateQuantityInLocalStorage(parseInt(itemId), change);
            }
        })
        .catch(error => {
            console.error('Error updating quantity:', error);
            updateQuantityInLocalStorage(parseInt(itemId), change);
        });
    }

    // Fallback: Update quantity in local storage
    function updateQuantityInLocalStorage(index, change) {
        let localCart = JSON.parse(localStorage.getItem('coffeeCart')) || [];
        localCart[index].quantity += change;
        
        if (localCart[index].quantity <= 0) {
            const itemName = localCart[index].name;
            localCart.splice(index, 1);
            showNotification(`<strong>${itemName}</strong> removed from cart`, 'info');
        } else {
            showNotification(`<strong>${localCart[index].name}</strong> quantity updated to ${localCart[index].quantity}`, 'info');
        }
        
        localStorage.setItem('coffeeCart', JSON.stringify(localCart));
        cart = localCart;
        updateCartCount();
        updateCartDisplay();
    }

    // Remove from cart in database
    function removeFromCartInDatabase(itemId) {
        // Check if itemId is a number (database ID) or string (local storage index)
        if (isNaN(itemId)) {
            removeFromLocalStorage(parseInt(itemId));
            return;
        }

        const formData = new URLSearchParams();
        formData.append('action', 'remove_from_cart');
        formData.append('item_id', itemId);

        fetch('cart_operations.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(text => {
            try {
                const data = JSON.parse(text);
                if (data.success) {
                    loadCartFromDatabase(); // Reload cart after removal
                    showNotification('Item removed from cart', 'info');
                } else {
                    console.warn('Database removal failed, using local storage:', data.message);
                    removeFromLocalStorage(parseInt(itemId));
                }
            } catch (error) {
                console.error('JSON parse error in removeFromCart:', error);
                removeFromLocalStorage(parseInt(itemId));
            }
        })
        .catch(error => {
            console.error('Error removing from cart:', error);
            removeFromLocalStorage(parseInt(itemId));
        });
    }

    // Fallback: Remove from local storage
    function removeFromLocalStorage(index) {
        let localCart = JSON.parse(localStorage.getItem('coffeeCart')) || [];
        const itemName = localCart[index].name;
        localCart.splice(index, 1);
        localStorage.setItem('coffeeCart', JSON.stringify(localCart));
        cart = localCart;
        updateCartCount();
        updateCartDisplay();
        showNotification(`<strong>${itemName}</strong> removed from cart`, 'info');
    }

    // Open cart sidebar
    function openCartSidebar() {
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Close cart sidebar
    function closeCartSidebar() {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Add to cart buttons
    document.querySelectorAll('.btn-add-to-cart').forEach(btn => {
        btn.addEventListener('click', function() {
            const itemName = this.getAttribute('data-item');
            const itemPrice = this.getAttribute('data-price');
            const itemCard = this.closest('.featured-card, .menu-item');
            const itemImage = itemCard ? itemCard.querySelector('img') : null;
            const imageSrc = itemImage ? itemImage.src : '';
            
            addToCart(itemName, itemPrice, imageSrc);
        });
    });

    // Cart toggle
    cartIcon.addEventListener('click', openCartSidebar);
    closeCart.addEventListener('click', closeCartSidebar);
    cartOverlay.addEventListener('click', closeCartSidebar);

    // Checkout button
    document.querySelector('.btn-checkout').addEventListener('click', function() {
        if (cart.length === 0) {
            showNotification('Your cart is empty!', 'error');
            return;
        }

        // Simulate checkout process
        showNotification('Processing your order...', 'info');
        
        setTimeout(() => {
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            showNotification(`Order placed successfully! Total: $${total.toFixed(2)}. Thank you for your purchase.`, 'success');
            
            // Clear cart after successful checkout
            clearCartInDatabase();
        }, 2000);
    });

    // Clear cart in database after checkout
    function clearCartInDatabase() {
        const formData = new URLSearchParams();
        formData.append('action', 'clear_cart');

        fetch('cart_operations.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(text => {
            try {
                const data = JSON.parse(text);
                if (data.success) {
                    cart = [];
                    updateCartCount();
                    updateCartDisplay();
                    closeCartSidebar();
                    // Also clear local storage
                    localStorage.removeItem('coffeeCart');
                } else {
                    console.warn('Database clear failed, clearing local storage:', data.message);
                    clearLocalStorage();
                }
            } catch (error) {
                console.error('JSON parse error in clearCart:', error);
                clearLocalStorage();
            }
        })
        .catch(error => {
            console.error('Error clearing cart:', error);
            clearLocalStorage();
        });
    }

    // Fallback: Clear local storage
    function clearLocalStorage() {
        localStorage.removeItem('coffeeCart');
        cart = [];
        updateCartCount();
        updateCartDisplay();
        closeCartSidebar();
    }

    // Initialize cart display
    updateCartCount();
}

// Forms
function initForms() {
    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('contactName').value,
                email: document.getElementById('contactEmail').value,
                subject: document.getElementById('contactSubject').value,
                message: document.getElementById('contactMessage').value,
                timestamp: new Date().toISOString()
            };
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission
            setTimeout(() => {
                // Save to localStorage (simulating database storage)
                const existingMessages = JSON.parse(localStorage.getItem('contactMessages')) || [];
                existingMessages.push(formData);
                localStorage.setItem('contactMessages', JSON.stringify(existingMessages));
                
                showNotification('Message sent successfully! We\'ll get back to you within 24 hours.', 'success');
                contactForm.reset();
                
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }
    
    // Feedback form
    const feedbackForm = document.getElementById('feedbackForm');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                coffeeType: document.getElementById('coffeeType').value,
                rating: document.querySelector('input[name="rating"]:checked')?.value,
                message: document.getElementById('feedbackMessage').value,
                recommend: document.getElementById('recommend').checked,
                timestamp: new Date().toISOString(),
                user: '<?php echo $_SESSION["username"]; ?>'
            };
            
            if (!formData.rating) {
                showNotification('Please rate your experience!', 'error');
                return;
            }
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
            submitBtn.disabled = true;
            
            // Simulate form submission
            setTimeout(() => {
                // Save to localStorage (simulating database storage)
                const existingFeedback = JSON.parse(localStorage.getItem('coffeeFeedback')) || [];
                existingFeedback.push(formData);
                localStorage.setItem('coffeeFeedback', JSON.stringify(existingFeedback));
                
                showNotification('Thank you for your valuable feedback! We appreciate your input.', 'success');
                feedbackForm.reset();
                
                // Reset stars
                document.querySelectorAll('input[name="rating"]').forEach(radio => {
                    radio.checked = false;
                });
                
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Update recent feedback display
                updateRecentFeedback();
            }, 1500);
        });
    }
    
    // Initialize recent feedback
    updateRecentFeedback();
}

// Update recent feedback display
function updateRecentFeedback() {
    const feedbackList = document.querySelector('.feedback-list');
    if (!feedbackList) return;
    
    const existingFeedback = JSON.parse(localStorage.getItem('coffeeFeedback')) || [];
    const recentFeedback = existingFeedback.slice(-2).reverse(); // Get last 2, most recent first
    
    if (recentFeedback.length === 0) {
        // Show sample feedback if no real feedback exists
        feedbackList.innerHTML = `
            <div class="feedback-item">
                <div class="feedback-header">
                    <div class="user-avatar small">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="user-info">
                        <strong>Sarah M.</strong>
                        <div class="rating">
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                        </div>
                    </div>
                </div>
                <p>"The caramel macchiato is absolutely divine! Best coffee I've had in years."</p>
                <span class="feedback-date">2 hours ago</span>
            </div>
            <div class="feedback-item">
                <div class="feedback-header">
                    <div class="user-avatar small">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="user-info">
                        <strong>John D.</strong>
                        <div class="rating">
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star-half-alt"></i>
                        </div>
                    </div>
                </div>
                <p>"Great atmosphere and friendly staff. The cold brew is perfect for summer!"</p>
                <span class="feedback-date">1 day ago</span>
            </div>
        `;
        return;
    }
    
    feedbackList.innerHTML = recentFeedback.map(feedback => {
        const stars = Array.from({length: 5}, (_, i) => {
            const starValue = i + 1;
            if (starValue <= feedback.rating) {
                return '<i class="fas fa-star"></i>';
            } else if (starValue - 0.5 <= feedback.rating) {
                return '<i class="fas fa-star-half-alt"></i>';
            } else {
                return '<i class="far fa-star"></i>';
            }
        }).join('');
        
        const timeAgo = getTimeAgo(new Date(feedback.timestamp));
        
        return `
            <div class="feedback-item">
                <div class="feedback-header">
                    <div class="user-avatar small">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="user-info">
                        <strong>${feedback.user || 'Anonymous'}</strong>
                        <div class="rating">
                            ${stars}
                        </div>
                    </div>
                </div>
                <p>"${feedback.message}"</p>
                <span class="feedback-date">${timeAgo}</span>
            </div>
        `;
    }).join('');
}

// Image handling
function initImageHandling() {
    // Preload images and handle errors
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        // Add loading state
        img.addEventListener('load', function() {
            this.style.opacity = '1';
            console.log('Image loaded successfully:', this.src);
        });
        
        img.addEventListener('error', function() {
            console.log('Image failed to load:', this.src);
            this.style.display = 'none';
        });
        
        // Set initial opacity for fade-in effect
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
    });
    
    // Lazy loading for images
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                observer.unobserve(img);
            }
        });
    });
    
    // Observe images for lazy loading
    images.forEach(img => {
        if (img.dataset.src) {
            imageObserver.observe(img);
        }
    });
}

// Animations
function initAnimations() {
    // Add bounce animation for cart
    if (!document.querySelector('#cart-animations')) {
        const styles = document.createElement('style');
        styles.id = 'cart-animations';
        styles.textContent = `
            @keyframes bounce {
                0%, 20%, 60%, 100% { transform: translateY(0); }
                40% { transform: translateY(-10px); }
                80% { transform: translateY(-5px); }
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Animate elements on scroll
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
    document.querySelectorAll('.featured-card, .menu-item, .gallery-item, .contact-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Utility Functions
function getTimeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return `${Math.floor(diffInSeconds / 2592000)} months ago`;
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                background: white;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                z-index: 3000;
                transform: translateX(400px);
                transition: transform 0.3s ease;
                border-left: 4px solid #2196F3;
                max-width: 400px;
            }
            .notification-success {
                border-left-color: #4CAF50;
            }
            .notification-error {
                border-left-color: #F44336;
            }
            .notification-warning {
                border-left-color: #FF9800;
            }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            .notification-success i {
                color: #4CAF50;
            }
            .notification-error i {
                color: #F44336;
            }
            .notification-warning i {
                color: #FF9800;
            }
            .notification strong {
                color: var(--dark-color);
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        // Show loading state
        showNotification('Logging out...', 'info');
        
        fetch('auth.php?action=logout')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showNotification('Logged out successfully!', 'success');
                    setTimeout(() => {
                        window.location.href = 'templates/login.html';
                    }, 1000);
                } else {
                    showNotification('Logout failed. Please try again.', 'error');
                }
            })
            .catch(error => {
                console.error('Logout error:', error);
                showNotification('Logout failed. Please try again.', 'error');
            });
    }
}

// Export functions for global access
window.customerDashboard = {
    logout,
    showNotification,
    scrollToSection: window.scrollToSection,
    updateRecentFeedback
};