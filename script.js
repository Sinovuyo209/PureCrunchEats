document.addEventListener('DOMContentLoaded', function() {
    let cart = [];
    
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
        });
    });
    
    // Update cart display
    function updateCart() {
        const cartItemsElement = document.getElementById('cart-items');
        const cartTotalElement = document.getElementById('cart-total');
        
        if (cart.length === 0) {
            cartItemsElement.innerHTML = '<p>Your cart is empty</p>';
            cartTotalElement.textContent = 'Total: R0';
            return;
        }
        
        let cartHTML = '';
        let total = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            cartHTML += `
                <div class="cart-item">
                    <div style="display: flex; justify-content: space-between;">
                        <span>${item.name} x${item.quantity}</span>
                        <span>R${itemTotal.toFixed(2)}</span>
                    </div>
                </div>
            `;
        });
        
        cartItemsElement.innerHTML = cartHTML;
        cartTotalElement.textContent = `Total: R${total.toFixed(2)}`;
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
    
    // Confirm payment button
    document.getElementById('confirm-payment-btn').addEventListener('click', function() {
        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;
        const paymentMethod = document.getElementById('payment-method').value;
        
        if (!name || !phone || !email) {
            alert('Please fill in all required fields');
            return;
        }
        
        document.getElementById('payment-form').style.display = 'none';
        
        if (paymentMethod === 'capitec' || paymentMethod === 'eft') {
            document.getElementById('verification-section').style.display = 'block';
            document.getElementById('capitec-verify').style.display = 'block';
        } else {
            // Cash on delivery
            document.getElementById('verification-section').style.display = 'block';
            document.getElementById('verification-message').style.display = 'block';
            completeOrder();
        }
    });
    
    // Verify payment button
    document.getElementById('verify-payment-btn').addEventListener('click', function() {
        const reference = document.getElementById('reference').value;
        
        if (!reference) {
            alert('Please enter your payment reference');
            return;
        }
        
        // In a real implementation, you would verify with your backend
        document.getElementById('capitec-verify').style.display = 'none';
        document.getElementById('verification-message').style.display = 'block';
        completeOrder();
    });
    
    function completeOrder() {
        let orderDetails = 'Order Details:\n\n';
        let total = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            orderDetails += `${item.name} x${item.quantity} - R${itemTotal.toFixed(2)}\n`;
        });
        
        orderDetails += `\nTotal: R${total.toFixed(2)}\n\n`;
        orderDetails += `Thank you for your order!`;
        
        console.log(orderDetails); // In real app, send to server
        
        // Reset cart
        cart = [];
        updateCart();
    }
});