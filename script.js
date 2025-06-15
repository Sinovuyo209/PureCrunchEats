document.addEventListener('DOMContentLoaded', function() {
    let cart = [];
    const deliveryFee = 3; // R3 delivery fee
    let currentOrder = null;
    const ownerPhone = '0731575601';
    
    // Toggle address field based on delivery type
    document.getElementById('delivery-type').addEventListener('change', function() {
        document.getElementById('address-group').style.display = 
            this.value === 'delivery' ? 'block' : 'none';
    });

    // Payment method change
    document.getElementById('payment-method').addEventListener('change', function() {
        const method = this.value;
        document.getElementById('bank-details-group').style.display = 
            method === 'cash' ? 'none' : 'block';
        document.getElementById('instant-payment-section').style.display = 
            method === 'instant' ? 'block' : 'none';
    });

    // Add to cart functionality
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const name = this.getAttribute('data-name');
            const price = parseFloat(this.getAttribute('data-price'));
            
            const existingItem = cart.find(item => item.name === name);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ name, price, quantity: 1 });
            }
            
            updateCart();
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
        
        // Add delivery fee if delivery selected
        const deliveryType = document.getElementById('delivery-type').value;
        const total = deliveryType === 'delivery' ? subtotal + deliveryFee : subtotal;
        
        if (deliveryType === 'delivery') {
            cartHTML += `
                <div class="cart-item">
                    <span>Delivery Fee</span>
                    <span>R${deliveryFee.toFixed(2)}</span>
                </div>
            `;
        }
        
        cartItemsElement.innerHTML = cartHTML;
        cartTotalElement.textContent = `Total: R${total.toFixed(2)}`;
        document.getElementById('payment-amount-display').value = `R${total.toFixed(2)}`;
        
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

    // Checkout button
    document.getElementById('checkout-btn').addEventListener('click', function() {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        document.getElementById('payment-form').style.display = 'block';
        this.style.display = 'none';
        updateCart(); // Update totals based on delivery option
    });

    // Process payment button
    document.getElementById('process-payment-btn').addEventListener('click', function() {
        const bankName = document.getElementById('bank-name').value.trim();
        const accountNumber = document.getElementById('account-number').value.trim();
        
        if (!bankName || !accountNumber) {
            alert('Please enter your bank details');
            return;
        }
        
        // Simulate immediate payment deduction
        setTimeout(() => {
            document.getElementById('instant-payment-section').style.display = 'none';
            document.getElementById('verification-message').style.display = 'block';
            
            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const deliveryType = document.getElementById('delivery-type').value;
            
            // Complete the order
            currentOrder = completeOrder(name, phone, deliveryType);
            
            // Simulate sending WhatsApp notification to owner
            const whatsappMessage = `NEW ORDER from ${name} (${phone}):\n\n${cart.map(item => `${item.name} x${item.quantity}`).join('\n')}\n\nTotal: R${currentOrder.total.toFixed(2)}\n\nPayment: ${currentOrder.paymentMethod}\n\n${deliveryType === 'delivery' ? 'Delivery to: ' + document.getElementById('address').value : 'For collection'}`;
            console.log(`Sending to ${ownerPhone}: ${whatsappMessage}`);
        }, 1500);
    });

    function completeOrder(name, phone, deliveryType) {
        let orderDetails = 'Order Details:\n\n';
        let subtotal = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            orderDetails += `${item.name} x${item.quantity} - R${itemTotal.toFixed(2)}\n`;
        });
        
        const total = deliveryType === 'delivery' ? subtotal + deliveryFee : subtotal;
        
        orderDetails += `\nSubtotal: R${subtotal.toFixed(2)}`;
        if (deliveryType === 'delivery') {
            orderDetails += `\nDelivery Fee: R${deliveryFee.toFixed(2)}`;
        }
        orderDetails += `\nTotal: R${total.toFixed(2)}`;
        orderDetails += `\n\nPayment Method: Instant Bank Payment`;
        orderDetails += `\n\nCustomer Details:`;
        orderDetails += `\nName: ${name}`;
        orderDetails += `\nPhone: ${phone}`;
        orderDetails += `\n${deliveryType === 'delivery' ? 'Delivery Address: ' + document.getElementById('address').value : 'Collection'}`;
        orderDetails += `\n\nEstimated ready in 5 minutes.`;
        
        // Display order summary
        document.getElementById('order-summary').innerHTML = orderDetails.replace(/\n/g, '<br>');
        
        // Create order object
        const order = {
            name,
            phone,
            items: [...cart],
            subtotal,
            deliveryFee: deliveryType === 'delivery' ? deliveryFee : 0,
            total,
            paymentMethod: 'Instant Bank Payment',
            reference: 'INST' + Math.floor(Math.random() * 1000000),
            date: new Date(),
            deliveryType
        };
        
        // Reset cart
        cart = [];
        updateCart();
        
        return order;
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
