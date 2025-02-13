import { LocalStorageService } from '../app.js';

export function renderImportacao(container) {
    // Add XLSX library script dynamically
    if (!document.getElementById('xlsx-script')) {
        const xlsxScript = document.createElement('script');
        xlsxScript.id = 'xlsx-script';
        xlsxScript.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
        document.head.appendChild(xlsxScript);
    }

    container.innerHTML = `
        <div class="container-fluid">
            <h1 class="mt-4">Importação de Funcionários - GrapeWork</h1>
            
            <div class="card mb-4">
                <div class="card-header">
                    <h4>Importação de Dados</h4>
                </div>
                <div class="card-body">
                    <div class="alert alert-info">
                        <strong>Instruções:</strong>
                        <p>Importe um arquivo XLSX com os dados dos funcionários. Todos os registros serão processados, 
                        mesmo com células em branco. Um relatório de inconsistências será gerado.</p>
                    </div>
                    
                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="form-label">Selecionar Arquivo XLSX</label>
                                <input type="file" class="form-control" id="xlsxFile" accept=".xlsx">
                            </div>
                        </div>
                        <div class="col-md-6 d-flex align-items-end">
                            <div class="btn-group">
                                <button class="btn btn-primary" id="importBtn">
                                    <i class="bi bi-upload me-2"></i>Importar Dados
                                </button>
                                <button class="btn btn-secondary" id="cancelBtn">
                                    <i class="bi bi-x-circle me-2"></i>Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Validation Errors Card -->
            <div id="errorCard" class="card mb-4" style="display:none;">
                <div class="card-header bg-warning">
                    <h4><i class="bi bi-exclamation-triangle me-2"></i>Registros com Inconsistências</h4>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-striped" id="errorTable">
                            <thead>
                                <tr>
                                    <th>Linha</th>
                                    <th>Colaborador</th>
                                    <th>Inconsistências</th>
                                </tr>
                            </thead>
                            <tbody id="errorTableBody"></tbody>
                        </table>
                    </div>
                    <button class="btn btn-warning" id="downloadErrorReport">
                        <i class="bi bi-download me-2"></i>Baixar Relatório de Erros
                    </button>
                </div>
            </div>

            <!-- Preview Card -->
            <div id="previewCard" class="card" style="display:none;">
                <div class="card-header">
                    <h4>Pré-visualização dos Dados</h4>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-hover" id="previewTable">
                            <thead>
                                <tr>
                                    <th>Colaborador</th>
                                    <th>Cargo</th>
                                    <th>Função</th>
                                    <th>Status</th>
                                    <th>Admissão</th>
                                </tr>
                            </thead>
                            <tbody id="previewTableBody"></tbody>
                        </table>
                    </div>
                    <div class="d-flex justify-content-between">
                        <button class="btn btn-success" id="confirmImportBtn">
                            <i class="bi bi-check-circle me-2"></i>Confirmar Importação
                        </button>
                        <div>
                            <span id="totalRegistros" class="me-3"></span>
                            <span id="registrosValidados" class="text-success"></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Validation Utilities
    const validators = {
        email: (email) => email ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) : true,
        cpf: (cpf) => cpf ? /^\d{11}$/.test(cpf.replace(/[^\d]/g, '')) : true,
        date: (date) => date ? !isNaN(Date.parse(date)) : true
    };

    function validateRecord(record) {
        const errors = [];

        // Example validations (you can expand these)
        if (record.emailPessoal && !validators.email(record.emailPessoal)) {
            errors.push('Email pessoal inválido');
        }
        
        if (record.emailCorporativo && !validators.email(record.emailCorporativo)) {
            errors.push('Email corporativo inválido');
        }

        if (record.cpf && !validators.cpf(record.cpf)) {
            errors.push('CPF inválido');
        }

        if (record.dataAdmissao && !validators.date(record.dataAdmissao)) {
            errors.push('Data de admissão inválida');
        }

        return errors;
    }

    function processarArquivo(file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(firstSheet, { defval: '' });

                const processedData = [];
                const errorData = [];

                // Comprehensive mapping with all specified fields
                jsonData.forEach((registro, index) => {
                    const processedRecord = {
                        nome: registro['Colaborador'] || registro['nome'] || '',
                        cargo: registro['Cargo'] || registro['cargo'] || '',
                        funcao: registro['Função'] || registro['funcao'] || '',
                        filial: registro['Filial'] || registro['filial'] || '',
                        localTrabalho: registro['Centro de Trabalho'] || registro['Locais de Trabalho'] || registro['localTrabalho'] || '',
                        centroCusto: registro['Centro de Custo'] || registro['centroCusto'] || '',
                        dataNascimento: registro['Data de Nascimento'] || registro['dataNascimento'] || '',
                        cpf: registro['CPF'] || registro['cpf'] || '',
                        rg: registro['RG'] || registro['rg'] || '',
                        pis: registro['PIS'] || registro['pis'] || '',
                        ctps: registro['Carteira de Trabalho'] || registro['ctps'] || '',
                        serieCtps: registro['Nº de Série'] || registro['serieCtps'] || '',
                        emailPessoal: registro['Email Pessoal'] || registro['emailPessoal'] || '',
                        telefone: registro['Telefone para Contato'] || registro['telefone'] || '',
                        estado: registro['Estado'] || registro['estado'] || '',
                        codigoExterno: registro['Código Externo'] || registro['codigoExterno'] || '',
                        status: (registro['Desligado'] === 'Sim' || registro['Desligado'] === true) ? 'Inativo' : (registro['Status'] || registro['status'] || 'Ativo'),
                        inicioVigencia: registro['Início Vigência'] || registro['inicioVigencia'] || '',
                        dataAdmissao: registro['Admissão'] || registro['dataAdmissao'] || new Date().toISOString().split('T')[0],
                        fusoHorario: registro['Fuso Horário'] || registro['fusoHorario'] || 'America/Sao_Paulo',
                        gestores: registro['Gestores'] || registro['gestores'] || '',
                        escalaVigente: registro['Escala Vigente'] || registro['escalaVigente'] || '',
                        calendarioVigente: registro['Calendário Vigente'] || registro['calendarioVigente'] || '',
                        qrCode: generateQRCode(),
                        estrangeiro: registro['Estrangeiro'] === 'Sim' || registro['estrangeiro'] === true,
                        emailCorporativo: registro['Email Corporativo'] || registro['emailCorporativo'] || '',
                        sexo: registro['Sexo'] || registro['sexo'] || '',
                        temFilhos: registro['Tem Filhos'] === 'Sim' || registro['temFilhos'] === true,
                        tamanhoCamisa: registro['Tamanho de Camisa'] || registro['tamanhoCamisa'] || '',
                        motivoDemissao: registro['Motivo Demissão'] || registro['motivoDemissao'] || '',
                        dataCadastro: registro['Data Cadastro'] || new Date().toISOString(),
                        dataDemissao: registro['Data Demissão'] || registro['dataDemissao'] || '',
                        dataInicioFerias: registro['Início das Férias'] || registro['dataInicioFerias'] || null,
                        proximaAvaliacao: registro['Próxima Avaliação'] || registro['proximaAvaliacao'] || null,
                        salario: registro['Salário'] || registro['salario'] || '',
                        salarioFamilia: registro['Salário Família'] || registro['salarioFamilia'] || '',
                        insalubridade: registro['Insalubridade'] || registro['insalubridade'] || '',
                        rt: registro['RT'] || registro['rt'] || '',
                        premiacao: registro['Premiação'] || registro['premiacao'] || '',
                        salarioBaseInss: registro['Salário Base INSS'] || registro['salarioBaseInss'] || '',
                        planoSaude: registro['Plano Saúde'] || registro['planoSaude'] || '',
                        cooparticipacao: registro['Cooparticipação'] || registro['cooparticipacao'] || '',
                        descVA: registro['Desc V.A'] || registro['descVA'] || '',
                        descVT: registro['Desc V.T'] || registro['descVT'] || '',
                        inss: registro['INSS'] || registro['inss'] || '',
                        irpf: registro['IRPF'] || registro['irpf'] || '',
                        valeAlimentacao: registro['Vale Alimentação'] || registro['valeAlimentacao'] || '',
                    };

                    const validationErrors = validateRecord(processedRecord);

                    if (validationErrors.length > 0) {
                        errorData.push({
                            linha: index + 2, 
                            nome: processedRecord.nome,
                            erros: validationErrors
                        });
                    }

                    processedData.push(processedRecord);
                });

                updatePreview(processedData, errorData);

            } catch (error) {
                console.error('Erro ao processar arquivo:', error);
                alert('Erro ao processar arquivo. Verifique o formato.');
            }
        };
        reader.readAsArrayBuffer(file);
    }

    function updatePreview(processedData, errorData) {
        // Update Preview Table
        const previewTableBody = document.getElementById('previewTableBody');
        previewTableBody.innerHTML = processedData.slice(0, 10).map(func => `
            <tr>
                <td>${func.nome || '-'}</td>
                <td>${func.cargo || '-'}</td>
                <td>${func.funcao || '-'}</td>
                <td>${func.status}</td>
                <td>${func.dataAdmissao || '-'}</td>
            </tr>
        `).join('');

        // Update Error Table
        const errorTableBody = document.getElementById('errorTableBody');
        errorTableBody.innerHTML = errorData.map(error => `
            <tr>
                <td>${error.linha}</td>
                <td>${error.nome}</td>
                <td>${error.erros.join(', ')}</td>
            </tr>
        `).join('');

        // Show/Hide Cards
        document.getElementById('previewCard').style.display = 'block';
        document.getElementById('errorCard').style.display = errorData.length > 0 ? 'block' : 'none';

        // Update counters
        document.getElementById('totalRegistros').textContent = `Total: ${processedData.length} registros`;
        document.getElementById('registrosValidados').textContent = `Válidos: ${processedData.length - errorData.length}`;

        // Confirm Import Button
        document.getElementById('confirmImportBtn').onclick = () => confirmImport(processedData);
    }

    function confirmImport(processedData) {
        const funcionariosAtuais = LocalStorageService.getData('funcionarios') || [];
        const novosFuncionarios = [...funcionariosAtuais, ...processedData];
        
        LocalStorageService.saveData('funcionarios', novosFuncionarios);
        
        alert(`Importação concluída: ${processedData.length} registros importados`);
        renderView('funcionarios');
    }

    function generateQRCode() {
        return btoa(Date.now().toString());
    }

    // Event Listeners
    document.getElementById('importBtn').addEventListener('click', () => {
        const fileInput = document.getElementById('xlsxFile');
        if (fileInput.files.length > 0) {
            processarArquivo(fileInput.files[0]);
        } else {
            alert('Por favor, selecione um arquivo XLSX para importar.');
        }
    });

    document.getElementById('cancelBtn').addEventListener('click', () => {
        renderView('funcionarios');
    });

    // Download Error Report
    document.getElementById('downloadErrorReport').addEventListener('click', () => {
        const errorData = Array.from(
            document.getElementById('errorTableBody').querySelectorAll('tr')
        ).map(row => ({
            linha: row.cells[0].textContent,
            nome: row.cells[1].textContent,
            erros: row.cells[2].textContent
        }));

        const ws = XLSX.utils.json_to_sheet(errorData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Erros de Importação");
        XLSX.writeFile(wb, `erros_importacao_${new Date().toISOString().split('T')[0]}.xlsx`);
    });
}