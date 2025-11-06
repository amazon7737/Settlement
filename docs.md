# JavaScript 리팩터링 문서

## 개요

계산 메모장 에디터의 JavaScript 코드를 단계적으로 리팩터링하여 가독성, 유지보수성, 확장성을 개선한 과정을 정리합니다.

## 초기 상태의 문제점

### 1. 단일 파일에 모든 로직 집중
- 하나의 `script.js` 파일에 모든 코드가 혼재
- 계산 로직, UI 업데이트, 이벤트 처리 등이 한 곳에 모여있음
- 코드 길이 약 170줄로, 전체 흐름 파악이 어려움

### 2. 함수의 책임이 불명확
- `calculate()` 함수가 너무 많은 일을 수행
  - 순수 수식 판별
  - 텍스트 정규화
  - 토큰 파싱
  - 계산 수행
- 단일 책임 원칙(SRP) 위반

### 3. 매직 넘버와 하드코딩된 값들
- 정규식 패턴이 코드 중간에 산재
- 설정값들이 함수 내부에 하드코딩
- 변경 시 여러 곳을 수정해야 하는 위험

### 4. 복잡한 조건 분기
- 중첩된 if-else 문
- 복잡한 로직이 한 함수에 집중
- 테스트하기 어려운 구조

### 5. 주석에 의존한 코드 이해
- 코드 자체로는 의도 파악이 어려워 주석 필요
- 주석과 코드의 불일치 위험

## 리팩터링 1단계: 함수 분리 및 구조 개선

### 목표
- 큰 함수를 작은 단위로 분리
- 각 함수가 하나의 명확한 책임을 가지도록 개선
- 변수 네이밍 개선으로 코드 자체가 문서 역할

### 해결 과정

#### 1.1 정적 변수 정리
**문제**: 정규식 패턴과 설정값이 코드 중간에 산재

**해결**:
```javascript
// Before: 코드 중간에 정규식이 하드코딩
const pureExpression = text.match(/^[\d,+\-*/().\s]+$/);

// After: 파일 상단에 상수로 정의
const PURE_EXPRESSION_PATTERN = /^[\d,+\-*/().\s]+$/;
```

**효과**:
- 재사용성 향상
- 변경 시 한 곳만 수정
- 코드 가독성 개선

#### 1.2 계산 로직 분리
**문제**: `calculate()` 함수가 너무 많은 책임을 가짐

**해결**: 단계별로 함수 분리

**1단계: 순수 수식 판별 및 계산**
```javascript
// Before: calculate() 내부에 모든 로직
if (pureExpression) {
    try {
        const sanitized = text.replace(/[\s,]/g, '');
        // ...
    }
}

// After: 별도 함수로 분리
function isPureExpression(text) {
    return PURE_EXPRESSION_PATTERN.test(text);
}

function evaluatePureExpression(text) {
    // 순수 수식 계산 로직만 담당
}
```

**2단계: 텍스트 파싱 로직 분리**
```javascript
// Before: calculate() 내부에 파싱 로직
let normalized = text.replace(/\s*([+\-*/])\s*/g, ' $1 ');
const tokens = normalized.split(/\s+/);
// ...

// After: 파싱 전용 함수들로 분리
function normalizeText(text) { /* ... */ }
function parseNumber(token) { /* ... */ }
function extractNumbersAndOperators(tokens) { /* ... */ }
```

**3단계: 계산 로직 분리**
```javascript
// Before: calculate() 내부에 모든 계산 로직
switch (op) {
    case '+': result += nextNum; break;
    // ...
}

// After: 계산 로직을 별도 함수로 분리
function sumNumbers(numbers) { /* ... */ }
function applyOperation(result, operator, number) { /* ... */ }
function calculateWithOperators(numbers, operators) { /* ... */ }
```

**효과**:
- 각 함수가 단일 책임을 가짐
- 함수별로 독립적인 테스트 가능
- 코드 재사용성 향상

#### 1.3 변수 네이밍 개선
**문제**: 변수명이 모호하거나 의도를 전달하지 못함

**해결**:
```javascript
// Before
const tokens = normalized.split(/\s+/);
let numIndex = 1;

// After
const trimmedToken = token.trim();
let numberIndex = 1;
```

**효과**:
- 코드만으로도 의도 파악 가능
- 주석 없이도 이해 가능한 코드

#### 1.4 주석 제거
**문제**: 주석에 의존한 코드 이해

**해결**:
- 함수명과 변수명으로 의도 표현
- 코드 자체가 문서 역할

**효과**:
- 주석과 코드의 불일치 위험 제거
- 코드 자체의 가독성 향상

## 리팩터링 2단계: 모듈화

### 목표
- 관련 기능을 논리적으로 그룹화
- 모듈 간 의존성 명확화
- 코드 재사용성 및 유지보수성 향상

### 모듈 구조 설계

#### 2.1 모듈 분리 기준
**원칙**: 단일 책임 원칙과 응집도(cohesion) 고려

1. **constants.js**: 모든 상수 정의
   - 정규식 패턴
   - 설정값
   - 이유: 변경 빈도가 낮고, 여러 모듈에서 공유

2. **parser.js**: 텍스트 파싱 관련
   - `isPureExpression()`: 순수 수식 판별
   - `evaluatePureExpression()`: 순수 수식 계산
   - `normalizeText()`: 텍스트 정규화
   - `parseNumber()`: 숫자 파싱
   - `extractNumbersAndOperators()`: 토큰에서 숫자/연산자 추출
   - 이유: 텍스트 파싱이라는 공통 목적

3. **calculator.js**: 계산 로직
   - `calculate()`: 메인 계산 함수
   - `sumNumbers()`: 숫자 합산
   - `applyOperation()`: 단일 연산 수행
   - `calculateWithOperators()`: 연산자 기반 계산
   - 이유: 계산이라는 공통 목적

4. **display.js**: 화면 표시 관련
   - `updateResultDisplay()`: 결과 표시 업데이트
   - `formatNumber()`: 숫자 포맷팅
   - 이유: UI 업데이트라는 공통 목적

5. **editor.js**: 에디터 이벤트 처리
   - `initializeEditor()`: 초기화
   - `updateResult()`: 결과 업데이트
   - `handlePaste()`: 붙여넣기 처리
   - `handleBlur()`: 블러 처리
   - 이유: 에디터 이벤트 처리라는 공통 목적

6. **script.js**: 메인 진입점
   - 모든 모듈을 import하고 초기화
   - 이유: 애플리케이션 진입점

#### 2.2 모듈 간 의존성

```
script.js
  └── editor.js
        ├── constants.js
        ├── calculator.js
        │     └── parser.js
        │           └── constants.js
        └── display.js
              └── constants.js
```

**의존성 특징**:
- `constants.js`는 여러 모듈에서 공유
- `parser.js`는 `calculator.js`에서만 사용
- `display.js`와 `editor.js`는 독립적
- 순환 의존성 없음

#### 2.3 모듈화의 장점

**1. 코드 조직화**
- 관련 기능이 한 곳에 모여있어 찾기 쉬움
- 파일 크기가 작아져 이해하기 쉬움

**2. 재사용성**
- 각 모듈을 독립적으로 import 가능
- 다른 프로젝트에서도 활용 가능

**3. 테스트 용이성**
- 모듈별로 독립적인 테스트 작성 가능
- Mock 객체 사용이 쉬움

**4. 유지보수성**
- 특정 기능 수정 시 해당 모듈만 수정
- 버그 발생 시 영향 범위가 명확

**5. 협업 효율성**
- 여러 개발자가 동시에 작업 가능
- Git 충돌 가능성 감소

## 개선 결과

### Before (초기 상태)
- 단일 파일: 약 170줄
- 함수: 1개의 큰 함수 + 몇 개의 작은 함수
- 책임: 불명확
- 테스트: 어려움
- 유지보수: 어려움

### After (리팩터링 후)
- 모듈: 6개 파일로 분리
- 함수: 각 모듈당 2-5개의 작은 함수
- 책임: 명확하게 분리
- 테스트: 각 함수별 독립 테스트 가능
- 유지보수: 쉬움

### 코드 메트릭스 개선

| 항목 | Before | After |
|------|--------|-------|
| 최대 함수 길이 | ~100줄 | ~30줄 |
| 함수당 평균 책임 | 3-4개 | 1개 |
| 순환 복잡도 | 높음 | 낮음 |
| 재사용 가능한 함수 | 낮음 | 높음 |

## 향후 개선 방향

### 1. 타입 안정성
- TypeScript 도입 고려
- 타입 정의로 런타임 에러 방지

### 2. 테스트 코드 작성
- 각 모듈별 단위 테스트
- 통합 테스트

### 3. 에러 처리 강화
- 명확한 에러 메시지
- 에러 로깅

### 4. 성능 최적화
- 불필요한 계산 최소화
- 메모이제이션 고려

## 결론

이번 리팩터링을 통해 코드의 가독성, 유지보수성, 확장성을 크게 개선했습니다. 특히 모듈화를 통해 코드 구조가 명확해지고, 각 모듈의 책임이 분리되어 향후 기능 추가나 수정이 용이해졌습니다.

