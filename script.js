document.addEventListener('DOMContentLoaded', function() {
    let cart = [];
    const deliveryFee = 3; // R3 delivery fee as requested
    let currentOrder = null;
    
    // Add to cart functionality
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const name = this.getAttribute('data-name');
            const price = parseFloat(this.getAttribute('data-price'));
            
            // Check if item already in cart
            const existingItem = cart.find(item => item.name === name);
            if (existingItem) {
                existingItem.quantity += 1;
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
        const cartItemsElement = document.getElementById('cart-items');
        const cartTotalElement = document.getElementById('cart-total');
        
        if (cart.length === 0) {
            cartItemsElement.innerHTML = '<p>Your cart is empty</p>';
            cartTotalElement.textContent = 'Total: R0.00';
            return;
        }
        
        let cartHTML = '';
        let subtotal = 0;
        
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            
            cartHTML += `
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
        
        // Add delivery fee
        const total = subtotal + deliveryFee;
        
        cartHTML += `
            <div class="cart-item">
                <span>Delivery Fee</span>
                <span>R${deliveryFee.toFixed(2)}</span>
            </div>
        `;
        
        cartItemsElement.innerHTML = cartHTML;
        cartTotalElement.textContent = `Total: R${total.toFixed(2)}`;
        
        // Add event listeners to quantity buttons
        document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                if (cart[index].quantity > 1) {
                    cart[index].quantity -= 1;
                    updateCart();
                }
            });
        });
        
        document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                cart[index].quantity += 1;
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
    
    // Animate add to cart button
    function animateAddToCart(button) {
        button.classList.add('added');
        setTimeout(() => {
            button.classList.remove('added');
        }, 500);
    }
    
    // Checkout button
    document.getElementById('checkout-btn').addEventListener('click', function() {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        
        document.getElementById('payment-form').style.display = 'block';
        this.style.display = 'none';
        window.scrollTo({
            top: document.getElementById('payment-form').offsetTop - 20,
            behavior: 'smooth'
        });
    });
    
    // Cancel order button
    document.getElementById('cancel-order-btn').addEventListener('click', function() {
        if (confirm('Are you sure you want to cancel this order?')) {
            document.getElementById('payment-form').style.display = 'none';
            document.getElementById('checkout-btn').style.display = 'block';
        }
    });
    
    // Payment method change
    document.getElementById('payment-method').addEventListener('change', function() {
        const method = this.value;
        const bankDetailsGroup = document.getElementById('bank-details-group');
        
        if (method === 'other') {
            bankDetailsGroup.style.display = 'block';
        } else {
            bankDetailsGroup.style.display = 'none';
        }
    });
    
    // Confirm payment button
    document.getElementById('confirm-payment-btn').addEventListener('click', function() {
        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const email = document.getElementById('email').value.trim();
        const address = document.getElementById('address').value.trim();
        const paymentMethod = document.getElementById('payment-method').value;
        const termsChecked = document.getElementById('terms').checked;
        
        if (!name || !phone || !email || !address || !termsChecked) {
            alert('Please fill in all required fields and accept the terms');
            return;
        }
        
        // Validate phone number
        if (!/^[0-9]{10,}$/.test(phone)) {
            alert('Please enter a valid phone number');
            return;
        }
        
        // Validate email
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            alert('Please enter a valid email address');
            return;
        }
        
        document.getElementById('payment-form').style.display = 'none';
        
        if (paymentMethod === 'cash') {
            // Cash on delivery
            document.getElementById('verification-section').style.display = 'block';
            document.getElementById('verification-message').style.display = 'block';
            currentOrder = completeOrder(name, phone, email, address, paymentMethod);
        } else {
            // Online payment
            document.getElementById('verification-section').style.display = 'block';
            document.getElementById('bank-verify').style.display = 'block';
            
            // Calculate total
            let subtotal = 0;
            cart.forEach(item => {
                subtotal += item.price * item.quantity;
            });
            const total = subtotal + deliveryFee;
            
            document.getElementById('payment-amount').textContent = `R${total.toFixed(2)}`;
        }
    });
    
    // Verify payment button
    document.getElementById('verify-payment-btn').addEventListener('click', function() {
        const proof = document.getElementById('proof').files[0];
        const reference = document.getElementById('reference').value.trim();
        
        if (!proof || !reference) {
            alert('Please upload proof of payment and enter a reference');
            return;
        }
        
        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const email = document.getElementById('email').value.trim();
        const address = document.getElementById('address').value.trim();
        const paymentMethod = document.getElementById('payment-method').value;
        
        // In a real implementation, you would verify with your backend
        document.getElementById('bank-verify').style.display = 'none';
        document.getElementById('verification-message').style.display = 'block';
        currentOrder = completeOrder(name, phone, email, address, paymentMethod, reference);
    });
    
    // Instant payment button (simulated)
    document.getElementById('instant-payment-btn').addEventListener('click', function() {
        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const email = document.getElementById('email').value.trim();
        const address = document.getElementById('address').value.trim();
        const paymentMethod = 'instant';
        
        if (!name || !phone || !email || !address) {
            alert('Please fill in all required fields first');
            return;
        }
        
        // Simulate instant payment processing
        if (confirm('You will be redirected to secure payment processing. Continue?')) {
            // In a real implementation, this would redirect to payment gateway
            setTimeout(() => {
                document.getElementById('bank-verify').style.display = 'none';
                document.getElementById('verification-message').style.display = 'block';
                currentOrder = completeOrder(name, phone, email, address, paymentMethod, 'INST' + Math.floor(Math.random() * 1000000));
            }, 2000);
        }
    });
    
    // New order button
    document.getElementById('new-order-btn').addEventListener('click', function() {
        document.getElementById('verification-section').style.display = 'none';
        document.getElementById('verification-message').style.display = 'none';
        document.getElementById('checkout-btn').style.display = 'block';
        cart = [];
        updateCart();
        
        // Reset form
        document.getElementById('payment-form').reset();
    });
    
    // Request refund button
    document.getElementById('request-refund-btn').addEventListener('click', function() {
        document.getElementById('refund-modal').style.display = 'block';
    });
    
    // Close modal button
    document.querySelector('.close-modal').addEventListener('click', function() {
        document.getElementById('refund-modal').style.display = 'none';
    });
    
    // Confirm refund button
    document.getElementById('confirm-refund-btn').addEventListener('click', function() {
        const reason = document.getElementById('refund-reason').value;
        const account = document.getElementById('refund-account').value.trim();
        
        if (!account) {
            alert('Please provide your bank account details for the refund');
            return;
        }
        
        // Process refund
        alert(`Refund request submitted for order ${currentOrder.reference}. Amount: R${currentOrder.total.toFixed(2)} will be refunded to ${account}`);
        document.getElementById('refund-modal').style.display = 'none';
        document.getElementById('verification-message').style.display = 'none';
        document.getElementById('checkout-btn').style.display = 'block';
        cart = [];
        updateCart();
        document.getElementById('payment-form').reset();
    });
    
    function completeOrder(name, phone, email, address, paymentMethod, reference = '') {
        let orderDetails = 'Order Details:\n\n';
        let subtotal = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            orderDetails += `${item.name} x${item.quantity} - R${itemTotal.toFixed(2)}\n`;
        });
        
        const total = subtotal + deliveryFee;
        
        orderDetails += `\nSubtotal: R${subtotal.toFixed(2)}`;
        orderDetails += `\nDelivery Fee: R${deliveryFee.toFixed(2)}`;
        orderDetails += `\nTotal: R${total.toFixed(2)}`;
        orderDetails += `\n\nPayment Method: ${getPaymentMethodName(paymentMethod)}`;
        
        if (reference) {
            orderDetails += `\nPayment Reference: ${reference}`;
        }
        
        orderDetails += `\n\nCustomer Details:`;
        orderDetails += `\nName: ${name}`;
        orderDetails += `\nPhone: ${phone}`;
        orderDetails += `\nEmail: ${email}`;
        orderDetails += `\nAddress: ${address}`;
        
        orderDetails += `\n\nEstimated ready for collection in 5 minutes.`; // 5 minutes as requested
        orderDetails += `\n\nThank you for your order!`;
        
        // Display order summary
        document.getElementById('order-summary').innerHTML = orderDetails.replace(/\n/g, '<br>');
        
        // In a real app, you would send this to your server
        console.log('Order placed:', orderDetails);
        
        // Simulate sending WhatsApp message (in a real app, you would use WhatsApp API)
        const whatsappMessage = `New Order from ${name} (${phone}):\n\n${cart.map(item => `${item.name} x${item.quantity}`).join('\n')}\n\nTotal: R${total.toFixed(2)}`;
        console.log('WhatsApp message:', whatsappMessage);
        
        // Create order object for refund purposes
        const order = {
            name,
            phone,
            email,
            address,
            items: [...cart],
            subtotal,
            deliveryFee,
            total,
            paymentMethod,
            reference: reference || 'CASH' + Math.floor(Math.random() * 10000),
            date: new Date()
        };
        
        // Reset cart
        cart = [];
        updateCart();
        
        return order;
    }
    
    function getPaymentMethodName(method) {
        switch(method) {
            case 'capitec': return 'Capitec Pay';
            case 'eft': return 'EFT/Bank Transfer';
            case 'other': return 'Other Bank Payment';
            case 'instant': return 'Instant Bank Payment';
            case 'cash': return 'Cash on Delivery';
            default: return method;
        }
    }
});
