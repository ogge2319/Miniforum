import * as userService from '../services/userService';

export function useAuth() {
  const login = async ({ email, password }) => {
    return await userService.login({ email, password });
  };

  const register = async ({ name, email, password }) => {
    return await userService.register({ name, email, password });
  };

  return { login, register };
}
