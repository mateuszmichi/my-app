import * as React from 'react';

import styled from 'styled-components';

import { TechnologiesList } from '../data/textsToFill';

// ---------- data
const TechnologiesDisplay = styled.div`
width:60%;
min-width:360px;
max-width:1160px;
margin:auto;
> div {
    margin-top:1.5rem;
    margin-bottom:1.5rem;
}
`;
const GroupName = styled.div`
position: relative;
width: 100%;
text-align:center;
font-size: 2rem;
text-shadow: 0 0 1rem #222222;
color: white;
margin-bottom:0.5rem;
`;
const GroupTechnologies = styled.div`
position: relative;
width: 100%;
text-align:center;
margin-bottom: 1rem;
`;
const Technology = styled.div<{ background: string | number, color: string }>`
background-color: ${props => props.background};
color: ${props => props.color};
position:relative;
display: inline-block;
overflow:hidden;
border-radius:14px;
margin:5px;
cursor:pointer;
`;
const MainTechnology = styled.div`
position:relative;
display: inline-block;
width: 150px;
height: 150px;
overflow:hidden;
`;
const TechnologyDescription = styled.div<{ isActive: boolean }>`
display: inline-block;
width: ${props => props.isActive ? `170px` : `0px`};
max-width:calc(100% - 150px);
height: 150px;
overflow:hidden;
transition: width 0.3s ease-in-out;
> div {
    position:absolute;
    top:0;
    left:150px;
    width:170px;
    height: 150px;
    > div {
        height:70%;
        display: flex;
        align-content:center;
        > div {
            margin:auto;
        }
    }
    > div:first-child {
        height: 30%;
        font-size:1.1rem;
        font-weight:bold;
    }
    
}
`;
const TechnologyIconField = styled.div<{ image: string, isFull: boolean }>`
position:relative;
width:100%;
padding-bottom: ${props => props.isFull ? `100%` : `70%`};
> div {
    position:absolute;
    background-image: url("${props => props.image}");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    ${props => props.isFull ?
        `width:90%;
    height:90%;
    top:5%;
    left:5%;` :
        `width:90%;
    height:90%;
    top:10%;
    left:5%;`};
}
`;
const TechnologyName = styled.div`
height:39px;
width:100%;
font-size:1.1rem;
font-weight:bold;
display:flex;
align-content:center;
> span {
    margin:auto;
}
`;

class Technologies extends React.Component<{}, { activeTechnology: { group: number, item: number } }> {
    constructor(props: any) {
        super(props);

        this.activateTechnology = this.activateTechnology.bind(this);

        this.state = {
            activeTechnology: {
                group: -1,
                item: -1,
            },
        }
    }
    public componentWillMount() {
        document.title = "Technologies";
    }
    public componentWillUnmount() {
        document.title = "Shattered Plains";
    }

    public render(): JSX.Element {
        const disactiveFun = (event:any) => {
            this.activateTechnology(event,-1, -1);
        };

        return (
            <div className="insideContent" onClick={disactiveFun}>
                <TechnologiesDisplay>
                    {TechnologiesList.map((e, i) =>
                        <div key={i}>
                            <GroupName >
                                {e.description}
                            </GroupName>
                            <GroupTechnologies>
                                {e.technologies.map((f, j) => {
                                    const activeFun = (event:any) => { this.activateTechnology(event,i, j); };
                                    return (
                                        <Technology key={j} background={f.background} color={f.color} onClick={activeFun}>
                                            <MainTechnology>
                                                <TechnologyIconField image={f.graphics} isFull={!f.displayName}>
                                                    <div />
                                                </TechnologyIconField>
                                                {(f.displayName) &&
                                                    <TechnologyName>
                                                        <span>{f.title}</span>
                                                    </TechnologyName>
                                                }
                                            </MainTechnology>
                                            <TechnologyDescription isActive={(this.state.activeTechnology.group === i && this.state.activeTechnology.item === j)}>
                                                <div>
                                                    <div><div>Applications:</div></div>
                                                    <div><div>{f.target}</div></div>
                                                </div>
                                            </TechnologyDescription>
                                        </Technology>
                                    );

                                }
                                )}
                            </GroupTechnologies>
                        </div>
                    )}
                </TechnologiesDisplay>
            </div>
        );
    }
    private activateTechnology(event: any, group: number, item: number) {
        event.stopPropagation();
        this.setState({ activeTechnology: { group, item } });
    }
}

// ========================================

export default Technologies;

// ------------------ interfaces
