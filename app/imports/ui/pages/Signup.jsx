/* Code written by Keanu Williams */

import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Redirect } from 'react-router-dom';
import { Container, Form, Grid, Header, Message, Segment, Progress } from 'semantic-ui-react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Accounts } from 'meteor/accounts-base';
import { Profiles } from '/imports/api/profiles/Profiles';

class Signup extends React.Component {

    /** Initialize state fields. */
    constructor(props) {
        super(props);
        this.state = { first_name: '', last_name: '', birthday: '', username: '',
            email: '', password: '', confirm_password: '', error: '', redirectToReferer: false };
    }

    /** Update the form controls each time the user interacts with them. */
    handleChange = (e, { name, value }) => {
        this.setState({ [name]: value });
    };

    /** Similar to handleChange, but updates the date each time the user interacts with the calendar **/
    dateChange = date => {
        this.setState({birthday: date});
    };

    /** Similar to handleChange, but makes sure that password is strong and also updates progress bar **/
    /** Regex code from https://martech.zone/javascript-password-strength/ **/
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

    /** Handle Signup submission. Create user account and a profile entry, then redirect to the home page. */
    submit = () => {
        const { first_name, last_name, birthday, username, email, password, confirm_password } = this.state;
        let password_strength = document.getElementById("password-progress-bar").dataset.percent;
        if (!(confirm_password === password)) { // Print error if passwords do not match
            this.setState({ error: "Passwords must match." });
        }
        else if (!(password_strength > 15)) { // Print error if there is little to no characters for password
            this.setState({ error: "Password needs to be stronger. Recommended to add at least one upper case letter, number, and symbol." });
        }
        else {
            Accounts.createUser({ username, email, password }, (err) => {
                if (err) { // If there was an error detected by Meteor in creating account, print message
                    this.setState({ error: err.reason });
                } else { // If no error, create an account and profile then redirect
                    let birthdayString = birthday.toString();
                    Profiles.insert({
                        firstName: first_name,
                        lastName: last_name,
                        fullName: first_name+" "+last_name,
                        birthday: birthdayString,
                        owner: username });
                    this.setState({ error: '', redirectToReferer: true });
                }
                if (Meteor.user()) {
                    Meteor.call( 'sendVerificationLink', ( error, response ) => {
                        if ( error ) {
                            console.log(error.reason);
                        }
                    });
                }
            });
        }
    };

    render() {
        /* Check if user is logged in before loading page, if so redirect to correct home page */
        const isNotLogged = Meteor.userId() === null || Meteor.user() === undefined;
        if (!isNotLogged) {
            if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
                return (<Redirect to={{ pathname: '/admin-home' }}/>); // If user is an admin
            }
            return (<Redirect to={{ pathname: '/home' }}/>); // If user is a regular user
        }
        const headerStyle = { marginBottom: "30px"};
        const buttonStyle = { marginTop: "40px"};
        const messageStyle = { marginBottom: "30px"};
        /** Else display the signup form. */
        return (
            <Container>
                <Grid textAlign="center" verticalAlign="middle" centered columns={2}>
                    <Grid.Row>
                        <Grid.Column>
                            <Header as="h1" textAlign="center" style={ headerStyle } >
                                Sign up for your FREE calendarG account!
                            </Header>
                            <Form onSubmit={this.submit}>
                                <Segment>
                                    <Form.Group unstackable widths={2}>
                                        <Form.Input
                                            required
                                            name = "first_name"
                                            label='First Name'
                                            type = "text"
                                            onChange={this.handleChange}
                                        />
                                        <Form.Input
                                            required
                                            name = 'last_name'
                                            label='Last Name'
                                            type = "text"
                                            onChange={this.handleChange}
                                        />
                                    </Form.Group>
                                    <Form.Input required label="Birthday">
                                        <DatePicker
                                            required
                                            maxDate = {Date.now()}
                                            selected={this.state.birthday}
                                            onChange={this.dateChange}
                                        />
                                    </Form.Input>
                                    {this.state.error === 'Username already exists.' ? (
                                        <Form.Input
                                            required
                                            error
                                            name="username"
                                            label="Username"
                                            type = "text"
                                            onChange={this.handleChange}
                                        />
                                    ) : (
                                        <Form.Input
                                            required
                                            name="username"
                                            label="Username"
                                            type = "text"
                                            onChange={this.handleChange}
                                        />
                                    )}
                                    {this.state.error === 'Email already exists.' ? (
                                        <Form.Input
                                            required
                                            error
                                            name="email"
                                            type="email"
                                            label="E-mail Address"
                                            onChange={this.handleChange}
                                        />
                                    ) : (
                                        <Form.Input
                                            required
                                            name="email"
                                            type="email"
                                            label="E-mail Address"
                                            onChange={this.handleChange}
                                        />
                                    )}
                                    <Form.Group unstackable widths={2}>
                                        <Form.Input
                                            required
                                            name="password"
                                            label="Password"
                                            type="password"
                                            onChange={this.passwordChange}
                                        />
                                        {this.state.confirm_password === this.state.password ||
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
                                    </Form.Group>
                                    <div id="password-progress-bar-area">
                                        <Progress error id="password-progress-bar" percent={0} label='Empty' />
                                    </div>
                                    <Form.Button fluid color="purple" style={buttonStyle} content="Create Account"/>
                                    <div id="signup-text">
                                        By clicking this button, you agree to our <a>Terms of Service</a>.
                                    </div>
                                </Segment>
                            </Form>
                            {this.state.error === '' ? (
                                ''
                            ) : (
                                <Message
                                    error
                                    style={messageStyle}
                                    header="Unable to register your account."
                                    content={this.state.error}
                                />
                            )}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>
        );
    }
}

/** Ensure that the React Router location object is available in case we need to redirect. */
Signup.propTypes = {
    location: PropTypes.object,
};

export default Signup;
