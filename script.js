document.addEventListener('DOMContentLoaded', function() {
    const cart = [];
    const deliveryFee = 3;
    const ownerPhone = '0731575601';
    const capitecAccount = '2016489258';
    
    // Toggle address field based on delivery option
    document.querySelectorAll('input[name="delivery"]').forEach(radio => {
        radio.addEventListener('change', function() {
            document.getElementById('address-group').style.display = 
                this.value === 'delivery' ? 'block' : 'none';
        });
    });
    
    // Add to cart functionality
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
                    <div>
                        <span>${item.name}</span>
                        <div class="quantity-controls">
                            <button class="quantity-btn minus" data-index="${index}">-</button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn plus" data-index="${index}">+</button>
                            <button class="remove-item" data-index="${index}">&times;</button>
                        </div>
                    </div>
                    <span>R${itemTotal.toFixed(2)}</span>
                </div>
            `;
        });
        
        // Add delivery fee if needed
        const deliveryType = document.querySelector('input[name="delivery"]:checked').value;
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
        
        // Add event listeners to quantity buttons
        document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                if (cart[index].quantity > 1) {
                    cart[index].quantity--;
                    updateCart();
                }
            });
        });
        
        document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                cart[index].quantity++;
                updateCart();
            });
        });
        
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                cart.splice(index, 1);
                updateCart();
            });
        });
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
    document.getElementById('process-payment').addEventListener('click', function() {
        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const deliveryType = document.querySelector('input[name="delivery"]:checked').value;
        const address = deliveryType === 'delivery' ? document.getElementById('address').value.trim() : '';
        const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
        const bankName = paymentMethod === 'online' ? document.getElementById('bank-name').value.trim() : '';
        const accountNumber = paymentMethod === 'online' ? document.getElementById('account-number').value.trim() : '';
        
        // Validate fields
        if (!name || !phone || (deliveryType === 'delivery' && !address) || 
            (paymentMethod === 'online' && (!bankName || !accountNumber))) {
            alert('Please fill in all required fields');
            return;
        }
        
        // Calculate total
        let subtotal = 0;
        cart.forEach(item => subtotal += item.price * item.quantity);
        const total = deliveryType === 'delivery' ? subtotal + deliveryFee : subtotal;
        
        // Create order summary
        let orderSummary = `New Order from ${name} (${phone}):\n\n`;
        cart.forEach(item => {
            orderSummary += `${item.name} x${item.quantity} - R${(item.price * item.quantity).toFixed(2)}\n`;
        });
        
        orderSummary += `\nSubtotal: R${subtotal.toFixed(2)}\n`;
        if (deliveryType === 'delivery') {
            orderSummary += `Delivery Fee: R${deliveryFee.toFixed(2)}\n`;
        }
        orderSummary += `Total: R${total.toFixed(2)}\n\n`;
        orderSummary += `Payment Method: ${paymentMethod === 'online' ? 'Bank Transfer' : 'Cash on Delivery'}\n`;
        if (paymentMethod === 'online') {
            orderSummary += `From: ${bankName} (${accountNumber})\n`;
            orderSummary += `To: Capitec ${capitecAccount}\n`;
        }
        orderSummary += `\n${deliveryType === 'delivery' ? 'Delivery to: ' + address : 'For collection'}`;
        
        // Simulate payment processing
        setTimeout(() => {
            // Show success message
            document.getElementById('payment-form').style.display = 'none';
            document.getElementById('payment-success').style.display = 'block';
            document.getElementById('order-summary').innerHTML = orderSummary.replace(/\n/g, '<br>');
            
            // Simulate WhatsApp notification to owner
            console.log(`Sending to ${ownerPhone}:\n${orderSummary}`);
            alert(`Order confirmed! Notification sent to ${ownerPhone}`);
            
            // Clear cart
            cart.length = 0;
            updateCart();
        }, 1500);
    });
    
    // Cancel order button
    document.getElementById('cancel-order').addEventListener('click', function() {
        if (confirm('Are you sure you want to cancel this order?')) {
            document.getElementById('payment-form').style.display = 'none';
            document.getElementById('checkout-btn').style.display = 'block';
            document.getElementById('payment-success').style.display = 'none';
        }
    });
    
    // New order button
    document.getElementById('new-order').addEventListener('click', function() {
        document.getElementById('payment-success').style.display = 'none';
        document.getElementById('checkout-btn').style.display = 'block';
    });
});
