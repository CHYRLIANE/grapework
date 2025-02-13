export class NotificationService {
  static generateNotifications() {
    const funcionarios = JSON.parse(localStorage.getItem('funcionarios') || '[]');
    const eventos = JSON.parse(localStorage.getItem('eventos') || '[]');
    const bancoHoras = JSON.parse(localStorage.getItem('banco_horas') || '[]');
    const notifications = [];
    const today = new Date();

    // Férias próximas
    funcionarios.forEach(func => {
      if (func.dataInicioFerias) {
        const inicioFerias = new Date(func.dataInicioFerias);
        const diasAteFerias = Math.ceil((inicioFerias - today) / (1000 * 60 * 60 * 24));
        
        if ([30, 15, 7].includes(diasAteFerias)) {
          notifications.push({
            type: 'ferias',
            message: `Férias de ${func.nome} começam em ${diasAteFerias} dias (${inicioFerias.toLocaleDateString()})`,
            severity: 'warning',
            timestamp: Date.now()
          });
        }
      }

      // Aniversários
      if (func.dataNascimento) {
        const nascimento = new Date(func.dataNascimento);
        if (
          nascimento.getMonth() === today.getMonth() && 
          nascimento.getDate() === today.getDate()
        ) {
          notifications.push({
            type: 'aniversario',
            message: `Hoje é o aniversário de ${func.nome}! `,
            severity: 'success',
            timestamp: Date.now()
          });
        }
      }

      // Próxima Avaliação
      if (func.proximaAvaliacao) {
        const proximaAvaliacao = new Date(func.proximaAvaliacao);
        const diasAteAvaliacao = Math.ceil((proximaAvaliacao - today) / (1000 * 60 * 60 * 24));
        
        if ([30, 15, 7].includes(diasAteAvaliacao)) {
          notifications.push({
            type: 'avaliacao',
            message: `Avaliação de ${func.nome} está próxima em ${diasAteAvaliacao} dias (${proximaAvaliacao.toLocaleDateString()})`,
            severity: 'info',
            timestamp: Date.now()
          });
        }
      }
    });

    // Banco de Horas Crítico
    funcionarios.forEach(func => {
      const horasFuncionario = bancoHoras.filter(bh => bh.funcionario === func.nome);
      const saldoTotal = horasFuncionario.reduce((sum, bh) => 
        sum + this.convertTimeToHours(bh.saldo), 0);
      
      if (saldoTotal < -20) {
        notifications.push({
          type: 'banco-horas',
          message: `Saldo de Banco de Horas de ${func.nome} está crítico: ${saldoTotal.toFixed(2)}h`,
          severity: 'danger',
          timestamp: Date.now()
        });
      }
    });

    // Atrasos e Faltas Acumuladas
    const atrasosPorFuncionario = {};
    eventos.forEach(evento => {
      if (evento.tipo === 'atraso') {
        atrasosPorFuncionario[evento.funcionario] = 
          (atrasosPorFuncionario[evento.funcionario] || 0) + 1;
      }
    });

    Object.entries(atrasosPorFuncionario).forEach(([funcionario, qtdAtrasos]) => {
      if (qtdAtrasos >= 3) {
        notifications.push({
          type: 'atrasos',
          message: `${funcionario} tem ${qtdAtrasos} atrasos registrados`,
          severity: 'warning',
          timestamp: Date.now()
        });
      }
    });

    return notifications;
  }

  static convertTimeToHours(timeStr) {
    if (!timeStr) return 0;
    
    const isNegative = timeStr.startsWith('-');
    const [hours, minutes] = timeStr.replace(/[+-]/, '').split(':').map(Number);
    const decimalHours = hours + (minutes / 60);
    
    return isNegative ? -decimalHours : decimalHours;
  }

  static saveNotifications(notifications) {
    const existingNotifications = this.getNotifications();
    const updatedNotifications = [
        ...notifications.map(n => ({
            ...n,
            timestamp: Date.now(), // Add timestamp to new notifications
            id: Date.now() + Math.random() // Add unique ID
        })),
        ...existingNotifications
    ];

    // Keep only the last 50 notifications
    localStorage.setItem('systemNotifications', JSON.stringify(
        updatedNotifications.slice(0, 50)
    ));

    // Trigger storage event for other tabs
    window.dispatchEvent(new Event('storage'));
  }

  static getNotifications() {
    return JSON.parse(localStorage.getItem('systemNotifications') || '[]');
  }

  static clearNotifications() {
    localStorage.removeItem('systemNotifications');
  }
}