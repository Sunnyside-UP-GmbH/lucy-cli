import { useColorScheme as useNativewindColorScheme } from 'nativewind';

/**
 * Custom hook to get the current color scheme and provide methods to change it.
 * This hook uses the nativewind's useColorScheme to access the color scheme.
 * @returns An object containing the current color scheme, a method to set the color scheme,
 */
export function useColorScheme() {
	const { colorScheme, setColorScheme, toggleColorScheme } = useNativewindColorScheme();
	
	return {
		colorScheme: colorScheme ?? 'dark',
		isDarkColorScheme: colorScheme === 'dark',
		setColorScheme,
		toggleColorScheme,
	};
}