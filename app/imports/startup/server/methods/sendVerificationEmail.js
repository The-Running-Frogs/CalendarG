/* Code written by Keanu Williams */

import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Email } from 'meteor/email';

Meteor.methods({
    sendVerificationLink() {
        let userId = Meteor.userId();
        if ( userId ) {
            Accounts.sendVerificationEmail(userId);
            console.log("Email verification for user "+Meteor.user().username+ " sent to email "+Meteor.user().emails[0].address);
        }
    }
});
