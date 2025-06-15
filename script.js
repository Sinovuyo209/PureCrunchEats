/* Global Styles */
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: 'Arial', sans-serif;
}

body {
    background-color: #f5f5f5;
    color: #333;
    line-height: 1.6;
}

/* Header */
header {
    background-color: #4CAF50;
    color: white;
    padding: 15px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    top: 0;
    z-index: 100;
}

.logo {
    display: flex;
    align-items: center;
}

.logo img {
    height: 40px;
    margin-right: 10px;
}

.contact a {
    color: white;
    text-decoration: none;
    margin-left: 15px;
    display: inline-flex;
    align-items: center;
}

.contact i {
    margin-right: 5px;
}

/* Promo Banner */
.promo-banner {
    position: relative;
    width: 100%;
    max-height: 300px;
    overflow: hidden;
}

.promo-banner img {
    width: 100%;
    height: auto;
    object-fit: cover;
}

.promo-text {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,0.7);
    color: white;
    padding: 15px 20px;
}

.promo-text h2 {
    margin-bottom: 5px;
}

/* Container */
.container {
    max-width: 1200px;
    margin: 20px auto;
    padding: 0 20px;
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 20px;
}

/* Menu Sections */
.menu-sections {
    display: flex;
    flex-direction: column;
    gap: 30px;
}

.menu-section h2 {
    color: #2E7D32;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
}

.menu-section h2 i {
    margin-right: 10px;
}

.menu-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 15px;
}

.menu-item {
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.menu-item img {
    width: 100%;
    height: 160px;
    object-fit: cover;
}

.item-details {
    padding: 15px;
}

.item-details h3 {
    margin-bottom: 5px;
    color: #2E7D32;
}

.item-details p {
    color: #666;
    font-size: 0.9rem;
    margin-bottom: 10px;
}

.price {
    font-weight: bold;
    color: #E91E63;
    margin-bottom: 10px;
}

.add-to-cart {
    background-color: #FF9800;
    color: white;
    border: none;
    padding: 8px 15px;
    border-radius: 4px;
    cursor: pointer;
    width: 100%;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
}

.add-to-cart i {
    margin-right: 8px;
}

/* Order Summary */
.order-summary {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    position: sticky;
    top: 20px;
    height: fit-content;
}

.order-summary h2 {
    margin-bottom: 15px;
    display: flex;
    align-items: center;
}

.order-summary h2 i {
    margin-right: 10px;
}

.cart-items {
    min-height: 100px;
    margin-bottom: 15px;
}

.empty {
    color: #666;
    text-align: center;
    font-style: italic;
    padding: 20px 0;
}

.cart-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
}

.order-totals {
    margin: 20px 0;
}

.total-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
}

.grand-total {
    font-weight: bold;
    border-top: 1px solid #eee;
    padding-top: 10px;
}

.delivery-time {
    background: #E8F5E9;
    padding: 10px;
    border-radius: 5px;
    margin: 15px 0;
    text-align: center;
}

.delivery-time i {
    color: #4CAF50;
    margin-right: 5px;
}

#delivery-method {
    width: 100%;
    padding: 10px;
    margin: 10px 0;
    border-radius: 4px;
    border: 1px solid #ddd;
}

#checkout-btn {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 12px;
    width: 100%;
    border-radius: 4px;
    font-weight: bold;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

#checkout-btn i {
    margin-right: 8px;
}

/* Payment Modal */
.payment-modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
    z-index: 1000;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background: white;
    width: 90%;
    max-width: 500px;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 3px 10px rgba(0,0,0,0.2);
}

.close-modal {
    position: absolute;
    top: 15px;
    right: 20px;
    font-size: 24px;
    cursor: pointer;
    color: #666;
}

.payment-tabs {
    display: flex;
    margin-bottom: 20px;
    border-bottom: 1px solid #ddd;
}

.tab {
    padding: 10px 20px;
    background: none;
    border: none;
    cursor: pointer;
    font-weight: bold;
    color: #666;
}

.tab.active {
    color: #4CAF50;
    border-bottom: 2px solid #4CAF50;
}

.tab-content {
    display: none;
}

.tab-content.active {
    display: block;
}

#card-element {
    border: 1px solid #ddd;
    padding: 10px;
    border-radius: 4px;
    margin-bottom: 15px;
}

.payment-btn {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 12px;
    width: 100%;
    border-radius: 4px;
    font-weight: bold;
    cursor: pointer;
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.payment-btn i {
    margin-right: 8px;
}

.whatsapp-btn {
    background-color: #25D366;
    color: white;
    border: none;
    padding: 12px;
    width: 100%;
    border-radius: 4px;
    font-weight: bold;
    cursor: pointer;
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
}

.whatsapp-btn i {
    margin-right: 8px;
}

.account-details {
    background: #f9f9f9;
    padding: 15px;
    border-radius: 5px;
    margin: 15px 0;
}

.account-details p {
    margin-bottom: 5px;
    display: flex;
    align-items: center;
}

.account-details i {
    margin-right: 10px;
    color: #4CAF50;
}

.note {
    font-size: 0.8rem;
    color: #666;
    text-align: center;
    margin-top: 10px;
}

#card-errors {
    color: #E91E63;
    margin-top: 10px;
    font-size: 0.9rem;
}

/* Confirmation Modal */
.confirmation-modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
    z-index: 1000;
    justify-content: center;
    align-items: center;
}

.confirmation-content {
    background: white;
    width: 90%;
    max-width: 500px;
    border-radius: 8px;
    padding: 30px;
    text-align: center;
    box-shadow: 0 3px 10px rgba(0,0,0,0.2);
}

.confirmation-icon {
    color: #4CAF50;
    font-size: 3rem;
    margin-bottom: 15px;
}

.order-details {
    text-align: left;
    margin: 20px 0;
    padding: 15px;
    background: #f9f9f9;
    border-radius: 5px;
}

.close-btn {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    margin-top: 15px;
}

.cancel-btn {
    background-color: #f44336;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
}

.cancel-btn i {
    margin-right: 8px;
}

/* Footer */
footer {
    background-color: #333;
    color: white;
    padding: 30px 0 20px;
    margin-top: 40px;
}

.footer-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 30px;
}

.footer-section {
    margin-bottom: 20px;
}

.footer-section h3 {
    color: #4CAF50;
    margin-bottom: 15px;
}

.footer-section p {
    margin-bottom: 8px;
    font-size: 0.9rem;
}

.footer-section a {
    color: white;
    text-decoration: none;
}

.footer-section i {
    margin-right: 8px;
    width: 20px;
}

.copyright {
    text-align: center;
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px solid #444;
    font-size: 0.9rem;
}

/* Responsive */
@media (max-width: 768px) {
    .container {
        grid-template-columns: 1fr;
    }
    
    header {
        flex-direction: column;
        text-align: center;
    }
    
    .contact {
        margin-top: 10px;
    }
    
    .payment-tabs {
        flex-direction: column;
    }
    
    .tab {
        text-align: center;
        border-bottom: 1px solid #eee;
    }
    
    .tab.active {
        border-bottom: 2px solid #4CAF50;
    }
}
