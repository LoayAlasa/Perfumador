// Updated scripts.js with enhanced notification and fancy confirmation modal for purchase
$(document).ready(function() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

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
                                <button class="add-to-cart-btn" data-name="${perfume.name}" data-price="${perfume.price}" data-image="${perfume.image}">Add to Cart</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            container.append(perfumeItem);
        });
    }

    function updateCartCount() {
        $('#cart-count').text(cart.length);
    }

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function showNotification(message, type = 'success', position = 'top-right') {
        const notification = $(`
            <div class="notification ${type} ${position}">
                <p>${message}</p>
            </div>
        `);
        $('body').append(notification);
        notification.fadeIn(400).delay(2000).fadeOut(400, function() {
            $(this).remove();
        });
    }

    function addToCart(perfume) {
        cart.push(perfume);
        saveCart();
        updateCartCount();
        showNotification(`${perfume.name} has been added to your cart!`, 'success');
    }

    $(document).on('click', '.add-to-cart-btn', function() {
        const perfume = {
            name: $(this).data('name'),
            price: $(this).data('price'),
            image: $(this).data('image'),
            quantity: 1
        };
        addToCart(perfume);
    });

    function loadCart() {
        const container = $('#cart-items');
        const summary = $('#cart-summary');
        const emptyMessage = $('#empty-cart-message');
        container.empty();
        
        if (cart.length === 0) {
            emptyMessage.show();
            summary.hide();
        } else {
            emptyMessage.hide();
            summary.show();
            let totalItems = 0;
            let subtotal = 0;

            cart.forEach((item, index) => {
                totalItems++;
                subtotal += parseFloat(item.price.replace('$', '')) * item.quantity;
                const cartItem = `
                    <tr style="background-color: #1a1a1a; color: #f0f0f0;">
                        <td><img src="${item.image}" alt="${item.name}" width="50" style="border-radius: 5px;"></td>
                        <td>${item.name}</td>
                        <td>${item.price}</td>
                        <td><input type="number" class="quantity" data-index="${index}" value="${item.quantity}" min="1" style="background-color: #333; color: #f0f0f0; border: 1px solid #555; padding: 5px; border-radius: 5px;"></td>
                        <td>$${(item.quantity * parseFloat(item.price.replace('$', ''))).toFixed(2)}</td>
                        <td><button class="remove-item-btn" data-index="${index}" style="background-color: #d9534f; color: white; border: none; padding: 5px 10px; border-radius: 5px;">🗑️</button></td>
                    </tr>
                `;
                container.append(cartItem);
            });

            $('#subtotal').text(`$${subtotal.toFixed(2)}`);
            $('#total').text(`$${(subtotal + 10).toFixed(2)}`); // $10 shipping
        }
    }

    $(document).on('click', '.quantity', function() {
        const index = $(this).data('index');
        const newQuantity = parseInt($(this).val());
        cart[index].quantity = newQuantity;
        saveCart();
        loadCart();
    });

    $(document).on('click', '.remove-item-btn', function() {
        const index = $(this).data('index');
        const removedItem = cart[index];
        cart.splice(index, 1);
        saveCart();
        loadCart();
        updateCartCount();
        showNotification(`${removedItem.name} has been removed from your cart!`, 'error');
    });

    $('#checkout-btn').click(function() {
        const modal = $(`
            <div class="confirmation-modal">
                <div class="modal-content">
                    <h3>Are you sure you want to proceed with the purchase?</h3>
                    <div class="modal-actions">
                        <button class="modal-confirm-btn">Yes</button>
                        <button class="modal-cancel-btn">No</button>
                    </div>
                </div>
            </div>
        `);

        $('body').append(modal);
        $('.confirmation-modal').fadeIn(400);

        $('.modal-confirm-btn').click(function() {
            showNotification('Thank you! Your purchase was successful.', 'success', 'bottom-right');
            cart = [];
            saveCart();
            loadCart();
            updateCartCount();
            modal.fadeOut(400, function() {
                $(this).remove();
            });
        });

        $('.modal-cancel-btn').click(function() {
            modal.fadeOut(400, function() {
                $(this).remove();
            });
        });
    });

    if (window.location.pathname.includes('cart.html')) {
        loadCart();
    }

    loadPerfumes();
    updateCartCount();

    // Ensure "Cart" link works from all pages
    $(".cart-link").on("click", function(event) {
        event.preventDefault();
        window.location.href = "cart.html";
    });

    // Notification and Modal styles
    $('head').append(`
        <style>
            .notification {
                position: fixed;
                padding: 15px 20px;
                border-radius: 5px;
                color: #fff;
                font-size: 16px;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
                z-index: 1000;
                display: none;
            }
            .notification.success {
                background-color: #28a745;
            }
            .notification.error {
                background-color: #dc3545;
            }
            .notification.top-right {
                top: 20px;
                right: 20px;
            }
            .notification.bottom-right {
                bottom: 20px;
                right: 20px;
            }
            .confirmation-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                display: none;
                justify-content: center;
                align-items: center;
                z-index: 2000;
            }
            .modal-content {
                background: #fff;
                padding: 20px;
                border-radius: 10px;
                text-align: center;
                width: 90%;
                max-width: 400px;
            }
            .modal-content h3 {
                margin-bottom: 20px;
                font-size: 18px;
            }
            .modal-actions {
                display: flex;
                justify-content: space-around;
            }
            .modal-confirm-btn,
            .modal-cancel-btn {
                padding: 10px 20px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-size: 14px;
            }
            .modal-confirm-btn {
                background-color: #28a745;
                color: #fff;
            }
            .modal-cancel-btn {
                background-color: #dc3545;
                color: #fff;
            }
        </style>
    `);
});
