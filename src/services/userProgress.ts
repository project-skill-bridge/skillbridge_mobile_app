
import firebase from './firebase'; // Correct way to import default export

export const getUserProgress = async (userId: string) => {
  try {
    const docRef = firebase.firestore()
      .collection('users')
      .doc(userId)
      .collection('progress')
      .doc('gameProgress');

    const docSnap = await docRef.get();

    if (docSnap.exists) {
      return docSnap.data();
    } else {
      console.log('No progress data found');
      return null;
    }
  } catch (error) {
    console.error('Error fetching progress:', error);
    return null;
  }
};
