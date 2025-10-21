import gulp from 'gulp';
import { buildBackend } from './backend.js';
import { buildPublic } from './public.js';
import { buildPages } from './pages.js';
import { copyFiles } from './copy.js';
import { previewTemplates } from './templates.js';
import { checkTs } from './checks.js';
export function watchAll(options) {
    function watchSCSS() {
        return gulp.watch([
            '*/styles/**/*.scss'
        ], gulp.parallel('scss'));
    }
    function watchBackend() {
        return gulp.watch([
            '*/backend/**/*.ts',
            '*/backend/**/*.tsx',
            '!*/backend/**/*.jsw.ts',
            '!src/**/*',
        ], gulp.parallel(checkTs(options, true), buildBackend(options)));
    }
    function watchPublic() {
        return gulp.watch([
            '*/public/**/*.ts',
            '*/public/**/*.tsx',
            '!src/**/*',
        ], gulp.parallel(checkTs(options, true), buildPublic(options)));
    }
    function watchPages() {
        return gulp.watch(['typescript/pages/**/*.ts', '!src/**/*',], gulp.parallel(checkTs(options, true), buildPages(options)));
    }
    function watchFiles() {
        return gulp.watch([
            '*/backend/**/*',
            '*/public/**/*',
            '*/pages/**/*',
            '!*/**/*.ts',
            '!*/**/*.tsx',
            '!src/**/*',
        ], gulp.parallel(copyFiles(options)));
    }
    function watchTemplates() {
        return gulp.watch([
            '*/backend/templates/**/*.tsx',
            '*/backend/templates/data/*.json',
            '!*/backend/templates/render.ts',
            '!src/**/*',
        ], gulp.parallel(previewTemplates(options), checkTs(options, true)));
    }
    function watchTypes() {
        return gulp.watch([
            './.wix/types/**/*.d.ts',
            '!./.wix/types/wix-code-types',
            '!src/**/*',
        ], gulp.series('fix-wix-types'));
    }
    return gulp.parallel(watchSCSS, watchBackend, watchPublic, watchPages, watchFiles, watchTemplates, watchTypes);
}
//# sourceMappingURL=watchers.js.map