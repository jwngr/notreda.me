import posthog from 'posthog-js';

import {POSTHOG_API_HOST, POSTHOG_PROJECT_ID} from './constants';

let _areAnalyticsInitialized = false;

export function initAnalytics() {
  if (_areAnalyticsInitialized) return;
  _areAnalyticsInitialized = true;

  posthog.init(POSTHOG_PROJECT_ID, {
    api_host: POSTHOG_API_HOST,
    person_profiles: 'identified_only',
  });
}
