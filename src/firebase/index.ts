'use client';

import firebaseConfig from '../../firebase-applet-config.json';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

function buildFirebaseConfig() {
  const config = {
    ...firebaseConfig,
    // Explicitly grab all variables from .env.local
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || (firebaseConfig as any).apiKey || '',
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || (firebaseConfig as any).authDomain || '',
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || (firebaseConfig as any).projectId || '',
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || (firebaseConfig as any).storageBucket || `${firebaseConfig.projectId}.appspot.com`,
  };

  // DEBUGGING: This will print your key in the browser console so we can verify it!
  console.log("FIREBASE SETUP CHECK:", {
    keyExists: !!config.apiKey,
    keyStarts_with: config.apiKey ? config.apiKey.substring(0, 6) : "MISSING",
    authDomain: config.authDomain
  });

  return config;
}

export function initializeFirebase() {
  if (!getApps().length) {
    // Force it to use our explicit config instead of guessing
    const config = buildFirebaseConfig();
    const firebaseApp = initializeApp(config);
    return getSdks(firebaseApp);
  }
  return getSdks(getApp());
}

export function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId || '(default)'),
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';