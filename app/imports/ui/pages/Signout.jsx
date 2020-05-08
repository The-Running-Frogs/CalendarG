/* Code written by Sophia Kim */

import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Header } from 'semantic-ui-react';
import PropTypes from "prop-types";

/** After the user clicks the "Signout" link in the NavBar, log them out and display this page.
 *  Page will redirect after two seconds. **/
export default class Signout extends React.Component {
    render() {
        Meteor.logout();
        return (
            <Header textAlign="center">
                <h2>You have been signed out.</h2>
                <h4>Redirecting in 2 seconds...</h4>
                {console.log("Timeout: "+setTimeout(function() {window.location.assign("#/")}, 2000))}
            </Header>
        );
    }
}

Signout.propTypes = {
    currentUser: PropTypes.string,
    location: PropTypes.object,
};
