let modal = null;
let modalOverlay = null;
let infoButton = null;
let closeButton = null;

async function loadModal() {
    const container = document.getElementById('modal-container');
    if (!container) return;
    
    try {
        const response = await fetch('modal.html');
        const html = await response.text();
        container.innerHTML = html;
        
        modal = document.getElementById('info-modal');
        modalOverlay = document.getElementById('modal-overlay');
        closeButton = document.getElementById('close-button');
        
        if (modal && modalOverlay && closeButton) {
            setupModalEvents();
        }
    } catch (error) {
        console.error('Failed to load modal:', error);
    }
}

function openModal() {
    if (modal && modalOverlay) {
        modal.classList.remove('hidden');
        modalOverlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    if (modal && modalOverlay) {
        modal.classList.add('hidden');
        modalOverlay.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

function handleOverlayClick(event) {
    if (event.target === modalOverlay) {
        closeModal();
    }
}

function handleEscapeKey(event) {
    if (event.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
        closeModal();
    }
}

function removeAttentionAnimation() {
    setTimeout(() => {
        if (infoButton) {
            infoButton.classList.remove('info-button-attention');
        }
    }, 5000);
}

function setupModalEvents() {
    if (closeButton) {
        closeButton.addEventListener('click', closeModal);
    }
    if (modalOverlay) {
        modalOverlay.addEventListener('click', handleOverlayClick);
    }
    document.addEventListener('keydown', handleEscapeKey);
}

export async function initializeModal() {
    infoButton = document.getElementById('info-button');
    
    if (infoButton) {
        infoButton.addEventListener('click', openModal);
        removeAttentionAnimation();
    }
    
    await loadModal();
}

