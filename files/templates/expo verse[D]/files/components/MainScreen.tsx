import { Effect } from 'effect';
import * as Haptics from 'expo-haptics';
import { useEffect, useRef, useState } from 'react';
import { Animated, AppState, AppStateStatus, ImageBackground, PanResponder, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from 'tailwindcss/colors';

import { DATA_REFRESH_DELAY, MIN_PULL_DISTANCE_THRESHOLD, PULL_BACK_DURATION, PULL_DISTANCE_THRESHOLD } from '@/constants/config';
import { getContent } from '@/lib/content';
import { shareCurrentScreen } from '@/lib/utils/screenshot';

import Share from './Share';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EffectReturnSuccessType<T extends (...args: any[]) => Effect.Effect<any, any, any>> = Effect.Effect.Success<ReturnType<T>>;

/**
 * Main screen of the app.
 * @returns The main screen of the app.
 */
export default function MainScreen() {
	const insets = useSafeAreaInsets();
	const [quote, setQuote] = useState<EffectReturnSuccessType<typeof getContent> | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);	
	const appState = useRef(AppState.currentState);
	const fadeAnim = useRef(new Animated.Value(0)).current;
	const [isCapturing, setIsCapturing] = useState(false);
	const hasTriggeredThresholdRef = useRef(false);
	const pullDirectionRef = useRef<'up' | 'down' | null>(null);
	const quoteRef = useRef<EffectReturnSuccessType<typeof getContent> | null>(null);
	const fadeValueRef = useRef(0);
	useEffect(() => {
		quoteRef.current = quote;
	}, [quote]);
	useEffect(() => {
		const id = fadeAnim.addListener(({ value }) => {
			fadeValueRef.current = typeof value === 'number' ? value : Number(value);
		});
		
		return () => {
			fadeAnim.removeListener(id);
		};
	}, [fadeAnim]);
	
	// Pull feedback state
	const [pullDirection, setPullDirection] = useState<'up' | 'down' | null>(null);
	const pullFeedbackOpacity = useRef(new Animated.Value(0)).current;
	const animatedPullDistance = useRef(new Animated.Value(0)).current;
	const panResponder = useRef(
		PanResponder.create({
			onStartShouldSetPanResponder: () => true,
			onMoveShouldSetPanResponder: (event, gestureState) => Math.abs(gestureState.dy) > MIN_PULL_DISTANCE_THRESHOLD,
			onPanResponderMove: (event, gestureState) => {
				const { dy } = gestureState;
				if(dy > 0) return;
				if (Math.abs(dy) > MIN_PULL_DISTANCE_THRESHOLD) {
					const direction = dy > 0 ? 'down' : 'up';
					setPullDirection(direction);
					pullDirectionRef.current = direction;
					animatedPullDistance.setValue(Math.abs(dy));
					// Animate feedback opacity based on pull distance with more subtle range
					const opacity = Math.min(Math.abs(dy) / 80, 1); // Reduced from 100 to 80 for more responsive feel
					Animated.timing(pullFeedbackOpacity, {
						toValue: opacity,
						duration: 0,
						useNativeDriver: true,
					}).start();
				}
				// Trigger once when crossing the threshold during this gesture
				if (!hasTriggeredThresholdRef.current && Math.abs(dy) >= PULL_DISTANCE_THRESHOLD) {
					hasTriggeredThresholdRef.current = true;
					void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
				}
			},
			onPanResponderRelease: (event, gestureState) => {
				// Hide pull feedback
				const releasedDirection: 'up' | 'down' = gestureState.dy > 0 ? 'down' : 'up';
				const finalDirection = pullDirectionRef.current ?? releasedDirection;
				setPullDirection(null);
				if(finalDirection === 'down') return;

				// Run slide-back and fade-out in parallel
				Animated.parallel([
					Animated.timing(animatedPullDistance, {
						toValue: 0,
						duration: PULL_BACK_DURATION,
						useNativeDriver: true,
					}),
					Animated.timing(pullFeedbackOpacity, {
						toValue: 0,
						duration: PULL_BACK_DURATION,
						useNativeDriver: true,
					}),
				]).start();
				hasTriggeredThresholdRef.current = false;
				pullDirectionRef.current = null;
				
				if ((finalDirection === 'up' || finalDirection === 'down') && (gestureState.dy <= -PULL_DISTANCE_THRESHOLD || gestureState.dy >= PULL_DISTANCE_THRESHOLD)) {
					void Haptics.notificationAsync(
						Haptics.NotificationFeedbackType.Success
					);
					void captureAndShare();
				}
			},
		})
	).current;

	const captureAndShare = async () => {
		if (!quoteRef.current) return;
		// Hide overlay visuals immediately and cancel any running overlay animations
		pullFeedbackOpacity.stopAnimation();
		animatedPullDistance.stopAnimation();
		pullFeedbackOpacity.setValue(0);
		animatedPullDistance.setValue(0);
		setIsCapturing(true);
		try {
			// Ensure quote is fully visible during capture
			fadeAnim.stopAnimation();
			fadeAnim.setValue(1);
			// Wait a frame so UI updates are applied
			await new Promise<void>((resolve) => requestAnimationFrame(() => setTimeout(() => resolve(), 16)));
			await shareCurrentScreen(quoteRef.current?.Reference.trim() ?? '');
		} finally {
			// Keep quote fully visible; keep overlay suppressed for a moment to avoid flicker
			fadeAnim.setValue(1);
			pullFeedbackOpacity.setValue(0);
			animatedPullDistance.setValue(0);
			setTimeout(() => setIsCapturing(false), 200);
		}
	};

	useEffect(() => {
		const getQuoteForToday = async (isInitialLoad: boolean) => {
			if (isInitialLoad) {
				setIsLoading(true);
			}
			setError(null);

			try {
				const newQuote = await Effect.runPromise(getContent());
				setQuote(newQuote);
				// Start fade-in animation after quote is loaded
				if (isInitialLoad) {
					setTimeout(() => {
						Animated.timing(fadeAnim, {
							toValue: 1,
							duration: 1500,
							useNativeDriver: true,
						}).start();
					}, 500); // 1500ms delay before animation starts
				}
			} catch (e) {
				// eslint-disable-next-line no-console
				console.error('Failed to fetch or store quote:', e);
				setError('Could not fetch a quote. Please try again later.');
			} finally {
				if (isInitialLoad) {
					setIsLoading(false);
				}
			}
		};
		void getQuoteForToday(true);
		const intervalId = setInterval(() => {
			void getQuoteForToday(false);
		}, DATA_REFRESH_DELAY);
		
		return () => clearInterval(intervalId);
	}, [fadeAnim]);

	useEffect(() => {
		// Subscribe to app state changes
		const appStateSubscription = AppState.addEventListener(
			'change',
			(nextAppState: AppStateStatus) => {
				if (
					appState.current.match(/inactive|background/) &&
                    nextAppState === 'active'
				) {
					setTimeout(() => {
						Animated.timing(fadeAnim, {
							toValue: 1,
							duration: 1500,
							useNativeDriver: true,
						}).start();
					}, 500); //

				}
				if (appState.current.match(/active/) && nextAppState === 'background') {
					Animated.timing(fadeAnim, {
						toValue: 0,
						duration: 0,
						useNativeDriver: true,
					}).start();
				}
				appState.current = nextAppState;
			}
		);

		// Cleanup subscription on unmount
		return () => {
			appStateSubscription.remove();
		};
	}, [fadeAnim]);

	return (
		<ImageBackground
			source={require('@/assets/images/background.png')}
			style={styles.container}
			resizeMode="cover"
            
		>
			<View style={[styles.titleWrapper, { top: insets.top + 10 }]}>
				<Text style={styles.titleText}>Daily Verse</Text>
			</View>

			<View style={styles.contentWrapper}>
				{/* {isLoading && (
					<Text style={styles.titleText}>Loading...</Text>
				)}
				{error && <Text style={styles.errorText}>{error}</Text>} */}
				{!isLoading && !error && quote && (
					<Animated.View style={[styles.quoteBox, { opacity: fadeAnim }]}>
						<Text style={styles.quoteContent}>&quot;{quote.Verse}&quot;</Text>
						<Text style={styles.quoteSource}>— {quote.Reference}</Text>
					</Animated.View>
				)}
			</View>
			
			{/* Pull feedback overlay */}
			<Share
				pullDirection={pullDirection}
				opacity={pullFeedbackOpacity}
				animatedPullDistance={animatedPullDistance}
				hidden={isCapturing}
			/>
			
			{/* Gesture overlay to capture double taps and vertical pulls */}
			<View style={styles.gestureOverlay} {...panResponder.panHandlers} />
			
		</ImageBackground>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#000',
		height: '100%',
		width: '100%',
	},
	gestureOverlay: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		zIndex: 999,
	},
	titleWrapper: {
		position: 'absolute',
		left: 0,
		right: 0,
		alignItems: 'center',
	},
	titleText: {
		color: colors.gray[900],
		fontFamily: 'Playfair-Bold',
		fontSize: 36,
	},
	contentWrapper: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 24,
	},
	quoteBox: {
		gap: 20,
		alignSelf: 'stretch',
	},
	quoteContent: {
		fontSize: 24,
		textAlign: 'center',
		color: colors.gray[900],
		lineHeight: 32,
		fontFamily: 'Playfair-Regular',
	},
	quoteSource: {
		fontSize: 16,
		color: colors.gray[800],
		textAlign: 'right',
		fontFamily: 'Playfair-Bold',
	},
	errorText: {
		textAlign: 'center',
		color: colors.red[500],
		fontSize: 18,
	}
});