// Firebase client initialization
// Supports both real Firebase and mock fallback for local testing

const useMock = process.env.NEXT_PUBLIC_USE_MOCK_FIREBASE === 'true'

let firebase

if (useMock) {
  // Use mock Firebase for local development/testing
  firebase = require('./firebaseClientMock.js')
} else {
  // Use real Firebase with try-catch fallback
  try {
    const app = require('firebase/compat/app').default
    require('firebase/compat/auth')
    require('firebase/compat/database')
    require('firebase/compat/storage')

    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`
    }

    if (!app.apps.length) {
      app.initializeApp(firebaseConfig)
    }

    firebase = app
  } catch (error) {
    console.error('Firebase initialization failed, falling back to mock:', error.message)
    // Fallback to mock
    firebase = require('./firebaseClientMock.js')
  }
}

module.exports = firebase
