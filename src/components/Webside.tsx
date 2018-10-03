import * as React from 'react';

import MediaQuery from 'react-responsive';

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

import MobileWebsite from './mobile/MobileWebsite';






class Website extends React.Component {
    public render() {
        return (
            <MediaQuery minWidth={880}>
                {(matches: boolean) => {
                    if (matches) {
                        return (
                            <div id="content"><Menu />
                                <div id="inside">
                                    <Route exact={true} path="/" component={Reception} />
                                    <Route exact={false} path="/account" component={Reception} />
                                    <Route path="/registration" component={Registry} />
                                    <Route path="/aboutproject" component={Project} />
                                    <Route path="/developed" component={Features} />
                                    <Route path="/roshar" component={Roshar} />
                                    <Route path="/technology" component={Technologies} />
                                    <Route path="/myprojects" component={Projects} />
                                    <Route path="/contact" component={Contact} />
                                    <Route path="/credits" component={Credits} />
                                </div>
                                <Footbar /></div>
                        );
                    } else {
                        return (
                            <MobileWebsite />
                        );
                    }
                }}

            </MediaQuery>
        );
    }
}

export default Website;
