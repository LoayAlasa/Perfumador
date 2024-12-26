$(document).ready(function() {
    let cart = [];

    function loadPerfumes() {
        $.ajax({
            url: 'data/perfumes.json',
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                displayPerfumes(data);
            },
            error: function(error) {
                console.error('Error fetching data:', error);
                $('#perfume-container').html('<p>Error loading perfumes. Please try again later.</p>');
            }
        });
    }

    function displayPerfumes(perfumes) {
        const container = $('#perfume-container');
        container.empty();
        perfumes.forEach(function(perfume) {
            const perfumeItem = `
                <div class="perfume-item">
                    <div class="image-container">
                        <img src="${perfume.image}" alt="${perfume.name}" loading="lazy">
                        <div class="overlay">
                            <div class="overlay-content">
                                <h3>${perfume.name}</h3>
                                <p class="price">${perfume.price}</p>
                                <button class="add-to-cart-btn">Add to Cart</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            container.append(perfumeItem);
        });
    }

    loadPerfumes();

    $('#search-bar').on('input', function() {
        const query = $(this).val().toLowerCase();
        $('.perfume-item').filter(function() {
            $(this).toggle($(this).find('h3').text().toLowerCase().indexOf(query) > -1)
        });
    });

    function updateCartCount() {
        $('#cart-count').text(cart.length);
    }

    $(document).on('click', '.add-to-cart-btn', function() {
        const perfumeName = $(this).closest('.perfume-item').find('h3').text();
        cart.push(perfumeName);
        updateCartCount();
        showCartModal(`"${perfumeName}" has been added to your cart!`);
    });

    const modal = $('<div id="cart-modal" class="modal"></div>');
    const modalContent = `
        <div class="modal-content">
            <span class="close-btn">&times;</span>
            <p id="cart-message"></p>
        </div>
    `;
    modal.html(modalContent);
    $('body').append(modal);

    function showCartModal(message) {
        $('#cart-message').text(message);
        $('#cart-modal').fadeIn();
    }

    $(document).on('click', '.close-btn', function() {
        $('#cart-modal').fadeOut();
    });

    $(window).on('click', function(event) {
        if ($(event.target).is('#cart-modal')) {
            $('#cart-modal').fadeOut();
        }
    });

    $('#contact-form').on('submit', function(event) {
        event.preventDefault();
        $('#form-message').empty();
        let isValid = true;
        $(this).find('input, textarea, select').each(function() {
            if (!this.checkValidity()) {
                isValid = false;
                $(this).addClass('input-error');
            } else {
                $(this).removeClass('input-error');
            }
        });
        if (isValid) {
            $('#form-message').html('<p class="success">Thank you for contacting us! We will get back to you shortly.</p>');
            $(this)[0].reset();
        } else {
            $('#form-message').html('<p class="error">Please fill out all required fields correctly.</p>');
        }
    });

    $('#subscribe-form').on('submit', function(event) {
        event.preventDefault();
        $('#subscribe-message').empty();
        let isValid = true;
        const emailInput = $('#subscribe-email');
        if (!emailInput.val()) {
            isValid = false;
            emailInput.addClass('input-error');
        } else if (!validateEmail(emailInput.val())) {
            isValid = false;
            emailInput.addClass('input-error');
        } else {
            emailInput.removeClass('input-error');
        }
        if (isValid) {
            $('#subscribe-message').html('<p class="success">Thank you for subscribing! Stay tuned for exclusive offers.</p>');
            $(this)[0].reset();
        } else {
            $('#subscribe-message').html('<p class="error">Please enter a valid email address.</p>');
        }
    });

    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i;
        return re.test(String(email).toLowerCase());
    }

    // Page Transition Logic
    $('a[href^="http"]').on('click', function(event) {
        // External links, ignore
        return;
    });

    $('a[href^="/"], a[href^="./"], a[href^="../"], a[href$=".html"]').on('click', function(event) {
        event.preventDefault();
        const href = $(this).attr('href');
        $('body').addClass('fade-out');
        setTimeout(function() {
            window.location.href = href;
        }, 500); // Match the CSS transition duration
    });

    // Apply fade-in on page load
    $('body').addClass('fade-in');
    setTimeout(function() {
        $('body').removeClass('fade-in');
        $('#page-transition').css('opacity', '1');
    }, 500); // Match the CSS transition duration
});
