module.exports = {
  // 코드를 분석할 파서를 지정합니다.
  parser: '@typescript-eslint/parser',

  // TypeScript ESLint 플러그인을 활성화합니다.
  plugins: ['@typescript-eslint/eslint-plugin'],

  // 파서에 대한 옵션을 설정합니다.
  parserOptions: {
    project: 'tsconfig.json', // tsconfig.json 파일 경로
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },

  // 사용할 규칙 세트를 지정합니다. 순서가 중요합니다.
  extends: [
    // Airbnb의 TypeScript 규칙 세트를 적용합니다.
    'airbnb-typescript/base',

    // Prettier와 충돌하는 ESLint 규칙을 비활성화하고, Prettier를 ESLint 규칙으로 실행합니다.
    // 반드시 배열의 맨 마지막에 위치해야 합니다.
    'plugin:prettier/recommended',
  ],

  // ESLint가 적용될 환경을 설정합니다.
  root: true,
  env: {
    node: true, // Node.js 전역 변수 및 스코프를 사용합니다.
    jest: true, // Jest 전역 변수를 사용합니다.
  },

  // 특정 파일이나 디렉토리를 ESLint 검사에서 제외합니다.
  ignorePatterns: ['.eslintrc.js'],

  // 기본 규칙 세트를 덮어쓰는 사용자 정의 규칙입니다.
  rules: {
    // 기존에 사용하시던 규칙들을 그대로 유지합니다.
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',

    // 프로젝트에 따라 필요할 수 있는 추가적인 규칙 비활성화
    'import/prefer-default-export': 'off', // default export 강제 비활성화
    'class-methods-use-this': 'off', // class 메서드에서 this 사용 강제 비활성화
  },
};
