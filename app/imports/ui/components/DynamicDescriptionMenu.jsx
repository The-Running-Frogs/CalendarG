import React, { Component } from 'react'
import { Grid, Segment, Menu } from 'semantic-ui-react'

export default class DynamicDescriptionMenu extends Component {

    state = { activeItem: 'What is this?' }

    handleItemClick = (e, { name }) => this.setState({ activeItem: name });

    render() {
        const square = {width: 100, height: 100}
        const { activeItem } = this.state
        return (

            <Grid>
                <Grid.Column width={4}>
                    <Menu fluid vertical tabular pointing>
                        <Menu.Item
                            name = 'What is this?'
                            active={activeItem === 'What is this?'}
                            onClick={this.handleItemClick}
                        />
                        <Menu.Item
                            name = 'Get Started'
                            active={activeItem === 'Get Started'}
                            onClick={this.handleItemClick}
                        />
                        <Menu.Item
                            name = 't'
                            active={activeItem === 't'}
                            onClick={this.handleItemClick}
                        />
                        <Menu.Item
                            name = 's'
                            active={activeItem === 's'}
                            onClick={this.handleItemClick}
                        />
                    </Menu>
                </Grid.Column>
                <Grid.Column stretched width={12}>
                   <RenderedContent tabName={activeItem} format={square}/>
                </Grid.Column>
            </Grid>
        )
    }
}


const RenderedContent = ({ tabName, format }) => {
    if (tabName === 'What is this?') {
        return <WhatIsThis format={format}/>
    }
    if (tabName === 'Get Started') {
        return <GetStarted/>
    }
    return <Default/>
};

const WhatIsThis = ({format}) => (

    <Segment centered raised padded>

        <p>CalendarG is a web tool developed by The Running Frogs to help its users stay organized and on top of things with an online Calendar interface. Every user gets their own account that they can use to establish a calendar and schedule for themselves.</p>
        <p>The interface will be something familiar to those who have used services such as Google Calendars before and aims to be simple enough for intuitive use to those less familiar with those types of products as well!</p>

        <Grid padded centered columns={1}>
            <Grid.Row centered columns={3}>
                <Grid.Column>
                    <Segment color='teal' inverted circular style={format}>Easy</Segment>
                </Grid.Column>
                <Grid.Column>
                    <Segment color='teal' inverted circular style={format}>Tidy</Segment>
                </Grid.Column>
                <Grid.Column>
                    <Segment color='teal' inverted circular style={format}>Fun</Segment>
                </Grid.Column>
             </Grid.Row>
        </Grid>
    </Segment>
);

const GetStarted = () => (

    <Segment raised>
        <p>To get started, please click on 'Don't have an account?' in the top right corner of this page! Once you've completed the form please check your email to verify your account!</p>
    </Segment>

);

const Default = () => (
    <Segment raised>
        Default message, please implement the proper formatting
    </Segment>
);