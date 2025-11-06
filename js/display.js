import { RESULT_OPACITY_VISIBLE, RESULT_OPACITY_HIDDEN } from './constants.js';

const resultDisplay = document.getElementById('result');

function formatNumber(number) {
    return number.toLocaleString('ko-KR');
}

export function updateResultDisplay(result) {
    if (result !== null) {
        const formatted = formatNumber(result);
        resultDisplay.textContent = formatted;
        resultDisplay.style.opacity = RESULT_OPACITY_VISIBLE;
    } else {
        resultDisplay.textContent = '0';
        resultDisplay.style.opacity = RESULT_OPACITY_HIDDEN;
    }
}

