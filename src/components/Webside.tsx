import * as React from 'react';

import {
    Route,
} from 'react-router-dom';

import Contact from './presentational/Contact';
import Credits from './presentational/Credits';
import Features from './presentational/Features';
import Project from './presentational/Project';
import Projects from './presentational/Projects';
import Roshar from './presentational/Roshar';
import Technologies from './presentational/Technologies';

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
                    <Route path="/aboutproject" component={Project} />
                    <Route path="/developed" component={Features} />
                    <Route path="/roshar" component={Roshar} />
                    <Route path="/technology" component={Technologies} />
                    <Route path="/myprojects" component={Projects} />
                    <Route path="/contact" component={Contact} />
                    <Route path="/credits" component={Credits}/>
                </div>
                <Footbar />
            </div>
        );
    }
}

export default Website;
