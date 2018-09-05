import * as React from 'react';

import '../css/Project.css';

import { Divider } from '@material-ui/core';


// ---------- data
import { AboutProject } from '../data/textsToFill';


class Project extends React.Component<{}, {}> {
    constructor(props: any) {
        super(props);
    }
    public componentWillMount() {
        document.title = "About the project";
    }
    public componentWillUnmount() {
        document.title = "Shattered Plains";
    }

    public render(): JSX.Element {
        return (
            <div className="insideContent">
                <div className="ContentField">
                    <div className="Header">
                        About the <span className="ProjectName">Shattered Plains</span> project
                    </div>
                    <Divider />
                    <div className="ProjectDescription">
                        {AboutProject}
                    </div>
                </div>
            </div>
        );
    }
}

// ========================================

export default Project;