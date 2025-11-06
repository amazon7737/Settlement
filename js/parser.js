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

export function extractNumbersAndOperators(tokens) {
    const numbers = [];
    const operators = [];
    
    for (const token of tokens) {
        const trimmedToken = token.trim();
        if (!trimmedToken) continue;
        
        if (OPERATOR_PATTERN.test(trimmedToken)) {
            operators.push(trimmedToken);
        } else {
            const number = parseNumber(trimmedToken);
            if (number !== null) {
                numbers.push(number);
            }
        }
    }
    
    return { numbers, operators };
}

