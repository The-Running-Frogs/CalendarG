/* Code written by Sophia Kim */

import { Meteor } from 'meteor/meteor';
import { Profiles } from '/imports/api/profiles/Profiles';

/** Initialize the database with a default data document. */
function createProfile(firstName, lastName, birthday, owner) {
    console.log(`   Creating profile ${owner}.`);
    Profiles.insert({
        firstName: firstName,
        lastName: lastName,
        fullName: firstName+" "+lastName,
        birthday: birthday,
        owner: owner,
    });
}

/** Initialize the collection if empty. */
if (Profiles.find().count() === 0 ) {
    if (Meteor.settings.private.defaultProfiles) {
        console.log('Creating default profile(s)');
        Meteor.settings.private.defaultProfiles.map(({firstName, lastName, birthday, owner}) =>
            createProfile(firstName, lastName, birthday, owner));
    } else {
        console.log('Cannot initialize the database!  Please invoke meteor with a settings file.');
    }
}

/** This subscription publishes only the documents associated with the logged in user */
Meteor.publish('Profiles', function publish() {
    return Profiles.find();
});
