import { Effect, Schema } from "effect/index";
import { Config } from "../config.js";
import { Command } from "@effect/platform/index";
import { logger } from "../utils/logger.js";
import { FileSystem } from "@effect/platform";
import Enquirer from "enquirer";
import { AppError } from "../error.js";
import { editors } from "../schemas/index.js";
export const execCommand = Effect.gen(function* () {
    const config = yield* Config;
    const cmds = config.config.lucySettings.additionalCommands ?? [];
    logger.info("Executing additional commands...", cmds);
    if (cmds.length > 0) {
        logger.info("Executing additional commands");
        yield* Effect.all([
            ...cmds.map((cmd) => {
                return Command.make(cmd[0], ...cmd.slice(1))
                    .pipe()
                    .pipe(Command.stdout("inherit"), Command.stderr("inherit"), Command.exitCode);
            }),
        ]);
    }
});
export const open = Effect.scoped(Effect.gen(function* () {
    const config = yield* Config;
    const fs = yield* FileSystem.FileSystem;
    console.log("Opening Lucy home directory:", config.config.lucyHome);
    let command;
    switch (process.platform) {
        case 'darwin':
            command = Command.make('open', config.config.lucyHome);
            break;
        case 'win32':
            command = Command.make('start', config.config.lucyHome);
            break;
        default:
            command = Command.make('xdg-open', config.config.lucyHome);
            break;
    }
    command.pipe().pipe(Command.stdout("inherit"), Command.stderr("inherit"), Command.exitCode);
    yield* command.pipe().pipe(Command.stdout("inherit"), Command.stderr("inherit"), Command.exitCode);
}));
export const openEditor = Effect.gen(function* () {
    const config = yield* Config;
    const editorQuestion = new Enquirer();
    const openEditorQuestion = yield* Effect.tryPromise({
        try: () => editorQuestion.prompt({
            type: 'select',
            name: 'openEditor',
            message: `Do you want to open the project in a supported editor?`,
            choices: [...editors, 'No'],
        }),
        catch: (e) => {
            return new AppError({
                cause: e,
                message: "Error opening VSCode",
            });
        }
    });
    const choice = yield* Schema.decodeUnknown(Schema.Struct({ openEditor: Schema.Literal(...editors, 'No') }))(openEditorQuestion);
    const open = Command.make(choice.openEditor, config.config.cwd).pipe(Command.stdout("inherit"), // Stream stdout to process.stdout
    Command.stderr("inherit"), // Stream stderr to process.stderr
    Command.exitCode // Get the exit code
    );
    if (choice.openEditor !== 'No') {
        yield* open;
    }
});
//# sourceMappingURL=exec.js.map