/* eslint-disable no-console */
import { Effect } from 'effect';
import * as BackgroundTask from 'expo-background-task';
import { Button, View } from 'react-native';

import { clearData, showData } from '@/lib';
import { BACKGROUND_TASK_IDENTIFIER, ENABLE_DEV_TOOLS } from '@/constants/config';

/**
 * Development tools for the app.
 * @returns The development tools for the app.
 */
export default function Dev() {
	const isDev = ENABLE_DEV_TOOLS && __DEV__;
	
	return (
		<View>
			{isDev && (
				<>
					<Button
						title="Run Background Task (Debug)"
						onPress={() => {
							BackgroundTask.triggerTaskWorkerForTestingAsync().catch(console.error);
						}}
					/>
					<Button
						title="Clear Storage (Debug)"
						onPress={() => {
							Effect.runPromise(clearData).catch(console.error);
						}}
					/>
					<Button
						title="Show Data (Debug)"
						onPress={() => {
							Effect.runPromise(showData).catch(console.error);
						}}
					/>
					<Button
						title="Clear Tasks (Debug)"
						onPress={() => {
							BackgroundTask.unregisterTaskAsync(BACKGROUND_TASK_IDENTIFIER).catch(console.error);
						}}
					/>
				</>
			)}		
		</View>
	);
}