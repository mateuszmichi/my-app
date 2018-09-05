import * as React from 'react';

import styled from 'styled-components';

import { ProjectsList } from '../data/textsToFill';

// ---------- data
const height = 300;
const width = 300;
const titleHeight = 36;
const imageWidthProc = 50;
const imageHeightProc = 35;

const ProjectsDisplay = styled.div`
text-align:center;
width:60%;
min-width:320px;
max-width:1160px;
margin:auto;
> div {
    margin-top:1.5rem;
    margin-bottom:1.5rem;
}
`;
const Project = styled.div<{ background: string | number, color: string }>`
background-color: ${props => props.background};
color: ${props => props.color};
position:relative;
display: inline-block;
overflow:hidden;
border-radius:14px;
margin:10px;
-webkit-box-shadow: 0px 0px 8px 4px rgba(0,0,0,0.2);
    box-shadow: 0px 0px 8px 4px rgba(0,0,0,0.2);
`;
const MainProject = styled.div`
position:relative;
width: ${width}px;
height: ${height}px;
overflow:hidden;
`;
const ProjectIconField = styled.div<{ image: string }>`
position:relative;
width:${imageWidthProc}%;
left:${(100-imageWidthProc)/2}%;
padding-bottom:${imageHeightProc}%;
> div {
    position:absolute;
    background-image: url("${props => props.image}");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    width:90%;
    height:90%;
    top:10%;
    left:5%;
}
`;
const ProjectName = styled.div`
height:${titleHeight}px;
width:100%;
font-size:1.1rem;
font-weight:bold;
display:flex;
align-content:center;
> span {
    margin:auto;
}
`;
const ProjectDescription = styled.div`
height:${height - titleHeight - width * imageHeightProc / 100}px;
width:${width}px;
color:#333333;
background-color:white;
font-size:0.9rem;
line-height:1.4rem;
font-weight:bold;
text-align:center;
display:flex;
align-content:center;
> span {
	padding:8px;
    margin:auto;
}
`;

class Projects extends React.Component {
    constructor(props: any) {
        super(props);
    }
    public componentWillMount() {
        document.title = "Projects";
    }
    public componentWillUnmount() {
        document.title = "Shattered Plains";
    }

    public render(): JSX.Element {
        return (
            <div className="insideContent">
                <ProjectsDisplay>
                    {ProjectsList.map((e, i) =>
                        <Project key={i} background={e.background} color={e.color}>
                            <MainProject>
                                <ProjectIconField image={e.image} >
                                    <div />
                                </ProjectIconField>
                                <ProjectName>
                                    <span>{e.title}</span>
                                </ProjectName>
                                <ProjectDescription>
                                    <span>{e.description}</span>
                                </ProjectDescription>
                            </MainProject>
                        </Project>
                    )}
                </ProjectsDisplay>
            </div>
        );
    }
}

// ========================================

export default Projects;

// ------------------ interfaces
