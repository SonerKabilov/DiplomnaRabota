const id = document.currentScript.getAttribute("item");

// Initialize Stripe.js with your publishable key
const stripe = Stripe('pk_test_51PO3prI02HZjRh1iM0ydad1ZinreTzTup2Ygihw0OaiAGCbam1DerWOTpH8S7pJehzeDcbdR0pN7z0kQsbevrJWR00dLxhdF9M');

// Create an instance of Elements
const elements = stripe.elements();

// Create card number Element
const cardNumber = elements.create('cardNumber');
cardNumber.mount('#card-number-element');

// Create card expiration date Element
const cardExpiry = elements.create('cardExpiry');
cardExpiry.mount('#card-expiry-element');

// Create card CVC Element
const cardCvc = elements.create('cardCvc');
cardCvc.mount('#card-cvc-element');

// Handle form submission
const form = document.getElementById('payment-form');
form.addEventListener('submit', async function(event) {
    event.preventDefault();

    // Disable the submit button to prevent multiple submissions
    form.querySelector('button').disabled = true;

    // Create payment method with the card Elements
    const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardNumber,
        billing_details: {
            name: document.getElementById('card-holder-name').value
        }
    });

    if (error) {
        // Display error message to the user
        const errorElement = document.getElementById('error-message');
        errorElement.textContent = error.message;
        errorElement.classList.add('visible');
        form.querySelector('button').disabled = false;
    } else {
        // Submit the form with the payment method
        const formData = new FormData(form);
        formData.append('payment_method_id', paymentMethod.id);
        
        // Send the payment method to your server for processing
        const response = await fetch('/shop/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                payment_method_id: paymentMethod.id,
                itemId: id
            })
        });

        if (response.ok) {
            // Payment successful, redirect or show success message
            window.location.href = '/shop';
        } else {
            // Display error message to the user
            const errorElement = document.getElementById('error-message');
            const responseData = await response.json();
            errorElement.textContent = responseData.error;
            errorElement.classList.add('visible');
            form.querySelector('button').disabled = false;
        }
    }
});
