import * as React from 'react';
import { connect } from "react-redux";

import { Close_Dialog, Pop_Dialog, } from '../actions/actionCreators';

import { isMobile } from "react-device-detect";

import {
    Link,
    Route,
} from 'react-router-dom';

import '../css/Roshar.css';
import { IRosharCart } from '../data/textsToFill';

import Button from '@material-ui/core/Button';

// ---------- data
import { RosharCarts } from '../data/textsToFill';
import InfoCart, { MobileInfoCart } from './InfoCart';


class ConnectedRoshar extends React.Component<{ DialogFuns: IDialogFunctions }, {}> {
    constructor(props: any) {
        super(props);
        this.renderCart = this.renderCart.bind(this);
        this.PopCart = this.PopCart.bind(this);
    }
    public componentWillMount() {
        document.title = "About Roshar";
    }
    public componentWillUnmount() {
        document.title = "Shattered Plains";
    }

    public render(): JSX.Element {
        const menu = (match: any) => {
            return (
                <Route path="/roshar" exact={true}>
                    <div className="CartContext">
                        {
                            (!isMobile) ? RosharCarts.map((e, i) => this.renderCart(e, i)) : RosharCarts.map((e, i) => this.renderMobileCart(e, i))
                        }
                    </div>
                </Route>
            );
        }
        return (
            <div className="insideContent">
                <Route path="/roshar" exact={true} component={menu} />
                {RosharCarts.map((e, i) => {
                    const comp = (match: any) => {
                        return (
                            <MobileInfoCart cart={RosharCarts[i]} />
                        );
                    }
                    return (<Route key={i} path={"/roshar/" + e.route} exact={true} component={comp} />);
                })}
            </div>
        );
    }
    private renderCart(element: IRosharCart, key: number): JSX.Element {
        const onClickFun = () => {
            this.PopCart(key);
        }
        const graphics = require('../img/AboutProject/roshar/minatures/' + element.graphics);
        return (
            <div className="Cart" key={key} onClick={onClickFun}>
                <div className="ImagePlace" style={{ backgroundImage: "url("+ graphics + ")" }} />
                <div className="ImageTitle">
                    <div>{element.title}</div>
                </div>
                <div className="ButtonPlace">
                    <Button
                        variant="flat"
                        color="default"
                        size="small"
                    >Description</Button>
                </div>
            </div>
        );
    }
    private PopCart(id: number) {
        this.props.DialogFuns.popDialog(<InfoCart cart={RosharCarts[id]} closeFun={this.props.DialogFuns.closeDialog} />);
    }
    private renderMobileCart(element: IRosharCart, key: number): JSX.Element {
        const graphics = require('../img/AboutProject/roshar/minatures/' + element.graphics);
        return (
            <Link to={"/roshar/" + element.route}>
                <div className="Cart" key={key}>
                    <div className="ImagePlace" style={{ backgroundImage: "url(" + graphics + ")" }} />
                    <div className="ImageTitle">
                        <div>{element.title}</div>
                    </div>
                    <div className="ButtonPlace">
                        <Button
                            variant="flat"
                            color="default"
                            size="small"
                        >Description</Button>
                    </div>
                </div>
            </Link>
        );
    }
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        DialogFuns: {
            closeDialog: () => dispatch(Close_Dialog()),
            popDialog: (element: React.ReactNode) => dispatch(Pop_Dialog(element)),
        } as IDialogFunctions,
    };
};

const Roshar = connect(null, mapDispatchToProps)(ConnectedRoshar);


// ========================================

export default Roshar;

// ------------------ interfaces

interface IDialogFunctions {
    closeDialog: VoidFunction;
    popDialog: (e: React.ReactNode) => void;
}