import { RESULT_OPACITY_VISIBLE, RESULT_OPACITY_HIDDEN } from './constants.js';
import { calculate } from './calculator.js';

const editor = document.getElementById('editor');
const editorContainer = document.getElementById('editor-container');
const lineResults = new Map();

function formatNumber(number) {
    return number.toLocaleString('ko-KR');
}

function getLineEndPosition(lineIndex) {
    const fullText = editor.textContent || '';
    const lines = fullText.split('\n');
    
    if (lineIndex >= lines.length) return null;
    
    const targetLine = lines[lineIndex];
    
    // Calculate the character offset for the start of this line
    // Sum up all characters in previous lines plus their newline characters
    let lineStartOffset = 0;
    for (let i = 0; i < lineIndex; i++) {
        lineStartOffset += lines[i].length;
        lineStartOffset += 1; // +1 for the newline character after each line
    }
    
    // Calculate the character offset for the end of this line (end of line text, before newline)
    const lineEndOffset = lineStartOffset + targetLine.length;
    
    // Create a range that points to the end of this specific line
    const lineEndRange = document.createRange();
    
    // Walk through all text nodes to find the position
    let currentOffset = 0;
    const walker = document.createTreeWalker(
        editor,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );
    
    let node;
    let targetNode = null;
    let targetOffset = 0;
    let found = false;
    
    // Find the text node and offset that corresponds to lineEndOffset
    while ((node = walker.nextNode()) && !found) {
        const nodeText = node.textContent || '';
        const nodeLength = nodeText.length;
        
        // Check if lineEndOffset falls within this node
        if (currentOffset + nodeLength >= lineEndOffset) {
            targetNode = node;
            targetOffset = Math.max(0, Math.min(lineEndOffset - currentOffset, nodeLength));
            found = true;
        } else {
            currentOffset += nodeLength;
        }
    }
    
    // If we didn't find the exact position, try to use the last node
    if (!found || !targetNode) {
        // Try to find the last text node
        let lastNode = null;
        const walker2 = document.createTreeWalker(
            editor,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        while ((node = walker2.nextNode())) {
            lastNode = node;
        }
        
        if (lastNode) {
            targetNode = lastNode;
            targetOffset = lastNode.textContent?.length || 0;
        } else {
            return null;
        }
    }
    
    // Set the range to point to the end of the line
    try {
        const maxOffset = targetNode.textContent?.length || 0;
        const safeOffset = Math.max(0, Math.min(targetOffset, maxOffset));
        lineEndRange.setStart(targetNode, safeOffset);
        lineEndRange.setEnd(targetNode, safeOffset);
    } catch (e) {
        return null;
    }
    
    // Get the bounding rectangle
    let rect;
    let tempSpan = null;
    
    try {
        rect = lineEndRange.getBoundingClientRect();
        
        // If the range is collapsed or has no dimensions, create a temporary span
        if ((rect.width === 0 && rect.height === 0) || lineEndRange.collapsed) {
            // Try inserting a zero-width space to get dimensions
            tempSpan = document.createElement('span');
            tempSpan.style.position = 'absolute';
            tempSpan.style.visibility = 'hidden';
            tempSpan.style.whiteSpace = 'pre';
            tempSpan.textContent = '\u200b';
            
            lineEndRange.insertNode(tempSpan);
            rect = tempSpan.getBoundingClientRect();
        }
    } catch (e) {
        return null;
    }
    
    const containerRect = editorContainer.getBoundingClientRect();
    
    const position = {
        left: rect.right - containerRect.left,
        top: rect.top - containerRect.top,
        height: rect.height || 24
    };
    
    // Clean up temporary span
    if (tempSpan && tempSpan.parentNode) {
        tempSpan.parentNode.removeChild(tempSpan);
    }
    
    return position;
}

function createLineResultElement(lineIndex) {
    const resultElement = document.createElement('div');
    resultElement.className = 'absolute text-2xl font-light text-blue-500 pointer-events-none whitespace-nowrap';
    resultElement.setAttribute('data-line-index', lineIndex.toString());
    resultElement.style.opacity = RESULT_OPACITY_HIDDEN;
    resultElement.style.zIndex = '1';
    resultElement.textContent = '0';
    editorContainer.appendChild(resultElement);
    return resultElement;
}

function updateAllLineResults() {
    requestAnimationFrame(() => {
        const fullText = editor.textContent || '';
        const lines = fullText.split('\n');
        
        // Remove result elements for lines that no longer exist
        const keysToRemove = [];
        for (const [lineIndex, resultElement] of lineResults.entries()) {
            if (lineIndex >= lines.length) {
                if (resultElement && resultElement.parentNode) {
                    resultElement.parentNode.removeChild(resultElement);
                }
                keysToRemove.push(lineIndex);
            }
        }
        keysToRemove.forEach(key => lineResults.delete(key));
        
        // Process each line independently
        for (let i = 0; i < lines.length; i++) {
            // Get the text for this specific line only
            const lineText = lines[i];
            
            // Trim whitespace but keep the line for position calculation
            const trimmedLineText = lineText.trim();
            
            // Calculate result for THIS LINE ONLY (completely independent)
            const result = trimmedLineText ? calculate(trimmedLineText) : null;
            
            // Get or create result element for this specific line index
            if (!lineResults.has(i)) {
                const resultElement = createLineResultElement(i);
                lineResults.set(i, resultElement);
            }
            
            const resultElement = lineResults.get(i);
            
            // Ensure this result element is uniquely identified with the correct line index
            resultElement.setAttribute('data-line-index', i.toString());
            
            // Get the position for THIS SPECIFIC LINE ONLY
            const position = getLineEndPosition(i);
            
            if (position) {
                if (result !== null) {
                    // Display the result for this line
                    const formatted = formatNumber(result);
                    resultElement.textContent = formatted;
                    resultElement.style.opacity = RESULT_OPACITY_VISIBLE;
                    resultElement.style.left = `${position.left + 8}px`;
                    resultElement.style.top = `${position.top}px`;
                    resultElement.style.lineHeight = `${position.height}px`;
                    resultElement.style.fontSize = window.getComputedStyle(editor).fontSize;
                } else {
                    // Hide result if line is empty or has no valid calculation
                    resultElement.textContent = '0';
                    resultElement.style.opacity = RESULT_OPACITY_HIDDEN;
                }
            } else {
                // Hide result if position cannot be determined
                resultElement.style.opacity = RESULT_OPACITY_HIDDEN;
            }
        }
    });
}

export function updateResultDisplay() {
    updateAllLineResults();
}

export function updateResultPositionOnCursorMove() {
    updateAllLineResults();
}

