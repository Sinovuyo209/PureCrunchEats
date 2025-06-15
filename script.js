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
    const sendProofBtn = document.getElementById('send-proof');
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

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
                const cartItem = document.createElement('div');
                cartItem.className = 'row';
                cartItem.innerHTML = `
                    <span>${item.name} x${item.quantity}</span>
                    <span>R${(item.price * item.quantity).toFixed(2)}</span>
                `;
                cartItemsEl.appendChild(cartItem);
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
        const orderRef = 'PC' + Math.floor(Math.random() * 1000000);
        
        // Update payment modal
        paymentAmountEl.textContent = totalEl.textContent;
        orderRefEl.textContent = orderRef;
        
        // Show payment modal
        paymentModal.style.display = 'flex';
    });

    // Payment tabs
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.style.display = 'none');
            
            this.classList.add('active');
            document.getElementById(this.getAttribute('data-tab') + '-tab').style.display = 'block';
        });
    });

    // Send payment proof via WhatsApp
    sendProofBtn.addEventListener('click', function() {
        const amount = paymentAmountEl.textContent;
        const ref = orderRefEl.textContent;
        
        const items = cart.map(item => `${item.name} x${item.quantity}`).join('%0A');
        const message = `Payment Proof for Order ${ref}%0AAmount: ${amount}%0AItems:%0A${items}`;
        
        window.open(`https://wa.me/27731575601?text=${message}`, '_blank');
        
        // Close modal and clear cart
        paymentModal.style.display = 'none';
        cart = [];
        updateCart();
        
        alert('Thank you! Your order has been received. We will contact you soon.');
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === paymentModal) {
            paymentModal.style.display = 'none';
        }
    });

    // Initialize
    updateCart();
});
