import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import MainScreen from './components/MainScreen';
import Dev from './components/ui/dev';
import { appLoadedResolver } from './lib/taskManager';

void SplashScreen.preventAutoHideAsync();

/**
 * This is the main entry point for the app.
 * It is used to initialize the app and to hide the splash screen.
 * It also calls the resolver function to indicate that the app has mounted.
 * @returns The main app component.
 */
export default function App() {
	const [loaded, error] = useFonts({
		'Playfair-Bold': require('@/assets/fonts/PlayfairDisplay-Bold.ttf'),
		'Playfair-Regular': require('@/assets/fonts/PlayfairDisplay-Regular.ttf'),
		'Playfair-Italic': require('@/assets/fonts/PlayfairDisplay-Italic.ttf'),
	});

	const hasResolvedOnceRef = useRef(false);

	useEffect(() => {
		if (__DEV__ && appLoadedResolver && !hasResolvedOnceRef.current) {
			hasResolvedOnceRef.current = true;
			appLoadedResolver();
			// eslint-disable-next-line no-console
			console.log('Resolver called');
		}
		if (loaded || error) {
			void SplashScreen.hideAsync();
		}
	}, [loaded, error]);

	if (!loaded && !error) {
		return null;
	}
	
	return (
		<SafeAreaProvider>
			<View style={styles.container}>
				<MainScreen />
				<StatusBar style="auto" />
				<Dev />
			</View>
		</SafeAreaProvider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
});
