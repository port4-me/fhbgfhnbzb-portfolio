// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Animate skill bars
const skillsSection = document.querySelector('#skills');
if (skillsSection) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bars = entry.target.querySelectorAll('.skill-fill');
                bars.forEach(bar => {
                    const level = bar.getAttribute('data-level');
                    let width = 0;
                    switch(level) {
                        case 'Beginner': width = 25; break;
                        case 'Intermediate': width = 50; break;
                        case 'Advanced': width = 75; break;
                        case 'Expert': width = 100; break;
                    }
                    setTimeout(() => { bar.style.width = width + '%'; }, 100);
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    observer.observe(skillsSection);
}

// Fade in animations
const fadeElements = document.querySelectorAll('.section, .project, .timeline-card, .edu-item');
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

fadeElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    fadeObserver.observe(el);
});

// Initialize drag and drop functionality
document.addEventListener('DOMContentLoaded', () => {
    initializeDragAndDrop();
});

// Drag and Drop functionality for customization
let draggedElement = null;
let dragOffset = { x: 0, y: 0 };
let originalPosition = { x: 0, y: 0 };

// Make elements draggable
function makeElementDraggable(element) {
    element.style.cursor = 'grab';
    element.style.position = 'relative';
    element.style.zIndex = '10';

    element.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return; // Only left mouse button

        draggedElement = element;
        const rect = element.getBoundingClientRect();
        const parentRect = element.parentElement.getBoundingClientRect();

        dragOffset.x = e.clientX - rect.left;
        dragOffset.y = e.clientY - rect.top;
        originalPosition.x = rect.left - parentRect.left;
        originalPosition.y = rect.top - parentRect.top;

        element.style.cursor = 'grabbing';
        element.style.zIndex = '1000';

        // Add visual feedback
        element.style.boxShadow = '0 10px 30px rgba(59, 130, 246, 0.3)';
        element.style.transform = 'scale(1.05)';

        e.preventDefault();
    });

    element.addEventListener('mousemove', (e) => {
        if (draggedElement !== element) return;

        const parentRect = element.parentElement.getBoundingClientRect();
        const newX = e.clientX - parentRect.left - dragOffset.x;
        const newY = e.clientY - parentRect.top - dragOffset.y;

        // Constrain to parent bounds
        const maxX = parentRect.width - element.offsetWidth;
        const maxY = parentRect.height - element.offsetHeight;

        const constrainedX = Math.max(0, Math.min(newX, maxX));
        const constrainedY = Math.max(0, Math.min(newY, maxY));

        element.style.left = constrainedX + 'px';
        element.style.top = constrainedY + 'px';
    });

    element.addEventListener('mouseup', () => {
        if (draggedElement !== element) return;

        draggedElement = null;
        element.style.cursor = 'grab';
        element.style.zIndex = '10';

        // Remove visual feedback
        element.style.boxShadow = '';
        element.style.transform = '';

        // Save position
        saveElementPosition(element);
    });
}

// Save element position
function saveElementPosition(element) {
    const position = {
        id: element.id || element.className,
        left: element.style.left,
        top: element.style.top
    };

    // Save to localStorage for persistence
    const positions = JSON.parse(localStorage.getItem('elementPositions') || '[]');
    const existingIndex = positions.findIndex(p => p.id === position.id);

    if (existingIndex >= 0) {
        positions[existingIndex] = position;
    } else {
        positions.push(position);
    }

    localStorage.setItem('elementPositions', JSON.stringify(positions));
    console.log('Element position saved:', position);
}

// Load saved positions
function loadSavedPositions() {
    const positions = JSON.parse(localStorage.getItem('elementPositions') || '[]');

    positions.forEach(position => {
        const element = document.querySelector(`#${position.id}`) ||
                       document.querySelector(`.${position.id.split(' ').join('.')}`);
        if (element) {
            element.style.left = position.left;
            element.style.top = position.top;
        }
    });
}

// Initialize drag and drop for draggable elements
function initializeDragAndDrop() {
    // Make specific elements draggable
    const draggableElements = document.querySelectorAll('.hero-image, .skill-item, .project, .contact-btn, .timeline-card, .edu-item');

    draggableElements.forEach(element => {
        makeElementDraggable(element);
    });

    // Load saved positions
    loadSavedPositions();
}
