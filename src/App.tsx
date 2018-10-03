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

import { ServerConnect } from './components/data/connectionConf';


class App extends React.Component {
    public componentDidMount() {
        // this is used only to force restarting azure server if needed - the students version is not always online
        const passed = 0;
        const Fun = (res: any) => undefined;
        const BlindFun = () => undefined;
        ServerConnect(`/api/WakeUp`, passed, Fun, Fun, BlindFun, BlindFun,false);
    }
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
