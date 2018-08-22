import * as React from 'react';

import {
    Route,
} from 'react-router-dom';

import Footbar from './Footbar';
import Menu from './Menu';
import Reception from './Reception';
import Registry from './Registry';

class Website extends React.Component {
    public render() {
        return (
            <div id="content">
                <Menu />
                <div id="inside">
                    <Route exact={true} path="/" component={Reception} />
                    <Route path="/registration" component={Registry} />
                </div>
                <Footbar />
            </div>
        );
    }
}

export default Website;
