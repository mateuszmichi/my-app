import * as React from 'react';
import { connect } from 'react-redux';
import { Func0 } from 'redux';

import Step from '@material-ui/core/Step';
import Stepper from '@material-ui/core/Stepper';

import StepLabel from '@material-ui/core/StepLabel';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import '../../css/dialogs/CreateCharacterDialog.css'

import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

import { Add_Hero, Close_Dialog, Close_Messages, End_Waiting, Pop_Dialog, Pop_Messages, Start_Waiting } from '../../actions/actionCreators';
import { IConnectionFunctions, ServerConnect } from '../../data/connectionConf';

import { ChampionsAttributes, ChampionsName, ChampionsOrigin, ChampionsSex,  } from './HeroCreationParts'

import { IMessage, IMessageTranslator } from '../../MessageMenager';
import { IAppStatus, ICharacterBrief, IPassedData, IUserToken,  } from '../../TYPES';

// ----------- constants


class ConnectedHeroCreationStepper extends React.Component<{ userToken: IUserToken, herosUpdateFun: (data: ICharacterBrief) => {}, ConnFuns: IConnectionFunctions }, { activeStep: number, isSkipped: boolean[], heroData: IHeroData }> {
    private LogSteps: IStep[] = [];
    private PointsToSpare = 104;
    constructor(props: any) {
        super(props);
        // -------binding
        this.handleBack = this.handleBack.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.handleSkip = this.handleSkip.bind(this);
        this.handleNameInput = this.handleNameInput.bind(this);
        this.handleSexInput = this.handleSexInput.bind(this);
        this.handleOriginInput = this.handleOriginInput.bind(this);
        this.checkUniqueName = this.checkUniqueName.bind(this);
        this.handleAttributesInput = this.handleAttributesInput.bind(this);
        this.RegisterNewHero = this.RegisterNewHero.bind(this);

        this.state = {
            activeStep: 0,
            heroData: {
                attributes: new Array(8).fill(10),
                country: -1,
                isMan: true,
                name: "",
                nickname: "",
                origin: -1,
            } as IHeroData,
            isSkipped: new Array(this.LogSteps.length).fill(false),

        }

        this.LogSteps = [
            {
                content: <ChampionsSex updateDataFun={this.handleSexInput} initialData={this.state.heroData} />,
                description: 'Gender',
                isOptional: false,
                validation: () => {
                    return true;
                }
            } as IStep,
            {
                content: <ChampionsName updateDataFun={this.handleNameInput} initialData={this.state.heroData} />,
                description: 'Identity',
                isOptional: false,
                validation: () => {
                    return (this.state.heroData.name.length >= 4 && this.state.heroData.name.length <= 30
                        && this.state.heroData.nickname.length >= 4 && this.state.heroData.nickname.length <= 50);
                }
            } as IStep,
            {
                content: <ChampionsOrigin updateDataFun={this.handleOriginInput} initialData={this.state.heroData} />,
                description: 'Origin',
                isOptional: false,
                validation: () => {
                    return (this.state.heroData.country !== -1 && this.state.heroData.origin !== -1);
                },
            } as IStep,
            {
                content: <ChampionsAttributes initialData={this.state.heroData} pointsLimit={this.PointsToSpare} updateDataFun={this.handleAttributesInput} />,
                description: 'Attributes',
                isOptional: false,
                validation: () => {
                    let mm = this.PointsToSpare;
                    this.state.heroData.attributes.forEach(e => { mm -= e; });
                    return (mm === 0);
                },
            } as IStep,];
    }

    public render() {
        return (
            <div className="HeroCreator">
                <Stepper activeStep={this.state.activeStep}>
                    {this.LogSteps.map((label, index) => {
                        const props: any = {};
                        const labelProps: any = {};
                        if (this.LogSteps[index].isOptional) {
                            labelProps.optional = <Typography variant="caption">Optional</Typography>;
                        }
                        if (this.state.isSkipped[index]) {
                            props.completed = false;
                        }
                        return (
                            <Step key={label} {...props}>
                                <StepLabel {...labelProps}>{label.description}</StepLabel>
                            </Step>
                        );
                    })}
                </Stepper>
                <div className="StepperNavigation" >
                    <div className={this.state.activeStep === 0 ? "NavButton NavButtonLeft NavButtonDisabled" : "NavButton NavButtonLeft"}>
                        <div className="NavButtonCircle" />
                        <Button disabled={this.state.activeStep === 0} onClick={this.handleBack} >
                            <NavigateBeforeIcon />
                        </Button>
                    </div>
                    <div className="NavContent">
                        {this.LogSteps[this.state.activeStep].content}
                        {(this.LogSteps[this.state.activeStep].isOptional) && (
                            <div><Button
                                variant="contained"
                                color="primary"
                                onClick={this.handleSkip}
                            >
                                Skip
                                        </Button>
                            </div>
                        )}
                    </div>
                    <div className={!this.LogSteps[this.state.activeStep].validation() ? "NavButton NavButtonRight NavButtonDisabled" : "NavButton NavButtonRight"}>
                        <div className="NavButtonCircle" />
                        <Button
                            disabled={!this.LogSteps[this.state.activeStep].validation()}
                            onClick={this.handleNext}
                        >
                            <NavigateNextIcon />
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
    // {this.state.activeStep === this.props.steps.length - 1 ? 'Finish' : 'Next'}
    private handleNext = () => {
        if (this.state.activeStep === this.LogSteps.length - 1) {
            this.RegisterNewHero();
            return;
        }
        const currStep = this.state.activeStep;
        const currSkip = [...this.state.isSkipped];
        if (currSkip[currStep] && this.LogSteps[currStep].isOptional) {
            currSkip[currStep] = false;
        }
        if (currStep !== 1) {
            this.setState({
                activeStep: currStep + 1,
                isSkipped: currSkip,
            });
        } else {
            this.checkUniqueName();
        }
    };

    private handleBack = () => {
        const { activeStep } = this.state;
        this.setState({
            activeStep: activeStep - 1,
        });
    };

    private handleSkip = () => {
        const currStep = this.state.activeStep;
        if (!this.LogSteps[currStep].isOptional) {
            throw new Error("You can't skip a step that isn't optional.");
        }
        const currSkip = [...this.state.isSkipped];
        currSkip[currStep] = true;
        this.setState({
            activeStep: currStep + 1,
            isSkipped: currSkip,
        });
    };

    private handleNameInput(data: IHeroName): void {
        const curr = this.state.heroData;
        curr.name = data.name;
        curr.nickname = data.nickname;
        this.setState({ heroData: curr });
    }

    private handleSexInput(data: boolean): void {
        const curr = this.state.heroData;
        curr.isMan = data;
        this.setState({ heroData: curr });
    }

    private handleOriginInput(data: { country: number, origin: number }):void {
        const curr = this.state.heroData;
        curr.country = data.country;
        curr.origin = data.origin;
        this.setState({ heroData: curr });
    }

    private handleAttributesInput(data: number[]):void {
        const curr = this.state.heroData;
        curr.attributes = data;
        this.setState({ heroData: curr });
    }

    private checkUniqueName(): void {
        const passed = { Name: this.state.heroData.name };
        const succFun = (res: any) => {
            const received = res.data;
            if (received.isUnique as boolean) {
                const curr = this.state.activeStep;
                this.setState({ activeStep: curr + 1 });
            }
        };
        const failFun = (error: any) => {
            if (error.response === undefined) {
                this.props.ConnFuns.popMessage([{ title: "serverErr", description: "I've got bad feelings about this...", } as IMessage], []);
            } else {
                this.props.ConnFuns.popMessage([{ title: error.response.data.type, description: error.response.data.description } as IMessage], []);
                const curr = this.state.heroData;
                curr.name = "";
                this.setState({ heroData: curr });
            }
        };
        ServerConnect(`/api/HerosCheck`, passed, succFun, failFun, this.props.ConnFuns.popWaiting, this.props.ConnFuns.closeWaiting);
    }

    private RegisterNewHero(): void {
        const passed: IPassedData<IHeroData> = {
            Data: this.state.heroData,
            UserToken: this.props.userToken,
        }
        const succFun = (res: any) => {
            const received = res.data;
            const nhero = {
                level: received.level,
                name: received.name,
                nickname: received.nickname,
                orders: received.orders,

            } as ICharacterBrief;
            this.props.ConnFuns.popMessage([{ title: "createHeroSucc", description: nhero.name + " has been successfully created.", } as IMessage], []);
            this.props.herosUpdateFun(nhero);
            this.props.ConnFuns.closeDialog();
        };
        const failFun = (error: any) => {
            if (error.response === undefined) {
                this.props.ConnFuns.popMessage([{ title: "serverErr", description: "I've got bad feelings about this...", } as IMessage], []);
            } else {
                this.props.ConnFuns.popMessage([{ title: error.response.data.type, description: error.response.data.description } as IMessage], []);
            }
        };
        ServerConnect(`/api/Heros`, passed, succFun, failFun, this.props.ConnFuns.popWaiting, this.props.ConnFuns.closeWaiting);
    }
}
// ----------- connect to store

const mapDispatchToProps1 = (dispatch: any) => {
    return {
        ConnFuns: {
            closeDialog: () => dispatch(Close_Dialog()),
            closeMessage: () => dispatch(Close_Messages()),
            closeWaiting: () => dispatch(End_Waiting()),
            popDialog: (element: React.ReactNode) => dispatch(Pop_Dialog(element)),
            popMessage: (messages: IMessage[], translators: IMessageTranslator[]) => dispatch(Pop_Messages(messages, translators)),
            popWaiting: () => dispatch(Start_Waiting()),
        } as IConnectionFunctions,
        herosUpdateFun: (hero: ICharacterBrief) => dispatch(Add_Hero(hero)),
    };
};
const mapStateToProps = (state: IAppStatus) => {
    return {
        userToken: state.userToken,
    }
};

const HeroCreationStepper = connect(mapStateToProps, mapDispatchToProps1)(ConnectedHeroCreationStepper);


class ConnectedCreateCharacterDialog extends React.Component<{ closedialogFun: VoidFunction, popmessFun: any, herosUpdateFun: (data: ICharacterBrief) => {} }, {}>{
    constructor(props: any) {
        super(props);
        // -------binding

    }
    public render() {
        return (<div className="dialog">
            <HeroCreationStepper closedialogFun={this.props.closedialogFun}/>
            <div className="dialogBottom">
                <Button
                    variant="flat"
                    color="primary"
                    onClick={this.props.closedialogFun}
                >
                    Abort</Button>
            </div>
        </div>);
    }
}

interface IStep {
    content: React.ReactNode;
    description: string;
    isOptional: boolean;
    validation: Func0<boolean>;
}
export interface IHeroName {
    name: string;
    nickname: string;
}
export interface IHeroData extends IHeroName {
    attributes: number[];
    country: number;
    origin: number;
    isMan: boolean;
}

// ----------- connect to store

const mapDispatchToProps = (dispatch: any) => {
    return {
        closedialogFun: () => dispatch(Close_Dialog()),
        herosUpdateFun: (hero: ICharacterBrief) => dispatch(Add_Hero(hero)),
        popmessFun: (message: IMessage[], translators: IMessageTranslator[]) => dispatch(Pop_Messages(message, translators)),
    };
};

const CreateCharacterDialog = connect(null, mapDispatchToProps)(ConnectedCreateCharacterDialog);

// ===============================

export default CreateCharacterDialog;