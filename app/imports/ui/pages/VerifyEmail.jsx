import React from 'react'
import Accounts from 'meteor/accounts-base'

export default class VerifyEmailPage extends React.Component {

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
            <div>{''}</div>
        )
    }
}