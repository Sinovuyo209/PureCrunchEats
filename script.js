document.addEventListener('DOMContentLoaded', function() {
    // Cart functionality
    let cart = [];
    const cartItemsEl = document.getElementById('cart-items');
    const subtotalEl = document.getElementById('subtotal');
    const deliveryFeeEl = document.getElementById('delivery-fee');
    const totalEl = document.getElementById('total');
    const deliveryOption = document.getElementById('delivery-option');
    const checkoutBtn = document.getElementById('checkout-btn');
    const paymentModal = document.getElementById('payment-modal');
    const paymentAmountEl = document.getElementById('payment-amount');
    const orderRefEl = document.getElementById('order-ref');
    const paymentMethods = document.querySelectorAll('.payment-method');
    const capitecInstructions = document.getElementById('capitec-instructions');
    const cardInstructions = document.getElementById('card-instructions');
    const confirmPaymentBtn = document.getElementById('confirm-payment');
    const whatsappProof = document.getElementById('whatsapp-proof');

    // Add to cart
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
            animateAddToCart(this);
        });
    });

    // Update cart display
    function updateCart() {
        // Calculate totals
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const deliveryFee = deliveryOption.value === 'delivery' ? 3 : 0;
        const total = subtotal + deliveryFee;
        
        // Update DOM
        if (cart.length === 0) {
            cartItemsEl.innerHTML = '<p class="empty">Your cart is empty</p>';
            checkoutBtn.disabled = true;
        } else {
            cartItemsEl.innerHTML = '';
            cart.forEach(item => {
                const itemEl = document.createElement('div');
                itemEl.className = 'cart-item';
                itemEl.innerHTML = `
                    <span>${item.name} x${item.quantity}</span>
                    <span>R${(item.price * item.quantity).toFixed(2)}</span>
                    <button class="remove-item" data-name="${item.name}">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                cartItemsEl.appendChild(itemEl);
            });
            
            // Add event listeners to remove buttons
            document.querySelectorAll('.remove-item').forEach(button => {
                button.addEventListener('click', function() {
                    const itemName = this.getAttribute('data-name');
                    cart = cart.filter(item => item.name !== itemName);
                    updateCart();
                });
            });
            
            checkoutBtn.disabled = false;
        }
        
        // Update totals
        subtotalEl.textContent = `R${subtotal.toFixed(2)}`;
        deliveryFeeEl.textContent = deliveryFee > 0 ? `R${deliveryFee.toFixed(2)}` : 'FREE';
        totalEl.textContent = `R${total.toFixed(2)}`;
    }

    // Delivery option change
    deliveryOption.addEventListener('change', updateCart);

    // Checkout button
    checkoutBtn.addEventListener('click', function() {
        if (cart.length === 0) return;
        
        // Generate random order reference
        const orderRef = 'PC' + Date.now().toString().slice(-6);
        
        // Update payment modal
        paymentAmountEl.textContent = totalEl.textContent;
        orderRefEl.textContent = orderRef;
        
        // Show payment modal
        paymentModal.style.display = 'flex';
    });

    // Payment method selection
    paymentMethods.forEach(method => {
        method.addEventListener('click', function() {
            paymentMethods.forEach(m => m.classList.remove('active'));
            this.classList.add('active');
            
            if (this.dataset.method === 'capitec') {
                capitecInstructions.style.display = 'block';
                cardInstructions.style.display = 'none';
            } else {
                capitecInstructions.style.display = 'none';
                cardInstructions.style.display = 'block';
            }
        });
    });

    // Confirm payment (Capitec)
    confirmPaymentBtn.addEventListener('click', function() {
        // In a real app, you would verify payment here
        alert('Thank you! Your payment is being processed.');
        paymentModal.style.display = 'none';
        cart = [];
        updateCart();
    });

    // Send payment proof via WhatsApp
    whatsappProof.addEventListener('click', function(e) {
        e.preventDefault();
        const amount = paymentAmountEl.textContent;
        const ref = orderRefEl.textContent;
        
        const items = cart.map(item => `${item.name} x${item.quantity}`).join('%0A');
        const message = `Payment Proof for Order ${ref}%0AAmount: ${amount}%0AItems:%0A${items}`;
        
        window.open(`https://wa.me/27731575601?text=${message}`, '_blank');
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === paymentModal) {
            paymentModal.style.display = 'none';
        }
    });

    // Animation for add to cart
    function animateAddToCart(button) {
        button.classList.add('pulse');
        setTimeout(() => button.classList.remove('pulse'), 300);
    }

    // Initialize cart
    updateCart();
});
