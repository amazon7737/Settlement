import { RESULT_OPACITY_VISIBLE, RESULT_OPACITY_HIDDEN } from './constants.js';

const resultDisplay = document.getElementById('result');
const editor = document.getElementById('editor');

function formatNumber(number) {
    return number.toLocaleString('ko-KR');
}

function getCaretPosition() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return null;
    
    const range = selection.getRangeAt(0).cloneRange();
    range.collapse(true);
    
    let rect;
    let tempSpan = null;
    
    try {
        rect = range.getBoundingClientRect();
        
        if (rect.width === 0 && rect.height === 0) {
            tempSpan = document.createElement('span');
            tempSpan.style.position = 'absolute';
            tempSpan.style.visibility = 'hidden';
            tempSpan.style.whiteSpace = 'pre';
            tempSpan.textContent = '\u200b';
            
            range.insertNode(tempSpan);
            rect = tempSpan.getBoundingClientRect();
        }
    } catch (e) {
        return null;
    }
    
    const editorContainer = document.getElementById('editor-container');
    const containerRect = editorContainer.getBoundingClientRect();
    
    const position = {
        left: rect.right - containerRect.left,
        top: rect.top - containerRect.top,
        height: rect.height || 24
    };
    
    if (tempSpan && tempSpan.parentNode) {
        tempSpan.parentNode.removeChild(tempSpan);
    }
    
    return position;
}

function updateResultPosition() {
    requestAnimationFrame(() => {
        const position = getCaretPosition();
        if (position) {
            resultDisplay.style.left = `${position.left + 8}px`;
            resultDisplay.style.top = `${position.top}px`;
            resultDisplay.style.lineHeight = `${position.height}px`;
            resultDisplay.style.fontSize = window.getComputedStyle(editor).fontSize;
        }
    });
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

