document.addEventListener('DOMContentLoaded', function() {
    // Cart and Order Management
    let cart = [];
    const cartItemsEl = document.getElementById('cart-items');
    const subtotalEl = document.getElementById('subtotal');
    const deliveryFeeEl = document.getElementById('delivery-fee');
    const grandTotalEl = document.getElementById('grand-total');
    const deliveryMethod = document.getElementById('delivery-method');
    const checkoutBtn = document.getElementById('checkout-btn');
    const paymentModal = document.getElementById('payment-modal');
    const paymentAmountEl = document.getElementById('payment-amount');
    const paymentReferenceEl = document.getElementById('payment-reference');
    const readyTimeEl = document.getElementById('ready-time');
    const sendProofBtn = document.getElementById('send-proof');

    // Add to Cart Functionality
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const name = this.getAttribute('data-name');
            const price = parseFloat(this.getAttribute('data-price'));
            
            // Check if item exists in cart
            const existingItem = cart.find(item => item.name === name);
            
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({
                    name: name,
                    price: price,
                    quantity: 1
                });
            }
            
            updateCart();
        });
    });

    // Update Cart Display
    function updateCart() {
        // Calculate totals
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const deliveryFee = deliveryMethod.value === 'delivery' ? 3 : 0; // R3 delivery fee
        const total = subtotal + deliveryFee;
        
        // Update DOM
        if (cart.length === 0) {
            cartItemsEl.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            checkoutBtn.disabled = true;
        } else {
            cartItemsEl.innerHTML = '';
            cart.forEach(item => {
                const itemEl = document.createElement('div');
                itemEl.className = 'cart-item';
                itemEl.innerHTML = `
                    <div class="item-info">
                        <span class="item-name">${item.name}</span>
                        <span class="item-quantity">x${item.quantity}</span>
                    </div>
                    <div class="item-price">
                        R${(item.price * item.quantity).toFixed(2)}
                        <button class="remove-item" data-name="${item.name}">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `;
                cartItemsEl.appendChild(itemEl);
            });
            
            checkoutBtn.disabled = false;
        }
        
        // Update totals
        subtotalEl.textContent = `R${subtotal.toFixed(2)}`;
        deliveryFeeEl.textContent = deliveryFee > 0 ? `R${deliveryFee.toFixed(2)}` : 'FREE';
        grandTotalEl.textContent = `R${total.toFixed(2)}`;
        
        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function() {
                const itemName = this.getAttribute('data-name');
                cart = cart.filter(item => item.name !== itemName);
                updateCart();
            });
        });
    }

    // Delivery Method Change
    deliveryMethod.addEventListener('change', updateCart);

    // Checkout Process
    checkoutBtn.addEventListener('click', function() {
        if (cart.length === 0) return;
        
        // Calculate preparation time (5 mins per item + 10 mins if delivery)
        let prepTime = cart.reduce((sum, item) => sum + (item.quantity * 5), 0);
        if (deliveryMethod.value === 'delivery') prepTime += 10;
        
        // Set payment details
        paymentAmountEl.textContent = grandTotalEl.textContent;
        paymentReferenceEl.textContent = `ORDER${Date.now().toString().slice(-6)}`;
        readyTimeEl.textContent = `${prepTime} minutes`;
        
        // Show payment modal
        paymentModal.style.display = 'flex';
    });

    // Send Payment Proof via WhatsApp
    sendProofBtn.addEventListener('click', function() {
        const orderRef = paymentReferenceEl.textContent;
        const amount = paymentAmountEl.textContent;
        const items = cart.map(item => `${item.name} x${item.quantity}`).join('%0A');
        
        const whatsappUrl = `https://wa.me/27731575601?text=Payment%20Proof%20for%20Order%20${orderRef}%0AAmount:%20${amount}%0AItems:%0A${items}`;
        window.open(whatsappUrl, '_blank');
        
        // Close modal after sending
        paymentModal.style.display = 'none';
        
        // Clear cart
        cart = [];
        updateCart();
        
        // Show confirmation
        alert('Order received! We\'ll prepare your items and contact you soon.');
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === paymentModal) {
            paymentModal.style.display = 'none';
        }
    });

    // Initialize cart
    updateCart();
});
