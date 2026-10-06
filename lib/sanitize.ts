// Credentials never belong in Firestore — Firebase Auth is the only store for them.
export function sanitizeUserData<T extends object>(userData: T): Omit<T, "password" | "confirmPassword"> {
  const { password, confirmPassword, ...clean } = userData as T & {
    password?: unknown
    confirmPassword?: unknown
  }
  return clean
}
