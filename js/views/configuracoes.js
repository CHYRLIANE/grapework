import { LocalStorageService } from '../app.js';

export function renderConfiguracoes(container) {
  container.innerHTML = `
    <div class="container-fluid">
      <h1 class="mt-4">Configurações - GrapeWork</h1>
      
      <!-- Tipos de Eventos -->
      <div class="card mb-4">
        <div class="card-header">
          <h4>Tipos de Eventos</h4>
        </div>
        <div class="card-body">
          <form id="eventoForm" class="mb-3">
            <div class="row">
              <div class="col-md-4">
                <input type="text" class="form-control" id="novoEvento" placeholder="Nome do novo tipo de evento">
              </div>
              <div class="col-md-4">
                <select class="form-control" id="corEvento">
                  <option value="primary">Azul</option>
                  <option value="success">Verde</option>
                  <option value="danger">Vermelho</option>
                  <option value="warning">Amarelo</option>
                  <option value="info">Ciano</option>
                </select>
              </div>
              <div class="col-md-4">
                <button type="submit" class="btn btn-primary">
                  <i class="bi bi-plus-circle"></i> Adicionar Evento
                </button>
              </div>
            </div>
          </form>
          
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>Tipo de Evento</th>
                  <th>Cor</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody id="eventosTableBody"></tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Campos Personalizados -->
      <div class="card mb-4">
        <div class="card-header">
          <h4>Campos Personalizados do Funcionário</h4>
        </div>
        <div class="card-body">
          <form id="campoForm" class="mb-3">
            <div class="row">
              <div class="col-md-3">
                <input type="text" class="form-control" id="nomeCampo" placeholder="Nome do campo">
              </div>
              <div class="col-md-3">
                <select class="form-control" id="tipoCampo">
                  <option value="text">Texto</option>
                  <option value="number">Número</option>
                  <option value="date">Data</option>
                  <option value="select">Lista de Seleção</option>
                  <option value="checkbox">Caixa de Seleção</option>
                </select>
              </div>
              <div class="col-md-3">
                <select class="form-control" id="secaoCampo">
                  <option value="dadosBasicos">Dados Básicos</option>
                  <option value="dadosPessoais">Dados Pessoais</option>
                  <option value="contato">Contato</option>
                  <option value="dadosFuncionais">Dados Funcionais</option>
                  <option value="infoAdicionais">Informações Adicionais</option>
                </select>
              </div>
              <div class="col-md-3">
                <button type="submit" class="btn btn-primary">
                  <i class="bi bi-plus-circle"></i> Adicionar Campo
                </button>
              </div>
            </div>
            <div class="row mt-3" id="opcoesContainer" style="display:none;">
              <div class="col">
                <input type="text" class="form-control" id="opcoesCampo" 
                  placeholder="Opções (separadas por vírgula)">
              </div>
            </div>
          </form>

          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>Nome do Campo</th>
                  <th>Tipo</th>
                  <th>Seção</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody id="camposTableBody"></tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Configurações de Notificações -->
      <div class="card mb-4">
        <div class="card-header">
          <h4>Configurações de Notificações</h4>
        </div>
        <div class="card-body">
          <form id="notificacoesForm">
            <div class="row">
              <div class="col-md-6">
                <h5>Lembretes de Férias</h5>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="ferias30dias" checked>
                  <label class="form-check-label">30 dias antes</label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="ferias15dias" checked>
                  <label class="form-check-label">15 dias antes</label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="ferias7dias" checked>
                  <label class="form-check-label">7 dias antes</label>
                </div>
              </div>
              
              <div class="col-md-6">
                <h5>Outras Notificações</h5>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="notifAniversarios" checked>
                  <label class="form-check-label">Aniversários</label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="notifAvaliacoes" checked>
                  <label class="form-check-label">Avaliações Periódicas</label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="notifBancoHoras" checked>
                  <label class="form-check-label">Banco de Horas Crítico</label>
                </div>
              </div>
            </div>
            
            <div class="row mt-3">
              <div class="col">
                <button type="submit" class="btn btn-primary">
                  <i class="bi bi-save"></i> Salvar Configurações
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;

  // Initialize event handlers and load data
  initializeEventosHandler();
  initializeCamposHandler();
  initializeNotificacoesHandler();
  loadEventosTable();
  loadCamposTable();
  loadNotificacoesConfig();

  // Show/hide opções field based on campo type
  document.getElementById('tipoCampo').addEventListener('change', (e) => {
    const opcoesContainer = document.getElementById('opcoesContainer');
    opcoesContainer.style.display = e.target.value === 'select' ? 'block' : 'none';
  });

  function initializeEventosHandler() {
    const eventoForm = document.getElementById('eventoForm');
    eventoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const novoEvento = document.getElementById('novoEvento').value;
      const corEvento = document.getElementById('corEvento').value;
      
      if (!novoEvento) return;

      const eventos = LocalStorageService.getData('tiposEventos') || [];
      eventos.push({ tipo: novoEvento, cor: corEvento });
      LocalStorageService.saveData('tiposEventos', eventos);

      loadEventosTable();
      eventoForm.reset();
    });
  }

  function initializeCamposHandler() {
    const campoForm = document.getElementById('campoForm');
    campoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nomeCampo = document.getElementById('nomeCampo').value;
      const tipoCampo = document.getElementById('tipoCampo').value;
      const secaoCampo = document.getElementById('secaoCampo').value;
      const opcoesCampo = document.getElementById('opcoesCampo').value;

      if (!nomeCampo) return;

      const campos = LocalStorageService.getData('camposPersonalizados') || [];
      campos.push({
        nome: nomeCampo,
        tipo: tipoCampo,
        secao: secaoCampo,
        opcoes: tipoCampo === 'select' ? opcoesCampo.split(',').map(opt => opt.trim()) : null
      });
      LocalStorageService.saveData('camposPersonalizados', campos);

      loadCamposTable();
      campoForm.reset();
    });
  }

  function initializeNotificacoesHandler() {
    const notificacoesForm = document.getElementById('notificacoesForm');
    notificacoesForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const config = {
        ferias: {
          dias30: document.getElementById('ferias30dias').checked,
          dias15: document.getElementById('ferias15dias').checked,
          dias7: document.getElementById('ferias7dias').checked
        },
        aniversarios: document.getElementById('notifAniversarios').checked,
        avaliacoes: document.getElementById('notifAvaliacoes').checked,
        bancoHoras: document.getElementById('notifBancoHoras').checked
      };

      LocalStorageService.saveData('configNotificacoes', config);
      alert('Configurações de notificações salvas com sucesso!');
    });
  }

  function loadEventosTable() {
    const eventos = LocalStorageService.getData('tiposEventos') || [];
    const tbody = document.getElementById('eventosTableBody');
    
    tbody.innerHTML = eventos.map((evento, index) => `
      <tr>
        <td>${evento.tipo}</td>
        <td>
          <span class="badge bg-${evento.cor}">${evento.tipo}</span>
        </td>
        <td>
          <button class="btn btn-sm btn-danger" onclick="removeEvento(${index})">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      </tr>
    `).join('');
  }

  function loadCamposTable() {
    const campos = LocalStorageService.getData('camposPersonalizados') || [];
    const tbody = document.getElementById('camposTableBody');
    
    tbody.innerHTML = campos.map((campo, index) => `
      <tr>
        <td>${campo.nome}</td>
        <td>${campo.tipo}</td>
        <td>${campo.secao}</td>
        <td>
          <button class="btn btn-sm btn-danger" onclick="removeCampo(${index})">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      </tr>
    `).join('');
  }

  function loadNotificacoesConfig() {
    const config = LocalStorageService.getData('configNotificacoes') || {
      ferias: { dias30: true, dias15: true, dias7: true },
      aniversarios: true,
      avaliacoes: true,
      bancoHoras: true
    };

    document.getElementById('ferias30dias').checked = config.ferias.dias30;
    document.getElementById('ferias15dias').checked = config.ferias.dias15;
    document.getElementById('ferias7dias').checked = config.ferias.dias7;
    document.getElementById('notifAniversarios').checked = config.aniversarios;
    document.getElementById('notifAvaliacoes').checked = config.avaliacoes;
    document.getElementById('notifBancoHoras').checked = config.bancoHoras;
  }

  // Add global functions for remove buttons
  window.removeEvento = function(index) {
    if (confirm('Deseja realmente remover este tipo de evento?')) {
      const eventos = LocalStorageService.getData('tiposEventos') || [];
      eventos.splice(index, 1);
      LocalStorageService.saveData('tiposEventos', eventos);
      loadEventosTable();
    }
  };

  window.removeCampo = function(index) {
    if (confirm('Deseja realmente remover este campo personalizado?')) {
      const campos = LocalStorageService.getData('camposPersonalizados') || [];
      campos.splice(index, 1);
      LocalStorageService.saveData('camposPersonalizados', campos);
      loadCamposTable();
    }
  };
}