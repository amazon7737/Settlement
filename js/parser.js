import {
    PURE_EXPRESSION_PATTERN,
    OPERATOR_PATTERN,
    NUMBER_PATTERN,
    OPERATOR_NORMALIZE_PATTERN,
    COMMA_PATTERN,
    SPACE_COMMA_PATTERN,
} from './constants.js';

export function isPureExpression(text) {
    return PURE_EXPRESSION_PATTERN.test(text);
}

export function evaluatePureExpression(text) {
    try {
        const sanitized = text.replace(SPACE_COMMA_PATTERN, '');
        const value = Function('"use strict"; return (' + sanitized + ')')();
        if (typeof value === 'number' && !isNaN(value) && isFinite(value)) {
            return value;
        }
    } catch (e) {
        return null;
    }
    return null;
}

export function normalizeText(text) {
    return text.replace(OPERATOR_NORMALIZE_PATTERN, ' $1 ');
}

export function parseNumber(token) {
    const numMatch = token.match(NUMBER_PATTERN);
    if (!numMatch) return null;
    
    const numStr = numMatch[1].replace(COMMA_PATTERN, '');
    const num = parseFloat(numStr);
    
    return !isNaN(num) ? num : null;
}

export function extractNumbersAndOperators(text) {
    const numbers = [];
    const operators = [];
    
    const normalizedText = normalizeText(text);
    
    let currentIndex = 0;
    const textLength = normalizedText.length;
    
    while (currentIndex < textLength) {
        const remainingText = normalizedText.substring(currentIndex);
        
        const operatorMatch = remainingText.match(/^\s*([+\-*/])\s*/);
        if (operatorMatch) {
            operators.push(operatorMatch[1]);
            currentIndex += operatorMatch[0].length;
            continue;
        }
        
        const numberMatch = remainingText.match(/^\s*(\d{1,3}(?:,\d{3})*(?:\.\d+)?|\d+\.?\d*)/);
        if (numberMatch) {
            const numStr = numberMatch[1].replace(COMMA_PATTERN, '');
            const num = parseFloat(numStr);
            if (!isNaN(num) && isFinite(num)) {
                numbers.push(num);
            }
            currentIndex += numberMatch[0].length;
            continue;
        }
        
        const spaceMatch = remainingText.match(/^\s+/);
        if (spaceMatch) {
            currentIndex += spaceMatch[0].length;
            continue;
        }
        
        const nonSpaceMatch = remainingText.match(/^[^\s+\-*/]+/);
        if (nonSpaceMatch) {
            currentIndex += nonSpaceMatch[0].length;
            continue;
        }
        
        currentIndex++;
    }
    
    return { numbers, operators };
}

