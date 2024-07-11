import posthog from 'posthog-js';

import {POSTHOG_API_HOST, POSTHOG_API_KEY} from './constants';

let _areAnalyticsInitialized = false;

export function initAnalytics() {
  if (_areAnalyticsInitialized) return;
  _areAnalyticsInitialized = true;

  // Initalize PostHog.
  posthog.init(POSTHOG_API_KEY, {
    api_host: POSTHOG_API_HOST,
    person_profiles: 'identified_only',
  });

  // Register $pageleave events.
  window.addEventListener('beforeunload', () => {
    posthog.capture('$pageleave');
  });

  // Register $pageview events on URL navigations. PostHog handles the initial page view itself.
  window.addEventListener('popstate', () => {
    posthog.capture('$pageview');
  });
}
