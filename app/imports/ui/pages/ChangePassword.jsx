import React from 'react';
import { Meteor } from 'meteor/meteor';
import 'semantic-ui-css/semantic.css';
import { Accounts } from 'meteor/accounts-base';
import { Profiles } from '/imports/api/profiles/Profiles';
import { Redirect } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import {Loader, Grid, Header, Container, Form, Checkbox, Segment, Progress, Message} from 'semantic-ui-react';
import PropTypes from "prop-types";

class ChangePassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = { confirm_password: '', current_password: '', new_password: '', success: '', error: '' };
    }

    changePassword = () => {
        const { current_password, new_password, confirm_password } = this.state;
        if (new_password === confirm_password) {
            return (Accounts.changePassword(current_password, new_password, (error) => this.callback(error)));
        }
        else {
            this.setState({success: '', error: 'Passwords must match.'});
        }
    };

    submit = () => {
        this.changePassword();
        window.location.assign("#/signout");
    };

    passwordChange = (e, { name, value }) => {
        this.setState({ [name]: value });
        let bar = document.getElementById("password-progress-bar-area");
        const strong =
            new RegExp("^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$", "g");
        const medium =
            new RegExp("^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");
        const enough =
            new RegExp("(?=.{6,}).*", "g");
        if (value.length === 0) {
            bar.innerHTML = `<div id="password-progress-bar" class="ui progress error" data-percent="0">
                                 <div class="bar" style="width:0%"></div>
                                <div class="label">Empty</div>
                            </div>`;
        }
        else if (false === enough.test(value)) {
            bar.innerHTML = `<div id="password-progress-bar" class="ui progress error" data-percent="15">
                                 <div class="bar" style="width:15%"></div>
                                <div class="label">More Characters</div>
                            </div>`;
        }
        else if (strong.test(value)) {
            bar.innerHTML = `<div id="password-progress-bar" class="ui progress success" data-percent="100">
                                 <div class="bar" style="width:100%"></div>
                                <div class="label">Strong</div>
                            </div>`;
        }
        else if (medium.test(value)) {
            bar.innerHTML = `<div id="password-progress-bar" class="ui progress warning" data-percent="67">
                                 <div class="bar" style="width:67%"></div>
                                <div class="label">Medium</div>
                            </div>`;
        }
        else {
            bar.innerHTML = `<div id="password-progress-bar" class="ui progress error" data-percent="33">
                                 <div class="bar" style="width:33%"></div>
                                <div class="label">Weak</div>
                            </div>`;
        }
    };

    handleChange = (e, { name, value }) => {
        this.setState({ [name]: value });
    };

    render() {

        if (this.props.ready) {
            const userProfile = Profiles.findOne({ owner: Meteor.user().username }); // Get the user profile
            if (userProfile === undefined || userProfile === null || Meteor.user() === undefined) { // If there is no user logged in, go to landing page
                return (<Redirect to={{ pathname: '/' }}/>);
            }
            else if (Meteor.user().emails[0].verified === false) { // If the user's email is not verified, they do not have access to site
                return (<Redirect to={{ pathname: '/home' }}/>);
            }
            else { // If the user's email is verified and is logged in, access their settings
                const messageStyle = { marginBottom: "30px"};
                const buttonStyle = { marginBottom: "30px", marginTop: "30px" };
                return (
                    <Segment>
                            <Form onSubmit={this.submit}>
                                    <Form.Input
                                        required
                                        name="current_password"
                                        label="Current Password"
                                        type="password"
                                        onChange={this.handleChange}
                                    />
                                    <Form.Input
                                        required
                                        name="new_password"
                                        label="New Password"
                                        type="password"
                                        onChange={this.passwordChange}
                                    />
                                {this.state.confirm_password === this.state.new_password ||
                                this.state.confirm_password === '' ? (
                                    <Form.Input
                                        required
                                        name="confirm_password"
                                        label="Confirm Password"
                                        type="password"
                                        onChange={this.handleChange}
                                    />
                                ) : (
                                    <Form.Input
                                        required
                                        error
                                        name="confirm_password"
                                        label="Confirm Password"
                                        type="password"
                                        onChange={this.handleChange}
                                    />
                                )}
                                <div id="password-progress-bar-area">
                                    <Progress style={buttonStyle} error id="password-progress-bar" percent={0} label='Empty' />
                                </div>
                            <Form.Button fluid color="purple" content="Change Password"/>
                            </Form>
                        {this.state.error === '' ? (
                            ''
                        ) : (
                            <Message
                                error
                                style={messageStyle}
                                header="Unable to change your password."
                                content={this.state.error}
                            />
                        )}
                    </Segment>
                );
            }
        }
        else {
            return (<Loader active>Loading</Loader>);
        }
    }
}

ChangePassword.propTypes = {
    currentUser: PropTypes.string,
    location: PropTypes.object,
};

export default withTracker(() => {
    const subscription = Meteor.subscribe('Profiles');

    return {
        ready: subscription.ready(),
        currentUser: Meteor.user() ? Meteor.user().username : '',
    };
}) (ChangePassword);