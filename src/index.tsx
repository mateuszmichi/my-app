import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Root from './Root';

import { createStore } from 'redux'

import './index.css';
import registerServiceWorker from './registerServiceWorker';

import shatteredApp from './components/reducers/reducers';

const store = createStore(shatteredApp);

ReactDOM.render(
    <Root store={store}/>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
