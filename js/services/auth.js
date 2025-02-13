export class AuthService {
  static async login(email, password) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      return { success: true };
    }
    return { success: false, message: 'Credenciais inválidas' };
  }

  static async register(name, email, password) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some(u => u.email === email)) {
      return { success: false, message: 'E-mail já cadastrado' };
    }

    const newUser = { name, email, password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    return { success: true };
  }

  static async forgotPassword(email) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email);

    if (!user) {
      return { success: false, message: 'E-mail não encontrado' };
    }

    const tempPassword = Math.random().toString(36).slice(-6);
    user.password = tempPassword;
    const updatedUsers = users.map(u => u.email === email ? user : u);
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    alert(`Sua senha temporária é: ${tempPassword}`);

    return { success: true };
  }

  static logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
  }

  static getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
  }

  static isAuthenticated() {
    return !!localStorage.getItem('currentUser');
  }
}