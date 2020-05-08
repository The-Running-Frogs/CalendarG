/* Code written by Sophia Kim */

import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { NavLink } from 'react-router-dom';
import { Menu, Dropdown, Input, Button, Message, Container, Loader } from 'semantic-ui-react';
import { Profiles } from '/imports/api/profiles/Profiles';
import { Roles } from 'meteor/alanning:roles';

/** The TopMenu appears at the top of every page. Rendered by the App Layout component. */
class TopMenu extends React.Component {

    /** Initialize component state with properties for login and redirection. */
    constructor(props) {
        super(props);
        this.state = { username: '', password: '', error: '', redirectToReferer: false };
    }

    /** Update the form controls each time the user interacts with them. */
    handleChange = (e, { name, value }) => {
        this.setState({ [name]: value });
    };

    /** Submit function for the login credentials **/
    submit = () => {
        const { username, password } = this.state;
        Meteor.loginWithPassword(username, password, (err) => {
            if (err) {
                this.setState({ error: err.reason });
            } else {
                this.setState({ error: '', redirectToReferer: true });
                if (Roles.userIsInRole(Meteor.userId(), 'admin')) { // If user is an admin, redirect to admin home page
                    window.location.assign("#/admin-home");
                }
                else { // If regular user, go to user home page
                    window.location.assign("#/home");
                }
            }
        });
    };

    /** Depending if the user is not logged in, regular user or admin, display the correct link **/
    renderHomeLink() {
        if (this.props.currentUser === '') { // Not logged in
            return (
                <Menu.Item as={NavLink} activeClassName="" exact to="/">
                    <h1>calendarG</h1>
                </Menu.Item>
            );
        }
        else if (Roles.userIsInRole(Meteor.userId(), 'admin') && this.props.ready) { // Admin
            return (
                <Menu.Item as={NavLink} activeClassName="" exact to="/admin-home" key='admin-home'>
                    <h1>calendarG Admin</h1>
                </Menu.Item>
            );
        }
        return ( // Regular user
            <Menu.Item as={NavLink} activeClassName="" exact to="/home" key='home'>
                <h1>calendarG</h1>
            </Menu.Item>
        );
    }

    /** Depending if the user is not logged in, regular user or admin, display login form or user dropdown **/
    renderUserDropdown() {
        const formStyle = { paddingTop: '10px', paddingBottom: '10px' };
        const userProfile = Profiles.findOne({ owner: this.props.currentUser });
        if (this.props.currentUser === '' || userProfile === undefined) {
            return ( // Not logged in
                <Container style={formStyle} fluid>
                    <Input
                        name = "username"
                        placeholder="Username"
                        id="login-username"
                        onChange={this.handleChange}
                    />
                    <Input
                        name = "password"
                        type = "password"
                        placeholder="Password"
                        id="login-password"
                        onChange={this.handleChange}
                    />
                    <Button inverted content="Log-in"
                            id="login-button"
                            onClick={this.submit}
                    />
                    <Container fluid id="navbar-text-container">
                        <a id="navbar-text" href="#/register">Don't have an account?</a>
                    </Container>
                </Container>
            );
        }
        else if (Roles.userIsInRole(Meteor.userId(), 'admin')) { // Admin
            return (
                <Dropdown text={userProfile.fullName} item inline floating closeOnChange>
                    <Dropdown.Menu>
                        <Dropdown.Header content={Meteor.user().username} />
                        <Dropdown.Item icon="setting" activeClassName="" text="Settings" as={NavLink} exact to="/settings"/>
                        <Dropdown.Item icon="sign out" activeClassName="" text="Sign Out" as={NavLink} exact to="/signout"/>
                    </Dropdown.Menu>
                </Dropdown>
            );
        }
        return ( // Regular user
            <Dropdown text={userProfile.fullName} item inline floating closeOnChange>
                <Dropdown.Menu>
                    <Dropdown.Header content={"@"+Meteor.user().username} />
                    {Meteor.user().emails[0].verified === false ? ( // Do not give user access to account settings if email is not verified
                        <Dropdown.Item disabled icon="setting" activeClassName="" text="Settings" as={NavLink} exact to="/settings"/>
                    ) : (
                        <Dropdown.Item icon="setting" activeClassName="" text="Settings" as={NavLink} exact to="/settings"/>
                    )}
                    <Dropdown.Item icon="sign out" activeClassName="" text="Sign Out" as={NavLink} exact to="/signout"/>
                </Dropdown.Menu>
            </Dropdown>
        );
    }

    /** Display the TopMenu Navigation bar **/
    render() {
        const menuStyle = { paddingLeft: '50px', paddingRight: '50px', paddingTop: '0px',
            backgroundColor: 'mediumpurple' };
        const loginMessageStyle = { marginTop: "0px" };
        const verifyMessageStyle = { marginTop: "0px", marginBottom: "-15px" };
        if (this.props.ready) {
            return (
                <Container fluid>
                    <Menu style={menuStyle} attached="top" size="large" borderless fluid inverted>
                        {this.renderHomeLink()}
                        <Menu.Menu position="right">
                            {this.renderUserDropdown()}
                        </Menu.Menu>
                    </Menu>
                    {this.state.error === '' ? (
                        ''
                    ) : (
                        <Message
                            error
                            header="Log-in attempt unsuccessful."
                            content={this.state.error}
                            style={loginMessageStyle}
                        />
                    )}
                    {this.props.currentUser === '' ? (
                        '' // Don't print anything if their is no user logged in
                    ) : ( Meteor.user().emails[0].verified === true ? (
                            '' // Don't print anything if the user's email is verified
                        ) : (
                            <Message warning style={verifyMessageStyle}>
                                <Message.Header>Verify your email address: {Meteor.user().emails[0].address}</Message.Header>
                                <Message.Content>
                                    Check your email for verification link in order to use calendarG.
                                </Message.Content>
                            </Message>
                        )
                    )}
                </Container>
            );
        }
        else {
            return (<Loader active>Loading</Loader>);
        }
    }
}

/** Declare the types of all properties. */
TopMenu.propTypes = {
    currentUser: PropTypes.string,
    location: PropTypes.object,
    ready: PropTypes.bool.isRequired,
};

export default withTracker(() => {
    const subscription = Meteor.subscribe('Profiles');

    return {
        ready: subscription.ready(),
        currentUser: Meteor.user() ? Meteor.user().username : '',
    };
})(TopMenu);
