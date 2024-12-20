/* eslint-disable max-len */
/* eslint-disable object-curly-spacing */

import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as path from 'path';
import { v4 as uuid } from 'uuid';

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
      // eslint-disable-next-line quotes
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
export const sendPhotoNotification = functions.firestore.onDocumentCreated(
  'photos/{photoId}',
  async (event) => {
    // const snapshot = event.data;
    const photoId = event.params.photoId;
    // const photoData = snapshot?.data();

    // Get all user tokens
    const tokensSnapshot = await admin.firestore().collection('user_push_tokens').get();

    const tokens: string[] = [];
    tokensSnapshot.forEach((doc) => {
      tokens.push(doc.data().token);
    });

    if (tokens.length === 0) {
      console.log('No tokens to send notifications to');
      return;
    }

    const message = {
      notification: {
        title: 'New Photo Added',
        body: 'A new photo has been added to the gallery!',
      },
      data: {
        photoId: photoId,
        // Add any additional data you want to send
      },
      tokens: tokens,
    };

    try {
      const response = await admin.messaging().sendEachForMulticast(message);
      console.log(`Successfully sent notifications: ${response.successCount}/${tokens.length}`);

      // Remove invalid tokens
      if (response.failureCount > 0) {
        const invalidTokens: unknown[] = [];
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            invalidTokens.push(tokens[idx]);
          }
        });

        // Remove invalid tokens from your database
        for (const invalidToken of invalidTokens) {
          await admin
            .firestore()
            .collection('user_push_tokens')
            .where('token', '==', invalidToken)
            .get()
            .then((snapshot) => {
              snapshot.forEach((doc) => doc.ref.delete());
            });
        }
      }
    } catch (error) {
      console.error('Error sending notifications:', error);
    }
  },
);

// needs fix
export const uploadImage = functions.https.onCall(async (request) => {
  if (!request.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }
  try {
    const id = uuid();
    const bucket = admin.storage().bucket('ang-tictactoe.firebasestorage.app');
    const fileName = `${Date.now()}_${path.basename(request.data.fileName)}`;
    const file = bucket.file(`images/${fileName}`);

    const writeStream = file.createWriteStream({
      metadata: {
        contentType: request.data.contentType,
        firebaseStorageDownloadTokens: id,
      },
    });

    const buffer = Buffer.from(request.data.base64Data, 'base64');
    writeStream.end(buffer);

    await new Promise((resolve, reject) => {
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/images/${fileName}`;
    const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/images/${encodeURIComponent(fileName)}?alt=media&token=${id}`;

    return {
      message: 'Image uploaded successfully',
      url: publicUrl,
      imageUrl,
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new functions.https.HttpsError('internal', 'Error uploading image');
  }
});
