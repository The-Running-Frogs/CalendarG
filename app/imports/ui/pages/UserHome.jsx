import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Loader, Menu, Grid, Image, Breadcrumb } from 'semantic-ui-react';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import { Profiles } from '/imports/api/profiles/Profiles';

class UserHome extends React.Component {

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
                return('');
            }
            else { // If the user's email is verified and is logged in, go to their home page
                const sideMenuStyle = { padding: "5px" };
                return (
                    <Grid padded columns={2}>
                        <Grid.Row>
                            <Grid.Column floated="left" width={1}>
                                <Menu style={sideMenuStyle} vertical>
                                    <Menu.Item>
                                        <Menu.Header>Categories</Menu.Header>
                                        <Menu.Menu>
                                            <Menu.Item>
                                                <input type="checkbox" id="category1" name="category1"/>
                                                <label htmlFor="category1">  Category 1</label>
                                            </Menu.Item>
                                            <Menu.Item>
                                                <input type="checkbox" id="category2" name="category2"/>
                                                <label htmlFor="category2">  Category 2</label>
                                            </Menu.Item>
                                        </Menu.Menu>
                                    </Menu.Item>
                                </Menu>
                            </Grid.Column>
                            <Grid.Column floated="left">
                                <Image src="https://blankcalendarpages.com/printable_calendar/blank/February-2020-calendar-b12.jpg"/>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
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