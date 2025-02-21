import { LocalStorageService } from '../app.js';

export function renderFuncionarios(container) {
    container.innerHTML = `
        <div class="container-fluid">
            <h1 class="mt-4">Gestão de Funcionários - GrapeWork</h1>
            <div class="row">
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-header">
                            <span id="formTitle">Cadastrar Funcionário</span>
                            <button id="cancelEdit" class="btn btn-sm btn-secondary float-end" style="display: none;">
                                <i class="bi bi-x-circle"></i> Cancelar Edição
                            </button>
                        </div>
                        <div class="card-body">
                            <form id="funcionarioForm" class="needs-validation">
                                <input type="hidden" id="isEditing" value="false">
                                
                                <!-- Dados Básicos -->
                                <h5 class="form-section">Dados Básicos</h5>
                                <div class="mb-3">
                                    <label>Colaborador*</label>
                                    <input type="text" class="form-control" id="nome" required>
                                </div>
                                <div class="row mb-3">
                                    <div class="col">
                                        <label>Cargo*</label>
                                        <input type="text" class="form-control" id="cargo" required>
                                    </div>
                                    <div class="col">
                                        <label>Função*</label>
                                        <input type="text" class="form-control" id="funcao" required>
                                    </div>
                                </div>
                                <div class="row mb-3">
                                    <div class="col">
                                        <label>Setor</label>
                                        <select class="form-control" id="setor">
                                            <option value="">Selecione o setor</option>
                                            ${getSetoresOptions()}
                                        </select>
                                    </div>
                                    <div class="col">
                                        <label>Filial</label>
                                        <input type="text" class="form-control" id="filial">
                                    </div>
                                </div>
                                <div class="row mb-3">
                                    <div class="col">
                                        <label>Local de Trabalho</label>
                                        <input type="text" class="form-control" id="localTrabalho">
                                    </div>
                                    <div class="col">
                                        <label>Centro de Custo</label>
                                        <input type="text" class="form-control" id="centroCusto">
                                    </div>
                                </div>

                                <!-- Dados Pessoais -->
                                <h5 class="form-section mt-4">Dados Pessoais</h5>
                                <div class="row mb-3">
                                    <div class="col">
                                        <label>Data de Nascimento*</label>
                                        <input type="date" class="form-control" id="dataNascimento" required>
                                    </div>
                                    <div class="col">
                                        <label>Sexo</label>
                                        <select class="form-control" id="sexo">
                                            <option value="">Selecione</option>
                                            <option value="M">Masculino</option>
                                            <option value="F">Feminino</option>
                                            <option value="O">Outro</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="row mb-3">
                                    <div class="col">
                                        <label>CPF*</label>
                                        <input type="text" class="form-control" id="cpf" required>
                                    </div>
                                    <div class="col">
                                        <label>RG*</label>
                                        <input type="text" class="form-control" id="rg" required>
                                    </div>
                                </div>
                                <div class="row mb-3">
                                    <div class="col">
                                        <label>PIS</label>
                                        <input type="text" class="form-control" id="pis">
                                    </div>
                                    <div class="col">
                                        <label>Carteira de Trabalho</label>
                                        <input type="text" class="form-control" id="ctps">
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label>Nº de Série CTPS</label>
                                    <input type="text" class="form-control" id="serieCtps">
                                </div>

                                <!-- Contato -->
                                <h5 class="form-section mt-4">Contato</h5>
                                <div class="row mb-3">
                                    <div class="col">
                                        <label>Email Pessoal</label>
                                        <input type="email" class="form-control" id="emailPessoal">
                                    </div>
                                    <div class="col">
                                        <label>Email Corporativo</label>
                                        <input type="email" class="form-control" id="emailCorporativo">
                                    </div>
                                </div>
                                <div class="row mb-3">
                                    <div class="col">
                                        <label>Telefone*</label>
                                        <input type="tel" class="form-control" id="telefone" required>
                                    </div>
                                    <div class="col">
                                        <label>Estado</label>
                                        <select class="form-control" id="estado">
                                            <option value="">Selecione</option>
                                            <option value="AC">Acre</option>
                                            <option value="AL">Alagoas</option>
                                            <option value="AP">Amapá</option>
                                            <option value="AM">Amazonas</option>
                                            <option value="BA">Bahia</option>
                                            <option value="CE">Ceará</option>
                                            <option value="DF">Distrito Federal</option>
                                            <option value="ES">Espírito Santo</option>
                                            <option value="GO">Goiás</option>
                                            <option value="MA">Maranhão</option>
                                            <option value="MG">Minas Gerais</option>
                                            <option value="MS">Mato Grosso do Sul</option>
                                            <option value="MT">Mato Grosso</option>
                                            <option value="PA">Pará</option>
                                            <option value="PB">Paraíba</option>
                                            <option value="PE">Pernambuco</option>
                                            <option value="PI">Piauí</option>
                                            <option value="PR">Paraná</option>
                                            <option value="RJ">Rio de Janeiro</option>
                                            <option value="RN">Rio Grande do Norte</option>
                                            <option value="RO">Rondônia</option>
                                            <option value="RR">Roraima</option>
                                            <option value="RS">Rio Grande do Sul</option>
                                            <option value="SC">Santa Catarina</option>
                                            <option value="SE">Sergipe</option>
                                            <option value="SP">São Paulo</option>
                                            <option value="TO">Tocantins</option>
                                        </select>
                                    </div>
                                </div>

                                <!-- Dados Funcionais -->
                                <h5 class="form-section mt-4">Dados Funcionais</h5>
                                <div class="row mb-3">
                                    <div class="col">
                                        <label>Código Externo</label>
                                        <input type="text" class="form-control" id="codigoExterno">
                                    </div>
                                    <div class="col">
                                        <label>Status</label>
                                        <select class="form-control" id="status">
                                            <option value="Ativo">Ativo</option>
                                            <option value="Inativo">Desligado</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="row mb-3">
                                    <div class="col">
                                        <label>Data de Admissão*</label>
                                        <input type="date" class="form-control" id="dataAdmissao" required>
                                    </div>
                                    <div class="col">
                                        <label>Início Vigência</label>
                                        <input type="date" class="form-control" id="inicioVigencia">
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label>Fuso Horário</label>
                                    <select class="form-control" id="fusoHorario">
                                        <option value="America/Sao_Paulo">Brasília (GMT-3)</option>
                                        <option value="America/Rio_de_Janeiro">Rio de Janeiro (GMT-2)</option>
                                        <option value="America/Bahia">Bahia (GMT-3)</option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label>Gestores</label>
                                    <select class="form-control" id="gestores" multiple>
                                        <!-- Will be populated dynamically -->
                                    </select>
                                </div>
                                <div class="row mb-3">
                                    <div class="col">
                                        <label>Escala Vigente</label>
                                        <input type="text" class="form-control" id="escalaVigente">
                                    </div>
                                    <div class="col">
                                        <label>Calendário Vigente</label>
                                        <input type="text" class="form-control" id="calendarioVigente">
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label>Data de Início das Férias</label>
                                    <input type="date" class="form-control" id="dataInicioFerias">
                                </div>
                                <div class="mb-3">
                                    <label>Data da Próxima Avaliação</label>
                                    <input type="date" class="form-control" id="proximaAvaliacao">
                                </div>

                                <!-- Informações Adicionais -->
                                <h5 class="form-section mt-4">Informações Adicionais</h5>
                                <div class="row mb-3">
                                    <div class="col">
                                        <div class="form-check">
                                            <input type="checkbox" class="form-check-input" id="estrangeiro">
                                            <label class="form-check-label">Estrangeiro</label>
                                        </div>
                                    </div>
                                    <div class="col">
                                        <div class="form-check">
                                            <input type="checkbox" class="form-check-input" id="temFilhos">
                                            <label class="form-check-label">Tem Filhos</label>
                                        </div>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label>Tamanho de Camisa</label>
                                    <select class="form-control" id="tamanhoCamisa">
                                        <option value="">Selecione</option>
                                        <option value="PP">PP</option>
                                        <option value="P">P</option>
                                        <option value="M">M</option>
                                        <option value="G">G</option>
                                        <option value="GG">GG</option>
                                        <option value="XG">XG</option>
                                    </select>
                                </div>

                                <!-- Dados de Desligamento -->
                                <div id="dadosDesligamento" style="display: none;">
                                    <h5 class="form-section mt-4">Dados de Desligamento</h5>
                                    <div class="mb-3">
                                        <label>Motivo Demissão</label>
                                        <select class="form-control" id="motivoDemissao">
                                            <option value="">Selecione</option>
                                            <option value="Voluntária">Demissão Voluntária</option>
                                            <option value="SemJustaCausa">Sem Justa Causa</option>
                                            <option value="JustaCausa">Com Justa Causa</option>
                                            <option value="Acordo">Acordo</option>
                                        </select>
                                    </div>
                                    <div class="mb-3">
                                        <label>Data Demissão</label>
                                        <input type="date" class="form-control" id="dataDemissao">
                                    </div>
                                </div>

                                <!-- System Fields -->
                                <input type="hidden" id="dataCadastro">
                                <input type="hidden" id="qrCode">

                                <div class="mt-4">
                                    <button type="submit" class="btn btn-primary">
                                        <i class="bi bi-save me-2"></i>
                                        <span id="submitButtonText">Salvar Funcionário</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <!-- List of employees -->
                <div class="col-md-8">
                    <div class="card">
                        <div class="card-header">
                            <div class="search-filter">
                                <input type="text" class="form-control" id="searchFuncionario" placeholder="Buscar por nome, cargo ou função">
                                <select class="form-control" id="filterStatus">
                                    <option value="">Todos os Status</option>
                                    <option value="Ativo">Ativos</option>
                                    <option value="Inativo">Desligados</option>
                                </select>
                                <button class="btn btn-primary" id="searchBtn">
                                    <i class="bi bi-search"></i>
                                </button>
                            </div>
                        </div>
                        <div class="card-body">
                            <div class="table-responsive">
                                <table class="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>Colaborador</th>
                                            <th>Cargo</th>
                                            <th>Função</th>
                                            <th>Filial</th>
                                            <th>Status</th>
                                            <th>Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody id="funcionariosList"></tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Add styles for form sections
    const style = document.createElement('style');
    style.textContent = `
        .form-section {
            color: var(--cor-roxo);
            border-bottom: 2px solid var(--cor-roxo);
            padding-bottom: 5px;
            margin-bottom: 15px;
        }
        .form-control:focus {
            border-color: var(--cor-roxo);
            box-shadow: 0 0 0 0.2rem rgba(106, 13, 173, 0.25);
        }
        select.form-control {
            cursor: pointer;
            background-image: linear-gradient(45deg, transparent 50%, var(--cor-roxo) 50%),
                            linear-gradient(135deg, var(--cor-roxo) 50%, transparent 50%);
            background-position: calc(100% - 20px) calc(1em + 2px),
                               calc(100% - 15px) calc(1em + 2px);
            background-size: 5px 5px,
                           5px 5px;
            background-repeat: no-repeat;
        }
    `;
    document.head.appendChild(style);

    // Initialize form handling
    initializeForm();
    
    // Load initial data
    loadFuncionarios();

    function initializeForm() {
        const form = document.getElementById('funcionarioForm');
        const status = document.getElementById('status');
        const dadosDesligamento = document.getElementById('dadosDesligamento');

        // Show/hide termination fields based on status
        status.addEventListener('change', () => {
            dadosDesligamento.style.display = 
                status.value === 'Inativo' ? 'block' : 'none';
        });

        function renderCustomFields() {
            const customFields = LocalStorageService.getData('camposPersonalizados') || [];
            const sections = {
                dadosBasicos: document.querySelector('#funcionarioForm .form-section:nth-of-type(1)').parentNode,
                dadosPessoais: document.querySelector('#funcionarioForm .form-section:nth-of-type(2)').parentNode,
                contato: document.querySelector('#funcionarioForm .form-section:nth-of-type(3)').parentNode,
                dadosFuncionais: document.querySelector('#funcionarioForm .form-section:nth-of-type(4)').parentNode,
                infoAdicionais: document.querySelector('#funcionarioForm .form-section:nth-of-type(5)').parentNode
            };

            customFields.forEach(field => {
                const section = sections[field.secao];
                if (!section) return;

                const div = document.createElement('div');
                div.className = 'mb-3';
                
                if (field.tipo === 'checkbox') {
                    div.innerHTML = `
                        <div class="form-check">
                            <input type="checkbox" class="form-check-input" id="${field.nome}">
                            <label class="form-check-label" for="${field.nome}">${field.nome}</label>
                        </div>
                    `;
                } else if (field.tipo === 'select') {
                    div.innerHTML = `
                        <label>${field.nome}</label>
                        <select class="form-control" id="${field.nome}">
                            <option value="">Selecione</option>
                            ${field.opcoes.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                        </select>
                    `;
                } else {
                    div.innerHTML = `
                        <label>${field.nome}</label>
                        <input type="${field.tipo}" class="form-control" id="${field.nome}">
                    `;
                }

                section.insertBefore(div, section.lastElementChild);
            });
        }

        renderCustomFields();

        // Form submission handling
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!form.checkValidity()) {
                e.stopPropagation();
                form.classList.add('was-validated');
                return;
            }

            const funcionario = collectFormData();
            saveFuncionario(funcionario);
        });
    }

    function collectFormData() {
        // Collect all form fields into an object
        const formData = {};
        const form = document.getElementById('funcionarioForm');
        const formElements = form.elements;

        for (let element of formElements) {
            if (element.id && element.id !== 'submitButtonText') {
                if (element.type === 'checkbox') {
                    formData[element.id] = element.checked;
                } else if (element.type === 'hidden' && element.id === 'dataCadastro') {
                    formData[element.id] = element.value || new Date().toISOString();
                } else {
                    formData[element.id] = element.value;
                }
            }
        }

        // Generate QR Code if needed
        if (!formData.qrCode) {
            formData.qrCode = generateQRCode(formData.nome);
        }

        return formData;
    }

    function generateQRCode(text) {
        // Simple implementation - in real world, use a proper QR code library
        return btoa(text + Date.now());
    }

    function saveFuncionario(funcionario) {
        const funcionarios = LocalStorageService.getData('funcionarios') || [];
        const isEditing = document.getElementById('isEditing').value === 'true';

        if (isEditing) {
            const index = funcionarios.findIndex(f => f.nome === funcionario.nome);
            if (index !== -1) {
                funcionarios[index] = funcionario;
                alert('Funcionário atualizado com sucesso!');
            }
        } else {
            if (funcionarios.some(f => f.nome === funcionario.nome)) {
                alert('Já existe um funcionário com este nome!');
                return;
            }
            funcionarios.push(funcionario);
            alert('Funcionário cadastrado com sucesso!');
        }

        LocalStorageService.saveData('funcionarios', funcionarios);
        loadFuncionarios();
        resetForm();
    }

    function loadFuncionarios() {
        const funcionarios = LocalStorageService.getData('funcionarios') || [];
        const searchInput = document.getElementById('searchFuncionario');
        const filterStatus = document.getElementById('filterStatus');
        const funcionariosList = document.getElementById('funcionariosList');

        const funcionariosFiltrados = funcionarios.filter(func => {
            const matchNome = !searchInput.value || 
                func.nome.toLowerCase().includes(searchInput.value.toLowerCase());
            const matchStatus = !filterStatus.value || func.status === filterStatus.value;
            return matchNome && matchStatus;
        });

        funcionariosList.innerHTML = funcionariosFiltrados.map(func => `
            <tr>
                <td>${func.nome}</td>
                <td>${func.cargo}</td>
                <td>${func.funcao}</td>
                <td>${func.filial}</td>
                <td>
                    <span class="badge ${func.status === 'Ativo' ? 'bg-success' : 'bg-danger'}">
                        ${func.status}
                    </span>
                </td>
                <td>
                    <div class="btn-group" role="group">
                        <button class="btn btn-sm btn-info edit-btn" data-nome="${func.nome}">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-danger delete-btn" data-nome="${func.nome}">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        // Adicionar event listeners para edição e exclusão
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => editFuncionario(btn.dataset.nome));
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => deleteFuncionario(btn.dataset.nome));
        });
    }

    function editFuncionario(nome) {
        const funcionarios = LocalStorageService.getData('funcionarios') || [];
        const funcionario = funcionarios.find(f => f.nome === nome);

        if (funcionario) {
            document.getElementById('nome').value = funcionario.nome;
            document.getElementById('cargo').value = funcionario.cargo;
            document.getElementById('funcao').value = funcionario.funcao;
            document.getElementById('setor').value = funcionario.setor;
            document.getElementById('filial').value = funcionario.filial;
            document.getElementById('localTrabalho').value = funcionario.localTrabalho;
            document.getElementById('centroCusto').value = funcionario.centroCusto;
            document.getElementById('dataNascimento').value = funcionario.dataNascimento;
            document.getElementById('sexo').value = funcionario.sexo;
            document.getElementById('cpf').value = funcionario.cpf;
            document.getElementById('rg').value = funcionario.rg;
            document.getElementById('pis').value = funcionario.pis;
            document.getElementById('ctps').value = funcionario.ctps;
            document.getElementById('serieCtps').value = funcionario.serieCtps;
            document.getElementById('emailPessoal').value = funcionario.emailPessoal;
            document.getElementById('emailCorporativo').value = funcionario.emailCorporativo;
            document.getElementById('telefone').value = funcionario.telefone;
            document.getElementById('estado').value = funcionario.estado;
            document.getElementById('codigoExterno').value = funcionario.codigoExterno;
            document.getElementById('status').value = funcionario.status;
            document.getElementById('dataAdmissao').value = funcionario.dataAdmissao;
            document.getElementById('inicioVigencia').value = funcionario.inicioVigencia;
            document.getElementById('fusoHorario').value = funcionario.fusoHorario;
            document.getElementById('gestores').value = funcionario.gestores;
            document.getElementById('escalaVigente').value = funcionario.escalaVigente;
            document.getElementById('calendarioVigente').value = funcionario.calendarioVigente;
            document.getElementById('estrangeiro').checked = funcionario.estrangeiro;
            document.getElementById('temFilhos').checked = funcionario.temFilhos;
            document.getElementById('tamanhoCamisa').value = funcionario.tamanhoCamisa;
            document.getElementById('motivoDemissao').value = funcionario.motivoDemissao;
            document.getElementById('dataDemissao').value = funcionario.dataDemissao;
            document.getElementById('dataCadastro').value = funcionario.dataCadastro;
            document.getElementById('qrCode').value = funcionario.qrCode;
            document.getElementById('dataInicioFerias').value = funcionario.dataInicioFerias;
            document.getElementById('proximaAvaliacao').value = funcionario.proximaAvaliacao;

            document.getElementById('isEditing').value = 'true';
            document.getElementById('formTitle').textContent = 'Editar Funcionário';
            document.getElementById('submitButtonText').textContent = 'Atualizar Funcionário';
            document.getElementById('cancelEdit').style.display = 'block';
        }
    }

    function deleteFuncionario(nome) {
        if (confirm(`Tem certeza que deseja excluir o funcionário ${nome}?`)) {
            const funcionarios = LocalStorageService.getData('funcionarios') || [];
            const novaListaFuncionarios = funcionarios.filter(f => f.nome !== nome);
            
            LocalStorageService.saveData('funcionarios', novaListaFuncionarios);
            loadFuncionarios();
            resetForm();
        }
    }

    function resetForm() {
        const form = document.getElementById('funcionarioForm');
        form.reset();
        document.getElementById('isEditing').value = 'false';
        document.getElementById('formTitle').textContent = 'Cadastrar Funcionário';
        document.getElementById('submitButtonText').textContent = 'Salvar Funcionário';
        document.getElementById('cancelEdit').style.display = 'none';
    }

    // Cancelar edição
    document.getElementById('cancelEdit').addEventListener('click', (e) => {
        e.preventDefault();
        resetForm();
    });

    // Eventos de busca e filtro
    document.getElementById('searchBtn').addEventListener('click', () => {
        loadFuncionarios();
    });

    document.getElementById('searchFuncionario').addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            loadFuncionarios();
        }
    });
}

function getSetoresOptions() {
    const setores = LocalStorageService.getData('setores') || [];
    return setores.map(setor => 
        `<option value="${setor}">${setor}</option>`
    ).join('');
}