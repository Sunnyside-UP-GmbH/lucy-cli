import AntDesign from '@expo/vector-icons/AntDesign';
import React, { useEffect, useRef } from 'react';
import { Animated, AppState, AppStateStatus, Dimensions, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MAX_OVERLAY_HEIGHT } from '@/constants/config';

const { width: screenWidth } = Dimensions.get('window');

/**
 * Props for the PullFeedback component
 */
interface PullFeedbackProps {
	pullDirection: 'up' | 'down' | null;
	opacity: Animated.Value;
    animatedPullDistance: Animated.Value;
    hidden?: boolean;
}

/**
 * PullFeedback component that shows a stretching semi-circle based on pull gestures
 * @param props - The component props
 * @param props.pullDirection - Direction of the pull ('up' or 'down')
 * @param props.opacity - Animated opacity value
 * @param props.animatedPullDistance - Optional animated distance value from parent for native-driven perf
 * @param props.hidden - Whether to hide the component
 * @returns The PullFeedback component
 */
export default function Share({ pullDirection, opacity, animatedPullDistance, hidden = false }: PullFeedbackProps) {
	const insets = useSafeAreaInsets();

	// Ensure hooks run consistently; default direction when inactive
	const activeDirection = pullDirection ?? 'up';

	// Fixed container height (revealed via sliding inner content)
	const containerHeight = MAX_OVERLAY_HEIGHT + (activeDirection === 'up' ? insets.bottom : insets.top);

	// Map distance -> visible height with rubber-band feel (approximation)
	const visibleHeight = animatedPullDistance.interpolate({
		inputRange: [0, 100, MAX_OVERLAY_HEIGHT],
		outputRange: [0, MAX_OVERLAY_HEIGHT * 0.7, MAX_OVERLAY_HEIGHT],
		extrapolate: 'clamp',
	});

	// base = containerHeight - visibleHeight
	// up: translateY = base, down: translateY = -base
	const base = Animated.subtract(containerHeight, visibleHeight);
	const translateY = activeDirection === 'up' ? base : (Animated.multiply(base, -1) as unknown as Animated.AnimatedInterpolation<number>);

	const topOffset = activeDirection === 'down' ? 0 : undefined;
	const bottomOffset = activeDirection === 'up' ? 0 : undefined;
	const bottomSafeArea = activeDirection === 'up' ? insets.bottom : 0;
	const appState = useRef(AppState.currentState);

	useEffect(() => {
		// Subscribe to app state changes
		const appStateSubscription = AppState.addEventListener(
			'change',
			(nextAppState: AppStateStatus) => {
				if (appState.current.match(/active/) && nextAppState === 'inactive') {
					animatedPullDistance.stopAnimation();
					animatedPullDistance.setValue(0);
					opacity.stopAnimation();
					opacity.setValue(0);
				}
				appState.current = nextAppState;
			}
		);

		// Cleanup subscription on unmount
		return () => {
			appStateSubscription.remove();
		};
	});
	
	return (
		<Animated.View 
			style={[
				styles.container,
				{
					opacity: opacity.interpolate({
						inputRange: [0, 1],
						outputRange: [0, 0.6], // Reduced max opacity from 1 to 0.6
					}),
					top: topOffset,
					bottom: bottomOffset,
					height: containerHeight,
					overflow: 'hidden',
				}
				,
				// Force hide without interrupting animations
				hidden && { opacity: 0 }
			]}
		>
			<Animated.View
				style={{
					transform: [{ translateY }],
				}}
			>
				<View style={[
					styles.semiCircle,
					{
						width: screenWidth,
						height: containerHeight,
						borderTopLeftRadius: activeDirection === 'down' ? 0 : 35,
						borderTopRightRadius: activeDirection === 'down' ? 0 : 35,
						borderBottomLeftRadius: activeDirection === 'up' ? 0 : 35,
						borderBottomRightRadius: activeDirection === 'up' ? 0 : 35,
					}
				]}>
					<AntDesign name="sharealt" size={48} color="white" style={{ paddingBottom: bottomSafeArea }}/>
				</View>
			</Animated.View>
		</Animated.View>
	);
}

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		left: 0,
		right: 0,
		zIndex: 998, // Below gesture overlay but above content
	},
	semiCircle: {
		backgroundColor: 'rgba(255, 255, 255, 0.3)',
		borderWidth: 2,
		borderColor: 'rgba(255, 255, 255, 0.5)',
		alignItems: 'center',
		justifyContent: 'center',
	},
});
