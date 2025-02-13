import { AuthService } from './services/auth.js';

document.addEventListener('DOMContentLoaded', () => {
    const resetPasswordForm = document.getElementById('resetPasswordForm');

    // Check if user is authenticated with temporary password
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) {
        alert('Você precisa estar logado para redefinir a senha');
        window.location.href = 'index.html';
        return;
    }

    resetPasswordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (newPassword !== confirmPassword) {
            alert('As senhas não coincidem');
            return;
        }

        if (newPassword.length < 6) {
            alert('A senha deve ter no mínimo 6 caracteres');
            return;
        }

        // Update user password
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const updatedUsers = users.map(user => 
            user.email === currentUser.email 
                ? { ...user, password: newPassword } 
                : user
        );
        
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        
        // Update current user
        currentUser.password = newPassword;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        alert('Senha redefinida com sucesso!');
        window.location.href = 'dashboard.html';
    });
});