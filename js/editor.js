import { PASTE_UPDATE_DELAY_MS } from './constants.js';
import { updateResultDisplay, updateResultPositionOnCursorMove } from './display.js';

const editor = document.getElementById('editor');

function updateResult() {
    updateResultDisplay();
}

function handlePaste() {
    setTimeout(updateResult, PASTE_UPDATE_DELAY_MS);
}

function handleBlur() {
    if (!editor.textContent.trim()) {
        editor.innerHTML = '';
    }
}

function handleKeyDown(event) {
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) {
        setTimeout(updateResultDisplay, 10);
    }
    
    // Enter 키를 누르면 현재 줄의 계산을 완료하고 다음 줄로 이동
    if (event.key === 'Enter') {
        // 줄 바꿈이 일어난 후, 현재 줄의 계산이 완료된 것으로 처리
        // 다음 줄로 넘어가기 전에 현재 줄의 계산 결과를 확정
        setTimeout(() => {
            updateResultDisplay();
        }, 10);
    }
}

function handleClick() {
    setTimeout(updateResultDisplay, 10);
}

export function initializeEditor() {
    editor.addEventListener('input', updateResult);
    editor.addEventListener('paste', handlePaste);
    editor.addEventListener('blur', handleBlur);
    editor.addEventListener('keydown', handleKeyDown);
    editor.addEventListener('click', handleClick);
    editor.addEventListener('keyup', updateResultDisplay);
    editor.focus();
}

