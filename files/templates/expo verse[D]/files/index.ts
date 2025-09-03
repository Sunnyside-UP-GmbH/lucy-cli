import '@/global.css';
import '@/lib/utils/polyfills';

import { registerRootComponent } from 'expo';
import * as BackgroundTask from 'expo-background-task';
import * as TaskManager from 'expo-task-manager';

import { appLoaded, initializeBackgroundTask } from '@/lib/taskManager';

import App from './App';
import { BACKGROUND_TASK_IDENTIFIER } from './lib';

// TaskManager.unregisterTaskAsync(BACKGROUND_TASK_IDENTIFIER);
if (__DEV__) {
	void TaskManager.getRegisteredTasksAsync().then((tasks) => {
		// eslint-disable-next-line no-console
		console.log('Registered Tasks: \n', tasks);
	}).catch((error) => {
		// eslint-disable-next-line no-console
		console.error(error);
	});
}

void initializeBackgroundTask(appLoaded);
// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
