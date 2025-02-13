import { LocalStorageService } from '../app.js';

export function renderRelatorios(container) {
    // Add XLSX library script dynamically
    if (!document.getElementById('xlsx-script')) {
        const xlsxScript = document.createElement('script');
        xlsxScript.id = 'xlsx-script';
        xlsxScript.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
        document.head.appendChild(xlsxScript);
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
                                <option value="">Selecione</option>
                                <optgroup label="Eventos" id="eventosOpcoes">
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
                                <button class="btn btn-success" id="exportarRelatorioBtn" disabled>
                                    <i class="bi bi-cloud-download me-2"></i>Exportar
                                </button>
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
                                    <th>Data</th>
                                    <th>Tipo</th>
                                    <th>Período</th>
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
    document.getElementById('gerarRelatorioBtn').addEventListener('click', gerarRelatorio);

    function gerarRelatorio() {
        const tipoRelatorio = document.getElementById('tipoRelatorio').value;
        const funcionario = document.getElementById('funcionarioFiltro').value;
        const setor = document.getElementById('setorFiltro').value;
        const dataInicial = document.getElementById('dataInicial').value;
        const dataFinal = document.getElementById('dataFinal').value;
        const filtroAdicional = document.getElementById('filtroAdicional').value;

        let dadosRelatorio = [];
        let sumario = {};

        // Carregar dados com base no tipo de relatório
        switch(tipoRelatorio) {
            case 'banco_horas':
                dadosRelatorio = processarBancoHoras(funcionario, setor, dataInicial, dataFinal);
                break;
            case 'eventos':
                dadosRelatorio = processarEventos(funcionario, setor, dataInicial, dataFinal, filtroAdicional);
                break;
            case 'pontualidade':
                dadosRelatorio = processarPontualidade(funcionario, setor, dataInicial, dataFinal);
                break;
            case 'produtividade':
                dadosRelatorio = processarProdutividade(funcionario, setor, dataInicial, dataFinal);
                break;
        }

        // Atualizar preview
        atualizarPreviewRelatorio(dadosRelatorio, tipoRelatorio);

        // Salvar relatório no histórico
        salvarHistoricoRelatorio(tipoRelatorio, dataInicial, dataFinal);
    }

    function processarBancoHoras(funcionario, setor, dataInicial, dataFinal) {
        const bancoHoras = LocalStorageService.getData('banco_horas') || [];
        
        return bancoHoras.filter(entry => {
            const matchFuncionario = !funcionario || entry.funcionario === funcionario;
            const matchData = (!dataInicial || new Date(entry.dataFinal) >= new Date(dataInicial)) &&
                              (!dataFinal || new Date(entry.dataFinal) <= new Date(dataFinal));
            return matchFuncionario && matchData;
        });
    }

    function processarEventos(funcionario, setor, dataInicial, dataFinal, tipoEvento) {
        const eventos = LocalStorageService.getData('eventos') || [];
        
        return eventos.filter(evento => {
            const matchFuncionario = !funcionario || evento.funcionario === funcionario;
            const matchTipoEvento = !tipoEvento || evento.tipo === tipoEvento;
            const matchData = (!dataInicial || new Date(evento.data) >= new Date(dataInicial)) &&
                              (!dataFinal || new Date(evento.data) <= new Date(dataFinal));
            return matchFuncionario && matchTipoEvento && matchData;
        });
    }

    function processarPontualidade(funcionario, setor, dataInicial, dataFinal) {
        const eventos = LocalStorageService.getData('eventos') || [];
        const funcionarios = LocalStorageService.getData('funcionarios') || [];

        const pontualidade = funcionarios
            .filter(f => (!funcionario || f.nome === funcionario) && 
                         (!setor || f.setor === setor))
            .map(f => {
                const eventosFunc = eventos.filter(e => 
                    e.funcionario === f.nome && 
                    (e.tipo === 'falta' || e.tipo === 'atraso') &&
                    (!dataInicial || new Date(e.data) >= new Date(dataInicial)) &&
                    (!dataFinal || new Date(e.data) <= new Date(dataFinal))
                );

                return {
                    nome: f.nome,
                    setor: f.setor,
                    totalEventos: eventosFunc.length,
                    faltas: eventosFunc.filter(e => e.tipo === 'falta').length,
                    atrasos: eventosFunc.filter(e => e.tipo === 'atraso').length,
                    percentualPontualidade: ((1 - (eventosFunc.length / 30)) * 100).toFixed(2) + '%'
                };
            });

        return pontualidade;
    }

    function processarProdutividade(funcionario, setor, dataInicial, dataFinal) {
        const bancoHoras = LocalStorageService.getData('banco_horas') || [];
        const funcionarios = LocalStorageService.getData('funcionarios') || [];

        const produtividade = funcionarios
            .filter(f => (!funcionario || f.nome === funcionario) && 
                         (!setor || f.setor === setor))
            .map(f => {
                const horasExtras = bancoHoras
                    .filter(bh => 
                        bh.funcionario === f.nome &&
                        (!dataInicial || new Date(bh.dataFinal) >= new Date(dataInicial)) &&
                        (!dataFinal || new Date(bh.dataFinal) <= new Date(dataFinal))
                    )
                    .reduce((sum, bh) => sum + convertTimeToHours(bh.saldo), 0);

                return {
                    nome: f.nome,
                    setor: f.setor,
                    horasExtras: horasExtras.toFixed(2),
                    statusProdutividade: 
                        horasExtras > 20 ? 'Excelente' : 
                        horasExtras > 10 ? 'Bom' : 
                        horasExtras > 0 ? 'Regular' : 'Baixa'
                };
            });

        return produtividade;
    }

    function atualizarPreviewRelatorio(dadosRelatorio, tipoRelatorio) {
        const previewCard = document.getElementById('previewCard');
        const previewTable = document.getElementById('relatorioPreviewTable');
        const sumarioDiv = document.getElementById('relatorioSumario');
        const exportarBtn = document.getElementById('exportarRelatorioBtn');
        const enviarEmailBtn = document.getElementById('enviarEmailBtn');

        // Limpar tabela anterior
        previewTable.innerHTML = '';

        if (dadosRelatorio.length === 0) {
            previewTable.innerHTML = '<tr><td colspan="6">Nenhum dado encontrado</td></tr>';
            previewCard.style.display = 'block';
            exportarBtn.disabled = true;
            enviarEmailBtn.disabled = true;
            return;
        }

        // Cabeçalhos dinâmicos com base no tipo de relatório
        const headers = {
            'banco_horas': ['Funcionário', 'Saldo do Período', 'Data Inicial', 'Data Final'],
            'eventos': ['Funcionário', 'Tipo', 'Data', 'Descrição'],
            'pontualidade': ['Funcionário', 'Setor', 'Total Eventos', 'Faltas', 'Atrasos', '% Pontualidade'],
            'produtividade': ['Funcionário', 'Setor', 'Horas Extras', 'Status']
        }[tipoRelatorio];

        // Criar cabeçalho
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        previewTable.appendChild(thead);

        // Criar corpo da tabela
        const tbody = document.createElement('tbody');
        dadosRelatorio.slice(0, 10).forEach(item => {
            const tr = document.createElement('tr');
            let rowData;
            switch(tipoRelatorio) {
                case 'banco_horas':
                    rowData = [
                        item.funcionario, 
                        item.saldo, 
                        item.dataInicial, 
                        item.dataFinal
                    ];
                    break;
                case 'eventos':
                    rowData = [
                        item.funcionario, 
                        item.tipo, 
                        item.data, 
                        item.descricao || '-'
                    ];
                    break;
                case 'pontualidade':
                    rowData = [
                        item.nome, 
                        item.setor, 
                        item.totalEventos, 
                        item.faltas, 
                        item.atrasos, 
                        item.percentualPontualidade
                    ];
                    break;
                case 'produtividade':
                    rowData = [
                        item.nome, 
                        item.setor, 
                        item.horasExtras, 
                        item.statusProdutividade
                    ];
                    break;
            }
            
            rowData.forEach(cellData => {
                const td = document.createElement('td');
                td.textContent = cellData;
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
        previewTable.appendChild(tbody);

        // Atualizar sumário
        sumarioDiv.innerHTML = `
            <p><strong>Total de Registros:</strong> ${dadosRelatorio.length}</p>
            <p><strong>Registros Exibidos:</strong> ${Math.min(dadosRelatorio.length, 10)}</p>
        `;

        // Exibir card de preview
        previewCard.style.display = 'block';
        exportarBtn.disabled = false;
        enviarEmailBtn.disabled = false;

        // Criação de gráfico de pizza
        criarGraficoPizza(dadosRelatorio, tipoRelatorio);
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

    function salvarHistoricoRelatorio(tipo, dataInicial, dataFinal) {
        const historico = JSON.parse(localStorage.getItem('historicoRelatorios') || '[]');
        const novoRegistro = {
            id: Date.now(),
            data: new Date().toLocaleString(),
            tipo: tipo,
            periodoInicial: dataInicial,
            periodoFinal: dataFinal
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
                <td>${registro.data}</td>
                <td>${formatarTipoRelatorio(registro.tipo)}</td>
                <td>${registro.periodoInicial} - ${registro.periodoFinal}</td>
                <td>
                    <button class="btn btn-sm btn-primary recuperar-relatorio" data-id="${registro.id}">
                        <i class="bi bi-cloud-download"></i>
                    </button>
                </td>
            </tr>
        `).join('');
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

    function convertTimeToHours(timeStr) {
        if (!timeStr) return 0;
        
        const isNegative = timeStr.startsWith('-');
        const [hours, minutes] = timeStr.replace(/[+-]/, '').split(':').map(Number);
        const decimalHours = hours + (minutes / 60);
        
        return isNegative ? -decimalHours : decimalHours;
    }

    // Exportar Relatório
    document.getElementById('exportarRelatorioBtn').addEventListener('click', () => {
        const tipoRelatorio = document.getElementById('tipoRelatorio').value;
        const dadosRelatorio = document.getElementById('relatorioPreviewTable').innerText;

        // Usar biblioteca XLSX para gerar arquivo
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.aoa_to_sheet(
            dadosRelatorio.split('\n').map(linha => linha.split('\t'))
        );
        XLSX.utils.book_append_sheet(wb, ws, `Relatório ${formatarTipoRelatorio(tipoRelatorio)}`);
        
        const nomeArquivo = `relatorio_${tipoRelatorio}_${new Date().toISOString().split('T')[0]}.xlsx`;
        XLSX.writeFile(wb, nomeArquivo);
    });

    // Enviar por E-mail (simulação)
    document.getElementById('enviarEmailBtn').addEventListener('click', () => {
        const tipoRelatorio = document.getElementById('tipoRelatorio').value;
        const destinatario = prompt('Digite o e-mail de destino:');
        
        if (destinatario) {
            alert(`Relatório de ${formatarTipoRelatorio(tipoRelatorio)} enviado para ${destinatario}`);
        }
    });

    // Inicializar histórico
    atualizarTabelaHistorico();

    // Listeners para recuperar relatórios do histórico
    document.getElementById('historicoRelatorios').addEventListener('click', (e) => {
        const btn = e.target.closest('.recuperar-relatorio');
        if (btn) {
            const id = btn.dataset.id;
            const historico = JSON.parse(localStorage.getItem('historicoRelatorios') || '[]');
            const registro = historico.find(r => r.id === Number(id));

            if (registro) {
                // Preencher filtros
                document.getElementById('tipoRelatorio').value = registro.tipo;
                document.getElementById('dataInicial').value = registro.periodoInicial;
                document.getElementById('dataFinal').value = registro.periodoFinal;

                // Gerar relatório novamente
                gerarRelatorio();
            }
        }
    });
}