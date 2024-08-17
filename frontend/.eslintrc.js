module.exports = {
    root: true,
    env: {
        browser: true,
        es2020: true,
        jest: true,
    },
    extends: [
        // https://eslint.org/docs/latest/rules
        'eslint:recommended',
        // https://typescript-eslint.io/users/configs
        'plugin:@typescript-eslint/recommended',
        // https://github.com/jsx-eslint/eslint-plugin-react
        'plugin:react/recommended',
        'plugin:react/jsx-runtime',
        // https://github.com/facebook/react/tree/main/packages/eslint-plugin-react-hooks
        'plugin:react-hooks/recommended',
        // https://github.com/import-js/eslint-plugin-import
        'plugin:import/recommended',
        'plugin:import/typescript',
        // https://github.com/prettier/eslint-config-prettier
        'prettier',
    ],
    ignorePatterns: ['build', 'coverage', '.eslintrc.js', 'tsconfig.json', 'vite.config.ts'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: 'tsconfig.json',
        ecmaVersion: 2020,
        ecmaFeatures: {
            jsx: true,
        },
    },
    plugins: ['@typescript-eslint', 'react', 'react-hooks', 'import', 'jest'],
    settings: {
        'import/resolver': {
            node: {
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
            },
        },
        react: {
            version: 'detect',
        },
        jest: {
            version: 'detect',
        },
    },
    overrides: [
        {
            files: ['**/__tests__/**', '**/*.test.tsx'],
            plugins: ['jest', 'jest-dom', 'testing-library'],
            extends: [
                // https://github.com/jest-community/eslint-plugin-jest
                'plugin:jest/recommended',
                // https://github.com/testing-library/eslint-plugin-jest-dom
                'plugin:jest-dom/recommended',
                // https://github.com/testing-library/eslint-plugin-testing-library
                'plugin:testing-library/react',
            ],
            rules: {
                'jest/no-standalone-expect': 'off', // disabled because it is not functioning as intended
                'testing-library/render-result-naming-convention': 'off', // disabled because the naming convention is unclear
                'testing-library/no-unnecessary-act': 'off', // disabled because renderHook sometimes has useEffect
            },
        },
    ],
};
