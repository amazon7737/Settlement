export const PURE_EXPRESSION_PATTERN = /^[\d,+\-*/().\s]+$/;
export const OPERATOR_PATTERN = /^[+\-*/]$/;
export const NUMBER_PATTERN = /(\d{1,3}(?:,\d{3})*(?:\.\d+)?|\d+\.?\d*)/;
export const OPERATOR_NORMALIZE_PATTERN = /\s*([+\-*/])\s*/g;
export const SPACE_COMMA_PATTERN = /[\s,]/g;
export const COMMA_PATTERN = /,/g;
export const PASTE_UPDATE_DELAY_MS = 10;
export const RESULT_OPACITY_VISIBLE = '0.6';
export const RESULT_OPACITY_HIDDEN = '0';

