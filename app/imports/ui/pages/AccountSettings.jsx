import React from 'react';
import { Meteor } from 'meteor/meteor';
import 'semantic-ui-css/semantic.css';
import { Accounts } from 'meteor/accounts-base';
import { Profiles } from '/imports/api/profiles/Profiles';
import { Redirect } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Loader, Grid , Header, Container, Form, Checkbox } from 'semantic-ui-react';
import PropTypes from "prop-types";

class AccountSettings extends React.Component {
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
                const headerStyle = { marginBottom : "100px"};
                return (
                    <Container>
                        <Header as="h1" style={headerStyle}>Account Settings</Header>
                        <Grid divided='vertically'>
                    <Grid.Row columns={2}>
                        <Grid.Column>
                            <Header as="h3">Username</Header>
                        </Grid.Column>
                        <Grid.Column>
                            {Meteor.user().username}
                        </Grid.Column>
                    </Grid.Row>
                        </Grid>
                        <div class="ui divider"></div>
                        <Grid divided='vertically'>
                            <Grid.Row columns={2}>
                                <Grid.Column>
                                    <Header as="h3">Email</Header>
                                </Grid.Column>
                                <Grid.Column>
                                    {Meteor.user().emails[0].address}
                                    <br/>
                                    <br/>
                                    <a id="password change" href="#/changeem">Change Email</a>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                        <div class="ui divider"></div>
                        <Grid divided='vertically'>
                            <Grid.Row columns={2}>
                                <Grid.Column>
                                    <Header as="h3">Password</Header>
                                </Grid.Column>
                                <Grid.Column>
                                    <a id="password change" href="#/changepw">Change Password</a>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                        <div className="ui divider"></div>
                        <Grid divided='vertically'>
                            <Grid.Row columns={2}>
                                <Grid.Column>
                                    <Header as="h3">Notification Settings</Header>
                                </Grid.Column>
                                <Grid.Column>
                                    <Checkbox label='Receive Email Notifications' />
                                    <br/>
                                    <Checkbox label='Receive Notifications in the App' />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Container>
                );
            }
        }
        else {
            return (<Loader active>Loading</Loader>);
        }
    }
}

AccountSettings.propTypes = {
    currentUser: PropTypes.string,
    location: PropTypes.object,
};

export default withTracker(() => {
    const subscription = Meteor.subscribe('Profiles');

    return {
        ready: subscription.ready(),
        currentUser: Meteor.user() ? Meteor.user().username : '',
    };
}) (AccountSettings);