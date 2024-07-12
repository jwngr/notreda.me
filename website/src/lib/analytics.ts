import {getAnalytics} from 'firebase/analytics';
import {initializeApp} from 'firebase/app';

import firebaseConfig from '../resources/firebaseConfig.json';

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
