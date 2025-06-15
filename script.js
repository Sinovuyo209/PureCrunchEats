document.addEventListener('DOMContentLoaded', function() {
    const cart = [];
    const deliveryFee = 3;
    const ownerPhone = '0731575601';
    
    // Toggle address field
    document.getElementById('delivery-type').addEventListener('change', function() {
        document.getElementById('address-group').style.display = 
            this.value === 'delivery' ? 'block' : 'none';
        updateCartTotal();
    });

    // Add to cart
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const name = this.getAttribute('data-name');
            const price = parseFloat(this.getAttribute('data-price'));
            
            const existingItem = cart.find(item => item.name === name);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ name, price, quantity: 1 });
            }
            
            updateCart();
        });
    });

    // Update cart display
    function updateCart() {
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        
        if (cart.length === 0) {
            cartItems.innerHTML = '<p>Your cart is empty</p>';
            cartTotal.textContent = 'Total: R0.00';
            return;
        }
        
        let html = '';
        let subtotal = 0;
        
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            
            html += `
                <div class="cart-item">
                    <span>${item.name} x${item.quantity}</span>
                    <span>R${itemTotal.toFixed(2)}</span>
                </div>
            `;
        });
        
        // Add delivery fee if needed
        const deliveryType = document.getElementById('delivery-type').value;
        const total = deliveryType === 'delivery' ? subtotal + deliveryFee : subtotal;
        
        if (deliveryType === 'delivery') {
            html += `
                <div class="cart-item">
                    <span>Delivery Fee</span>
                    <span>R${deliveryFee.toFixed(2)}</span>
                </div>
            `;
        }
        
        cartItems.innerHTML = html;
        cartTotal.textContent = `Total: R${total.toFixed(2)}`;
        document.getElementById('payment-amount').textContent = `R${total.toFixed(2)}`;
    }

    // Checkout button
    document.getElementById('checkout-btn').addEventListener('click', function() {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        document.getElementById('payment-form').style.display = 'block';
        this.style.display = 'none';
    });

    // Process payment
    document.getElementById('confirm-payment-btn').addEventListener('click', function() {
        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const bankDetails = document.getElementById('bank-details').value.trim();
        const deliveryType = document.getElementById('delivery-type').value;
        
        if (!name || !phone || !bankDetails) {
            alert('Please fill in all required fields');
            return;
        }
        
        // Show processing animation
        document.getElementById('payment-form').style.display = 'none';
        document.getElementById('verification-section').style.display = 'block';
        document.getElementById('display-bank-name').textContent = bankDetails.split(',')[0];
        document.getElementById('display-account-number').textContent = bankDetails.split(',')[1] || '';
        
        // Simulate payment processing
        setTimeout(() => {
            document.querySelector('.payment-processing').style.display = 'none';
            document.querySelector('.payment-success').style.display = 'block';
            
            // Complete order after 1.5 seconds
            setTimeout(completeOrder, 1500, name, phone, deliveryType);
        }, 2000);
    });

    function completeOrder(name, phone, deliveryType) {
        // Calculate total
        let subtotal = 0;
        cart.forEach(item => subtotal += item.price * item.quantity);
        const total = deliveryType === 'delivery' ? subtotal + deliveryFee : subtotal;
        
        // Create order summary
        let summary = `
            <h3>Order Summary</h3>
            <p><strong>Customer:</strong> ${name}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Type:</strong> ${deliveryType === 'delivery' ? 'Delivery' : 'Collection'}</p>
            
            <h4>Items:</h4>
        `;
        
        cart.forEach(item => {
            summary += `<p>${item.name} x${item.quantity} - R${(item.price * item.quantity).toFixed(2)}</p>`;
        });
        
        summary += `
            <p><strong>Subtotal:</strong> R${subtotal.toFixed(2)}</p>
            ${deliveryType === 'delivery' ? `<p><strong>Delivery Fee:</strong> R${deliveryFee.toFixed(2)}</p>` : ''}
            <p><strong>Total:</strong> R${total.toFixed(2)}</p>
            <p><strong>Payment Method:</strong> Instant Bank Transfer</p>
            <p><i class="fas fa-check"></i> Payment received in your Capitec account</p>
        `;
        
        // Show confirmation
        document.getElementById('verification-message').style.display = 'block';
        document.getElementById('order-summary').innerHTML = summary;
        
        // Simulate WhatsApp notification
        const whatsappMsg = `NEW ORDER from ${name} (${phone}):
${cart.map(item => `${item.name} x${item.quantity}`).join('\n')}

Total: R${total.toFixed(2)}
${deliveryType === 'delivery' ? 'Delivery to: ' + document.getElementById('address').value : 'For collection'}`;
        
        console.log(`Sending to ${ownerPhone}: ${whatsappMsg}`);
        
        // Clear cart
        cart.length = 0;
    }

    // New order button
    document.getElementById('new-order-btn').addEventListener('click', function() {
        document.getElementById('verification-section').style.display = 'none';
        document.getElementById('checkout-btn').style.display = 'block';
        document.getElementById('payment-form').reset();
    });

    // Cancel order button
    document.getElementById('cancel-order-btn').addEventListener('click', function() {
        if (confirm('Cancel this order?')) {
            document.getElementById('payment-form').style.display = 'none';
            document.getElementById('checkout-btn').style.display = 'block';
        }
    });
});
