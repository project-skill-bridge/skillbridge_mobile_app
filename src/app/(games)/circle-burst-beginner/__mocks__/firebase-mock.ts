// /**
//  * Firebase Authentication Mock
//  * 
//  * Simulates the auth() functionality with a mock user
//  */
// export const mockAuth = {
//   currentUser: {
//     uid: 'test-user-id',
//   },
// };

// /**
//  * Firebase Firestore Mock
//  * 
//  * Simulates Firestore's document/collection methods and serverTimestamp
//  */
// interface MockFirestore {
//   collection: jest.Mock<MockFirestore, []>;
//   doc: jest.Mock<MockFirestore, []>;
//   set: jest.Mock<Promise<void>, []>;
//   FieldValue: {
//     serverTimestamp: jest.Mock<string, []>;
//   };
// }

// export const mockFirestore: MockFirestore = {
//   // Collection method returns this same object for chaining
//   collection: jest.fn(() => mockFirestore),
  
//   // Doc method returns this same object for chaining
//   doc: jest.fn(() => mockFirestore),
  
//   // Set method returns a resolved promise
//   set: jest.fn(() => Promise.resolve()),
  
//   // Mock special Firebase server timestamp functionality
//   FieldValue: {
//     serverTimestamp: jest.fn(() => 'mock-server-timestamp'),
//   },
// };

// /**
//  * Helper method to reset all mock counts between tests
//  */
// export const resetFirebaseMocks = () => {
//   mockFirestore.collection.mockClear();
//   mockFirestore.doc.mockClear();
//   mockFirestore.set.mockClear();
//   mockFirestore.FieldValue.serverTimestamp.mockClear();
// };