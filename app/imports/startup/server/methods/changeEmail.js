import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Email } from 'meteor/email';

Meteor.methods({
    changeEmail(email) {
        let userId =  Meteor.userId();
        if (userId) {
            if (email === Meteor.user().emails[0].address) {
                console.error("ERROR: Unable to change email. This is currently the user's email.");
            }
            else {
                Accounts.addEmail(userId, email);
                Accounts.removeEmail(userId, Meteor.user().emails[0].address);
            }
        }
    }
});