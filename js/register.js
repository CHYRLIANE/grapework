import { AuthService } from './services/auth.js';

document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');

  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    try {
      const result = await AuthService.register(name, email, password);
      if (result.success) {
        alert('Usuário registrado com sucesso!');
        window.location.href = 'index.html';
      } else {
        alert(result.message || 'Erro ao registrar');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Erro ao registrar');
    }
  });
});