/* Changes made by Keanu Williams */

import '/imports/startup/server/Accounts';
import '/imports/startup/server/Emails';
import '/imports/startup/server/Mongo';
import '/imports/startup/server/Publications';
import '/imports/startup/server/Profiles';
import '/imports/startup/server/methods/sendVerificationEmail.js';
import '/imports/startup/server/methods/changeEmail.js';

process.env.MAIL_URL = Meteor.settings.private.env.MAIL_URL;
