import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Divider, Grid, Image, Segment } from 'semantic-ui-react';
import {Redirect} from "react-router";
import DynamicDescriptionMenu from '../components/DynamicDescriptionMenu';

/** A simple static component to render some text for the landing page. */
class Landing extends React.Component {
    render() {
        /* Check if user is logged in before loading page, if so redirect to correct home page */
        const isNotLogged = Meteor.userId() === null || Meteor.user() === undefined;
        if (!isNotLogged) {
            if (Roles.userIsInRole(Meteor.userId(), 'admin')) { // If user is an admin
                return (<Redirect to={{ pathname: '/request-admin' }}/>);
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
                      {/*
                      <Segment>
                        <Grid columns={2} relaxed='very'>
                          <Grid.Column>
                            <p>
                              <Image src='https://react.semantic-ui.com/images/wireframe/short-paragraph.png' />
                            </p>
                            <p>
                              <Image src='https://react.semantic-ui.com/images/wireframe/short-paragraph.png' />
                            </p>
                            <p>
                              <Image src='https://react.semantic-ui.com/images/wireframe/short-paragraph.png' />
                            </p>
                            <p>
                              <Image src='https://react.semantic-ui.com/images/wireframe/short-paragraph.png' />
                            </p>
                          </Grid.Column>
                          <Grid.Column>
                            <p>
                              <Image src='https://react.semantic-ui.com/images/wireframe/short-paragraph.png' />
                            </p>
                            <p>
                              <Image src='https://react.semantic-ui.com/images/wireframe/short-paragraph.png' />
                            </p>
                            <p>
                              <Image src='https://react.semantic-ui.com/images/wireframe/short-paragraph.png' />
                            </p>
                            <p>
                              <Image src='https://react.semantic-ui.com/images/wireframe/short-paragraph.png' />
                            </p>
                          </Grid.Column>
                        </Grid>

                        <Divider vertical>And</Divider>
                      </Segment>
                      */}
                </Grid.Column>

            </Grid>
        );
    }
}

export default Landing;


