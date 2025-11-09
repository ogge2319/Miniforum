import {
  login as loginApi,
  register as registerApi
} from '../api/auth';

export function useAuth() {
  const login = async ({ email, password }) => {
    return await loginApi(email, password);
  };

  const register = async ({ name, email, password }) => {
    return await registerApi(email, password, name);
  };

  return { login, register };
}
