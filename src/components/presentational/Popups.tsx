import * as React from 'react';

import '../css/Popups.css';

import Divider from '@material-ui/core/Divider';

import * as errorSrc from '../img/MainPage/error.png';
import * as successSrc from '../img/MainPage/success.png';

export class ErrorPopup extends React.Component<{ index: number, title: string, description: string, clearFun: VoidFunction, imgs: string[] }, {}>{
    constructor(props: any) {
        super(props);
    }
    public render(): JSX.Element {
        return (
            <div className="Popup ErrorPopup" key={this.props.index}>
                <div className="PopupContent">
                    <div className="Centered"><img src={String(errorSrc)} /></div>
                    <p className="Title Centered">{this.props.title}</p>
                    <Divider />
                    <p className="Centered">{this.props.description}</p>
                    {(this.props.imgs.length > 0) ? <div className="Centered">{this.props.imgs.map(e => <img src={e} key={e} />)}</div> : ""}
                </div>
                <button onClick={this.props.clearFun}>Back</button>
            </div>
        );
    }
}
export class SuccessPopup extends React.Component<{ index: number, title: string, description: string, clearFun: VoidFunction, imgs: string[] }, {}>{
    constructor(props: any) {
        super(props);
    }
    public render(): JSX.Element {
        return (
            <div className="Popup SuccessPopup" key={this.props.index}>
                <div className="PopupContent">
                    <div className="Centered"><img src={String(successSrc)} /></div>
                    <p className="Title Centered">{this.props.title}</p>
                    <Divider />
                    <p className="Centered">{this.props.description}</p>
                    {(this.props.imgs.length > 0) ? <div className="Centered">{this.props.imgs.map(e => <img src={e} key={e} />)}</div> : ""}
                </div>
                <button onClick={this.props.clearFun}>Back</button>
            </div>
        );
    }
}
// ========================================

export default ErrorPopup;