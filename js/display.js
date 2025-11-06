import { RESULT_OPACITY_VISIBLE, RESULT_OPACITY_HIDDEN } from './constants.js';

const resultDisplay = document.getElementById('result');
const editor = document.getElementById('editor');

function formatNumber(number) {
    return number.toLocaleString('ko-KR');
}

function getCaretPosition() {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return null;
    
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const editorRect = editor.getBoundingClientRect();
    
    return {
        left: rect.right - editorRect.left,
        top: rect.top - editorRect.top
    };
}

function updateResultPosition() {
    const position = getCaretPosition();
    if (position) {
        resultDisplay.style.left = `${position.left + 8}px`;
        resultDisplay.style.top = `${position.top}px`;
    }
}

export function updateResultDisplay(result) {
    if (result !== null) {
        const formatted = formatNumber(result);
        resultDisplay.textContent = formatted;
        resultDisplay.style.opacity = RESULT_OPACITY_VISIBLE;
        updateResultPosition();
    } else {
        resultDisplay.textContent = '0';
        resultDisplay.style.opacity = RESULT_OPACITY_HIDDEN;
    }
}

export function updateResultPositionOnCursorMove() {
    if (resultDisplay.style.opacity === RESULT_OPACITY_VISIBLE) {
        updateResultPosition();
    }
}

