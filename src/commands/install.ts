import { Command } from "@effect/platform/index";
import { Effect, Schedule } from "effect/index";
import { Config } from "../config.js";
import { logger } from "../utils/logger.js";
import { CommandExecutor, ExitCode } from "@effect/platform/CommandExecutor";
import { PlatformError } from "@effect/platform/Error";

export const installPackages = (workspace: boolean = false) => {
    return Effect.gen(function*() {
        const config = yield* Config;

        const pkgs: string[] = []
        for (const [key, value] of Object.entries(config.config.lucySettings.dependencies)) {
            if (value.length > 0) {
                pkgs.push(`${key}@${value}`);
                continue
            }
            pkgs.push(key);
        }
        const devPkgs: string[] = []
        for (const [key, value] of Object.entries(config.config.lucySettings.devDependencies)) {
            if (value.length > 0) {
                devPkgs.push(`${key}@${value}`);
                continue
            }
            devPkgs.push(key);
        }

        const manager = config.config.lucySettings.packageManager;
        function pkgMgrParamsInstall():string[] {
            if (manager === "npm") {
                return ["install"];
            }
            if (manager === "pnpm") {
                return ["install"];
            }
            return ["add"];
        }
        function pkgMgrParamsInstallDev():string[] {
            if (manager === "npm") {
                return ["install", "-D"];
            }
            if (manager === "pnpm") {
                return ["install", "-D"];
            }
            return ["add", "-D"];
        }

        function workspaceEnabled() {
            if(config.config.lucySettings.packageManager === "pnpm" && workspace) {
                return ["--workspace-root"];
            }
            return [];
        }
        logger.info("Installing dependencies");

        const install = Command.make(
            manager,
                ...pkgMgrParamsInstall(),
                ...workspaceEnabled(),
                ...pkgs,
            ).pipe(
            Command.stdout("inherit"), // Stream stdout to process.stdout
            Command.stderr("inherit"), // Stream stderr to process.stderr
            Command.exitCode // Get the exit code
        )

        logger.info("Installing dev dependencies");
        const installDev = Command.make(
                manager,
                ...pkgMgrParamsInstallDev(),
                ...workspaceEnabled(),
                ...devPkgs,
            ).pipe(
            Command.stdout("inherit"), // Stream stdout to process.stdout
            Command.stderr("inherit"), // Stream stderr to process.stderr
            Command.exitCode // Get the exit code
        )

        if(Object.keys(config.config.lucySettings.dependencies).length > 0) {
            if ((yield* install) !== 0) {
                return logger.error("Failed to install dependencies. Please check the error message above.");
            }
        }
        if(Object.keys(config.config.lucySettings.devDependencies).length > 0) {
            if ((yield* installDev) !== 0) {
                return logger.error("Failed to install dev dependencies. Please check the error message above.");
            }
        }
    })
}

export const runInstall = Effect.gen(function*() {
        const config = yield* Config;

    const manager = config.config.lucySettings.packageManager;
    const install = Command.make(
        manager,
        "install",
    ).pipe(
        Command.stdout("inherit"), // Stream stdout to process.stdout
        Command.stderr("inherit"), // Stream stderr to process.stderr
        Command.exitCode // Get the exit code
    )
    yield* install;
})

export const yarnSetVersion = Effect.gen(function*() {
        const set = Command.make(
            "yarn",
            "set",
            "version",
            "berry",
        ).pipe(
        Command.stdout("inherit"), // Stream stdout to process.stdout
        Command.exitCode // Get the exit code
    )
    yield* set;
})

export const installVeloPackages = Effect.gen(function*() {
    const config = yield* Config;
        const simpleSchedule = Schedule.tapOutput(
            Schedule.fromDelays(50, 100, 200, 400, 800, 1600, 3200),
            (n, ) => Effect.succeed(logger.warning(`Failed to install WIX package. Retrying...`))
        );

    const pkgs: string[] = []
    for (const [key, value] of Object.entries(config.config.lucySettings.dependencies)) {
        if (value.length > 0) {
            pkgs.push(`${key}@${value}`);
            continue
        }
        pkgs.push(key);
    }

    const wixPkgs: Effect.Effect<ExitCode, PlatformError, CommandExecutor>[] = []
    const wixInstall = (cmd: Effect.Effect<ExitCode, PlatformError, CommandExecutor>) => Effect.gen(function*() {
        const code = yield* Effect.retryOrElse(
            Effect.gen(function*() {
                const code = yield* cmd;
                if (code !== 0) {
                    return yield* Effect.fail(code);
                }
                return yield* Effect.succeed(code);
            }), 
            simpleSchedule,
            () => Effect.succeed(0 as ExitCode)
        )
        if (code !== 0) {
            logger.error("Failed to install WIX package.");
        } 
        return code;
    })

    for (const [key, value] of Object.entries(config.config.lucySettings.dependencies)) {
        if (value.length > 0) {
            wixPkgs.push(
                wixInstall(
                    Command.make(
                        "wix",
                        "install",
                        `${key}@${value}`
                ).pipe(
                    Command.stdout("inherit"),
                    Command.stderr("inherit"),
                    Command.exitCode
                )
            )
        )
            continue
        }
        wixPkgs.push(
            wixInstall(
                Command.make(
                    "wix",
                    "install",
                    `${key}`
            ).pipe(
                Command.stdout("inherit"),
                Command.stderr("inherit"),
                Command.exitCode
            ),
        ))
    }

    const devPkgs: string[] = []
    for (const [key, value] of Object.entries(config.config.lucySettings.devDependencies)) {
        if (value.length > 0) {
            devPkgs.push(`${key}@${value}`);
            continue
        }
        devPkgs.push(key);
    }

    const manager = config.config.lucySettings.packageManager;
    function pkgMgrParamsInstall():string[] {
        if (manager === "npm") {
            return ["install"];
        }
        if (manager === "pnpm") {
            return ["install"];
        }
        return ["add"];
    }
    function pkgMgrParamsInstallDev():string[] {
        if (manager === "npm") {
            return ["install", "-D"];
        }
        if (manager === "pnpm") {
            return ["install", "-D"];
        }
        return ["add", "-D"];
    }

    const install = Command.make(
        manager,
        ...pkgMgrParamsInstall(),
            ...pkgs,
        ).pipe(
        Command.stdout("inherit"), // Stream stdout to process.stdout
        Command.exitCode // Get the exit code
    )
    const installDev = Command.make(
            manager,
            ...pkgMgrParamsInstallDev(),
            ...devPkgs,
        ).pipe(
        Command.stdout("inherit"), // Stream stdout to process.stdout
        Command.exitCode // Get the exit code
    )

    logger.info("Installing dependencies with wix...");
    const status = yield* Effect.all([...wixPkgs], { concurrency: 15});
    if(status.every((s) => s !== 0)) {
        return logger.error("Failed to install WIX dependencies. Please check the error message above.");
    }

    logger.info("Installing dependencies");
    if ((yield* install) !== 0) {
        return logger.error("Failed to install dependencies. Please check the error message above.");
    }

    logger.info("Installing dev dependencies");
    if ((yield* installDev) !== 0) {
        return logger.error("Failed to install dev dependencies. Please check the error message above.");
    }

})

export const approveBuilds = Effect.gen(function*() {
        const config = yield* Config;

    const manager = config.config.lucySettings.packageManager;
    const approve = Command.make(
        "pnpm",
        "approve-builds",
    ).pipe(
        Command.stdout("inherit"), // Stream stdout to process.stdout
        Command.stderr("inherit"), // Stream stderr to process.stderr
        Command.stdin("inherit"),
        Command.exitCode // Get the exit code
    )
    if (manager !== "pnpm") {
        logger.warning("The 'approve-build' command is only available for pnpm. Skipping...");
        return;
    }
    yield* approve;
})