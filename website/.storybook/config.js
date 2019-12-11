import React from 'react';
import {Provider} from 'react-redux';
import {ThemeProvider} from 'styled-components';
import requireContext from 'require-context.macro';
import {configure, addDecorator} from '@storybook/react';

import theme from '../src/resources/theme.json';
import configureStore from '../src/configureStore.js';

import '../src/index.css';

const store = configureStore();

addDecorator((storyFn) => <div style={{textAlign: 'center'}}>{storyFn()}</div>);
addDecorator((storyFn) => <ThemeProvider theme={theme}>{storyFn()}</ThemeProvider>);
addDecorator((storyFn) => <Provider store={store}>{storyFn()}</Provider>);

const req = requireContext('../src/components', true, /\.stories\.js$/);

configure(req, module);
