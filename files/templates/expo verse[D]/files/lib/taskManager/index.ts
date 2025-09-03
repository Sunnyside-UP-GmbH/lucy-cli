import { Effect } from 'effect';
import * as BackgroundTask from 'expo-background-task';
import * as TaskManager from 'expo-task-manager';

import { BACKGROUND_TASK_IDENTIFIER, MINIMUM_INTERVAL } from '../../constants/config';
import { backgroundTask } from './loadData';

export let appLoadedResolver: (() => void) | null;
export const appLoaded = new Promise<void>((resolve) => {
	appLoadedResolver = resolve;
});


export const initializeBackgroundTask = async (
	innerAppMountedPromise: Promise<void>
) => {
	// await TaskManager.unregisterAllTasksAsync();
	TaskManager.defineTask(BACKGROUND_TASK_IDENTIFIER, async () => {
		try {
			await Effect.runPromise(backgroundTask(innerAppMountedPromise));
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error('Error in background task:', error);
		}
	});
	// Register the task
	if (!(await TaskManager.isTaskRegisteredAsync(BACKGROUND_TASK_IDENTIFIER))) {
		await BackgroundTask.registerTaskAsync(BACKGROUND_TASK_IDENTIFIER, {
			minimumInterval: MINIMUM_INTERVAL,
		});
		if (__DEV__) {
			// eslint-disable-next-line no-console
			console.info(
				`Background task with ID: ${BACKGROUND_TASK_IDENTIFIER} registered`
			);
		}
	}
};