import * as React from 'react';

import './App.css';

import {
    BrowserRouter as Router,
    Route,
    Switch,
} from 'react-router-dom';

import PopupDisplay from './components/presentational/PopupDisplay';
import ServerWaiting from './components/presentational/ServerWaiting';

import Game from './components/Game';
import Website from './components/Webside';



class App extends React.Component {
    public render() {
        return (
            <Router>
                <div>
                    <Switch>
                        <Route path="/game" component={Game} />
                        <Route path="/" component={Website} />
                    </Switch>
                    <PopupDisplay />
                    <ServerWaiting />
                </div>
            </Router>
        );
    }
}

export default App;
