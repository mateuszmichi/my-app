import * as React from 'react';

import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';

import DeleteIcon from '@material-ui/icons/Delete';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EmailIcon from '@material-ui/icons/Email';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import LockIcon from '@material-ui/icons/Lock';

class AccountManagement extends React.Component<{ passFun: VoidFunction, emailFun: VoidFunction, removeAccountFun: VoidFunction, removeCharacterFun:VoidFunction, logFun:VoidFunction}, {}> {
    public render() {
        return (<div className="buttonGroup">
            <List component="nav">
                <ListItem component="button" onClick={this.props.passFun}>
                    <ListItemIcon>
                        <LockIcon />
                    </ListItemIcon>
                    <ListItemText primary="Change password" />
                </ListItem>
                <ListItem component="button" onClick={this.props.emailFun}>
                    <ListItemIcon>
                        <EmailIcon />
                    </ListItemIcon>
                    <ListItemText primary="Change email" />
                </ListItem>
                <ListItem component="button" onClick={this.props.removeCharacterFun}>
                    <ListItemIcon>
                        <DeleteIcon />
                    </ListItemIcon>
                    <ListItemText primary="Remove a character" />
                </ListItem>
                <ListItem component="button" onClick={this.props.removeAccountFun}>
                    <ListItemIcon>
                        <DeleteForeverIcon />
                    </ListItemIcon>
                    <ListItemText primary="Delete account" />
                </ListItem>
                <ListItem component="button" onClick={this.props.logFun}>
                    <ListItemIcon>
                        <ExitToAppIcon />
                    </ListItemIcon>
                    <ListItemText primary="Log Out" />
                </ListItem>
            </List>
        </div>);
    }
}

// =========================

export default AccountManagement;