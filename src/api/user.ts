import axios, { endpoints } from '@/lib/axios';
import { mutate } from 'swr';

// Define interfaces for user-related data
interface User {
  id: string;
  name: string;
  email: string;
  // Add other user properties here
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface ForgotPasswordData {
  email: string;
}

interface ResetPasswordData {
  token: string;
  password: string;
}

// Function to register a new user
export async function register(data: RegisterData): Promise<User> {
  const res = await axios.post(endpoints.auth.register, data);
  return res.data;
}

// Function to login a user
export async function login(data: LoginData): Promise<User> {
  const res = await axios.post(endpoints.auth.login, data);
  return res.data;
}

// Function to handle forgot password
export async function forgotPassword(data: ForgotPasswordData): Promise<void> {
  await axios.post(endpoints.auth.forgotPassword, data);
}

// Function to get the current user
export async function me(): Promise<User> {
  const res = await axios.get(endpoints.auth.me);
  return res.data;
}

// Function to reset password
export async function resetPassword(data: ResetPasswordData): Promise<void> {
  await axios.post(endpoints.auth.resetPassword, data);
}

// Optionally, you can use `mutate` to update local state after certain actions
export async function updateUserCache() {
  const user = await me();
  mutate(endpoints.auth.me, user, false);
}