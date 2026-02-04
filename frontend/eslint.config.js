import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import importPlugin from 'eslint-plugin-import';
import jestPlugin from 'eslint-plugin-jest';
import jestDomPlugin from 'eslint-plugin-jest-dom';
import testingLibraryPlugin from 'eslint-plugin-testing-library';
import prettierConfig from 'eslint-config-prettier';
import unimportedPlugin from 'eslint-plugin-unused-imports';
import globals from 'globals';

export default [
    {
        ignores: ['build', 'coverage', 'dist', 'node_modules', '.prettierrc.cjs'],
    },
    {
        files: ['src/**/*.{js,jsx,ts,tsx}'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: 'tsconfig.json',
                ecmaVersion: 2020,
                sourceType: 'module',
                ecmaFeatures: {
                    jsx: true,
                },
            },
            globals: {
                browser: 'readonly',
                es2020: 'readonly',
                document: 'readonly',
                window: 'readonly',
                console: 'readonly',
            },
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
            react: reactPlugin,
            'react-hooks': reactHooksPlugin,
            import: importPlugin,
            'unused-imports': unimportedPlugin,
        },
        rules: {
            ...js.configs.recommended.rules,
            ...tsPlugin.configs.recommended.rules,
            ...reactPlugin.configs.recommended.rules,
            ...reactHooksPlugin.configs.recommended.rules,
            ...prettierConfig.rules,
            'react/react-in-jsx-scope': 'off',
            'react/prop-types': 'off',
            'unused-imports/no-unused-imports': 'error',
        },
        settings: {
            react: {
                version: 'detect',
            },
            'import/resolver': {
                typescript: {
                    alwaysTryTypes: true,
                    project: 'tsconfig.json',
                },
            },
        },
    },
    {
        files: ['src/**/__tests__/**', 'src/**/*.test.{ts,tsx}'],
        languageOptions: {
            globals: {
                ...globals.browser,
                describe: 'readonly',
                it: 'readonly',
                expect: 'readonly',
                beforeEach: 'readonly',
                afterEach: 'readonly',
                vi: 'readonly',
            },
        },
        plugins: {
            jest: jestPlugin,
            'jest-dom': jestDomPlugin,
            'testing-library': testingLibraryPlugin,
        },
        settings: {
            jest: {
                version: 'latest',
            },
        },
        rules: {
            ...jestPlugin.configs.recommended.rules,
            ...jestDomPlugin.configs.recommended.rules,
            ...testingLibraryPlugin.configs.react.rules,
            'jest/no-standalone-expect': 'off',
            'testing-library/render-result-naming-convention': 'off',
            'testing-library/no-unnecessary-act': 'off',
            'unused-imports/no-unused-imports': 'error',
        },
    },
];
