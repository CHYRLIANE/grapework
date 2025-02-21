import { LocalStorageService } from '../app.js';

export function renderConfiguracoes(container) {
  const existingConfigSections = `
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

    <!-- New Alert Criteria Section with Automated Actions -->
    <div class="card mb-4">
        <div class="card-header">
            <h4>Critérios de Alertas e Ações Automatizadas</h4>
        </div>
        <div class="card-body">
            <form id="alertCriteriaForm">
                <!-- Absence Alert -->
                <div class="mb-4">
                    <h5>Alertas de Ausência</h5>
                    <div class="row">
                        <div class="col-md-6">
                            <label class="form-label">Percentual de Faltas</label>
                            <div class="input-group">
                                <input type="number" class="form-control" id="absencePercentage" 
                                    min="1" max="100" value="10">
                                <span class="input-group-text">%</span>
                            </div>
                            <small class="text-muted">
                                Gerar alerta quando o percentual de faltas ultrapassar este valor
                            </small>
                        </div>
                        <div class="col-md-6">
                            <div class="form-check mt-4">
                                <input class="form-check-input" type="checkbox" id="absenceAlertEnabled" checked>
                                <label class="form-check-label">Ativar alerta de ausência</label>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Overtime Alert -->
                <div class="mb-4">
                    <h5>Alertas de Horas Extras</h5>
                    <div class="row">
                        <div class="col-md-6">
                            <label class="form-label">Limite de Horas Extras</label>
                            <div class="input-group">
                                <input type="number" class="form-control" id="overtimeLimit" 
                                    min="1" value="20">
                                <span class="input-group-text">horas</span>
                            </div>
                            <small class="text-muted">
                                Gerar alerta quando as horas extras ultrapassarem este valor
                            </small>
                        </div>
                        <div class="col-md-6">
                            <div class="form-check mt-4">
                                <input class="form-check-input" type="checkbox" id="overtimeAlertEnabled" checked>
                                <label class="form-check-label">Ativar alerta de horas extras</label>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Late Arrival Alert -->
                <div class="mb-4">
                    <h5>Alertas de Atrasos</h5>
                    <div class="row">
                        <div class="col-md-6">
                            <label class="form-label">Número de Atrasos</label>
                            <div class="input-group">
                                <input type="number" class="form-control" id="lateArrivalLimit" 
                                    min="1" value="3">
                                <span class="input-group-text">atrasos em</span>
                                <select class="form-control" id="lateArrivalPeriod">
                                    <option value="week">uma semana</option>
                                    <option value="month">um mês</option>
                                </select>
                            </div>
                            <small class="text-muted">
                                Gerar alerta quando os atrasos ultrapassarem este valor no período
                            </small>
                        </div>
                        <div class="col-md-6">
                            <div class="form-check mt-4">
                                <input class="form-check-input" type="checkbox" id="lateArrivalAlertEnabled" checked>
                                <label class="form-check-label">Ativar alerta de atrasos</label>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Analysis Period -->
                <div class="mb-4">
                    <h5>Período de Análise</h5>
                    <div class="row">
                        <div class="col-md-6">
                            <select class="form-control" id="analysisPeriod">
                                <option value="7">Últimos 7 dias</option>
                                <option value="30" selected>Últimos 30 dias</option>
                                <option value="90">Últimos 3 meses</option>
                                <option value="365">Último ano</option>
                                <option value="custom">Intervalo personalizado</option>
                            </select>
                        </div>
                        <div class="col-md-6 custom-period" style="display: none;">
                            <div class="row">
                                <div class="col">
                                    <input type="date" class="form-control" id="customPeriodStart">
                                </div>
                                <div class="col">
                                    <input type="date" class="form-control" id="customPeriodEnd">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- New Automated Actions Section -->
                <div class="mb-4">
                    <h5>Ações Automatizadas</h5>
                    <div class="alert alert-info">
                        <i class="bi bi-info-circle"></i> 
                        Configure ações automáticas para dias com alta incidência de eventos
                    </div>
                    
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label class="form-label">Limite para Ações Automáticas</label>
                            <div class="input-group">
                                <input type="number" class="form-control" id="autoActionThreshold" 
                                    min="1" max="100" value="60">
                                <span class="input-group-text">% de eventos</span>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-check mt-4">
                                <input class="form-check-input" type="checkbox" id="autoActionsEnabled" checked>
                                <label class="form-check-label">Ativar ações automáticas</label>
                            </div>
                        </div>
                    </div>

                    <div class="row mb-3">
                        <div class="col-md-12">
                            <h6>Ações a serem executadas:</h6>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="actionReforceTeam" checked>
                                <label class="form-check-label">Sugerir reforço de equipe</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="actionAdjustSchedule" checked>
                                <label class="form-check-label">Sugerir ajuste de escala</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="actionNotifyManagers" checked>
                                <label class="form-check-label">Notificar gestores</label>
                            </div>
                        </div>
                    </div>

                    <!-- Pattern Analysis by Sector -->
                    <div class="mb-4">
                        <h5>Análise de Padrões por Setor</h5>
                        <div class="table-responsive">
                            <table class="table" id="sectorPatternTable">
                                <thead>
                                    <tr>
                                        <th>Setor</th>
                                        <th>Eventos Críticos</th>
                                        <th>Dias Críticos</th>
                                        <th>Funcionários em Atenção</th>
                                    </tr>
                                </thead>
                                <tbody id="sectorPatternTableBody"></tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <button type="submit" class="btn btn-primary">
                    <i class="bi bi-save"></i> Salvar Configurações de Alertas
                </button>
            </form>
        </div>
    </div>

    <!-- Alert History -->
    <div class="card mb-4">
        <div class="card-header">
            <h4>Histórico de Alertas</h4>
        </div>
        <div class="card-body">
            <div class="table-responsive">
                <table class="table" id="alertHistoryTable">
                    <thead>
                        <tr>
                            <th>Data/Hora</th>
                            <th>Tipo</th>
                            <th>Descrição</th>
                            <th>Critério</th>
                        </tr>
                    </thead>
                    <tbody id="alertHistoryTableBody"></tbody>
                </table>
            </div>
        </div>
    </div>
`;

  container.innerHTML = `
    <div class="container-fluid">
      <h1 class="mt-4">Configurações - GrapeWork</h1>
      
      <!-- Setores -->
      <div class="card mb-4">
        <div class="card-header">
          <h4>Gestão de Setores</h4>
        </div>
        <div class="card-body">
          <form id="setorForm" class="mb-3">
            <div class="row">
              <div class="col-md-8">
                <input type="text" class="form-control" id="novoSetor" placeholder="Nome do novo setor">
              </div>
              <div class="col-md-4">
                <button type="submit" class="btn btn-primary">
                  <i class="bi bi-plus-circle"></i> Adicionar Setor
                </button>
              </div>
            </div>
          </form>
          
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>Setor</th>
                  <th>Funcionários</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody id="setoresTableBody"></tbody>
            </table>
          </div>
        </div>
      </div>

      ${existingConfigSections}
    </div>
  `;

  // Initialize event handlers and load data
  initializeSetoresHandler();
  initializeEventosHandler();
  initializeCamposHandler();
  initializeNotificacoesHandler();
  initializeAlertCriteria();
  loadEventosTable();
  loadCamposTable();
  loadNotificacoesConfig();

  // Show/hide opções field based on campo type
  document.getElementById('tipoCampo').addEventListener('change', (e) => {
    const opcoesContainer = document.getElementById('opcoesContainer');
    opcoesContainer.style.display = e.target.value === 'select' ? 'block' : 'none';
  });
}

function initializeSetoresHandler() {
  const setorForm = document.getElementById('setorForm');
  const setoresTableBody = document.getElementById('setoresTableBody');

  function loadSetoresTable() {
    const setores = LocalStorageService.getData('setores') || [];
    const funcionarios = LocalStorageService.getData('funcionarios') || [];

    setoresTableBody.innerHTML = setores.map(setor => {
      const funcionariosCount = funcionarios.filter(f => f.setor === setor).length;
      
      return `
        <tr>
          <td>${setor}</td>
          <td>${funcionariosCount}</td>
          <td>
            <div class="btn-group">
              <button class="btn btn-sm btn-danger delete-setor" data-setor="${setor}"
                      ${funcionariosCount > 0 ? 'disabled title="Setor em uso"' : ''}>
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    // Add delete event listeners
    document.querySelectorAll('.delete-setor').forEach(btn => {
      if (!btn.disabled) {
        btn.addEventListener('click', () => deleteSetor(btn.dataset.setor));
      }
    });
  }

  setorForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const novoSetorInput = document.getElementById('novoSetor');
    const novoSetor = novoSetorInput.value.trim();
    
    if (!novoSetor) return;

    const setores = LocalStorageService.getData('setores') || [];
    
    if (setores.includes(novoSetor)) {
      alert('Este setor já existe!');
      return;
    }

    setores.push(novoSetor);
    LocalStorageService.saveData('setores', setores);
    
    novoSetorInput.value = '';
    loadSetoresTable();
  });

  function deleteSetor(setor) {
    if (confirm(`Tem certeza que deseja excluir o setor "${setor}"?`)) {
      const setores = LocalStorageService.getData('setores') || [];
      const index = setores.indexOf(setor);
      if (index > -1) {
        setores.splice(index, 1);
        LocalStorageService.saveData('setores', setores);
        loadSetoresTable();
      }
    }
  }

  // Initial load
  loadSetoresTable();
}

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

function initializeAlertCriteria() {
    const alertCriteriaForm = document.getElementById('alertCriteriaForm');
    const analysisPeriod = document.getElementById('analysisPeriod');
    const customPeriod = document.querySelector('.custom-period');

    // Show/hide custom period inputs
    analysisPeriod.addEventListener('change', () => {
      customPeriod.style.display = 
        analysisPeriod.value === 'custom' ? 'block' : 'none';
    });

    // Save enhanced alert criteria
    alertCriteriaForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const alertCriteria = {
            absence: {
                enabled: document.getElementById('absenceAlertEnabled').checked,
                percentage: document.getElementById('absencePercentage').value
            },
            overtime: {
                enabled: document.getElementById('overtimeAlertEnabled').checked,
                limit: document.getElementById('overtimeLimit').value
            },
            lateArrival: {
                enabled: document.getElementById('lateArrivalAlertEnabled').checked,
                limit: document.getElementById('lateArrivalLimit').value,
                period: document.getElementById('lateArrivalPeriod').value
            },
            analysisPeriod: {
                type: analysisPeriod.value,
                customStart: document.getElementById('customPeriodStart').value,
                customEnd: document.getElementById('customPeriodEnd').value
            },
            automatedActions: {
                enabled: document.getElementById('autoActionsEnabled').checked,
                threshold: document.getElementById('autoActionThreshold').value,
                actions: {
                    reinforceTeam: document.getElementById('actionReforceTeam').checked,
                    adjustSchedule: document.getElementById('actionAdjustSchedule').checked,
                    notifyManagers: document.getElementById('actionNotifyManagers').checked
                }
            }
        };

        LocalStorageService.saveData('alertCriteria', alertCriteria);
        generateEnhancedAlerts(alertCriteria);
        alert('Configurações de alertas salvas com sucesso!');
    });

    // Load saved enhanced criteria
    const savedCriteria = LocalStorageService.getData('alertCriteria');
    if (savedCriteria?.automatedActions) {
        document.getElementById('autoActionsEnabled').checked = savedCriteria.automatedActions.enabled;
        document.getElementById('autoActionThreshold').value = savedCriteria.automatedActions.threshold;
        document.getElementById('actionReforceTeam').checked = savedCriteria.automatedActions.actions.reinforceTeam;
        document.getElementById('actionAdjustSchedule').checked = savedCriteria.automatedActions.actions.adjustSchedule;
        document.getElementById('actionNotifyManagers').checked = savedCriteria.automatedActions.actions.notifyManagers;
    }

    // Initial enhanced alerts generation
    generateEnhancedAlerts(savedCriteria);
    updateSectorPatternAnalysis();
}

function generateEnhancedAlerts(criteria) {
    if (!criteria) return;

    const funcionarios = LocalStorageService.getData('funcionarios') || [];
    const eventos = LocalStorageService.getData('eventos') || [];
    const alerts = [];

    // Analyze patterns by day of week
    const eventsByDay = analyzeDayPatterns(eventos);
    
    // Generate automated action alerts
    if (criteria.automatedActions?.enabled) {
        Object.entries(eventsByDay).forEach(([day, data]) => {
            const percentage = (data.count / eventos.length) * 100;
            if (percentage >= criteria.automatedActions.threshold) {
                const actions = [];
                if (criteria.automatedActions.actions.reinforceTeam) {
                    actions.push('Reforço de equipe recomendado');
                }
                if (criteria.automatedActions.actions.adjustSchedule) {
                    actions.push('Ajuste de escala necessário');
                }

                alerts.push({
                    timestamp: new Date(),
                    type: 'Ação Automática',
                    description: `${day}: ${percentage.toFixed(1)}% dos eventos. Ações recomendadas: ${actions.join(', ')}`,
                    criteria: `Limite: ${criteria.automatedActions.threshold}%`,
                    sector: getMostAffectedSector(eventos, data.events)
                });
            }
        });
    }

    // Save and display enhanced alerts
    const existingAlerts = LocalStorageService.getData('alertHistory') || [];
    const updatedAlerts = [...alerts, ...existingAlerts].slice(0, 100);
    LocalStorageService.saveData('alertHistory', updatedAlerts);
    updateAlertHistory(updatedAlerts);
}

function updateSectorPatternAnalysis() {
    const eventos = LocalStorageService.getData('eventos') || [];
    const funcionarios = LocalStorageService.getData('funcionarios') || [];
    const setores = LocalStorageService.getData('setores') || [];
    
    const sectorPatterns = setores.map(setor => {
        const sectorEvents = eventos.filter(evento => {
            const funcionario = funcionarios.find(f => f.nome === evento.funcionario);
            return funcionario?.setor === setor;
        });

        const criticalDays = analyzeDayPatterns(sectorEvents);
        const criticalEmployees = analyzeCriticalEmployees(sectorEvents, funcionarios);

        return {
            setor,
            eventCount: sectorEvents.length,
            criticalDays: Object.entries(criticalDays)
                .filter(([_, data]) => data.count > 0)
                .map(([day, data]) => `${day} (${data.count})`),
            criticalEmployees: criticalEmployees
                .filter(emp => emp.eventCount > 2)
                .map(emp => emp.nome)
        };
    });

    // Update sector pattern table
    const tbody = document.getElementById('sectorPatternTableBody');
    tbody.innerHTML = sectorPatterns.map(pattern => `
        <tr>
            <td>${pattern.setor}</td>
            <td>${pattern.eventCount}</td>
            <td>${pattern.criticalDays.join(', ') || 'Nenhum'}</td>
            <td>
                ${pattern.criticalEmployees.map(emp => `
                    <span class="badge bg-warning">${emp}</span>
                `).join(' ')}
            </td>
        </tr>
    `).join('');
}

function analyzeDayPatterns(eventos) {
    const days = {
        'Segunda': { count: 0, events: [] },
        'Terça': { count: 0, events: [] },
        'Quarta': { count: 0, events: [] },
        'Quinta': { count: 0, events: [] },
        'Sexta': { count: 0, events: [] },
        'Sábado': { count: 0, events: [] },
        'Domingo': { count: 0, events: [] }
    };

    eventos.forEach(evento => {
        const date = new Date(evento.data);
        const dayName = date.toLocaleDateString('pt-BR', { weekday: 'long' });
        const day = dayName.charAt(0).toUpperCase() + dayName.slice(1);
        if (days[day]) {
            days[day].count++;
            days[day].events.push(evento);
        }
    });

    return days;
}

function analyzeCriticalEmployees(eventos, funcionarios) {
    const employeeEvents = {};
    
    eventos.forEach(evento => {
        if (!employeeEvents[evento.funcionario]) {
            employeeEvents[evento.funcionario] = {
                nome: evento.funcionario,
                eventCount: 0,
                events: []
            };
        }
        employeeEvents[evento.funcionario].eventCount++;
        employeeEvents[evento.funcionario].events.push(evento);
    });

    return Object.values(employeeEvents);
}

function getMostAffectedSector(eventos, dayEvents) {
    const funcionarios = LocalStorageService.getData('funcionarios') || [];
    const sectorCounts = {};
    
    dayEvents.forEach(evento => {
        const funcionario = funcionarios.find(f => f.nome === evento.funcionario);
        if (funcionario?.setor) {
            sectorCounts[funcionario.setor] = (sectorCounts[funcionario.setor] || 0) + 1;
        }
    });

    const mostAffected = Object.entries(sectorCounts)
        .sort(([,a], [,b]) => b - a)[0];
    
    return mostAffected ? mostAffected[0] : 'Não identificado';
}

function updateAlertHistory(alerts) {
    const tbody = document.getElementById('alertHistoryTableBody');
    tbody.innerHTML = alerts.map(alert => `
        <tr>
            <td>${new Date(alert.timestamp).toLocaleString()}</td>
            <td><span class="badge bg-${getAlertTypeBadge(alert.type)}">${alert.type}</span></td>
            <td>${alert.description}</td>
            <td>${alert.criteria}</td>
        </tr>
    `).join('');
}

function getAlertTypeBadge(type) {
    const badges = {
        'Ausência': 'danger',
        'Horas Extras': 'warning',
        'Atrasos': 'info',
        'Ação Automática': 'primary'
    };
    return badges[type] || 'secondary';
}

function getAnalysisStartDate(analysisPeriod) {
    const now = new Date();
    if (analysisPeriod.type === 'custom') {
        return new Date(analysisPeriod.customStart);
    }
  
    const days = parseInt(analysisPeriod.type);
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - days);
    return startDate;
}

function calculateAbsencePercentage(eventos, funcionarios, startDate) {
    const absences = eventos.filter(e => 
        e.tipo === 'falta' && new Date(e.data) >= startDate
    ).length;
  
    return (absences / funcionarios.length) * 100;
}

function calculateOvertime(bancoHoras, funcionario, startDate) {
    return bancoHoras
        .filter(bh => 
            bh.funcionario === funcionario && 
            new Date(bh.dataFinal) >= startDate
        )
        .reduce((total, bh) => total + convertTimeToHours(bh.saldo), 0);
}

function countLateArrivals(eventos, funcionario, startDate) {
    return eventos.filter(e => 
        e.funcionario === funcionario &&
        e.tipo === 'atraso' &&
        new Date(e.data) >= startDate
    ).length;
}

function convertTimeToHours(timeStr) {
    if (!timeStr) return 0;
    const isNegative = timeStr.startsWith('-');
    const [hours, minutes] = timeStr.replace(/[+-]/, '').split(':').map(Number);
    const decimalHours = hours + (minutes / 60);
    return isNegative ? -decimalHours : decimalHours;
}