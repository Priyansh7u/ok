// Show/hide password onClick of button using Javascript only

const wrapper = document.querySelector('.popuar-course-wrapper');

wrapper.addEventListener('mouseenter', () => {
  wrapper.style.animationPlayState = 'paused';
});

wrapper.addEventListener('mouseleave', () => {
  wrapper.style.animationPlayState = 'running';
});


// https://stackoverflow.com/questions/31224651/show-hide-password-onclick-of-button-using-javascript-only

function handlePayment() {
    // Ensure Razorpay script is loaded
    if (typeof Razorpay === 'undefined') {
        alert('Payment system not loaded. Please check your internet connection or try again later.');
        return;
    }

    const options = {
        key: 'rzp_test_your_key_here', // Replace with your Razorpay test/live API key
        amount: 999900, // Amount in paise (₹9999)
        currency: 'INR',
        name: 'Priyanshu Classes',
        description: 'Course Enrollment Payment',
        image: 'https://example.com/logo.png', // Replace with your logo
        handler: function (response) {
            alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
        },
        prefill: {
            name: 'Student Name', // Replace dynamically if needed
            email: 'student@example.com', // Replace dynamically if needed
            contact: '9999999999', // Replace dynamically if needed
        },
        theme: {
            color: '#3399cc',
        },
    };

    const paymentObject = new Razorpay(options);
    paymentObject.open();

    paymentObject.on('payment.failed', function (response) {
        alert(`Payment failed. Reason: ${response.error.description}`);
    });
}

// Live Chat Feature
function startLiveChat() {
    const chatBox = document.createElement('div');
    chatBox.className = 'chat-box';

    chatBox.innerHTML = `
        <div class="chat-header">
            <h4>Live Chat</h4>
            <button onclick="closeChat()" class="btn btn-outline">Close</button>
        </div>
        <div class="chat-messages" id="chatMessages">
            <p><strong>Support:</strong> Hi! How can we help you today?</p>
        </div>
        <div class="chat-input">
            <input type="text" id="chatInput" placeholder="Type your message here...">
            <button onclick="sendMessage()" class="btn btn-primary">Send</button>
        </div>
    `;

    chatBox.style.position = 'fixed';
    chatBox.style.bottom = '20px';
    chatBox.style.right = '20px';
    chatBox.style.width = '300px';
    chatBox.style.border = '1px solid #ccc';
    chatBox.style.backgroundColor = '#fff';
    chatBox.style.zIndex = '1000';
    chatBox.style.borderRadius = '8px';

    document.body.appendChild(chatBox);
}

function sendMessage() {
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    const message = chatInput.value.trim();

    if (message) {
        const userMessage = document.createElement('p');
        userMessage.innerHTML = `<strong>You:</strong> ${message}`;
        chatMessages.appendChild(userMessage);
        chatInput.value = '';

        // Simulate a response
        setTimeout(() => {
            const supportMessage = document.createElement('p');
            supportMessage.innerHTML = `<strong>Support:</strong> Thank you for reaching out! We will get back to you shortly.`;
            chatMessages.appendChild(supportMessage);
        }, 1000);
    }
}

function closeChat() {
    const chatBox = document.querySelector('.chat-box');
    if (chatBox) chatBox.remove();
}


function show() {
    var p = document.getElementById('pwd');
    p.setAttribute('type', 'text');
}



function hide() {
    var p = document.getElementById('pwd');
    p.setAttribute('type', 'password');
}

var pwShown = 0;

document.getElementById("eye").addEventListener("click", function () {
    if (pwShown == 0) {
        pwShown = 1;
        show();
    } else {
        pwShown = 0;
        hide();
    }
}, false);





