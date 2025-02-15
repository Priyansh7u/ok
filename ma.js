document.addEventListener('DOMContentLoaded', function() {
    // Class selection functionality
    const classButtons = document.querySelectorAll('.class-btn');
    const searchInput = document.getElementById('searchInput');
    const viewButtons = document.querySelectorAll('.view-btn');
    const subjectGrid = document.querySelector('.subject-grid');
    let notifications = [];

    // Class button click handler
    classButtons.forEach(button => {
        button.addEventListener('click', () => {
            classButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const selectedClass = button.dataset.class;
            updateContent(selectedClass);
        });
    });

    // View toggle functionality
    viewButtons.forEach(button => {
        button.addEventListener('click', () => {
            viewButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const viewType = button.dataset.view;
            updateViewType(viewType);
        });
    });

    // Search functionality
    searchInput.addEventListener('input', debounce(function(e) {
        const searchTerm = e.target.value.toLowerCase();
        filterContent(searchTerm);
    }, 300));

    // Resource link click handler with analytics
    const resourceLinks = document.querySelectorAll('.resource-link');
    resourceLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const subject = link.closest('.subject-card').dataset.subject;
            const resourceType = link.dataset.type;
            handleResourceClick(subject, resourceType);
            trackAnalytics('resource_click', { subject, resourceType });
        });
    });

    // Quick action buttons
    const actionButtons = document.querySelectorAll('.action-btn');
    actionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const action = button.getAttribute('title');
            handleQuickAction(action);
        });
    });

    // Progress tracking
    initializeProgress();
    
    // Add notification system
    initializeNotifications();

    // Helper functions
    function updateContent(classNumber) {
        console.log(`Updating content for Class ${classNumber}`);
        // Simulate content update
        showNotification(`Loaded Class ${classNumber} content`);
    }

    function updateViewType(viewType) {
        if (viewType === 'list') {
            subjectGrid.style.gridTemplateColumns = '1fr';
        } else {
            subjectGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(300px, 1fr))';
        }
        showNotification(`Switched to ${viewType} view`);
    }

    function filterContent(searchTerm) {
        const subjects = document.querySelectorAll('.subject-card');
        subjects.forEach(subject => {
            const text = subject.textContent.toLowerCase();
            subject.style.display = text.includes(searchTerm) ? 'block' : 'none';
        });
    }

    function handleResourceClick(subject, resourceType) {
        console.log(`Opening ${resourceType} for ${subject}`);
        showNotification(`Opening ${resourceType} for ${subject}`);
    }

    function handleQuickAction(action) {
        console.log(`Handling quick action: ${action}`);
        showNotification(`${action} feature coming soon!`);
    }

    function trackAnalytics(event, data) {
        console.log('Analytics:', event, data);
        // Implement actual analytics tracking here
    }

    function initializeProgress() {
        // Simulate progress updates
        setInterval(() => {
            const progressBars = document.querySelectorAll('.progress');
            progressBars.forEach(bar => {
                const currentWidth = parseInt(bar.style.width) || 0;
                const newWidth = Math.min(currentWidth + 1, 100);
                bar.style.width = `${newWidth}%`;
            });
        }, 30000); // Update every 30 seconds
    }

    function initializeNotifications() {
        const panel = document.getElementById('notificationPanel');
        
        // Toggle notification panel
        document.querySelector('.profile-btn').addEventListener('click', () => {
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        });

        // Close panel when clicking outside
        document.addEventListener('click', (e) => {
            if (!panel.contains(e.target) && !e.target.matches('.profile-btn')) {
                panel.style.display = 'none';
            }
        });
    }

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        const panel = document.getElementById('notificationPanel');
        panel.insertBefore(notification, panel.firstChild);
        
        // Remove notification after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    // Utility function for debouncing
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Initialize live session counter
    initializeLiveCounter();
    function initializeLiveCounter() {
        const liveCounter = document.querySelector('.session-info span:last-child');
        if (liveCounter) {
            setInterval(() => {
                const currentCount = parseInt(liveCounter.textContent.match(/\d+/)[0]);
                const change = Math.floor(Math.random() * 3) - 1; // Random change between -1 and 1
                const newCount = Math.max(50, Math.min(200, currentCount + change));
                liveCounter.textContent = `👥 ${newCount} Students`;
            }, 5000);
        }
    }
});