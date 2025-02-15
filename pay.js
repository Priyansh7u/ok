document.addEventListener('DOMContentLoaded', function() {
    // Variables
    let currentStep = 1;
    let selectedPlan = null;
    let selectedPaymentMethod = 'card';
    const maxSteps = 3;

    // Elements
    const steps = document.querySelectorAll('.step');
    const sections = document.querySelectorAll('.payment-section');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const planButtons = document.querySelectorAll('.select-plan-btn');
    const paymentMethods = document.querySelectorAll('.payment-method-btn');
    const paymentForms = document.querySelectorAll('.payment-form');
    const cardPreview = document.querySelector('.card-preview');
    const supportChatBtn = document.getElementById('supportChat');
    const chatWidget = document.getElementById('supportChatWidget');
    const closeChatBtn = document.querySelector('.close-chat');
    const sendMessageBtn = document.querySelector('.send-message');
    const messageInput = document.querySelector('.chat-input input');

    // Initialize
    updateSteps();
    initializePaymentValidation();
    initializeChatWidget();

    // Event Listeners
    prevBtn.addEventListener('click', () => navigateStep(-1));
    nextBtn.addEventListener('click', () => navigateStep(1));

    planButtons.forEach(button => {
        button.addEventListener('click', () => {
            selectedPlan = {
                type: button.dataset.plan,
                price: parseInt(button.dataset.price)
            };
           updatePlanPrice(); 
           updateSteps();
           });
           });
           paymentMethods.forEach(button => {
            button.addEventListener('click', () => {
                selectedPaymentMethod = button.dataset.paymentMethod;
                updatePaymentMethod();
                updateSteps();
                

            updateOrderSummary();
            navigateStep(1);
        });
    });

    paymentMethods.forEach(method => {
        method.addEventListener('click', () => {
            selectedPaymentMethod = method.dataset.method;
            updatePaymentMethod();
        });
    });

    // Card number input formatting and validation
    const cardNumberInput = document.getElementById('cardNumber');
    cardNumberInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/(\d{4})/g, '$1 ').trim();
        e.target.value = value;
        updateCardPreview();
    });

    // Expiry date formatting
    const expiryInput = document.getElementById('expiryDate');
    expiryInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.slice(0, 2) + '/' + value.slice(2, 4);
        }
        e.target.value = value;
        updateCardPreview();
    });

    // CVV handling
    const cvvInput = document.getElementById('cvv');
    cvvInput.addEventListener('focus', () => {
        cardPreview.classList.add('flipped');
    });

    cvvInput.addEventListener('blur', () => {
        cardPreview.classList.remove('flipped');
    });

    // Functions
    function navigateStep(direction) {
        currentStep += direction;
        
        if (currentStep === maxSteps) {
            simulatePayment();
        }

        updateSteps();
    }

    function updateSteps() {
        // Update step indicators
        steps.forEach((step, index) => {
            if (index + 1 === currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });

        // Update sections visibility
        sections.forEach((section, index) => {
            if (index + 1 === currentStep) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });

        // Update navigation buttons
        prevBtn.disabled = currentStep === 1;
        nextBtn.textContent = currentStep === maxSteps - 1 ? 'Confirm Payment' : 'Next';
    }

    function updatePaymentMethod() {
        paymentMethods.forEach(method => {
            method.classList.remove('active');
            if (method.dataset.method === selectedPaymentMethod) {
                method.classList.add('active');
            }
        });

        paymentForms.forEach(form => {
            form.classList.remove('active');
            if (form.id === `${selectedPaymentMethod}PaymentForm`) {
                form.classList.add('active');
            }
        });
    }

    function updateOrderSummary() {
        if (!selectedPlan) return;

        const planNames = {
            monthly: 'Monthly Plan',
            quarterly: 'Quarterly Plan',
            yearly: 'Yearly Plan'
        };

        const durations = {
            monthly: '1 Month',
            quarterly: '3 Months',
            yearly: '12 Months'
        };

        document.getElementById('selectedPlan').textContent = planNames[selectedPlan.type];
        document.getElementById('planDuration').textContent = durations[selectedPlan.type];
        document.getElementById('planAmount').textContent = `₹${selectedPlan.price.toLocaleString()}`;

        const tax = selectedPlan.price * 0.18;
        document.getElementById('taxAmount').textContent = `₹${tax.toLocaleString()}`;

        const total = selectedPlan.price + tax;
        document.getElementById('totalAmount').textContent = `₹${total.toLocaleString()}`;
    }

    function updateCardPreview() {
        const cardNumber = document.getElementById('cardNumber').value;
        const cardHolder = document.getElementById('cardHolder').value;
        const expiry = document.getElementById('expiryDate').value;
        const cvv = document.getElementById('cvv').value;

        document.querySelector('.card-number-display').textContent = cardNumber || '•••• •••• •••• ••••';
        document.querySelector('.card-holder-display').textContent = cardHolder || 'CARD HOLDER';
        document.querySelector('.card-expiry-display').textContent = expiry || 'MM/YY';
        document.querySelector('.card-cvv-display').textContent = cvv || '•••';
    }

    function initializePaymentValidation() {
        const cardForm = document.getElementById('cardPaymentForm');
        cardForm.addEventListener('submit', (e) => {
            e.preventDefault();
            validateAndSubmitPayment();
        });
    }

    function validateAndSubmitPayment() {
        // Add validation logic here
        const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
        const cardHolder = document.getElementById('cardHolder').value;
        const expiry = document.getElementById('expiryDate').value;
        const cvv = document.getElementById('cvv').value;

        let isValid = true;
        let errors = [];

        if (!/^\d{16}$/.test(cardNumber)) {
            isValid = false;
            errors.push('Invalid card number');
        }

        if (!cardHolder.trim()) {
            isValid = false;
            errors.push('Card holder name is required');
        }

        if (!/^\d{2}\/\d{2}$/.test(expiry)) {
            isValid = false;
            errors.push('Invalid expiry date');
        }

        if (!/^\d{3,4}$/.test(cvv)) {
            isValid = false;
            errors.push('Invalid CVV');
        }

        if (!isValid) {
            showErrors(errors);
            return false;
        }

        return true;
    }

    function simulatePayment() {
        const processingSection = document.querySelector('.processing-animation');
        const successSection = document.querySelector('.success-message');
        
        // Show processing animation
        processingSection.style.display = 'block';
        successSection.style.display = 'none';

        // Generate random transaction ID
        const transactionId = 'TXN' + Math.random().toString(36).substr(2, 9).toUpperCase();
        document.getElementById('transactionId').textContent = transactionId;

        // Simulate payment processing
        setTimeout(() => {
            processingSection.style.display = 'none';
            successSection.style.display = 'block';
            nextBtn.style.display = 'none';
            prevBtn.style.display = 'none';
        }, 3000);
    }

    function initializeChatWidget() {
        supportChatBtn.addEventListener('click', (e) => {
            e.preventDefault();
            chatWidget.style.display = chatWidget.style.display === 'none' ? 'block' : 'none';
        });

        closeChatBtn.addEventListener('click', () => {
            chatWidget.style.display = 'none';
        });

        sendMessageBtn.addEventListener('click', sendMessage);
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    function sendMessage() {
        const message = messageInput.value.trim();
        if (!message) return;

        // Add user message
        addMessage(message, 'user');
        messageInput.value = '';

        // Simulate support response
        setTimeout(() => {
            const responses = [
                "I'll help you with that right away!",
                "Let me check that for you.",
                "Thanks for your question. Here's what you need to know...",
                "I understand your concern. Let me assist you."
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            addMessage(randomResponse, 'support');
        }, 1000);
    }

    function addMessage(text, type) {
        const messagesContainer = document.querySelector('.chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        
        const avatar = document.createElement('span');
        avatar.className = 'avatar';
        avatar.textContent = type === 'user' ? '👤' : '👩‍💼';

        const content = document.createElement('div');
        content.className = 'message-content';
        content.textContent = text;

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
});