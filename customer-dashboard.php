<?php
// customer-dashboard.php
session_start();

// Strict customer-only access
if (!isset($_SESSION['loggedin']) || $_SESSION['loggedin'] !== true) {
    header('Location: templates/login.html');
    exit;
}

// Only allow customer users with specific user_type
if (!isset($_SESSION['user_type']) || $_SESSION['user_type'] !== 'customer') {
    // Clear session and redirect to login
    session_destroy();
    header('Location: templates/login.html');
    exit;
}

// Prevent access if admin
if (isset($_SESSION['is_admin']) && $_SESSION['is_admin'] === true) {
    session_destroy();
    header('Location: templates/login.html');
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title> Ramanuj BCA Wallah Cafe - Customer Dashboard</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="static/customer-style.css">
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar">
        <div class="nav-container">
            <div class="nav-logo">
                <i class="fas fa-mug-hot"></i>
                <span>Ramanuj Cafe</span>
            </div>
            <div class="nav-menu">
                <a href="#home" class="nav-link active">Home</a>
                <a href="#menu" class="nav-link">Menu</a>
                <a href="#gallery" class="nav-link">Gallery</a>
                <a href="#contact" class="nav-link">Contact</a>
                <a href="#feedback" class="nav-link">Feedback</a>
            </div>
            <div class="nav-actions">
                <div class="cart-icon">
                    <i class="fas fa-shopping-cart"></i>
                    <span class="cart-count">0</span>
                </div>
                <div class="user-menu">
                    <div class="user-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <span class="username"><?php echo $_SESSION['username']; ?></span>
                    <button class="logout-btn" onclick="logout()">Logout</button>
                </div>
            </div>
        </div>
    </nav>

    <!-- Main Content -->
    <main class="main-content">
        <!-- Home Section -->
        <section id="home" class="section active">
            <div class="hero-section">
                <div class="hero-content">
                    <h1>Welcome to Ramanuj BCA Wallah Cafe</h1>
                    <p>Experience the finest coffee crafted with passion and precision. Every cup tells a story.</p>
                    <div class="hero-buttons">
                        <button class="btn-primary" onclick="scrollToSection('menu')">Order Now</button>
                        <button class="btn-secondary" onclick="scrollToSection('gallery')">View Gallery</button>
                    </div>
                </div>
                <div class="hero-image">
                    <div class="coffee-cup">
                        <i class="fas fa-mug-hot"></i>
                    </div>
                </div>
            </div>

            <!-- Featured Coffees -->
            <div class="featured-section">
                <h2>Today's Specials</h2>
                <div class="featured-grid">
                    <div class="featured-card">
                        <div class="coffee-image">
                            <!-- <img src="media/coffee1.jpg" alt="Caramel Macchiato"> -->
                            <div class="image-fallback">
                                <!-- <i class="fas fa-coffee"></i> -->
                                  <img src="media/coffee1.jpg" alt="Caramel Macchiato">
                            </div>
                        </div>
                        <div class="coffee-info">
                            <h3>Caramel Macchiato</h3>
                            <p>Rich espresso with vanilla-flavored syrup, milk and caramel drizzle</p>
                            <div class="coffee-price">$4.99</div>
                            <button class="btn-add-to-cart" data-item="Caramel Macchiato" data-price="4.99">
                                <i class="fas fa-plus"></i> Add to Cart
                            </button>
                        </div>
                    </div>

                    <div class="featured-card">
                        <div class="coffee-image">
                            <!-- <img src="media/coffee2.jpg" alt="Iced Americano"> -->
                            <div class="image-fallback">
                                <!-- <i class="fas fa-mug-hot"></i> -->
                                <img src="media/coffee2.jpg" alt="Iced Americano">
                            </div>
                        </div>
                        <div class="coffee-info">
                            <h3>Iced Americano</h3>
                            <p>Espresso shots topped with cold water and served over ice</p>
                            <div class="coffee-price">$3.99</div>
                            <button class="btn-add-to-cart" data-item="Iced Americano" data-price="3.99">
                                <i class="fas fa-plus"></i> Add to Cart
                            </button>
                        </div>
                    </div>

                    <div class="featured-card">
                        <div class="coffee-image">
                            <!-- <img src="media/coffee3.jpg" alt="Vanilla Latte"> -->
                            <div class="image-fallback">
                                <!-- <i class="fas fa-mug-hot"></i> -->
                                <img src="media/coffee3.jpg" alt="Vanilla Latte">
                            </div>
                        </div>
                        <div class="coffee-info">
                            <h3>Vanilla Latte</h3>
                            <p>Espresso with steamed milk and vanilla syrup</p>
                            <div class="coffee-price">$4.49</div>
                            <button class="btn-add-to-cart" data-item="Vanilla Latte" data-price="4.49">
                                <i class="fas fa-plus"></i> Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Menu Section -->
        <section id="menu" class="section">
            <div class="section-header">
                <h1>Our Coffee Menu</h1>
                <p>Discover our carefully crafted selection of coffee beverages</p>
            </div>

            <div class="menu-categories">
                <button class="category-btn active" data-category="all">All Items</button>
                <button class="category-btn" data-category="hot">Hot Coffee</button>
                <button class="category-btn" data-category="cold">Cold Coffee</button>
                <button class="category-btn" data-category="espresso">Espresso</button>
                <button class="category-btn" data-category="specialty">Specialty Drinks</button>
            </div>

            <div class="menu-grid">
                <!-- Hot Coffees -->
                <div class="menu-item" data-category="hot">
                    <div class="item-image">
                        <!-- <img src="media/coffee1.jpg" alt="Classic Brew"> -->
                        <div class="image-fallback">
                            <!-- <i class="fas fa-fire"></i> -->
                            <img src="media/coffee1.jpg" alt="Classic Brew">
                        </div>
                    </div>
                    <div class="item-details">
                        <h3>Classic Brew</h3>
                        <p>Freshly brewed coffee made from premium beans</p>
                        <div class="item-price">$2.99</div>
                        <button class="btn-add-to-cart" data-item="Classic Brew" data-price="2.99">
                            <i class="fas fa-plus"></i> Add to Cart
                        </button>
                    </div>
                </div>

                <div class="menu-item" data-category="hot">
                    <div class="item-image">
                        <!-- <img src="media/coffee2.jpg" alt="Cappuccino"> -->
                        <div class="image-fallback">
                            <!-- <i class="fas fa-mug-hot"></i> -->
                            <img src="media/coffee2.jpg" alt="Cappuccino">
                        </div>
                    </div>
                    <div class="item-details">
                        <h3>Cappuccino</h3>
                        <p>Espresso with steamed milk and a thick layer of foam</p>
                        <div class="item-price">$3.99</div>
                        <button class="btn-add-to-cart" data-item="Cappuccino" data-price="3.99">
                            <i class="fas fa-plus"></i> Add to Cart
                        </button>
                    </div>
                </div>

                <!-- Cold Coffees -->
                <div class="menu-item" data-category="cold">
                    <div class="item-image">
                        <!-- <img src="media/coffee3.jpg" alt="Iced Coffee"> -->
                        <div class="image-fallback">
                            <!-- <i class="fas fa-snowflake"></i> -->
                            <img src="media/coffee3.jpg" alt="Iced Coffee">
                        </div>
                    </div>
                    <div class="item-details">
                        <h3>Iced Coffee</h3>
                        <p>Chilled coffee served with ice and your choice of milk</p>
                        <div class="item-price">$3.49</div>
                        <button class="btn-add-to-cart" data-item="Iced Coffee" data-price="3.49">
                            <i class="fas fa-plus"></i> Add to Cart
                        </button>
                    </div>
                </div>

                <div class="menu-item" data-category="cold">
                    <div class="item-image">
                        <!-- <img src="media/coffee1.jpg" alt="Cold Brew"> -->
                        <div class="image-fallback">
                            <!-- <i class="fas fa-wind"></i> -->
                            <img src="media/coffee1.jpg" alt="Cold Brew">
                        </div>
                    </div>
                    <div class="item-details">
                        <h3>Cold Brew</h3>
                        <p>Slow-steeped coffee for a smooth, rich flavor</p>
                        <div class="item-price">$4.29</div>
                        <button class="btn-add-to-cart" data-item="Cold Brew" data-price="4.29">
                            <i class="fas fa-plus"></i> Add to Cart
                        </button>
                    </div>
                </div>

                <!-- Espresso -->
                <div class="menu-item" data-category="espresso">
                    <div class="item-image">
                        <!-- <img src="media/coffee2.jpg" alt="Espresso Shot"> -->
                        <div class="image-fallback">
                            <!-- <i class="fas fa-coffee"></i> -->
                            <img src="media/coffee2.jpg" alt="Espresso Shot">
                        </div>
                    </div>
                    <div class="item-details">
                        <h3>Espresso Shot</h3>
                        <p>Concentrated coffee brewed by forcing hot water through finely-ground beans</p>
                        <div class="item-price">$2.49</div>
                        <button class="btn-add-to-cart" data-item="Espresso Shot" data-price="2.49">
                            <i class="fas fa-plus"></i> Add to Cart
                        </button>
                    </div>
                </div>

                <div class="menu-item" data-category="espresso">
                    <div class="item-image">
                        <!-- <img src="media/coffee3.jpg" alt="Double Espresso"> -->
                        <div class="image-fallback">
                            <!-- <i class="fas fa-coffee"></i> -->
                            <img src="media/coffee3.jpg" alt="Double Espresso">
                        </div>
                    </div>
                    <div class="item-details">
                        <h3>Double Espresso</h3>
                        <p>Two shots of our finest espresso for an extra boost</p>
                        <div class="item-price">$3.99</div>
                        <button class="btn-add-to-cart" data-item="Double Espresso" data-price="3.99">
                            <i class="fas fa-plus"></i> Add to Cart
                        </button>
                    </div>
                </div>

                <!-- Specialty Drinks -->
                <div class="menu-item" data-category="specialty">
                    <div class="item-image">
                        <!-- <img src="media/coffee1.jpg" alt="Mocha Delight"> -->
                        <div class="image-fallback">
                            <!-- <i class="fas fa-crown"></i> -->
                            <img src="media/coffee1.jpg" alt="Mocha Delight">
                        </div>
                    </div>
                    <div class="item-details">
                        <h3>Mocha Delight</h3>
                        <p>Espresso with chocolate syrup, steamed milk, and whipped cream</p>
                        <div class="item-price">$5.49</div>
                        <button class="btn-add-to-cart" data-item="Mocha Delight" data-price="5.49">
                            <i class="fas fa-plus"></i> Add to Cart
                        </button>
                    </div>
                </div>

                <div class="menu-item" data-category="specialty">
                    <div class="item-image">
                        <!-- <img src="media/coffee2.jpg" alt="Hazelnut Dream"> -->
                        <div class="image-fallback">
                            <!-- <i class="fas fa-star"></i> -->
                            <img src="media/coffee2.jpg" alt="Hazelnut Dream">
                        </div>
                    </div>
                    <div class="item-details">
                        <h3>Hazelnut Dream</h3>
                        <p>Espresso with hazelnut syrup and steamed milk</p>
                        <div class="item-price">$4.99</div>
                        <button class="btn-add-to-cart" data-item="Hazelnut Dream" data-price="4.99">
                            <i class="fas fa-plus"></i> Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <!-- Gallery Section -->
        <section id="gallery" class="section">
            <div class="section-header">
                <h1>Our Coffee Gallery</h1>
                <p>Take a visual journey through our coffee world</p>
            </div>

            <div class="gallery-filters">
                <button class="filter-btn active" data-filter="all">All</button>
                <button class="filter-btn" data-filter="coffee">Coffee Art</button>
                <button class="filter-btn" data-filter="cafe">Our Café</button>
                <button class="filter-btn" data-filter="beans">Coffee Beans</button>
            </div>

            <div class="gallery-grid">
                <div class="gallery-item" data-category="coffee">
                    <div class="gallery-image">
                        <!-- <img src="media/gallery/coffee-art1.jpg" alt="Coffee Art"> -->
                        <div class="image-fallback">
                            <!-- <i class="fas fa-coffee"></i> -->
                            <img src="media/gallery/coffee-art1.jpg" alt="Coffee Art">
                        </div>
                        <div class="image-overlay">
                            <span>Coffee Art</span>
                        </div>
                    </div>
                </div>

                <div class="gallery-item" data-category="cafe">
                    <div class="gallery-image">
                        <!-- <img src="media/gallery/cafe1.jpg" alt="Our Café"> -->
                        <div class="image-fallback">
                            <!-- <i class="fas fa-store"></i> -->
                            <img src="media/gallery/cafe1.jpg" alt="Our Café">
                        </div>
                        <div class="image-overlay">
                            <span>Our Café</span>
                        </div>
                    </div>
                </div>

                <div class="gallery-item" data-category="beans">
                    <div class="gallery-image">
                        <!-- <img src="media/gallery/coffee-art2.jpg" alt="Coffee Beans"> -->
                        <div class="image-fallback">
                            <!-- <i class="fas fa-seedling"></i> -->
                            <img src="media/gallery/coffee-art2.jpg" alt="Coffee Beans">
                        </div>
                        <div class="image-overlay">
                            <span>Coffee Beans</span>
                        </div>
                    </div>
                </div>

                <div class="gallery-item" data-category="coffee">
                    <div class="gallery-image">
                        <!-- <img src="media/gallery/cafe2.jpg" alt="Latte Art"> -->
                        <div class="image-fallback">
                            <!-- <i class="fas fa-mug-hot"></i> -->
                            <img src="media/gallery/cafe2.jpg" alt="Latte Art">
                        </div>
                        <div class="image-overlay">
                            <span>Latte Art</span>
                        </div>
                    </div>
                </div>

                <div class="gallery-item" data-category="cafe">
                    <div class="gallery-image">
                        <!-- <img src="media/coffee1.jpg" alt="Café Interior"> -->
                        <div class="image-fallback">
                            <!-- <i class="fas fa-chair"></i> -->
                            <img src="media/coffee1.jpg" alt="Café Interior">
                        </div>
                        <div class="image-overlay">
                            <span>Café Interior</span>
                        </div>
                    </div>
                </div>

                <div class="gallery-item" data-category="beans">
                    <div class="gallery-image">
                        <!-- <img src="media/coffee2.jpg" alt="Fresh Grounds"> -->
                        <div class="image-fallback">
                            <!-- <i class="fas fa-mortar-pestle"></i> -->
                            <img src="media/coffee2.jpg" alt="Fresh Grounds">
                        </div>
                        <div class="image-overlay">
                            <span>Fresh Grounds</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Contact Section -->
        <section id="contact" class="section">
            <div class="section-header">
                <h1>Contact Us</h1>
                <p>We'd love to hear from you. Visit us or get in touch!</p>
            </div>

            <div class="contact-container">
                <div class="contact-info">
                    <div class="contact-card">
                        <div class="contact-icon">
                            <i class="fas fa-map-marker-alt"></i>
                        </div>
                        <div class="contact-details">
                            <h3>Visit Our Café</h3>
                            <p>123 Coffee Street<br>Brew City, BC 12345</p>
                        </div>
                    </div>

                    <div class="contact-card">
                        <div class="contact-icon">
                            <i class="fas fa-phone"></i>
                        </div>
                        <div class="contact-details">
                            <h3>Call Us</h3>
                            <p>+1 (555) 123-COFFEE<br>Mon-Sun: 6:00 AM - 10:00 PM</p>
                        </div>
                    </div>

                    <div class="contact-card">
                        <div class="contact-icon">
                            <i class="fas fa-envelope"></i>
                        </div>
                        <div class="contact-details">
                            <h3>Email Us</h3>
                            <p>hello@brewmaster.com<br>We respond within 24 hours</p>
                        </div>
                    </div>

                    <div class="contact-card">
                        <div class="contact-icon">
                            <i class="fas fa-clock"></i>
                        </div>
                        <div class="contact-details">
                            <h3>Opening Hours</h3>
                            <p>Monday - Friday: 6:00 AM - 10:00 PM<br>Weekend: 7:00 AM - 11:00 PM</p>
                        </div>
                    </div>
                </div>

                <div class="contact-form">
                    <h3>Send us a Message</h3>
                    <form id="contactForm">
                        <div class="form-group">
                            <input type="text" id="contactName" placeholder="Your Name" required>
                        </div>
                        <div class="form-group">
                            <input type="email" id="contactEmail" placeholder="Your Email" required>
                        </div>
                        <div class="form-group">
                            <input type="text" id="contactSubject" placeholder="Subject" required>
                        </div>
                        <div class="form-group">
                            <textarea id="contactMessage" placeholder="Your Message" rows="5" required></textarea>
                        </div>
                        <button type="submit" class="btn-primary">
                            <i class="fas fa-paper-plane"></i> Send Message
                        </button>
                    </form>
                </div>
            </div>
        </section>

        <!-- Feedback Section -->
        <section id="feedback" class="section">
            <div class="section-header">
                <h1>Share Your Experience</h1>
                <p>Your feedback helps us serve you better</p>
            </div>

            <div class="feedback-container">
                <div class="feedback-form">
                    <h3>Leave Your Feedback</h3>
                    <form id="feedbackForm">
                        <div class="form-group">
                            <label for="coffeeType">Coffee Type</label>
                            <select id="coffeeType" required>
                                <option value="">Select Coffee Type</option>
                                <option value="espresso">Espresso</option>
                                <option value="latte">Latte</option>
                                <option value="cappuccino">Cappuccino</option>
                                <option value="americano">Americano</option>
                                <option value="cold-brew">Cold Brew</option>
                                <option value="specialty">Specialty Drink</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label>Rate Your Experience</label>
                            <div class="rating-stars">
                                <input type="radio" id="star5" name="rating" value="5">
                                <label for="star5"><i class="fas fa-star"></i></label>
                                <input type="radio" id="star4" name="rating" value="4">
                                <label for="star4"><i class="fas fa-star"></i></label>
                                <input type="radio" id="star3" name="rating" value="3">
                                <label for="star3"><i class="fas fa-star"></i></label>
                                <input type="radio" id="star2" name="rating" value="2">
                                <label for="star2"><i class="fas fa-star"></i></label>
                                <input type="radio" id="star1" name="rating" value="1">
                                <label for="star1"><i class="fas fa-star"></i></label>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="feedbackMessage">Your Feedback</label>
                            <textarea id="feedbackMessage" placeholder="Tell us about your experience..." rows="4" required></textarea>
                        </div>

                        <div class="form-group">
                            <label class="checkbox-label">
                                <input type="checkbox" id="recommend" name="recommend">
                                <span class="checkmark"></span>
                                I would recommend BrewMaster to others
                            </label>
                        </div>

                        <button type="submit" class="btn-primary">
                            <i class="fas fa-comment"></i> Submit Feedback
                        </button>
                    </form>
                </div>

                <div class="recent-feedback">
                    <h3>Recent Feedback</h3>
                    <div class="feedback-list">
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
                    </div>
                </div>
            </div>
        </section>
    </main>

    <!-- Shopping Cart Sidebar -->
    <div class="cart-sidebar">
        <div class="cart-header">
            <h3>Your Order</h3>
            <button class="close-cart">&times;</button>
        </div>
        <div class="cart-items">
            <!-- Cart items will be added here dynamically -->
        </div>
        <div class="cart-footer">
            <div class="cart-total">
                <strong>Total: $<span id="cartTotal">0.00</span></strong>
            </div>
            <button class="btn-checkout">Proceed to Checkout</button>
        </div>
    </div>
    <div class="cart-overlay"></div>

    <!-- Footer -->
    <footer class="footer">
        <div class="footer-content">
            <div class="footer-section">
                <h3>Ramanuj BCA Wallah Cafe</h3>
                <p>Creating memorable coffee experiences since 2010. Every cup tells our story.</p>
                <div class="social-links">
                    <a href="#"><i class="fab fa-facebook"></i></a>
                    <a href="#"><i class="fab fa-instagram"></i></a>
                    <a href="#"><i class="fab fa-twitter"></i></a>
                </div>
            </div>
            <div class="footer-section">
                <h3>Quick Links</h3>
                <a href="#menu">Our Menu</a>
                <a href="#gallery">Gallery</a>
                <a href="#contact">Contact</a>
                <a href="#feedback">Feedback</a>
            </div>
            <div class="footer-section">
                <h3>Contact Info</h3>
                <p><i class="fas fa-map-marker-alt"></i> 271001 Chowk Market, Gonda City</p>
                <p><i class="fas fa-phone"></i> +91 6387951614-COFFEE</p>
                <p><i class="fas fa-envelope"></i> hello@ramanuj.com</p>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2025 Ramanuj BCA Wallah Cafe. All rights reserved.</p>
        </div>
    </footer>

    <script src="static/customer-script.js"></script>
</body>
</html>