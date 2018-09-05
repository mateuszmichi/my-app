import * as React from 'react';
import { connect } from "react-redux";

import { Close_Dialog, Pop_Dialog,} from '../actions/actionCreators';


import '../css/Roshar.css';
import { IRosharCart } from '../data/textsToFill';

import Button from '@material-ui/core/Button';

// ---------- data
import { RosharCarts } from '../data/textsToFill';
import InfoCart from './InfoCart';


class ConnectedRoshar extends React.Component<{ DialogFuns: IDialogFunctions }, { }> {
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
        return (
            <div className="insideContent">
                <div className="CartContext">
                    {RosharCarts.map((e, i) => this.renderCart(e, i))}
                </div>
            </div>
        );
    }
    private renderCart(element: IRosharCart, key: number): JSX.Element {
        const onClickFun = () => {
            this.PopCart(key);
        }
        return (
            <div className="Cart" key={key} onClick={onClickFun}>
                <div className="ImagePlace" style={{ backgroundImage: "url(" + element.graphics + ")" }} />
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
        this.props.DialogFuns.popDialog(<InfoCart cart={RosharCarts[id]} closeFun={this.props.DialogFuns.closeDialog}/>);
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