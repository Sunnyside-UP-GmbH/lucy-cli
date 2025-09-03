import { Schedule } from 'effect';
import { RuntimeFiber } from 'effect/Fiber';
import * as Application from 'expo-application';
import { Dimensions, Platform } from 'react-native';

import { Quote } from '@/models';

const { height: screenHeight } = Dimensions.get('window');

export const BASE_URL = new URL('https://static.we-host.ch/daily-verse');
export const FALLBACK_QUOTE: Quote = { Reference: 'The Lord', Verse: 'The ways of the Lord are inscrutable.', Topic: 'Grace' };
export const FALLBACK_LOCALE = 'en';
export const STORAGE_KEY = 'quotes';
export const STATE_KEY = 'state';
export const HTTP_RETRY_POLICY = Schedule.fromDelays(50, 100, 200, 400, 800);
export const backgroundTasks: RuntimeFiber<void, never>[] = [];
export const BACKGROUND_TASK_IDENTIFIER = 'fetch-data-task';
export const MINIMUM_INTERVAL = 60 * 24;
export const DATA_REFRESH_DELAY = 60000;

export const ENABLE_DEV_TOOLS = true;

export const MAX_OVERLAY_HEIGHT = (screenHeight * 0.25); // 30% of screen height
export const DOUBLE_TAP_DELAY_MS = 300;
export const MIN_PULL_DISTANCE_THRESHOLD = 10;
export const PULL_DISTANCE_THRESHOLD = MAX_OVERLAY_HEIGHT - 50;
export const PULL_BACK_DURATION = 350;

export const CACHE_CONTROL = 'max-age=43200';
export const USER_AGENT = `EXPO_APPLICATION/${Application.applicationName}:${Application.nativeApplicationVersion} (${Platform.OS} BUILD/${Application.nativeBuildVersion})`;