import { LocalStorageService } from '../app.js';

export function renderSalarios(container) {
    container.innerHTML = `
        <div class="container-fluid">
            <h1 class="mt-4">Gestão de Salários - GrapeWork</h1>
            
            <div class="row">
                <!-- Form Card -->
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-header">
                            <span id="formTitle">Registrar Salário</span>
                            <button id="cancelEdit" class="btn btn-sm btn-secondary float-end" style="display: none;">
                                <i class="bi bi-x-circle"></i> Cancelar
                            </button>
                        </div>
                        <div class="card-body">
                            <form id="salarioForm">
                                <input type="hidden" id="editingId">
                                
                                <div class="mb-3">
                                    <label class="form-label">Colaborador*</label>
                                    <select class="form-control" id="colaborador" required>
                                        <option value="">Selecione um colaborador</option>
                                    </select>
                                </div>

                                <div class="mb-3">
                                    <label class="form-label">Data de Admissão</label>
                                    <input type="date" class="form-control" id="admissao" required>
                                </div>

                                <div class="mb-3">
                                    <label class="form-label">Salário Base*</label>
                                    <input type="number" class="form-control" id="salario" step="0.01" required>
                                </div>

                                <div class="mb-3">
                                    <label class="form-label">Salário Família</label>
                                    <input type="number" class="form-control" id="salarioFamilia" step="0.01">
                                </div>

                                <div class="mb-3">
                                    <label class="form-label">Insalubridade</label>
                                    <input type="number" class="form-control" id="insalubridade" step="0.01">
                                </div>

                                <div class="mb-3">
                                    <label class="form-label">RT (Reflexo Tempo)</label>
                                    <input type="number" class="form-control" id="rt" step="0.01">
                                </div>

                                <div class="mb-3">
                                    <label class="form-label">Premiação</label>
                                    <input type="number" class="form-control" id="premiacao" step="0.01">
                                </div>

                                <div class="mb-3">
                                    <label class="form-label">Salário Base INSS</label>
                                    <input type="number" class="form-control" id="salarioBaseInss" step="0.01">
                                </div>

                                <div class="mb-3">
                                    <label class="form-label">Plano de Saúde</label>
                                    <input type="number" class="form-control" id="planoSaude" step="0.01">
                                </div>

                                <div class="mb-3">
                                    <label class="form-label">Cooparticipação</label>
                                    <input type="number" class="form-control" id="cooparticipacao" step="0.01">
                                </div>

                                <div class="mb-3">
                                    <label class="form-label">Desconto V.A.</label>
                                    <input type="number" class="form-control" id="descVA" step="0.01">
                                </div>

                                <div class="mb-3">
                                    <label class="form-label">Desconto V.T.</label>
                                    <input type="number" class="form-control" id="descVT" step="0.01">
                                </div>

                                <div class="mb-3">
                                    <label class="form-label">INSS</label>
                                    <input type="number" class="form-control" id="inss" step="0.01">
                                </div>

                                <div class="mb-3">
                                    <label class="form-label">IRPF</label>
                                    <input type="number" class="form-control" id="irpf" step="0.01">
                                </div>

                                <div class="mb-3">
                                    <label class="form-label">Vale Alimentação</label>
                                    <input type="number" class="form-control" id="valeAlimentacao" step="0.01">
                                </div>

                                <div class="mb-3">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="check">
                                        <label class="form-check-label">Verificado</label>
                                    </div>
                                </div>

                                <button type="submit" class="btn btn-primary">
                                    <i class="bi bi-save"></i> Salvar
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                <!-- Table Card -->
                <div class="col-md-8">
                    <div class="card">
                        <div class="card-header">
                            <div class="d-flex justify-content-between align-items-center">
                                <h5>Registros de Salários</h5>
                                <div class="search-filter">
                                    <input type="text" class="form-control" id="searchInput" placeholder="Buscar por nome">
                                    <button class="btn btn-primary" id="searchBtn">
                                        <i class="bi bi-search"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="card-body">
                            <div class="table-responsive">
                                <table class="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>Colaborador</th>
                                            <th>Admissão</th>
                                            <th>Salário Base</th>
                                            <th>Total Benefícios</th>
                                            <th>Total Descontos</th>
                                            <th>Salário Final</th>
                                            <th>Status</th>
                                            <th>Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody id="salariosTableBody"></tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Initialize the module
    initializeSalariosModule();
}

function initializeSalariosModule() {
    const form = document.getElementById('salarioForm');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const cancelEditBtn = document.getElementById('cancelEdit');

    // Load funcionários into select
    loadFuncionariosSelect();

    // Load initial data
    loadSalariosTable();

    // Form submit handler
    form.addEventListener('submit', handleFormSubmit);

    // Search handler
    searchBtn.addEventListener('click', () => loadSalariosTable(searchInput.value));

    // Cancel edit handler
    cancelEditBtn.addEventListener('click', resetForm);

    // Initialize edit and delete handlers
    initializeTableActions();
}

function loadFuncionariosSelect() {
    const funcionarios = LocalStorageService.getData('funcionarios') || [];
    const select = document.getElementById('colaborador');
    
    const options = funcionarios
        .sort((a, b) => a.nome.localeCompare(b.nome))
        .map(func => `<option value="${func.nome}">${func.nome}</option>`);
    
    select.innerHTML = '<option value="">Selecione um colaborador</option>' + options.join('');
}

function loadSalariosTable(searchTerm = '') {
    const salarios = LocalStorageService.getData('salarios') || [];
    const tbody = document.getElementById('salariosTableBody');
    
    const filteredSalarios = salarios.filter(salario => 
        !searchTerm || salario.colaborador.toLowerCase().includes(searchTerm.toLowerCase())
    );

    tbody.innerHTML = filteredSalarios.map((salario, index) => {
        const totalBeneficios = calculateBeneficios(salario);
        const totalDescontos = calculateDescontos(salario);
        const salarioFinal = calculateSalarioFinal(salario);

        return `
            <tr>
                <td>${salario.colaborador}</td>
                <td>${formatDate(salario.admissao)}</td>
                <td>R$ ${formatNumber(salario.salario)}</td>
                <td>R$ ${formatNumber(totalBeneficios)}</td>
                <td>R$ ${formatNumber(totalDescontos)}</td>
                <td>R$ ${formatNumber(salarioFinal)}</td>
                <td>
                    <span class="badge ${salario.check ? 'bg-success' : 'bg-warning'}">
                        ${salario.check ? 'Verificado' : 'Pendente'}
                    </span>
                </td>
                <td>
                    <div class="btn-group">
                        <button class="btn btn-sm btn-info edit-btn" data-index="${index}">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-danger delete-btn" data-index="${index}">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = {
        colaborador: document.getElementById('colaborador').value,
        admissao: document.getElementById('admissao').value,
        salario: parseFloat(document.getElementById('salario').value),
        salarioFamilia: parseFloat(document.getElementById('salarioFamilia').value) || 0,
        insalubridade: parseFloat(document.getElementById('insalubridade').value) || 0,
        rt: parseFloat(document.getElementById('rt').value) || 0,
        premiacao: parseFloat(document.getElementById('premiacao').value) || 0,
        salarioBaseInss: parseFloat(document.getElementById('salarioBaseInss').value) || 0,
        planoSaude: parseFloat(document.getElementById('planoSaude').value) || 0,
        cooparticipacao: parseFloat(document.getElementById('cooparticipacao').value) || 0,
        descVA: parseFloat(document.getElementById('descVA').value) || 0,
        descVT: parseFloat(document.getElementById('descVT').value) || 0,
        inss: parseFloat(document.getElementById('inss').value) || 0,
        irpf: parseFloat(document.getElementById('irpf').value) || 0,
        valeAlimentacao: parseFloat(document.getElementById('valeAlimentacao').value) || 0,
        check: document.getElementById('check').checked
    };

    const editingId = document.getElementById('editingId').value;
    const salarios = LocalStorageService.getData('salarios') || [];

    if (editingId) {
        // Update existing
        salarios[editingId] = formData;
    } else {
        // Add new
        salarios.push(formData);
    }

    LocalStorageService.saveData('salarios', salarios);
    loadSalariosTable();
    resetForm();
}

function resetForm() {
    document.getElementById('salarioForm').reset();
    document.getElementById('editingId').value = '';
    document.getElementById('formTitle').textContent = 'Registrar Salário';
    document.getElementById('cancelEdit').style.display = 'none';
}

function initializeTableActions() {
    document.addEventListener('click', e => {
        if (e.target.closest('.edit-btn')) {
            const index = e.target.closest('.edit-btn').dataset.index;
            editSalario(index);
        }
        if (e.target.closest('.delete-btn')) {
            const index = e.target.closest('.delete-btn').dataset.index;
            deleteSalario(index);
        }
    });
}

function editSalario(index) {
    const salarios = LocalStorageService.getData('salarios') || [];
    const salario = salarios[index];

    // Populate form
    Object.keys(salario).forEach(key => {
        const input = document.getElementById(key);
        if (input) {
            input.value = salario[key];
        }
    });

    // Update form state
    document.getElementById('editingId').value = index;
    document.getElementById('formTitle').textContent = 'Editar Salário';
    document.getElementById('cancelEdit').style.display = 'block';
    document.getElementById('check').checked = salario.check;
}

function deleteSalario(index) {
    if (confirm('Tem certeza que deseja excluir este registro?')) {
        const salarios = LocalStorageService.getData('salarios') || [];
        salarios.splice(index, 1);
        LocalStorageService.saveData('salarios', salarios);
        loadSalariosTable();
    }
}

// Utility functions
function calculateBeneficios(salario) {
    return salario.salarioFamilia + salario.insalubridade + 
           salario.rt + salario.premiacao + salario.valeAlimentacao;
}

function calculateDescontos(salario) {
    return salario.planoSaude + salario.cooparticipacao + 
           salario.descVA + salario.descVT + salario.inss + salario.irpf;
}

function calculateSalarioFinal(salario) {
    return salario.salario + calculateBeneficios(salario) - calculateDescontos(salario);
}

function formatNumber(number) {
    return number.toFixed(2).replace('.', ',');
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('pt-BR');
}