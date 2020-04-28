import React from 'react';
import { Meteor } from 'meteor/meteor';
import 'semantic-ui-css/semantic.css';
import { Accounts } from 'meteor/accounts-base';
import { Profiles } from '/imports/api/profiles/Profiles';
import { Redirect } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import {Loader, Container, Form, Segment} from 'semantic-ui-react';
import PropTypes from "prop-types";

class ChangeEmail extends React.Component {

    constructor(props) {
        super(props);
        this.state = { email: '', success: '', error: '' };
    }

    submit = () => {
        const { email } = this.state;
        if (email === Meteor.user().emails[0].address) {
            this.setState({success: '', error: 'Email that was entered is already associated with your account.'});
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
                const segmentStyle = { marginTop: "30px" };
                return (
                    <Container>
                        <h1>Change Email</h1>
                        <Segment style={segmentStyle}>
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
                                <Form.Button fluid color="purple" content="Change E-mail"/>
                            </Form>
                        </Segment>
                    </Container>
                );
            }
        }
        else {
            return (<Loader active>Loading</Loader>);
        }
    }
}

ChangeEmail.propTypes = {
    currentUser: PropTypes.string,
    location: PropTypes.object,
};

export default withTracker(() => {
    const subscription = Meteor.subscribe('Profiles');

    return {
        ready: subscription.ready(),
        currentUser: Meteor.user() ? Meteor.user().username : '',
    };
}) (ChangeEmail);