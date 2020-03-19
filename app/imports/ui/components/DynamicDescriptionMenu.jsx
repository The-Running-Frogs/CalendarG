import React, { Component } from 'react'
import { Grid, Segment, Menu } from 'semantic-ui-react'

export default class DynamicDescriptionMenu extends Component {

    state = { activeItem: 'bio' }

    handleItemClick = (e, { name }) => this.setState({ activeItem: name })

    render() {
        const { activeItem } = this.state
        return (
            <Grid>
                <Grid.Column width={4}>
                    <Menu fluid vertical tabular pointing large>
                        <Menu.Item
                            name = 'bio'
                            active={activeItem === 'bio'}
                            onClick={this.handleItemClick}
                        />
                        <Menu.Item
                            name = 'about'
                            active={activeItem === 'about'}
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
                   <RenderedContent tabName={activeItem} />
                </Grid.Column>
            </Grid>
        )
    }
}


const RenderedContent = ({ tabName }) => {
    if (tabName === 'bio') {
        return <Bio/>
    }
    if (tabName === 'about') {
        return <About/>
    }
    return <Default/>
}

const Bio = () => (
    <Segment>
        BIO This is an stretched grid column. This segment will always match the tab height
    </Segment>
)

const About = () => (
    <Segment>
        ABOUT This is an stretched grid column. This segment will always match the tab height
    </Segment>
)

const Default = () => (
    <Segment>
        Default message, please implement the proper formatting
    </Segment>
)