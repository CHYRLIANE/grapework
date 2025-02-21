import { LocalStorageService } from '../app.js';

export function renderRelatorios(container) {
    // Add XLSX and jsPDF library scripts dynamically
    if (!document.getElementById('xlsx-script')) {
        const xlsxScript = document.createElement('script');
        xlsxScript.id = 'xlsx-script';
        xlsxScript.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
        document.head.appendChild(xlsxScript);
    }

    if (!document.getElementById('jspdf-script')) {
        const jspdfScript = document.createElement('script');
        jspdfScript.id = 'jspdf-script';
        jspdfScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        document.head.appendChild(jspdfScript);
    }

    if (!document.getElementById('jspdf-autotable-script')) {
        const autoTableScript = document.createElement('script');
        autoTableScript.id = 'jspdf-autotable-script';
        autoTableScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.28/jspdf.plugin.autotable.min.js';
        document.head.appendChild(autoTableScript);
    }

    container.innerHTML = `
        <div class="container-fluid">
            <h1 class="mt-4">Relatórios - GrapeWork</h1>
            
            <!-- Filtros de Relatório -->
            <div class="card mb-4">
                <div class="card-header">
                    <h4>Configurações do Relatório</h4>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-3">
                            <label>Tipo de Relatório</label>
                            <select class="form-control" id="tipoRelatorio">
                                <option value="todos">Todos os Relatórios</option>
                                <option value="banco_horas">Banco de Horas</option>
                                <option value="eventos">Eventos</option>
                                <option value="pontualidade">Pontualidade</option>
                                <option value="produtividade">Produtividade</option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <label>Funcionário</label>
                            <select class="form-control" id="funcionarioFiltro">
                                <option value="">Todos os Funcionários</option>
                                ${getFuncionariosOptions()}
                            </select>
                        </div>
                        <div class="col-md-3">
                            <label>Setor</label>
                            <select class="form-control" id="setorFiltro">
                                <option value="">Todos os Setores</option>
                                ${getSetoresOptions()}
                            </select>
                        </div>
                        <div class="col-md-3">
                            <label>Período</label>
                            <div class="row">
                                <div class="col">
                                    <input type="date" class="form-control" id="dataInicial">
                                </div>
                                <div class="col">
                                    <input type="date" class="form-control" id="dataFinal">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row mt-3">
                        <div class="col-md-6">
                            <label>Filtro Adicional</label>
                            <select class="form-control" id="filtroAdicional">
                                <option value="">Todos</option>
                                <optgroup label="Eventos" id="eventosOpcoes">
                                    <option value="todos">Todos os Eventos</option>
                                    <option value="falta">Faltas</option>
                                    <option value="advertencia">Advertências</option>
                                    <option value="suspensao">Suspensões</option>
                                    <option value="atraso">Atrasos</option>
                                    <option value="atestado">Atestados</option>
                                </optgroup>
                            </select>
                        </div>
                        <div class="col-md-6 d-flex align-items-end">
                            <div class="btn-group w-100">
                                <button class="btn btn-primary" id="gerarRelatorioBtn">
                                    <i class="bi bi-file-earmark-spreadsheet me-2"></i>Gerar Relatório
                                </button>
                                <div class="btn-group">
                                    <button class="btn btn-success dropdown-toggle" id="exportarRelatorioBtn" data-bs-toggle="dropdown" disabled>
                                        <i class="bi bi-cloud-download me-2"></i>Exportar
                                    </button>
                                    <ul class="dropdown-menu">
                                        <li>
                                            <a class="dropdown-item" href="#" id="exportExcelBtn">
                                                <i class="bi bi-file-excel me-2"></i>Excel (.xlsx)
                                            </a>
                                        </li>
                                        <li>
                                            <a class="dropdown-item" href="#" id="exportPdfBtn">
                                                <i class="bi bi-file-pdf me-2"></i>PDF
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                                <button class="btn btn-secondary" id="enviarEmailBtn" disabled>
                                    <i class="bi bi-envelope me-2"></i>Enviar por E-mail
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Pré-visualização do Relatório -->
            <div class="card mb-4" id="previewCard" style="display:none;">
                <div class="card-header">
                    <h4>Pré-visualização do Relatório</h4>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-8">
                            <div class="table-responsive">
                                <table class="table table-striped" id="relatorioPreviewTable">
                                    <thead></thead>
                                    <tbody></tbody>
                                </table>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="card">
                                <div class="card-header">Resumo</div>
                                <div class="card-body">
                                    <div id="relatorioSumario"></div>
                                    <canvas id="relatorioPieChart"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Histórico de Relatórios -->
            <div class="card">
                <div class="card-header">
                    <h4>Histórico de Relatórios</h4>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table" id="historicoRelatorios">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Data</th>
                                    <th>Tipo</th>
                                    <th>Período</th>
                                    <th>Status</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody></tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Helpers for populating select options
    function getFuncionariosOptions() {
        const funcionarios = LocalStorageService.getData('funcionarios') || [];
        return funcionarios.map(f => `<option value="${f.nome}">${f.nome}</option>`).join('');
    }

    function getSetoresOptions() {
        const funcionarios = LocalStorageService.getData('funcionarios') || [];
        const setores = [...new Set(funcionarios.map(f => f.setor).filter(Boolean))];
        return setores.map(setor => `<option value="${setor}">${setor}</option>`).join('');
    }

    // Dynamically adjust additional filter based on report type
    document.getElementById('tipoRelatorio').addEventListener('change', (e) => {
        const filtroAdicional = document.getElementById('filtroAdicional');
        const eventosOpcoes = document.getElementById('eventosOpcoes');

        // Reset and hide/show options
        filtroAdicional.value = '';
        switch(e.target.value) {
            case 'eventos':
                eventosOpcoes.style.display = 'block';
                break;
            default:
                eventosOpcoes.style.display = 'none';
        }
    });

    // Gerar Relatório
    document.getElementById('gerarRelatorioBtn').addEventListener('click', async () => {
        const tipoRelatorio = document.getElementById('tipoRelatorio').value;
        const funcionario = document.getElementById('funcionarioFiltro').value;
        const setor = document.getElementById('setorFiltro').value;
        const dataInicial = document.getElementById('dataInicial').value;
        const dataFinal = document.getElementById('dataFinal').value;
        const filtroAdicional = document.getElementById('filtroAdicional').value;

        // Validation
        if (!dataInicial || !dataFinal) {
            alert('Por favor, selecione um período para o relatório');
            return;
        }

        // Show loading state
        const gerarBtn = document.getElementById('gerarRelatorioBtn');
        const exportarBtn = document.getElementById('exportarRelatorioBtn');
        const enviarEmailBtn = document.getElementById('enviarEmailBtn');
        
        gerarBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Gerando...';
        gerarBtn.disabled = true;
        exportarBtn.disabled = true;
        enviarEmailBtn.disabled = true;

        try {
            // Construct query parameters
            const params = new URLSearchParams({
                tipo: tipoRelatorio === 'todos' ? filtroAdicional || 'todos' : tipoRelatorio,
                periodoInicio: dataInicial,
                periodoFim: dataFinal
            });

            if (funcionario) params.append('funcionario', funcionario);
            if (setor) params.append('setor', setor);

            // Make API request
            const response = await fetch(`/api/relatorios?${params.toString()}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const dadosRelatorio = await response.json();

            if (!dadosRelatorio || (Array.isArray(dadosRelatorio) && dadosRelatorio.length === 0)) {
                alert('Nenhum dado encontrado para os filtros selecionados');
                document.getElementById('previewCard').style.display = 'none';
                return;
            }

            // Update preview with received data
            atualizarPreviewRelatorio(dadosRelatorio, tipoRelatorio);

            // Save to history with status from API
            salvarHistoricoRelatorio({
                tipo: tipoRelatorio,
                periodoInicial: dataInicial,
                periodoFinal: dataFinal,
                status: 'Gerado com sucesso',
                data: new Date().toLocaleString(),
                dadosRelatorio // Store the actual data
            });

            // Enable export buttons
            exportarBtn.disabled = false;
            enviarEmailBtn.disabled = false;

            // Show preview card
            document.getElementById('previewCard').style.display = 'block';

        } catch (error) {
            console.error('Erro ao gerar relatório:', error);
            alert('Erro ao gerar relatório. Por favor, tente novamente.');
            
            // Save failed attempt to history
            salvarHistoricoRelatorio({
                tipo: tipoRelatorio,
                periodoInicial: dataInicial,
                periodoFinal: dataFinal,
                status: 'Erro na geração',
                data: new Date().toLocaleString()
            });

        } finally {
            // Restore button states
            gerarBtn.innerHTML = '<i class="bi bi-file-earmark-spreadsheet me-2"></i>Gerar Relatório';
            gerarBtn.disabled = false;
        }
    });

    function salvarHistoricoRelatorio(relatorio) {
        const historico = JSON.parse(localStorage.getItem('historicoRelatorios') || '[]');
        const novoRegistro = {
            id: Date.now(),
            ...relatorio
        };

        historico.unshift(novoRegistro);
        localStorage.setItem('historicoRelatorios', JSON.stringify(historico.slice(0, 10)));

        atualizarTabelaHistorico();
    }

    function atualizarTabelaHistorico() {
        const historico = JSON.parse(localStorage.getItem('historicoRelatorios') || '[]');
        const historicoTable = document.getElementById('historicoRelatorios').getElementsByTagName('tbody')[0];
        
        historicoTable.innerHTML = historico.map(registro => `
            <tr>
                <td>
                    <div class="form-check">
                        <input class="form-check-input select-report" type="checkbox" value="${registro.id}">
                    </div>
                </td>
                <td>${registro.data}</td>
                <td>${formatarTipoRelatorio(registro.tipo)}</td>
                <td>${registro.periodoInicial} - ${registro.periodoFinal}</td>
                <td>
                    <span class="badge bg-${registro.status.includes('Erro') ? 'danger' : 'success'}">
                        ${registro.status}
                    </span>
                </td>
                <td>
                    <div class="btn-group">
                        <button class="btn btn-sm btn-primary recuperar-relatorio" 
                                data-id="${registro.id}" 
                                data-bs-toggle="tooltip" 
                                title="Recuperar relatório">
                            <i class="bi bi-cloud-download"></i>
                        </button>
                        <button class="btn btn-sm btn-success export-excel" 
                                data-id="${registro.id}"
                                data-bs-toggle="tooltip" 
                                title="Exportar para Excel"
                                ${!registro.dadosRelatorio ? 'disabled' : ''}>
                            <i class="bi bi-file-excel"></i>
                        </button>
                        <button class="btn btn-sm btn-danger export-pdf" 
                                data-id="${registro.id}"
                                data-bs-toggle="tooltip" 
                                title="Exportar para PDF"
                                ${!registro.dadosRelatorio ? 'disabled' : ''}>
                            <i class="bi bi-file-pdf"></i>
                        </button>
                        <button class="btn btn-sm btn-info send-email" 
                                data-id="${registro.id}"
                                data-bs-toggle="tooltip" 
                                title="Enviar por e-mail"
                                ${!registro.dadosRelatorio ? 'disabled' : ''}>
                            <i class="bi bi-envelope"></i>
                        </button>
                        <button class="btn btn-sm btn-danger delete-report" 
                                data-id="${registro.id}"
                                data-bs-toggle="tooltip" 
                                title="Excluir relatório">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        // Re-initialize event listeners and tooltips
        initializeTableEventListeners();
    }

    // ... (keep existing utility functions and event handlers)

    function atualizarPreviewRelatorio(dadosRelatorio, tipoRelatorio) {
        const previewCard = document.getElementById('previewCard');
        const previewTable = document.getElementById('relatorioPreviewTable');
        const sumarioDiv = document.getElementById('relatorioSumario');

        // Clear previous content
        previewTable.querySelector('thead').innerHTML = '';
        previewTable.querySelector('tbody').innerHTML = '';

        if (tipoRelatorio === 'todos') {
            let combinedHtml = '<div class="accordion" id="reportAccordion">';
            
            // Process each report type
            if (dadosRelatorio.bancoHoras?.length > 0) {
                combinedHtml += createAccordionSection('bancoHoras', 'Banco de Horas', dadosRelatorio.bancoHoras);
            }
            if (dadosRelatorio.eventos?.length > 0) {
                combinedHtml += createAccordionSection('eventos', 'Eventos', dadosRelatorio.eventos);
            }
            if (dadosRelatorio.pontualidade?.length > 0) {
                combinedHtml += createAccordionSection('pontualidade', 'Pontualidade', dadosRelatorio.pontualidade);
            }
            if (dadosRelatorio.produtividade?.length > 0) {
                combinedHtml += createAccordionSection('produtividade', 'Produtividade', dadosRelatorio.produtividade);
            }
            
            combinedHtml += '</div>';
            previewTable.innerHTML = combinedHtml;

            // Update summary for combined report
            let totalRegistros = 0;
            Object.values(dadosRelatorio).forEach(data => {
                if (Array.isArray(data)) {
                    totalRegistros += data.length;
                }
            });

            sumarioDiv.innerHTML = `
                <h5>Resumo Geral</h5>
                <ul class="list-unstyled">
                    <li>Total de Registros: ${totalRegistros}</li>
                    <li>Banco de Horas: ${dadosRelatorio.bancoHoras?.length || 0} registros</li>
                    <li>Eventos: ${dadosRelatorio.eventos?.length || 0} registros</li>
                    <li>Pontualidade: ${dadosRelatorio.pontualidade?.length || 0} registros</li>
                    <li>Produtividade: ${dadosRelatorio.produtividade?.length || 0} registros</li>
                    <li>Período: ${document.getElementById('dataInicial').value} a ${document.getElementById('dataFinal').value}</li>
                </ul>
            `;
        } else {
            // Handle single report type
            const headers = Object.keys(dadosRelatorio[0] || {});
            
            // Create header row
            const headerRow = document.createElement('tr');
            headers.forEach(header => {
                const th = document.createElement('th');
                th.textContent = header.charAt(0).toUpperCase() + header.slice(1).replace(/([A-Z])/g, ' $1');
                headerRow.appendChild(th);
            });
            previewTable.querySelector('thead').appendChild(headerRow);

            // Create data rows
            dadosRelatorio.forEach(item => {
                const row = document.createElement('tr');
                headers.forEach(header => {
                    const td = document.createElement('td');
                    td.textContent = item[header] || '-';
                    row.appendChild(td);
                });
                previewTable.querySelector('tbody').appendChild(row);
            });

            // Update summary
            sumarioDiv.innerHTML = `
                <h5>Resumo do Relatório</h5>
                <ul class="list-unstyled">
                    <li>Total de Registros: ${dadosRelatorio.length}</li>
                    <li>Tipo: ${formatarTipoRelatorio(tipoRelatorio)}</li>
                    <li>Período: ${document.getElementById('dataInicial').value} a ${document.getElementById('dataFinal').value}</li>
                </ul>
            `;

            // Generate chart if applicable
            if (['eventos', 'pontualidade', 'produtividade'].includes(tipoRelatorio)) {
                criarGraficoPizza(dadosRelatorio, tipoRelatorio);
            }
        }

        // Show preview card
        previewCard.style.display = 'block';
    }

    function criarGraficoPizza(dadosRelatorio, tipoRelatorio) {
        const ctx = document.getElementById('relatorioPieChart');
        const existingChart = Chart.getChart(ctx);
        if (existingChart) {
            existingChart.destroy();
        }

        let labels = [];
        let data = [];
        let backgroundColor = [];

        switch(tipoRelatorio) {
            case 'eventos':
                const tiposEventos = {};
                dadosRelatorio.forEach(evento => {
                    tiposEventos[evento.tipo] = (tiposEventos[evento.tipo] || 0) + 1;
                });
                labels = Object.keys(tiposEventos);
                data = Object.values(tiposEventos);
                backgroundColor = [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'
                ];
                break;
            case 'pontualidade':
                labels = ['Pontual', 'Com Eventos'];
                const totalPessoas = dadosRelatorio.length;
                const pessoasComEventos = dadosRelatorio.filter(p => p.totalEventos > 0).length;
                data = [totalPessoas - pessoasComEventos, pessoasComEventos];
                backgroundColor = ['#4BC0C0', '#FF6384'];
                break;
            case 'produtividade':
                const statusProdutividade = {};
                dadosRelatorio.forEach(item => {
                    statusProdutividade[item.statusProdutividade] = 
                        (statusProdutividade[item.statusProdutividade] || 0) + 1;
                });
                labels = Object.keys(statusProdutividade);
                data = Object.values(statusProdutividade);
                backgroundColor = ['#4BC0C0', '#36A2EB', '#FFCE56', '#FF6384'];
                break;
        }

        // Criar gráfico de pizza
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: backgroundColor
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: `Distribuição de ${tipoRelatorio}`
                    }
                }
            }
        });
    }

    function formatarTipoRelatorio(tipo) {
        const mapeamento = {
            'banco_horas': 'Banco de Horas',
            'eventos': 'Eventos',
            'pontualidade': 'Pontualidade',
            'produtividade': 'Produtividade'
        };
        return mapeamento[tipo] || tipo;
    }

    function createAccordionSection(id, title, data) {
        if (!data || data.length === 0) return '';
        
        const headers = Object.keys(data[0]);
        const rows = data.map(item => 
            `<tr>${headers.map(header => `<td>${item[header] || '-'}</td>`).join('')}</tr>`
        ).join('');

        return `
            <div class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${id}">
                        ${title} (${data.length} registros)
                    </button>
                </h2>
                <div id="collapse${id}" class="accordion-collapse collapse">
                    <div class="accordion-body">
                        <table class="table table-striped">
                            <thead>
                                <tr>${headers.map(h => `<th>${h.charAt(0).toUpperCase() + h.slice(1).replace(/([A-Z])/g, ' $1')}</th>`).join('')}</tr>
                            </thead>
                            <tbody>${rows}</tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    function initializeTableEventListeners() {
        // Checkbox selection handlers
        const checkboxes = document.querySelectorAll('.select-report');
        const deleteSelectedBtn = document.getElementById('deleteSelectedBtn');
        const selectedCountSpan = document.getElementById('selectedCount');

        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                const selectedCount = document.querySelectorAll('.select-report:checked').length;
                deleteSelectedBtn.disabled = selectedCount === 0;
                selectedCountSpan.textContent = `${selectedCount} relatório${selectedCount !== 1 ? 's' : ''} selecionado${selectedCount !== 1 ? 's' : ''}`;
            });
        });

        // Add "Select All" functionality
        const selectAllCheckbox = document.createElement('input');
        selectAllCheckbox.type = 'checkbox';
        selectAllCheckbox.className = 'form-check-input';
        selectAllCheckbox.id = 'selectAllReports';
        
        const selectAllCell = document.querySelector('#historicoRelatorios thead tr').insertCell(0);
        selectAllCell.appendChild(selectAllCheckbox);

        selectAllCheckbox.addEventListener('change', (e) => {
            checkboxes.forEach(checkbox => {
                checkbox.checked = e.target.checked;
            });
            const selectedCount = e.target.checked ? checkboxes.length : 0;
            deleteSelectedBtn.disabled = selectedCount === 0;
            selectedCountSpan.textContent = `${selectedCount} relatório${selectedCount !== 1 ? 's' : ''} selecionado${selectedCount !== 1 ? 's' : ''}`;
        });

        // Button handlers
        document.querySelectorAll('.recuperar-relatorio').forEach(btn => {
            btn.addEventListener('click', () => recuperarRelatorio(btn.dataset.id));
        });

        document.querySelectorAll('.export-excel').forEach(btn => {
            btn.addEventListener('click', () => exportarRelatorioExcel(btn.dataset.id));
        });

        document.querySelectorAll('.export-pdf').forEach(btn => {
            btn.addEventListener('click', () => exportarRelatorioPDF(btn.dataset.id));
        });

        document.querySelectorAll('.send-email').forEach(btn => {
            btn.addEventListener('click', () => enviarRelatorioEmail(btn.dataset.id));
        });

        document.querySelectorAll('.delete-report').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                if (confirm('Tem certeza que deseja excluir este relatório?')) {
                    deleteReport(btn.dataset.id);
                }
            });
        });

        // Bulk delete handler
        deleteSelectedBtn.addEventListener('click', () => {
            const selectedIds = Array.from(document.querySelectorAll('.select-report:checked'))
                .map(checkbox => checkbox.value);
            
            if (selectedIds.length > 0 && confirm(`Tem certeza que deseja excluir ${selectedIds.length} relatório(s)?`)) {
                deleteMultipleReports(selectedIds);
            }
        });

        // Initialize tooltips
        const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        tooltips.forEach(tooltip => new bootstrap.Tooltip(tooltip));
    }

    function deleteReport(id) {
        const historico = JSON.parse(localStorage.getItem('historicoRelatorios') || '[]');
        const updatedHistorico = historico.filter(registro => registro.id !== Number(id));
        localStorage.setItem('historicoRelatorios', JSON.stringify(updatedHistorico));
        atualizarTabelaHistorico();
    }

    function deleteMultipleReports(ids) {
        const historico = JSON.parse(localStorage.getItem('historicoRelatorios') || '[]');
        const updatedHistorico = historico.filter(registro => !ids.includes(registro.id.toString()));
        localStorage.setItem('historicoRelatorios', JSON.stringify(updatedHistorico));
        atualizarTabelaHistorico();
    }

    function exportToExcel(dadosRelatorio, tipoRelatorio) {
        const wb = XLSX.utils.book_new();
        
        // Convert data to worksheet format
        const wsData = [
            // Header row
            Object.keys(dadosRelatorio[0]),
            // Data rows
            ...dadosRelatorio.map(item => Object.values(item))
        ];
        
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        
        // Add the worksheet to the workbook
        XLSX.utils.book_append_sheet(wb, ws, `Relatório ${formatarTipoRelatorio(tipoRelatorio)}`);
        
        // Generate filename with date
        const date = new Date().toISOString().split('T')[0];
        const filename = `relatorio_${tipoRelatorio}_${date}.xlsx`;
        
        // Save the file
        XLSX.writeFile(wb, filename);

        // Add confirmation
        alert(`Relatório exportado com sucesso: ${filename}`);
    }

    function exportToPDF(dadosRelatorio, tipoRelatorio) {
        // Create new PDF document
        const doc = new jsPDF();
        
        // Add title
        doc.setFontSize(16);
        doc.text(`Relatório de ${formatarTipoRelatorio(tipoRelatorio)}`, 14, 15);
        
        // Add date
        doc.setFontSize(10);
        doc.text(`Gerado em: ${new Date().toLocaleDateString()}`, 14, 25);
        
        // Prepare data for autotable
        const headers = Object.keys(dadosRelatorio[0]);
        const data = dadosRelatorio.map(item => Object.values(item));
        
        // Add table
        doc.autoTable({
            head: [headers],
            body: data,
            startY: 30,
            styles: { fontSize: 8 },
            headStyles: { fillColor: [106, 13, 173] }, // Roxo GrapeWork
            alternateRowStyles: { fillColor: [245, 245, 245] }
        });
        
        // Generate filename with date
        const date = new Date().toISOString().split('T')[0];
        const filename = `relatorio_${tipoRelatorio}_${date}.pdf`;
        
        // Save the file
        doc.save(filename);

        // Add confirmation
        alert(`Relatório PDF exportado com sucesso: ${filename}`);
    }

    function recuperarRelatorio(id) {
        const historico = JSON.parse(localStorage.getItem('historicoRelatorios') || '[]');
        const registro = historico.find(r => r.id === Number(id));

        if (registro) {
            // Preencher filtros
            document.getElementById('tipoRelatorio').value = registro.tipo;
            document.getElementById('dataInicial').value = registro.periodoInicial;
            document.getElementById('dataFinal').value = registro.periodoFinal;

            // Gerar relatório novamente
            document.getElementById('gerarRelatorioBtn').click();
        }
    }

    function exportarRelatorioExcel(id) {
        const historico = JSON.parse(localStorage.getItem('historicoRelatorios') || '[]');
        const registro = historico.find(r => r.id === Number(id));
        
        if (registro) {
            const dadosRelatorio = registro.dadosRelatorio;
            exportToExcel(dadosRelatorio, registro.tipo);
        }
    }

    function exportarRelatorioPDF(id) {
        const historico = JSON.parse(localStorage.getItem('historicoRelatorios') || '[]');
        const registro = historico.find(r => r.id === Number(id));
        
        if (registro) {
            const dadosRelatorio = registro.dadosRelatorio;
            exportToPDF(dadosRelatorio, registro.tipo);
        }
    }

    function enviarRelatorioEmail(id) {
        const historico = JSON.parse(localStorage.getItem('historicoRelatorios') || '[]');
        const registro = historico.find(r => r.id === Number(id));
        
        if (registro) {
            const destinatario = prompt('Digite o e-mail de destino:');
            if (destinatario && validateEmail(destinatario)) {
                // Simulate email sending
                alert(`Relatório de ${formatarTipoRelatorio(registro.tipo)} enviado para ${destinatario}`);
            } else if (destinatario) {
                alert('Por favor, insira um endereço de e-mail válido.');
            }
        }
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // Inicializar histórico
    atualizarTabelaHistorico();

    container.innerHTML += `
        <!-- Add Legend -->
        <div class="card mt-3">
            <div class="card-header">
                <h5>Legenda dos Botões</h5>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-12">
                        <div class="btn-group me-3">
                            <button class="btn btn-sm btn-primary" disabled>
                                <i class="bi bi-cloud-download"></i>
                            </button>
                            <span class="ms-2">Recuperar relatório</span>
                        </div>
                        <div class="btn-group me-3">
                            <button class="btn btn-sm btn-success" disabled>
                                <i class="bi bi-file-excel"></i>
                            </button>
                            <span class="ms-2">Exportar para Excel</span>
                        </div>
                        <div class="btn-group me-3">
                            <button class="btn btn-sm btn-danger" disabled>
                                <i class="bi bi-file-pdf"></i>
                            </button>
                            <span class="ms-2">Exportar para PDF</span>
                        </div>
                        <div class="btn-group me-3">
                            <button class="btn btn-sm btn-info" disabled>
                                <i class="bi bi-envelope"></i>
                            </button>
                            <span class="ms-2">Enviar por e-mail</span>
                        </div>
                        <div class="btn-group">
                            <button class="btn btn-sm btn-danger" disabled>
                                <i class="bi bi-trash"></i>
                            </button>
                            <span class="ms-2">Excluir relatório</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Add bulk actions -->
        <div class="card mt-3">
            <div class="card-header">
                <h5>Ações em Massa</h5>
            </div>
            <div class="card-body">
                <button class="btn btn-danger" id="deleteSelectedBtn" disabled>
                    <i class="bi bi-trash"></i> Excluir Selecionados
                </button>
                <span class="ms-3" id="selectedCount">0 relatórios selecionados</span>
            </div>
        </div>
    `;

    // Initialize tooltips
    const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltips.forEach(tooltip => new bootstrap.Tooltip(tooltip));

    initializeTableEventListeners();
}