/// <reference types="vitest" />
/// <reference types="vite/client" />

import react from '@vitejs/plugin-react-swc';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';
import compression from 'vite-plugin-compression';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';

export default {
    plugins: [
        react(),
        viteTsconfigPaths(),
        svgrPlugin(),
        compression({
            algorithm: 'gzip',
            ext: '.gz',
            threshold: 1024,
            deleteOriginFile: false,
        }),
        compression({
            algorithm: 'brotliCompress',
            ext: '.br',
            threshold: 1024,
            deleteOriginFile: false,
        }),
        process.env.ANALYZE &&
            visualizer({
                filename: 'dist/bundle-analysis.html',
                open: true,
                gzipSize: true,
                brotliSize: true,
                template: 'treemap',
            }),
    ].filter(Boolean),
    build: {
        outDir: 'build',
        minify: 'terser',
        cssMinify: true,
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true,
                pure_funcs: ['console.log', 'console.info', 'console.debug'],
                passes: 2,
            },
            mangle: {
                safari10: true,
            },
            format: {
                comments: false,
            },
        },
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                    router: ['react-router-dom'],
                    'mui-core': ['@mui/material/styles', '@mui/system'],
                    'mui-components': [
                        '@mui/material/AppBar',
                        '@mui/material/Avatar',
                        '@mui/material/Box',
                        '@mui/material/Button',
                        '@mui/material/Container',
                        '@mui/material/IconButton',
                        '@mui/material/Menu',
                        '@mui/material/MenuItem',
                        '@mui/material/Toolbar',
                        '@mui/material/Tooltip',
                        '@mui/material/Typography',
                        '@mui/material/CssBaseline',
                    ],
                    'mui-icons': ['@mui/icons-material'],
                    http: ['axios'],
                },
                chunkFileNames: 'assets/js/[name]-[hash].js',
                entryFileNames: 'assets/js/[name]-[hash].js',
                assetFileNames: (assetInfo) => {
                    const info = assetInfo.name.split('.');
                    if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name)) {
                        return `assets/images/[name]-[hash].[ext]`;
                    }
                    if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
                        return `assets/fonts/[name]-[hash].[ext]`;
                    }
                    return `assets/[ext]/[name]-[hash].[ext]`;
                },
            },
        },
        chunkSizeWarningLimit: 1000,
        sourcemap: false,
        target: 'es2020',
        cssCodeSplit: true,
        modulePreload: {
            polyfill: true,
        },
    },

    server: {
        port: 3000,
        strictPort: true,
        hmr: {
            overlay: true,
        },
        fs: {
            strict: false,
        },
        proxy: {
            '/api': {
                target: 'http://localhost:8080',
                changeOrigin: true,
                secure: false,
                timeout: 60000,
            },
        },
    },

    optimizeDeps: {
        include: ['react', 'react-dom', 'react-router-dom', '@mui/material/styles', 'axios'],
    },

    resolve: {
        dedupe: ['react', 'react-dom'],
    },

    css: {
        modules: {
            localsConvention: 'camelCase',
        },
    },

    define: {
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    },

    preview: {
        port: 3001,
        host: true,
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
                'src/assets/**',
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
};
