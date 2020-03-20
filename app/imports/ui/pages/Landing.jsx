import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Grid } from 'semantic-ui-react';
import { Redirect } from "react-router";
import { withTracker } from 'meteor/react-meteor-data';
import DynamicDescriptionMenu from '../components/DynamicDescriptionMenu';
import PropTypes from "prop-types";

/** A simple static component to render some text for the landing page. */
class Landing extends React.Component {
    render() {
        /* Check if user is logged in before loading page, if so redirect to correct home page */
        if (!(this.props.currentUser === '')) {
            if (Roles.userIsInRole(Meteor.userId(), 'admin')) { // If user is an admin
                return (<Redirect to={{ pathname: '/admin-home' }}/>);
            }
            return (<Redirect to={{ pathname: '/home' }}/>); // If user is regular user
        }
        /* Else print the landing page */
        return (
            <Grid verticalAlign='middle' textAlign='center' container>
                <Grid.Column width={16}>
                    <h1>Welcome to CalendarG</h1>
                    <p>Now get to work and modify this app!</p>
                   <DynamicDescriptionMenu/>
                </Grid.Column>

            </Grid>
        );
    }
}

/** Declare the types of all properties. */
Landing.propTypes = {
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
})(Landing);



