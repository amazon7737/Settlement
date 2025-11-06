const modal = document.getElementById('info-modal');
const modalOverlay = document.getElementById('modal-overlay');
const infoButton = document.getElementById('info-button');
const closeButton = document.getElementById('close-button');

function openModal() {
    modal.classList.remove('hidden');
    modalOverlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.add('hidden');
    modalOverlay.classList.add('hidden');
    document.body.style.overflow = '';
}

function handleOverlayClick(event) {
    if (event.target === modalOverlay) {
        closeModal();
    }
}

function handleEscapeKey(event) {
    if (event.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
    }
}

function removeAttentionAnimation() {
    setTimeout(() => {
        infoButton.classList.remove('info-button-attention');
    }, 5000);
}

export function initializeModal() {
    infoButton.addEventListener('click', openModal);
    closeButton.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', handleOverlayClick);
    document.addEventListener('keydown', handleEscapeKey);
    removeAttentionAnimation();
}

