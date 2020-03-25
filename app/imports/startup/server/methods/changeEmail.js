import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Email } from 'meteor/email';

Meteor.methods({
    changeEmail(email) {
        let userId =  Meteor.userId();
        if (userId) {
            if (email === Meteor.user().emails[0].address) {
                console.error("ERROR: unable to change email. "+ email +" is currently the user's email.");
            }
            else {
                console.log("Adding "+email+" to user "+Meteor.user().username);
                Accounts.addEmail(userId, email);
                console.log("Removing "+Meteor.user().emails[0].address+" from user "+Meteor.user().username);
                Accounts.removeEmail(userId, Meteor.user().emails[0].address);
            }
        }
    }
});