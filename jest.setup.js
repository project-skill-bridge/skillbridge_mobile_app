/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-undef */

jest.mock("@react-native-google-signin/google-signin", () => ({
    GoogleSignin: {
      hasPlayServices: jest.fn().mockResolvedValue(true),
      signIn: jest.fn().mockResolvedValue({
        data: {
          idToken: "mock-id-token",
        },
        user: {
          email: "mock@example.com",
        },
      }),
    },
  }));
  
  jest.mock("@react-native-firebase/auth", () => ({
    __esModule: true,
    default: () => ({
      signInWithCredential: jest.fn().mockResolvedValue({
        user: {
          uid: "mock-uid",
          displayName: "Mock User",
          email: "mock@example.com",
        },
        additionalUserInfo: {
          isNewUser: true,
        },
      }),
    }),
    GoogleAuthProvider: {
      credential: jest.fn(() => "mock-google-credential"),
    },
  }));
  
  jest.mock("@react-native-firebase/firestore", () => ({
    __esModule: true,
    default: () => ({
      collection: jest.fn(() => ({
        doc: jest.fn(() => ({
          set: jest.fn().mockResolvedValue(undefined),
        })),
      })),
    }),
    FieldValue: {
      serverTimestamp: jest.fn(),
    },
  }));
  
  jest.mock("@react-native-async-storage/async-storage", () =>
    require("@react-native-async-storage/async-storage/jest/async-storage-mock")
  );
  