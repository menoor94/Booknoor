import { supabase } from "./supabase";

export interface UserRecord {
  id: number | string;
  email: string;
  password_hash?: string;
  created_at?: string;
}

export interface NewUserInput {
  email: string;
  password_hash?: string;
  password?: string;
}

/**
 * Fetches all registered users from the Supabase "users" table.
 */
export async function getUsers(): Promise<UserRecord[]> {
  const { data, error } = await supabase
    .from("users")
    .select("id, email, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching users from Supabase:", error.message);
    throw new Error(error.message);
  }

  return data ?? [];
}

/**
 * Retrieves a user by their ID from the "users" table.
 */
export async function getUserById(
  id: number | string,
): Promise<UserRecord | null> {
  const { data, error } = await supabase
    .from("users")
    .select("id, email, created_at")
    .eq("id", id)
    .single();

  if (error) {
    console.error(`Error fetching user ${id}:`, error.message);
    throw new Error(error.message);
  }

  return data;
}

/**
 * Retrieves a user by their email address from the "users" table.
 */
export async function getUserByEmail(
  email: string,
): Promise<UserRecord | null> {
  const { data, error } = await supabase
    .from("users")
    .select("id, email, created_at")
    .eq("email", email.trim().toLowerCase())
    .maybeSingle();

  if (error) {
    console.error(`Error fetching user with email ${email}:`, error.message);
    throw new Error(error.message);
  }

  return data;
}

/**
 * Adds a new user record to the Supabase "users" table.
 */
export async function addNewUser(user: NewUserInput): Promise<UserRecord> {
  const payload: { email: string; password_hash?: string } = {
    email: user.email.trim().toLowerCase(),
  };

  if (user.password_hash) {
    payload.password_hash = user.password_hash;
  } else if (user.password) {
    payload.password_hash = user.password;
  }

  const { data, error } = await supabase
    .from("users")
    .insert([payload])
    .select("id, email, created_at")
    .single();

  if (error) {
    console.error("Error adding user to Supabase:", error.message);
    throw new Error(error.message);
  }

  return data;
}

/**
 * Deletes a user by ID from the "users" table.
 */
export async function deleteUser(id: number | string): Promise<void> {
  const { error } = await supabase.from("users").delete().eq("id", id);

  if (error) {
    console.error(`Error deleting user ${id}:`, error.message);
    throw new Error(error.message);
  }
}

export default {
  getUsers,
  getUserById,
  getUserByEmail,
  addNewUser,
  deleteUser,
};
