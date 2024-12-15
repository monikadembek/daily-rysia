/* eslint-disable object-curly-spacing */
/* eslint-disable quotes */

import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

admin.initializeApp({
  credential: admin.credential.cert(
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('../ang-tictactoe-firebase-adminsdk-wwqq0-c1bebd450e.json'),
  ),
});

/**
 * Cloud Function to assign the "admin" role to a user.
 * This function can only be called by existing admin users.
 */
export const setAdminRole = functions.https.onCall(async (request) => {
  // Security check: Ensure the caller is authenticated
  if (!request.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'You must be authenticated to call this function.',
    );
  }

  // // Security check: Ensure the caller has the admin claim
  if (!request.auth.token.admin) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'You must be an admin to assign roles.',
    );
  }

  // Validate the request data
  const userId = request.data.uid;
  if (!userId || typeof userId !== 'string') {
    throw new functions.https.HttpsError(
      'invalid-argument',
      "The 'uid' field must be a valid string.",
    );
  }

  try {
    // Set custom claims for the target user
    await admin.auth().setCustomUserClaims(userId, { admin: true });

    return {
      message: `Admin role has been assigned to user ${userId}.`,
      success: true,
    };
  } catch (error) {
    console.error('Error assigning admin role:', error);
    throw new functions.https.HttpsError(
      'internal',
      'An error occurred while assigning the admin role.',
    );
  }
});
