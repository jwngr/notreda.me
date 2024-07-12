import {createRoot} from 'react-dom/client';

import {App} from './components/App';

import './weather-icons.min.css';
import './index.css';
import '@fontsource/bungee';
import '@fontsource/inter';
// Initializes analytics on import.
import './lib/analytics';

const rootDiv = document.getElementById('root');
if (!rootDiv) {
  throw new Error('Root element not found');
}

const root = createRoot(rootDiv);
root.render(<App />);
