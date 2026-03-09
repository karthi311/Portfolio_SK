import { defineConfig } from 'vite';

export default defineConfig({
    // For GitHub Pages deployment:
    // If deploying to https://<username>.github.io/ → set base to '/'
    // If deploying to https://<username>.github.io/<repo>/ → set base to '/<repo>/'
    base: './',

    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        // Generate clean URLs
        rollupOptions: {
            input: './index.html',
        },
    },

    server: {
        open: true,
    },
});

