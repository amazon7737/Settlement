import {
    isPureExpression,
    evaluatePureExpression,
    normalizeText,
    extractNumbersAndOperators,
} from './parser.js';

function sumNumbers(numbers) {
    return numbers.reduce((sum, num) => sum + num, 0);
}

function applyOperation(result, operator, number) {
    switch (operator) {
        case '+':
            return result + number;
        case '-':
            return result - number;
        case '*':
            return result * number;
        case '/':
            return number !== 0 ? result / number : result;
        default:
            return result;
    }
}

function calculateWithOperators(numbers, operators) {
    let result = numbers[0];
    let numberIndex = 1;
    
    for (const operator of operators) {
        if (numberIndex >= numbers.length) break;
        result = applyOperation(result, operator, numbers[numberIndex]);
        numberIndex++;
    }
    
    while (numberIndex < numbers.length) {
        result += numbers[numberIndex];
        numberIndex++;
    }
    
    return result;
}

export function calculate(text) {
    const trimmedText = text.trim();
    if (!trimmedText) return null;
    
    if (isPureExpression(trimmedText)) {
        const pureResult = evaluatePureExpression(trimmedText);
        if (pureResult !== null) {
            return pureResult;
        }
    }
    
    const { numbers, operators } = extractNumbersAndOperators(trimmedText);
    
    if (numbers.length === 0) return null;
    
    if (operators.length === 0) {
        return sumNumbers(numbers);
    }
    
    const result = calculateWithOperators(numbers, operators);
    return isFinite(result) ? result : null;
}

