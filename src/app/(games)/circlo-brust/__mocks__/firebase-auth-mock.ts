/**
 * Firebase Authentication Mock
 * 
 * Provides a mock implementation of the Firebase auth functionality for testing.
 * Simulates a logged-in user, auth state changes, and common auth methods.
 

// Mock user object
export const mockUser = {
    uid: 'test-user-123',
    email: 'test@example.com',
    displayName: 'Test User',
    photoURL: 'https://example.com/photo.jpg',
    emailVerified: true,
    phoneNumber: '+1234567890',
    isAnonymous: false,
    tenantId: null,
    providerData: [
      {
        providerId: 'password',
        uid: 'test@example.com',
        displayName: 'Test User',
        email: 'test@example.com',
        phoneNumber: '+1234567890',
        photoURL: 'https://example.com/photo.jpg',
      }
    ],
    metadata: {
      creationTime: '2023-01-01T00:00:00Z',
      lastSignInTime: '2023-03-01T00:00:00Z',
    },
    refreshToken: 'mock-refresh-token',
    getIdToken: jest.fn().mockResolvedValue('mock-id-token'),
    toJSON: jest.fn().mockReturnValue({}),
  };
  
  // Auth state listeners array
  const authStateListeners: Array<(user: typeof mockUser | null) => void> = [];
  
  // Auth error to simulate authentication failures
  let authError: Error | null = null;
  
  // Current auth state
  let isSignedIn = true;
  
  /**
   * Mock auth implementation
   
  export const mockAuth = {
    // Current user property
    currentUser: isSignedIn ? mockUser : null,
    
    // State management methods
    signOut: jest.fn().mockImplementation(() => {
      isSignedIn = false;
      mockAuth.currentUser = null;
      authStateListeners.forEach(listener => listener(null));
      return Promise.resolve();
    }),
    
    signInWithEmailAndPassword: jest.fn().mockImplementation((email, password) => {
      if (authError) {
        return Promise.reject(authError);
      }
      
      isSignedIn = true;
      mockAuth.currentUser = mockUser;
      authStateListeners.forEach(listener => listener(mockUser));
      return Promise.resolve({ user: mockUser });
    }),
    
    createUserWithEmailAndPassword: jest.fn().mockImplementation((email, password) => {
      if (authError) {
        return Promise.reject(authError);
      }
      
      isSignedIn = true;
      mockAuth.currentUser = mockUser;
      authStateListeners.forEach(listener => listener(mockUser));
      return Promise.resolve({ user: mockUser });
    }),
    
    // Observer methods
    onAuthStateChanged: jest.fn().mockImplementation(listener => {
      authStateListeners.push(listener);
      // Immediately call with current state
      listener(isSignedIn ? mockUser : null);
      
      // Return unsubscribe function
      return () => {
        const index = authStateListeners.indexOf(listener);
        if (index !== -1) {
          authStateListeners.splice(index, 1);
        }
      };
    }),
    
    // Helper methods for testing
    __setAuthError: (error: Error | null) => {
      authError = error;
    },
    
    __setSignedIn: (signedIn: boolean) => {
      isSignedIn = signedIn;
      mockAuth.currentUser = signedIn ? mockUser : null;
      
      // Notify all listeners about the change
      authStateListeners.forEach(listener => listener(mockAuth.currentUser));
    },
    
    // Additional auth methods
    sendPasswordResetEmail: jest.fn().mockResolvedValue(undefined),
    sendEmailVerification: jest.fn().mockResolvedValue(undefined),
    updateProfile: jest.fn().mockResolvedValue(undefined),
    updateEmail: jest.fn().mockResolvedValue(undefined),
    updatePassword: jest.fn().mockResolvedValue(undefined),
    deleteUser: jest.fn().mockResolvedValue(undefined),
  };
  
  /**
   * Factory function to mock the auth module
   * This structure matches how Firebase modules are typically imported and used
   
  const authMock = () => mockAuth;
  
  // Add special Jest mock properties
  authMock.mockClear = () => {
    mockAuth.signOut.mockClear();
    mockAuth.signInWithEmailAndPassword.mockClear();
    mockAuth.createUserWithEmailAndPassword.mockClear();
    mockAuth.onAuthStateChanged.mockClear();
    mockAuth.sendPasswordResetEmail.mockClear();
    mockAuth.sendEmailVerification.mockClear();
    mockAuth.updateProfile.mockClear();
    mockAuth.updateEmail.mockClear();
    mockAuth.updatePassword.mockClear();
    mockAuth.deleteUser.mockClear();
  };
  
  export default authMock; 
  */