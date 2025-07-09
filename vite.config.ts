import { defineConfig } from 'vitest/config';
import tsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    plugins: [tsConfigPaths()],
    test: {
        globals: true,
        environment: 'node',
        include: ['**/*.spec.ts'], // Inclui todos os arquivos .spec.ts
        coverage: {
            reporter: ['text', 'json', 'html'],
            exclude: ['**/node_modules/**', '**/tests/**', '**/*.spec.ts'],
        },
    },
})