// Runs before every test file so modules that import @/firebase can evaluate.
// Real values live in .env.local, which Vitest does not load into process.env.
process.env.NEXT_PUBLIC_FIREBASE_API_KEY ??= "test-api-key"
process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ??= "test-project.firebaseapp.com"
process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ??= "test-project"
process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ??= "test-project.appspot.com"
process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ??= "0"
process.env.NEXT_PUBLIC_FIREBASE_APP_ID ??= "1:0:web:test"
