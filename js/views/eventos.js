import { LocalStorageService } from '../app.js';

export function renderEventos(container) {
    container.innerHTML = `
        <div class="container-fluid">
            <h1 class="mt-4">Registro de Eventos - GrapeWork</h1>
            <div class="row">
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-header">
                            <span id="formTitle">Registrar Evento</span>
                            <button id="cancelEdit" class="btn btn-sm btn-secondary float-end" style="display: none;">
                                <i class="bi bi-x-circle"></i> Cancelar Edição
                            </button>
                        </div>
                        <div class="card-body">
                            <form id="eventoForm">
                                <input type="hidden" id="eventoId">
                                <div class="mb-3">
                                    <label>Funcionário</label>
                                    <select class="form-control" id="funcionario" required></select>
                                </div>
                                <div class="mb-3">
                                    <label>Tipo de Evento</label>
                                    <select class="form-control" id="tipoEvento" required>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label>Data</label>
                                    <input type="date" class="form-control" id="dataEvento" required>
                                </div>
                                <div class="mb-3">
                                    <label>Descrição</label>
                                    <textarea class="form-control" id="descricao"></textarea>
                                </div>
                                <button type="submit" class="btn btn-primary" id="submitButton">Registrar</button>
                            </form>
                        </div>
                    </div>
                </div>
                <div class="col-md-8">
                    <div class="card">
                        <div class="card-header">
                            <div class="search-filter">
                                <input type="text" class="form-control" id="searchFuncionario" placeholder="Buscar por nome ou setor">
                                <select class="form-control" id="filterTipoEvento">
                                    <option value="">Todos os Eventos</option>
                                    <option value="falta">Faltas</option>
                                    <option value="advertencia">Advertências</option>
                                    <option value="suspensao">Suspensões</option>
                                    <option value="atraso">Atrasos</option>
                                    <option value="atestado">Atestados</option>
                                </select>
                                <button class="btn btn-primary" id="searchBtn">
                                    <i class="bi bi-search"></i>
                                </button>
                            </div>
                        </div>
                        <div class="card-body">
                            <table class="table" id="eventosTable">
                                <thead>
                                    <tr>
                                        <th>Funcionário</th>
                                        <th>Tipo</th>
                                        <th>Data</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody id="eventosList"></tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    const form = document.getElementById('eventoForm');
    const eventosList = document.getElementById('eventosList');
    const funcionarioSelect = document.getElementById('funcionario');
    const searchInput = document.getElementById('searchFuncionario');
    const filterTipoEvento = document.getElementById('filterTipoEvento');
    const searchBtn = document.getElementById('searchBtn');
    const submitButton = document.getElementById('submitButton');
    const cancelEditButton = document.getElementById('cancelEdit');
    const eventoIdInput = document.getElementById('eventoId');

    // Campos do formulário
    const funcionarioInput = document.getElementById('funcionario');
    const tipoEventoInput = document.getElementById('tipoEvento');
    const dataEventoInput = document.getElementById('dataEvento');
    const descricaoInput = document.getElementById('descricao');

    // Popular select de funcionários
    function carregarFuncionarios() {
        const funcionarios = LocalStorageService.getData('funcionarios') || [];
        funcionarioSelect.innerHTML = funcionarios.map(func => 
            `<option value="${func.nome}">${func.nome} - ${func.setor}</option>`
        ).join('');
    }

    // Carregar eventos com filtro
    function carregarEventos(filtro = {}) {
        const eventos = LocalStorageService.getData('eventos') || [];
        const eventosFiltrados = eventos.filter(evento => {
            const matchNome = !filtro.nome || 
                evento.funcionario.toLowerCase().includes(filtro.nome.toLowerCase());
            const matchTipo = !filtro.tipo || evento.tipo === filtro.tipo;
            return matchNome && matchTipo;
        });

        eventosList.innerHTML = eventosFiltrados.map((evento, index) => `
            <tr>
                <td>${evento.funcionario}</td>
                <td>${evento.tipo}</td>
                <td>${evento.data}</td>
                <td>
                    <div class="btn-group" role="group">
                        <button class="btn btn-sm btn-info edit-btn" data-index="${index}">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-danger delete-btn" data-index="${index}">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        // Adicionar listeners para botões de edição e exclusão
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => editarEvento(btn.dataset.index));
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => excluirEvento(btn.dataset.index));
        });
    }

    // Função para editar evento
    function editarEvento(index) {
        const eventos = LocalStorageService.getData('eventos') || [];
        const evento = eventos[index];

        // Preencher formulário com dados do evento
        funcionarioInput.value = evento.funcionario;
        tipoEventoInput.value = evento.tipo;
        dataEventoInput.value = evento.data;
        descricaoInput.value = evento.descricao || '';
        eventoIdInput.value = index;

        // Alterar texto do botão e mostrar botão de cancelar
        submitButton.textContent = 'Atualizar Evento';
        cancelEditButton.style.display = 'block';
    }

    // Função para excluir evento
    function excluirEvento(index) {
        if (confirm('Tem certeza que deseja excluir este evento?')) {
            const eventos = LocalStorageService.getData('eventos') || [];
            eventos.splice(index, 1);
            LocalStorageService.saveData('eventos', eventos);
            carregarEventos();
        }
    }

    carregarFuncionarios();
    
    const tiposEventos = LocalStorageService.getData('tiposEventos') || [
      { tipo: 'falta', cor: 'danger' },
      { tipo: 'advertencia', cor: 'warning' },
      { tipo: 'suspensao', cor: 'dark' },
      { tipo: 'atraso', cor: 'info' },
      { tipo: 'atestado', cor: 'success' }
    ];

    document.getElementById('tipoEvento').innerHTML = tiposEventos.map(tipo => 
      `<option value="${tipo.tipo}">${tipo.tipo}</option>`
    ).join('');

    carregarEventos();

    // Cancelar edição
    cancelEditButton.addEventListener('click', () => {
        form.reset();
        submitButton.textContent = 'Registrar';
        cancelEditButton.style.display = 'none';
        eventoIdInput.value = '';
    });

    // Evento de submit do formulário
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const eventos = LocalStorageService.getData('eventos') || [];
        
        const eventoData = {
            funcionario: document.getElementById('funcionario').value,
            tipo: document.getElementById('tipoEvento').value,
            data: document.getElementById('dataEvento').value,
            descricao: document.getElementById('descricao').value
        };

        // Verificar se é edição ou novo evento
        const eventoId = eventoIdInput.value;
        if (eventoId !== '') {
            // Edição de evento existente
            eventos[eventoId] = eventoData;
        } else {
            // Novo evento
            eventos.push(eventoData);
        }

        LocalStorageService.saveData('eventos', eventos);
        carregarEventos();
        form.reset();
        submitButton.textContent = 'Registrar';
        cancelEditButton.style.display = 'none';
    });

    // Eventos de busca e filtro
    searchBtn.addEventListener('click', () => {
        carregarEventos({
            nome: searchInput.value,
            tipo: filterTipoEvento.value
        });
    });

    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            carregarEventos({
                nome: searchInput.value,
                tipo: filterTipoEvento.value
            });
        }
    });
}