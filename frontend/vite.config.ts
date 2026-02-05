/// <reference types="vitest" />
/// <reference types="vite/client" />

import react from '@vitejs/plugin-react-swc';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';

export default {
    plugins: [react(), viteTsconfigPaths(), svgrPlugin()],
    build: {
        outDir: 'build',
    },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      include: ['src/**/*'],
      exclude: [
        'node_modules/**',
        'src/setupTests.ts',
        'src/vite-env.d.ts',
        '**/*.config.{js,ts}',
        '**/*.test.{js,ts,jsx,tsx}',
        '**/*.spec.{js,ts,jsx,tsx}',
        'build/**',
        'coverage/**',
        'src/Routes/*',
        'src/main.tsx',
        'src/index.css',
        'src/**/*.d.ts',
        'src/themes/*',
        'src/**/model/*',
        'src/ApiEndpoints/*',
        '**/types/**',
        'src/**/__tests__/**',
        'src/*.css',
        'src/assets/**'
      ],
      skipFull: false,
      excludeAfterRemap: true,
      thresholds: {
        branches: 90,
        functions: 90,
        lines: 90,
        statements: 90,
      },
    },
  },
    server: {
        port: 3000,
        strictPort: true,
        proxy: {
            '/api': {
                target: 'http://localhost:8080',
                changeOrigin: true,
                secure: false,
            },
        },
    },
};
