import { AuthService } from './services/auth.js';

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const forgotPasswordBtn = document.getElementById('forgotPasswordBtn');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const result = await AuthService.login(email, password);
      if (result.success) {
        alert('Login realizado com sucesso! Redirecionando para o painel...');
        window.location.href = 'dashboard.html';
      } else {
        alert(result.message || 'Erro no login. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao realizar login:', error);
      alert('Erro ao realizar login. Verifique sua conexão.');
    }
  });

  forgotPasswordBtn.addEventListener('click', async () => {
    const email = prompt('Digite seu e-mail cadastrado:');
    if (email) {
      try {
        const result = await AuthService.forgotPassword(email);
        if (result.success) {
          alert('Uma senha provisória foi enviada para seu e-mail.');
        } else {
          alert(result.message || 'Erro ao processar solicitação');
        }
      } catch (error) {
        console.error('Erro ao processar solicitação:', error);
        alert('Erro ao processar solicitação');
      }
    }
  });
});