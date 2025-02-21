import { renderDashboard } from './views/dashboard.js';
import { renderFuncionarios } from './views/funcionarios.js';
import { renderEventos } from './views/eventos.js';
import { renderRelatorios } from './views/relatorios.js';
import { renderImportacao } from './views/importacao.js';
import { renderConfiguracoes } from './views/configuracoes.js';
import { renderSalarios } from './views/salarios.js';
import { renderBancoHoras } from './views/banco-horas.js';
import { AuthService } from './services/auth.js';

// Configuração de Armazenamento Local
class LocalStorageService {
  static saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  static getData(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  static initializeData() {
    const defaultData = {
      funcionarios: [],
      eventos: []
    };
    if (!localStorage.getItem('funcionarios')) {
      this.saveData('funcionarios', defaultData.funcionarios);
    }
    if (!localStorage.getItem('eventos')) {
      this.saveData('eventos', defaultData.eventos);
    }
  }
}

// Função para renderizar views
window.renderView = function(view) {
  const mainContent = document.getElementById('main-content');
  switch (view) {
    case 'dashboard':
      renderDashboard(mainContent);
      break;
    case 'funcionarios':
      renderFuncionarios(mainContent);
      break;
    case 'eventos':
      renderEventos(mainContent);
      break;
    case 'relatorios':
      renderRelatorios(mainContent);
      break;
    case 'importacao':
      renderImportacao(mainContent);
      break;
    case 'salarios':
      renderSalarios(mainContent);
      break;
    case 'configuracoes':
      renderConfiguracoes(mainContent);
      break;
    default:
      renderDashboard(mainContent);
  }
};

// Expor AuthService para o escopo global
window.AuthService = AuthService;

// Inicialização da Aplicação
document.addEventListener('DOMContentLoaded', () => {
  if (AuthService.isAuthenticated()) {
    LocalStorageService.initializeData();
    const urlParams = new URLSearchParams(window.location.search);
    const view = urlParams.get('view') || 'dashboard';
    renderView(view);
  } else {
    window.location.href = 'index.html'; // Redirect to login if not authenticated
  }
});

export { LocalStorageService };