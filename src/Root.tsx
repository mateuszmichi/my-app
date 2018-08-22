import * as React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import App from './App'

class Root extends React.Component<{ store: any }, {}> {
    public render() {
        return (
            <Provider store={this.props.store} >
                <Router>
                    <Route path="/" component={App} />
                </Router>
            </Provider >);
        }
}

export default Root