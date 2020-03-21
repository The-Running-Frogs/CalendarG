import React from 'react'
import { Meteor } from 'meteor/meteor';
import Accounts from 'meteor/accounts-base'

export default class VerifyEmail extends React.Component {

    componentDidMount () {
        const token = this.props.match.params.token;
        Accounts.verifyEmail(token, (err) => {
            if (err) {
                console.log(err.reason);
            } else {
                console.log("Email Verification Success");
                {console.log("Timeout: "+setTimeout(function() {window.location.assign("#/")}, 1000))}
            }
        })
    }

    render () {
        return (
            Meteor.user().emails[ 0 ].verified ? <div>Success</div> : <div>Failed</div>
        )
    }
}