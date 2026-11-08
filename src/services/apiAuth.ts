import { supabase } from "./supabase";

export interface AuthUser {
  id: number | string;
  email: string;
  created_at?: string;
}

const STORAGE_KEY = "booknoor-auth-user";

/**
 * Retrieves the stored user from localStorage or sessionStorage.
 */
export function getStoredUser(): AuthUser | null {
  try {
    const item =
      localStorage.getItem(STORAGE_KEY) ||
      sessionStorage.getItem(STORAGE_KEY);
    return item ? (JSON.parse(item) as AuthUser) : null;
  } catch {
    return null;
  }
}

/**
 * Saves authenticated user data to storage.
 */
export function saveStoredUser(user: AuthUser, remember: boolean = true): void {
  try {
    const serialized = JSON.stringify(user);
    if (remember) {
      localStorage.setItem(STORAGE_KEY, serialized);
      sessionStorage.removeItem(STORAGE_KEY);
    } else {
      sessionStorage.setItem(STORAGE_KEY, serialized);
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch (err) {
    console.error("Failed to save user session:", err);
  }
}

/**
 * Clears stored user from all storage.
 */
export function clearStoredUser(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error("Failed to clear user session:", err);
  }
}

/**
 * Authenticates a user with email and password using Supabase.
 * Checks the Supabase users table and Supabase Auth.
 */
export async function loginWithCredentials(
  email: string,
  password: string,
  remember: boolean = true,
): Promise<AuthUser> {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail || !password) {
    throw new Error("Please enter both email and password.");
  }

  // 1. Check custom "users" table
  const { data: userRecord, error: dbError } = await supabase
    .from("users")
    .select("id, email, password_hash, created_at")
    .eq("email", normalizedEmail)
    .maybeSingle();

  if (dbError) {
    console.error("Database query error:", dbError.message);
  }

  if (userRecord) {
    if (userRecord.password_hash !== password) {
      throw new Error("Incorrect password. Please try again.");
    }

    const authUser: AuthUser = {
      id: userRecord.id,
      email: userRecord.email,
      created_at: userRecord.created_at,
    };

    saveStoredUser(authUser, remember);

    // Optional background Supabase Auth sign in
    supabase.auth
      .signInWithPassword({ email: normalizedEmail, password })
      .catch(() => {});

    return authUser;
  }

  // 2. Fallback to Supabase Auth
  const { data: authData, error: authError } =
    await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

  if (authError || !authData.user) {
    throw new Error("Invalid email or password. Please check your credentials.");
  }

  const authUser: AuthUser = {
    id: authData.user.id,
    email: authData.user.email ?? normalizedEmail,
    created_at: authData.user.created_at,
  };

  saveStoredUser(authUser, remember);
  return authUser;
}

/**
 * Registers a new user.
 */
export async function signUpWithCredentials(
  email: string,
  password: string,
  remember: boolean = true,
): Promise<AuthUser> {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail || !password) {
    throw new Error("Please enter both email and password.");
  }

  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters long.");
  }

  // Check if user already exists
  const { data: existing } = await supabase
    .from("users")
    .select("id")
    .eq("email", normalizedEmail)
    .maybeSingle();

  if (existing) {
    throw new Error("An account with this email address already exists.");
  }

  // Try creating in Supabase Auth first
  const { data: authData } = await supabase.auth.signUp({
    email: normalizedEmail,
    password,
  });

  // Try inserting into custom users table
  const { data: newUser, error: insertError } = await supabase
    .from("users")
    .insert([{ email: normalizedEmail, password_hash: password }])
    .select("id, email, created_at")
    .single();

  if (insertError && !authData?.user) {
    throw new Error(insertError.message || "Failed to create account.");
  }

  const authUser: AuthUser = {
    id: newUser?.id ?? authData?.user?.id ?? `u-${Date.now()}`,
    email: newUser?.email ?? authData?.user?.email ?? normalizedEmail,
    created_at: newUser?.created_at ?? new Date().toISOString(),
  };

  saveStoredUser(authUser, remember);
  return authUser;
}

/**
 * Signs out the current user.
 */
export async function logout(): Promise<void> {
  clearStoredUser();
  await supabase.auth.signOut().catch(() => {});
}

export default {
  getStoredUser,
  saveStoredUser,
  clearStoredUser,
  loginWithCredentials,
  signUpWithCredentials,
  logout,
};
