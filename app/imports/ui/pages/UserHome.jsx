import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import {Loader, Grid, Container, Form, Segment, Header, Button, Message, Divider} from 'semantic-ui-react';
import { Accounts } from 'meteor/accounts-base';
import Scheduler from "../components/Scheduler/";
import { Profiles } from '/imports/api/profiles/Profiles';

class UserHome extends React.Component {

    /** Initialize state fields. */
    constructor(props) {
        super(props);
        this.state = { email: '', confirm_email: '', success: '', error: '' };
    }

    resend = () => {
        if (Meteor.userId()) {
            Meteor.call( 'sendVerificationLink', ( error, response ) => {
                if ( error ) {
                    this.setState({success: '', error: 'Unable to send verification email.'});
                }
                else {
                    this.setState({email: '', success: 'Email successfully sent.', error: ''});
                }
            });
        }
    };

    submit = () => {
        const { email, confirm_email } = this.state;
        if (email === Meteor.user().emails[0].address) {
            this.setState({success: '', error: 'Email that was entered is already associated with your account.'});
        }
        else if (!(email === confirm_email)) {
            this.setState({success: '', error: 'In order to change email, emails must match.'});
        }
        else {
            if (Meteor.userId()) {
                Meteor.call('changeEmail', email, (error, response) => {
                    if (error) {
                        this.setState({success: '', error: 'Email already exists.'});
                    }
                    else {
                        this.resend();
                        this.setState({email: '', success: 'Email successfully changed.', error: ''});
                    }
                })
            }
        }
    };

    /** Update the form controls each time the user interacts with them. */
    handleChange = (e, { name, value }) => {
        this.setState({ [name]: value });
    };

    render() {
        if (Roles.userIsInRole(Meteor.userId(), 'admin')) { // If user is admin, redirect them to admin home page
            return (<Redirect to={{ pathname: '/admin-home' }}/>);
        }
        else if (this.props.ready) {
            const userProfile = Profiles.findOne({ owner: Meteor.user().username }); // Get the user profile
            if (userProfile === undefined || userProfile === null || Meteor.user() === undefined) { // If there is no user logged in, go to landing page
                return (<Redirect to={{ pathname: '/' }}/>);
            }
            else if (Meteor.user().emails[0].verified === false) { // If the user's email is not verified, they do not have access to site
                const headerStyle = { marginBottom: "30px"};
                const messageStyle = { marginBottom: "30px"};
                return (
                    <Container>
                        <Grid textAlign="center" columns="equal" centered>
                            <Grid.Column width={9}>
                                <Header as="h2" textAlign="center" style={ headerStyle }>
                                    Put in the wrong email address? Well you're in luck! Change your email below.
                                </Header>
                                <Segment>
                                    <Form onSubmit={this.submit}>
                                        {this.state.error === 'Email already exists.' ||
                                            this.state.error === 'Email that was entered is already associated with your account.'
                                            ? (
                                            <Form.Input
                                                required
                                                error
                                                name="email"
                                                type="email"
                                                label="New E-mail Address"
                                                onChange={this.handleChange}
                                            />
                                        ) : (
                                            <Form.Input
                                                required
                                                name="email"
                                                type="email"
                                                label="New E-mail Address"
                                                onChange={this.handleChange}
                                            />
                                        )}
                                        {this.state.email === this.state.confirm_email ||
                                        this.state.confirm_email === ''
                                            ? (
                                                <Form.Input
                                                    required
                                                    name="confirm_email"
                                                    type="email"
                                                    label="Confirm New E-mail Address"
                                                    onChange={this.handleChange}
                                                />
                                            ) : (
                                                <Form.Input
                                                    required
                                                    error
                                                    name="confirm_email"
                                                    type="email"
                                                    label="Confirm New E-mail Address"
                                                    onChange={this.handleChange}
                                                />
                                            )}
                                        <Form.Button fluid color="purple" content="Change E-mail"/>
                                    </Form>
                                    <Divider horizontal>Or</Divider>
                                    <Button fluid onClick={this.resend} content="Resend Verification Email" />
                                </Segment>
                                {this.state.error === '' ? (
                                    ''
                                ) : (
                                    <Message
                                        error
                                        style={messageStyle}
                                        header="Error!"
                                        content={this.state.error}
                                    />
                                )}
                                {this.state.success === '' ? (
                                    ''
                                ) : (
                                    <Message
                                        positive
                                        style={messageStyle}
                                        header="Success!"
                                        content={this.state.success}
                                    />
                                )}
                            </Grid.Column>
                        </Grid>
                    </Container>
                );
            }
            else { // If the user's email is verified and is logged in, go to their home page
                return (
                    <Container>
                        <Grid padded>
                            <Grid.Row>
                                <Header as="h1" content="My Calendar"/>
                            </Grid.Row>
                            <Grid.Row centered>
                                <div className='scheduler-container'>
                                    <Scheduler/>
                                </div>
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

UserHome.propTypes = {
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
}) (UserHome);