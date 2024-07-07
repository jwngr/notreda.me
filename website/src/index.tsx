import {createRoot} from 'react-dom/client';

import {App} from './components/App';

import './weather-icons.min.css';
import './index.css';
import 'typeface-bungee';

const rootDiv = document.getElementById('root');
if (!rootDiv) {
  throw new Error('Root element not found');
}

const root = createRoot(rootDiv);
root.render(<App />);
