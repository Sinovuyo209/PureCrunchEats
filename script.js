document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const cartItemsEl = document.getElementById('cart-items');
    const subtotalEl = document.getElementById('subtotal');
    const deliveryFeeEl = document.getElementById('delivery-fee');
    const totalEl = document.getElementById('total');
    const estTimeEl = document.getElementById('est-time');
    const deliveryOption = document.getElementById('delivery-option');
    const checkoutBtn = document.getElementById('checkout-btn');
    const paymentModal = document.getElementById('payment-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    const paymentAmountEl = document.getElementById('payment-amount');
    const orderRefEl = document.getElementById('order-ref');
    const cashAmountEl = document.getElementById('cash-amount');
    const sendProofBtn = document.getElementById('send-proof');
    const verifyPaymentBtn = document.getElementById('verify-payment');
    const payNowBtn = document.getElementById('pay-now');
    const confirmCashBtn = document.getElementById('confirm-cash');
    const confirmationModal = document.getElementById('confirmation-modal');
    const orderNumberEl = document.getElementById('order-number');
    const readyTimeEl = document.getElementById('ready-time');
    const orderDetailsEl = document.getElementById('order-details');
    const closeConfirmationBtn = document.getElementById('close-confirmation');

    // Cart and Order Data
    let cart = [];
    let currentOrder = null;
    let prepTime = 0;

    // Add to Cart Functionality
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const name = this.getAttribute('data-name');
            const price = parseFloat(this.getAttribute('data-price'));
            const itemPrepTime = parseInt(this.getAttribute('data-prep'));
            
            // Check if item exists in cart
            const existingItem = cart.find(item => item.name === name);
            
            if (existingItem) {
                existingItem.quantity++;
                existingItem.prepTime = Math.max(existingItem.prepTime, itemPrepTime);
            } else {
                cart.push({
                    name: name,
                    price: price,
                    quantity: 1,
                    prepTime: itemPrepTime
                });
            }
            
            updateCart();
            animateAddToCart(this);
        });
    });

    // Update Cart Display
    function updateCart() {
        // Calculate totals
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const deliveryFee = deliveryOption.value === 'delivery' ? 15 : 0;
        const total = subtotal + deliveryFee;
        
        // Calculate preparation time (longest item prep time + 10 mins if delivery)
        prepTime = cart.reduce((max, item) => Math.max(max, item.prepTime), 0);
        if (deliveryOption.value === 'delivery') prepTime += 10;
        
        // Update DOM
        if (cart.length === 0) {
            cartItemsEl.innerHTML = '<p class="empty">Your cart is empty</p>';
            checkoutBtn.disabled = true;
            estTimeEl.textContent = '0-5 mins';
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
            
            // Update estimated time
            estTimeEl.textContent = `${prepTime}-${prepTime + 5} mins`;
            
            checkoutBtn.disabled = false;
        }
        
        // Update totals
        subtotalEl.textContent = `R${subtotal.toFixed(2)}`;
        deliveryFeeEl.textContent = deliveryFee > 0 ? `R${deliveryFee.toFixed(2)}` : 'FREE';
        totalEl.textContent = `R${total.toFixed(2)}`;
        
        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function() {
                const itemName = this.getAttribute('data-name');
                cart = cart.filter(item => item.name !== itemName);
                updateCart();
            });
        });
    }

    // Delivery option change
    deliveryOption.addEventListener('change', updateCart);

    // Checkout button
    checkoutBtn.addEventListener('click', function() {
        if (cart.length === 0) return;
        
        // Create order
        currentOrder = {
            id: 'PC' + Date.now().toString().slice(-6),
            items: [...cart],
            subtotal: parseFloat(subtotalEl.textContent.replace('R', '')),
            deliveryFee: deliveryOption.value === 'delivery' ? 15 : 0,
            total: parseFloat(totalEl.textContent.replace('R', '')),
            method: deliveryOption.value,
            prepTime: prepTime,
            timestamp: new Date()
        };
        
        // Update payment modal
        paymentAmountEl.textContent = totalEl.textContent;
        cashAmountEl.textContent = totalEl.textContent;
        orderRefEl.textContent = currentOrder.id;
        
        // Show payment modal
        paymentModal.style.display = 'flex';
    });

    // Payment tabs
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            this.classList.add('active');
            document.getElementById(this.dataset.tab + '-tab').classList.add('active');
        });
    });

    // Send payment proof via WhatsApp
    sendProofBtn.addEventListener('click', function() {
        const items = currentOrder.items.map(item => 
            `${item.name} x${item.quantity} - R${(item.price * item.quantity).toFixed(2)}`
        ).join('%0A');
        
        const message = `Payment Proof for Order ${currentOrder.id}%0A%0A` +
                       `Amount Paid: ${paymentAmountEl.textContent}%0A` +
                       `Payment Method: Capitec Pay%0A` +
                       `Items:%0A${items}%0A%0A` +
                       `Customer Reference: ${orderRefEl.textContent}`;
        
        window.open(`https://wa.me/27731575601?text=${encodeURIComponent(message)}`, '_blank');
    });

    // Verify payment (Capitec)
    verifyPaymentBtn.addEventListener('click', function() {
        completeOrder();
    });

    // Pay now (Card)
    payNowBtn.addEventListener('click', function() {
        // In a real app, you would process payment here
        // For demo, we'll simulate successful payment
        completeOrder();
    });

    // Confirm cash order
    confirmCashBtn.addEventListener('click', function() {
        completeOrder();
    });

    // Complete order process
    function completeOrder() {
        // Calculate ready time
        const now = new Date();
        const readyTime = new Date(now.getTime() + currentOrder.prepTime * 60000);
        const options = { hour: '2-digit', minute: '2-digit' };
        const readyTimeString = readyTime.toLocaleTimeString('en-US', options);
        
        // Update confirmation modal
        orderNumberEl.textContent = currentOrder.id;
        readyTimeEl.textContent = readyTimeString;
        
        // Build order details
        orderDetailsEl.innerHTML = '';
        currentOrder.items.forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.className = 'order-item';
            itemEl.innerHTML = `
                <span>${item.name} x${item.quantity}</span>
                <span>R${(item.price * item.quantity).toFixed(2)}</span>
            `;
            orderDetailsEl.appendChild(itemEl);
        });
        
        // Add delivery if applicable
        if (currentOrder.deliveryFee > 0) {
            const deliveryEl = document.createElement('div');
            deliveryEl.className = 'order-item';
            deliveryEl.innerHTML = `
                <span>Delivery Fee</span>
                <span>R${currentOrder.deliveryFee.toFixed(2)}</span>
            `;
            orderDetailsEl.appendChild(deliveryEl);
        }
        
        // Add total
        const totalEl = document.createElement('div');
        totalEl.className = 'order-item total';
        totalEl.innerHTML = `
            <span>Total</span>
            <span>R${currentOrder.total.toFixed(2)}</span>
        `;
        orderDetailsEl.appendChild(totalEl);
        
        // Send order notification (simulated)
        sendOrderNotification();
        
        // Show confirmation
        paymentModal.style.display = 'none';
        confirmationModal.style.display = 'flex';
        
        // Clear cart
        cart = [];
        updateCart();
    }

    // Send order notification
    function sendOrderNotification() {
        // In a real app, this would send to your backend
        // For demo, we'll log to console and simulate WhatsApp
        
        const itemsText = currentOrder.items.map(item => 
            `${item.name} x${item.quantity} - R${(item.price * item.quantity).toFixed(2)}`
        ).join('%0A');
        
        const notificationText = `New Order #${currentOrder.id}%0A%0A` +
                               `Items:%0A${itemsText}%0A%0A` +
                               `Subtotal: R${currentOrder.subtotal.toFixed(2)}%0A` +
                               `Delivery: R${currentOrder.deliveryFee.toFixed(2)}%0A` +
                               `Total: R${currentOrder.total.toFixed(2)}%0A%0A` +
                               `Payment Method: ${currentOrder.method === 'delivery' ? 'Delivery' : 'Pickup'}%0A` +
                               `Estimated Ready: ${currentOrder.prepTime} mins`;
        
        console.log('Order Notification:', notificationText.replace(/%0A/g, '\n'));
        
        // Simulate WhatsApp notification to business
        window.open(`https://wa.me/27731575601?text=${encodeURIComponent(notificationText)}`, '_blank');
    }

    // Close modals
    closeModalBtn.addEventListener('click', function() {
        paymentModal.style.display = 'none';
    });

    closeConfirmationBtn.addEventListener('click', function() {
        confirmationModal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target === paymentModal) {
            paymentModal.style.display = 'none';
        }
        if (event.target === confirmationModal) {
            confirmationModal.style.display = 'none';
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
