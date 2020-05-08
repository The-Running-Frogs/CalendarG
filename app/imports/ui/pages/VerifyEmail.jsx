/* Code written by Keanu Williams */

import React from 'react'
import { Meteor } from 'meteor/meteor';
import { Message, Container } from 'semantic-ui-react';

export default class VerifyEmail extends React.Component {

    /** Initialize component state with properties for login and redirection. */
    constructor(props) {
        super(props);
        this.state = { success: '', error: '' };
    }

    componentDidMount () {
        const token = this.props.match.params.token;
        Accounts.verifyEmail(token, (error) => {
            if (error) {
                this.setState({ success: '', error: error.reason });
            }
            else {
                this.setState({ success: 'Email verification successful.', error: '' });
            }
        })
    }

    render () {
        return (
            Meteor.user().emails[ 0 ].verified ?
                (<Container>
                    <Message positive>
                        <Message.Header>
                            Success!
                        </Message.Header>
                        <Message.Content>
                            {this.state.success}
                        </Message.Content>
                    </Message>
                    {console.log("Timeout: "+setTimeout(function() {window.location.assign("#/")}, 2000))}
                </Container>)
                : (<Container>
                    <Message error>
                        <Message.Header>
                            Error!
                        </Message.Header>
                        <Message.Content>
                            {this.state.error}
                        </Message.Content>
                    </Message>
                    {console.log("Timeout: "+setTimeout(function() {window.location.assign("#/")}, 2000))}
                </Container>)
        )
    }
}
