import { LocalStorageService } from '../app.js';

export function renderBancoHoras(container) {
    // Add PDF.js library script dynamically
    if (!document.getElementById('pdfjs-script')) {
        const pdfjsScript = document.createElement('script');
        pdfjsScript.id = 'pdfjs-script';
        pdfjsScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.min.js';
        document.head.appendChild(pdfjsScript);
    }

    container.innerHTML = `
        <div class="container-fluid">
            <h1 class="mt-4">Banco de Horas - GrapeWork</h1>
            
            <div class="card mb-4">
                <div class="card-header">
                    <h4>Importar Relatório de Banco de Horas (PDF)</h4>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label class="form-label">Selecionar Arquivo(s) PDF</label>
                                <input type="file" class="form-control" id="pdfUpload" accept=".pdf" multiple>
                            </div>
                        </div>
                        <div class="col-md-6 d-flex align-items-end">
                            <button class="btn btn-primary" id="importPDFBtn">
                                <i class="bi bi-upload me-2"></i>Importar PDFs
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Resultados da Importação -->
            <div id="importResults" class="card mt-4" style="display:none;">
                <div class="card-header">
                    <h4>Resultados da Importação</h4>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-striped" id="importResultsTable">
                            <thead>
                                <tr>
                                    <th>Funcionário</th>
                                    <th>Saldo do Período</th>
                                    <th>Período</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody id="importResultsTableBody"></tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Painel Resumo Mês a Mês -->
            <div class="card mt-4">
                <div class="card-header">
                    <div class="row">
                        <div class="col-md-6">
                            <h4>Resumo Mensal de Banco de Horas</h4>
                        </div>
                        <div class="col-md-6">
                            <select class="form-control" id="funcionarioSelecionado">
                                <option value="">Todos os Funcionários</option>
                                ${getFuncionariosOptions()}
                            </select>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <div id="resumoMensalContainer" class="row"></div>
                </div>
            </div>
        </div>
    `;

    // Helper function to get funcionarios options
    function getFuncionariosOptions() {
        const funcionarios = LocalStorageService.getData('funcionarios') || [];
        return funcionarios.map(f => `<option value="${f.nome}">${f.nome}</option>`).join('');
    }

    // Resumo Mensal Handler
    function calcularResumoMensal(funcionarioFiltro = null) {
        const bancoHoras = LocalStorageService.getData('banco_horas') || [];
        const mesesData = {};
        const mesesNomes = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];

        // Filtrar banco de horas por funcionário, se selecionado
        const bancoHorasFiltrado = funcionarioFiltro 
            ? bancoHoras.filter(bh => bh.funcionario === funcionarioFiltro)
            : bancoHoras;

        // Processar cada entrada do banco de horas
        bancoHorasFiltrado.forEach(entrada => {
            const data = new Date(entrada.dataFinal || entrada.data);
            const mes = data.getMonth();
            const ano = data.getFullYear();
            const chave = `${ano}-${mes}`;

            if (!mesesData[chave]) {
                mesesData[chave] = {
                    nome: `${mesesNomes[mes]} ${ano}`,
                    saldoInicial: 0,
                    horasTrabalhadas: 0,
                    horasCompensadas: 0,
                    saldoFinal: convertTimeToHours(entrada.saldo || '00:00')
                };
            } else {
                // Acumular saldo final
                mesesData[chave].saldoFinal += convertTimeToHours(entrada.saldo || '00:00');
            }
        });

        // Renderizar resumo mensal
        const resumoMensalContainer = document.getElementById('resumoMensalContainer');
        resumoMensalContainer.innerHTML = Object.values(mesesData)
            .sort((a, b) => {
                const [anoA, mesA] = a.nome.split(' ');
                const [anoB, mesB] = b.nome.split(' ');
                return new Date(anoA, mesesNomes.indexOf(mesA)) - 
                       new Date(anoB, mesesNomes.indexOf(mesB));
            })
            .map(mes => `
                <div class="col-md-4 mb-3">
                    <div class="card ${mes.saldoFinal >= 0 ? 'border-success' : 'border-danger'}">
                        <div class="card-header ${mes.saldoFinal >= 0 ? 'bg-success text-white' : 'bg-danger text-white'}">
                            ${mes.nome}
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-6">Saldo Inicial:</div>
                                <div class="col-6">0h</div>
                                <div class="col-6">Horas Trabalhadas:</div>
                                <div class="col-6">${mes.horasTrabalhadas.toFixed(2)}h</div>
                                <div class="col-6">Horas Compensadas:</div>
                                <div class="col-6">${mes.horasCompensadas.toFixed(2)}h</div>
                                <div class="col-6"><strong>Saldo Final:</strong></div>
                                <div class="col-6">
                                    <strong class="${mes.saldoFinal >= 0 ? 'text-success' : 'text-danger'}">
                                        ${mes.saldoFinal.toFixed(2)}h
                                    </strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');
    }

    const pdfUploadInput = document.getElementById('pdfUpload');
    const importPDFBtn = document.getElementById('importPDFBtn');
    const importResults = document.getElementById('importResults');
    const importResultsTableBody = document.getElementById('importResultsTableBody');

    // Extraction Patterns
    const extractionPatterns = {
        name: [
            /\|([A-ZÃÁÀÂ!ÄÇÉÊËÍÌÎÏÕÓÒÔÖÚÙÛÜÑ]+\s+[A-ZÃÁÀÂ!ÄÇÉÊËÍÌÎÏÕÓÒÔÖÚÙÛÜÑ]+(?:\s+[A-ZÃÁÀÂ!ÄÇÉÊËÍÌÎÏÕÓÒÔÖÚÙÛÜÑ]+)*)\|/,
            /Nome\s*(?:do\s*Colaborador)?[:]\s*([^\n]+)/i,
            /\b([A-ZÃÁÀÂ!ÄÇÉÊËÍÌÎÏÕÓÒÔÖÚÙÛÜÑ]+\s+[A-ZÃÁÀÂ!ÄÇÉÊËÍÌÎÏÕÓÒÔÖÚÙÛÜÑ]+(?:\s+[A-ZÃÁÀÂ!ÄÇÉÊËÍÌÎÏÕÓÒÔÖÚÙÛÜÑ]+)*)\b/
        ],
        periodBalance: [
            /Saldo\s*(?:do\s*Período)?[:]\s*([-+]?\d{2}:\d{2})/i,
            /Saldo\s*(?:Acumulado)?[:]\s*([-+]?\d{2}:\d{2})/i,
            /Total\s*Praticado\s*(?:Primeira\s*Fase)?[:]\s*([-+]?\d{2}:\d{2})/i
        ],
        period: [
            /Periodo:\s*de\s*(\d{2}\/\d{2}\/\d{4})\s*a\s*(\d{2}\/\d{2}\/\d{4})/i
        ]
    };

    // Find match in text using multiple patterns
    function findMatch(text, patterns, index = 0) {
        for (let pattern of patterns) {
            const match = text.match(pattern);
            if (match) return match[index + 1].trim();
        }
        return null;
    }

    // Convert date from DD/MM/YYYY to YYYY-MM-DD
    function convertDateFormat(dateStr) {
        if (!dateStr) return null;
        const [day, month, year] = dateStr.split('/');
        return `${year}-${month}-${day}`;
    }

    // Process single PDF file
    async function processPDF(file) {
        if (typeof pdfjsLib === 'undefined') {
            throw new Error('PDF.js library not loaded');
        }

        try {
            const loadingTask = pdfjsLib.getDocument(URL.createObjectURL(file));
            const pdf = await loadingTask.promise;
            
            const extractedData = [];

            // Process each page
            for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                const page = await pdf.getPage(pageNum);
                const textContent = await page.getTextContent();
                const fullText = textContent.items.map(item => item.str).join(' ');

                // Extract name, period balance, and reference period
                const name = findMatch(fullText, extractionPatterns.name);
                const balanceStr = findMatch(fullText, extractionPatterns.periodBalance);
                const periodMatch = findMatch(fullText, extractionPatterns.period, 1);
                
                // Check if we have valid data
                if (name && balanceStr) {
                    extractedData.push({
                        nome: name,
                        saldoPeriodo: balanceStr,
                        dataInicial: periodMatch ? convertDateFormat(periodMatch[0]) : null,
                        dataFinal: periodMatch ? convertDateFormat(periodMatch[1]) : null
                    });
                }
            }

            return extractedData;

        } catch (error) {
            console.error('PDF Extraction Error:', error);
            throw error;
        }
    }

    // Validate and save banco de horas data
    function saveBancoHoras(importedData) {
        const bancoHorasAtual = LocalStorageService.getData('banco_horas') || [];
        const funcionarios = LocalStorageService.getData('funcionarios') || [];
        const resultados = [];

        importedData.forEach(data => {
            // Find matching funcionário
            const funcionario = funcionarios.find(f => 
                f.nome.toLowerCase().includes(data.nome.toLowerCase())
            );

            if (funcionario) {
                // Prepare new banco de horas entry
                const novoLancamento = {
                    id: Date.now() + Math.random(),
                    funcionario: funcionario.nome,
                    saldo: data.saldoPeriodo,
                    dataInicial: data.dataInicial || new Date().toISOString().slice(0, 10),
                    dataFinal: data.dataFinal || new Date().toISOString().slice(0, 10)
                };

                bancoHorasAtual.push(novoLancamento);
                resultados.push({
                    nome: funcionario.nome,
                    saldo: data.saldoPeriodo,
                    status: 'Importado com Sucesso'
                });
            } else {
                resultados.push({
                    nome: data.nome,
                    saldo: data.saldoPeriodo,
                    status: 'Funcionário não encontrado'
                });
            }
        });

        // Save updated banco de horas
        LocalStorageService.saveData('banco_horas', bancoHorasAtual);

        // Update dashboard total hours
        updateDashboardTotalHours(bancoHorasAtual);

        return resultados;
    }

    // Update dashboard total hours
    function updateDashboardTotalHours(bancoHorasAtual) {
        // Get the most recent saldo for each employee
        const totalHorasPorFuncionario = {};
        bancoHorasAtual.forEach(lancamento => {
            totalHorasPorFuncionario[lancamento.funcionario] = lancamento.saldo;
        });

        // Calculate total across all employees
        const totalHoras = Object.values(totalHorasPorFuncionario)
            .reduce((sum, saldo) => sum + convertTimeToHours(saldo), 0);

        // Save total hours to local storage for dashboard access
        LocalStorageService.saveData('total_horas', totalHoras);
    }

    // Convert time string to decimal hours
    function convertTimeToHours(timeStr) {
        if (!timeStr) return 0;
        
        const isNegative = timeStr.startsWith('-');
        const [hours, minutes] = timeStr.replace(/[+-]/, '').split(':').map(Number);
        const decimalHours = hours + (minutes / 60);
        
        return isNegative ? -decimalHours : decimalHours;
    }

    // Handle PDF Import
    importPDFBtn.addEventListener('click', async () => {
        const pdfFiles = pdfUploadInput.files;
        if (pdfFiles.length === 0) {
            alert('Por favor, selecione um ou mais arquivos PDF');
            return;
        }

        try {
            // Disable button during processing
            importPDFBtn.disabled = true;
            importPDFBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processando...';

            // Process all PDFs
            const allExtractedData = [];
            for (let file of pdfFiles) {
                const fileData = await processPDF(file);
                allExtractedData.push(...fileData);
            }

            // Save data and get results
            const resultados = saveBancoHoras(allExtractedData);

            // Update results table
            importResultsTableBody.innerHTML = resultados.map(resultado => `
                <tr class="${resultado.status === 'Importado com Sucesso' ? 'table-success' : 'table-warning'}">
                    <td>${resultado.nome}</td>
                    <td>${resultado.saldo}</td>
                    <td>${new Date().toLocaleDateString()}</td>
                    <td>
                        <span class="badge ${resultado.status === 'Importado com Sucesso' ? 'bg-success' : 'bg-warning'}">
                            ${resultado.status}
                        </span>
                    </td>
                </tr>
            `).join('');

            // Show results section
            importResults.style.display = 'block';

            alert('Dados importados e salvos com sucesso!');

        } catch (error) {
            console.error('Erro na importação:', error);
            alert(`Erro na importação: ${error.message}`);
        } finally {
            // Restore button
            importPDFBtn.disabled = false;
            importPDFBtn.innerHTML = '<i class="bi bi-upload me-2"></i>Importar PDFs';
        }

        // Após a importação, atualizar o resumo mensal
        calcularResumoMensal();
    });

    // Adicionar listener para filtro de funcionário
    document.getElementById('funcionarioSelecionado').addEventListener('change', (e) => {
        const funcionarioSelecionado = e.target.value;
        calcularResumoMensal(funcionarioSelecionado);
    });

    // Chamar inicialmente para popular o resumo
    calcularResumoMensal();
}