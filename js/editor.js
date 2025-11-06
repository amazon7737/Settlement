import { PASTE_UPDATE_DELAY_MS } from './constants.js';
import { calculate } from './calculator.js';
import { updateResultDisplay } from './display.js';

const editor = document.getElementById('editor');

function getEditorText() {
    return editor.textContent || editor.innerText || '';
}

function updateResult() {
    const text = getEditorText();
    const result = calculate(text);
    updateResultDisplay(result);
}

function handlePaste() {
    setTimeout(updateResult, PASTE_UPDATE_DELAY_MS);
}

function handleBlur() {
    if (!editor.textContent.trim()) {
        editor.innerHTML = '';
    }
}

export function initializeEditor() {
    editor.addEventListener('input', updateResult);
    editor.addEventListener('paste', handlePaste);
    editor.addEventListener('blur', handleBlur);
    editor.focus();
}

