import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Profiles } from '/imports/api/profiles/Profiles';
import PropTypes from "prop-types";

Accounts.emailTemplates.siteName = "calendarG";
Accounts.emailTemplates.from     = "Frog Admin <therunningfrogs.biz@gmail.com>";

Accounts.emailTemplates.verifyEmail = {
    subject() {
        return "[calendarG] Verify Your Email Address";
    },
    text( user, url ) {
        let emailAddress   = user.emails[0].address,
            userProfile    = Profiles.findOne({ owner: Meteor.user().username }),
            supportEmail   = "therunningfrogs.biz@gmail.com",
            emailBody      = `Hello ${userProfile.firstName}!\n\nTo verify your email address (${emailAddress}) visit the following link: \n\n${url}\n\nIf you did not request this verification, please ignore this email. If you feel something is wrong, please contact our support team: ${supportEmail}.\n\nThank you for using calendarG!\n\nSincerely,\nFrog Admin`;

        return emailBody;
    }
};

Accounts.onEmailVerificationLink = function() {
    Meteor.user().emails[0].verified = true;
};