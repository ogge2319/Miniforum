export const login = async ({ email, password }) => {
    // Mock example:
    if (email === 'test@test.com' && password === '1234') {
      return { user: { email, name: 'Test' } };
    } else {
      throw new Error('Fel e-post eller lösenord');
    }
  };
  
  export const register = async ({ name, email, password }) => {
    // Mock example:
    if (!name || !email || !password) throw new Error('Fyll i alla fält');
    return { user: { name, email } };
  };
  