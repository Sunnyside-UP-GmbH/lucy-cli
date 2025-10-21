import gulp from 'gulp';
import gulpSass from 'gulp-sass';
import shell from 'gulp-shell';
import * as dartSass from 'sass';
import backendSettings from '../../settings/backend-settings.json' with { type: "json" };
;
import masterSettings from '../../settings/master-settings.json' with { type: "json" };
;
import pageSettings from '../../settings/page-settings.json' with { type: "json" };
;
import publicSettings from '../../settings/public-settings.json' with { type: "json" };
;
import { buildPublic } from './gulp/public.js';
import { buildBackend, buildBackendJSW } from './gulp/backend.js';
import { checkPages, checkTs } from './gulp/checks.js';
import { compileScss } from './gulp/styles.js';
import { buildPages } from './gulp/pages.js';
import { previewTemplates } from './gulp/templates.js';
import { copyFiles } from './gulp/copy.js';
import { cleanSrc, cleanWix } from './gulp/clean.js';
import { addTypes, updateWixTypes } from './gulp/types.js';
import { setProdConfig } from './gulp/pipeline.js';
import { watchAll } from './gulp/watchers.js';
import { getModulesSourcePaths } from './gulp/helpers.js';
import { logger } from '../utils/logger.js';
import { Effect } from 'effect/index';
import { Config } from '../config.js';
import { AppError } from '../error.js';
const sass = gulpSass(dartSass);
export const task_runGulp = Effect.gen(function* (_) {
    const config = (yield* Config).config;
    const task = config.action.tasksName || "dev";
    const taskOptions = {
        enableIncrementalBuild: config.action.tasksName === 'dev' ? true : false,
        outputDir: './src',
        sass,
        pageSettings,
        publicSettings,
        backendSettings,
        masterSettings,
        replaceOptions: {
            logs: {
                enabled: false
            }
        },
        cwd: process.cwd(),
        modulesSourcePaths: yield* getModulesSourcePaths,
    };
    logger.action(`Running task: ${task}`);
    gulp.task('check-ts', gulp.parallel(checkTs(taskOptions, false)));
    gulp.task('scss', gulp.parallel(compileScss(taskOptions)));
    gulp.task('build-backend', gulp.parallel(buildBackend(taskOptions), buildBackendJSW(taskOptions)));
    gulp.task('build-public', gulp.parallel(buildPublic(taskOptions)));
    gulp.task('preview-templates', gulp.parallel(previewTemplates(taskOptions)));
    gulp.task('copy-files', gulp.parallel(copyFiles(taskOptions)));
    gulp.task('test', function () {
        return shell.task(['yarn test'], { ignoreErrors: true })().then(() => {
            logger.success("Tests completed successfully.");
        }).catch(err => {
            logger.error("Error in test task!");
        });
    });
    gulp.task('test-ci', function () {
        return shell.task(['yarn test --run'], { ignoreErrors: true })().then(() => {
            logger.success("Tests completed successfully.");
        }).catch(err => {
            logger.error("Error in test task!");
        });
    });
    gulp.task('sync-types', shell.task([
        'wix sync-types',
    ]));
    gulp.task('fix-wix-types', gulp.parallel(updateWixTypes(taskOptions)));
    gulp.task('add-wix-types', function (done) {
        return addTypes(taskOptions, done);
    });
    gulp.task('set-production', gulp.parallel(setProdConfig()));
    gulp.task('start-wix', shell.task([
        'wix dev',
    ]));
    gulp.task('gen-docs', shell.task([
        'yarn docs',
    ]));
    gulp.task('fix-wix', gulp.series(cleanWix(), 'sync-types', 'fix-wix-types', 'add-wix-types'));
    gulp.task('build', gulp.parallel('build-backend', 'build-public', 'preview-templates', buildPages(taskOptions), compileScss(taskOptions), 'copy-files'));
    gulp.task('build-pipeline', gulp.series(cleanSrc(taskOptions), 'set-production', 'check-ts', 'fix-wix-types', 'add-wix-types', 'test-ci', 'build'));
    gulp.task('build-prod', gulp.series((done) => checkPages(true, false).then(() => done(), (err) => done(err)), cleanSrc(taskOptions), 'set-production', 'fix-wix', 'check-ts', 'test-ci', 'build-backend', 'build-public', buildPages(taskOptions), 'copy-files', compileScss(taskOptions)));
    gulp.task('start-dev-env', gulp.parallel(watchAll(taskOptions), 'test', 'start-wix', 'check-ts', (done) => checkPages(false, config.force).then(() => done(), (err) => done(err))));
    gulp.task('dev', gulp.series(cleanSrc(taskOptions), 'fix-wix', 'build', 'start-dev-env'));
    yield* Effect.tryPromise({
        try: () => {
            return new Promise(function (resolve, reject) {
                gulp.series(task, (done) => {
                    resolve(true);
                    done();
                })(function (err) {
                    if (err) {
                        logger.error("Error starting tasks:", err);
                        reject(err);
                    }
                });
            });
        },
        catch: (e) => {
            logger.error("Error starting tasks:", e);
            return new AppError({ message: 'Error starting tasks', cause: e });
        }
    });
    logger.report("Task completed successfully:", task);
});
//# sourceMappingURL=Gulpfile.js.map