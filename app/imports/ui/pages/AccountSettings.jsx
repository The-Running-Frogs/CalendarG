import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Profiles } from '/imports/api/profiles/Profiles';
import { Redirect } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Loader } from 'semantic-ui-react';
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
                return (
                  '' // put settings here
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