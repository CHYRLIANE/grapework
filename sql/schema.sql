-- Create database
CREATE DATABASE grapework;
USE grapework;

-- Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Departments table
CREATE TABLE departments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Employees table
CREATE TABLE employees (
    id INT PRIMARY KEY AUTO_INCREMENT,
    department_id INT,
    nome VARCHAR(100) NOT NULL,
    cargo VARCHAR(100),
    funcao VARCHAR(100),
    filial VARCHAR(100),
    local_trabalho VARCHAR(100),
    centro_custo VARCHAR(100),
    data_nascimento DATE,
    sexo ENUM('M', 'F', 'O'),
    cpf VARCHAR(14) UNIQUE,
    rg VARCHAR(20),
    pis VARCHAR(20),
    ctps VARCHAR(20),
    serie_ctps VARCHAR(20),
    email_pessoal VARCHAR(100),
    email_corporativo VARCHAR(100),
    telefone VARCHAR(20),
    estado CHAR(2),
    codigo_externo VARCHAR(50),
    status ENUM('Ativo', 'Inativo') DEFAULT 'Ativo',
    data_admissao DATE,
    inicio_vigencia DATE,
    fuso_horario VARCHAR(50) DEFAULT 'America/Sao_Paulo',
    escala_vigente VARCHAR(100),
    calendario_vigente VARCHAR(100),
    data_inicio_ferias DATE,
    proxima_avaliacao DATE,
    estrangeiro BOOLEAN DEFAULT FALSE,
    tem_filhos BOOLEAN DEFAULT FALSE,
    tamanho_camisa VARCHAR(5),
    motivo_demissao VARCHAR(100),
    data_demissao DATE,
    qr_code VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- Employee Managers (Many-to-Many relationship)
CREATE TABLE employee_managers (
    employee_id INT,
    manager_id INT,
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    FOREIGN KEY (manager_id) REFERENCES employees(id),
    PRIMARY KEY (employee_id, manager_id)
);

-- Salary Records table
CREATE TABLE salary_records (
    id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id INT,
    salario_base DECIMAL(10,2),
    salario_familia DECIMAL(10,2),
    insalubridade DECIMAL(10,2),
    rt DECIMAL(10,2),
    premiacao DECIMAL(10,2),
    salario_base_inss DECIMAL(10,2),
    plano_saude DECIMAL(10,2),
    cooparticipacao DECIMAL(10,2),
    desc_va DECIMAL(10,2),
    desc_vt DECIMAL(10,2),
    inss DECIMAL(10,2),
    irpf DECIMAL(10,2),
    vale_alimentacao DECIMAL(10,2),
    verificado BOOLEAN DEFAULT FALSE,
    data_registro DATE DEFAULT (CURRENT_DATE),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id)
);

-- Event Types table
CREATE TABLE event_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tipo VARCHAR(50) NOT NULL,
    cor VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Events table
CREATE TABLE events (
    id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id INT,
    event_type_id INT,
    data DATE,
    descricao TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    FOREIGN KEY (event_type_id) REFERENCES event_types(id)
);

-- Time Bank Records table
CREATE TABLE time_bank_records (
    id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id INT,
    saldo TIME,
    data_inicial DATE,
    data_final DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id)
);

-- Custom Fields table
CREATE TABLE custom_fields (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    tipo ENUM('text', 'number', 'date', 'select', 'checkbox') NOT NULL,
    secao VARCHAR(50) NOT NULL,
    opcoes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Custom Field Values table
CREATE TABLE custom_field_values (
    id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id INT,
    custom_field_id INT,
    valor TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id),
    FOREIGN KEY (custom_field_id) REFERENCES custom_fields(id)
);

-- Notifications table
CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    type VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    severity VARCHAR(20) NOT NULL,
    employee_id INT,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id)
);

-- Initial data for event types
INSERT INTO event_types (tipo, cor) VALUES
('falta', 'danger'),
('advertencia', 'warning'),
('suspensao', 'dark'),
('atraso', 'info'),
('atestado', 'success');

-- Create indexes for better performance
CREATE INDEX idx_employee_status ON employees(status);
CREATE INDEX idx_events_date ON events(data);
CREATE INDEX idx_salary_records_date ON salary_records(data_registro);
CREATE INDEX idx_notifications_employee ON notifications(employee_id, read_at);
CREATE INDEX idx_time_bank_date ON time_bank_records(data_inicial, data_final);

-- Create view for salary statistics
CREATE VIEW vw_salary_statistics AS
SELECT 
    d.name as department,
    COUNT(e.id) as total_employees,
    AVG(sr.salario_base) as avg_salary,
    MIN(sr.salario_base) as min_salary,
    MAX(sr.salario_base) as max_salary
FROM employees e
JOIN departments d ON e.department_id = d.id
JOIN salary_records sr ON e.id = sr.employee_id
WHERE e.status = 'Ativo'
GROUP BY d.id;

-- Create view for employee events summary
CREATE VIEW vw_employee_events_summary AS
SELECT 
    e.nome,
    d.name as department,
    COUNT(ev.id) as total_events,
    SUM(CASE WHEN et.tipo = 'falta' THEN 1 ELSE 0 END) as total_faltas,
    SUM(CASE WHEN et.tipo = 'atraso' THEN 1 ELSE 0 END) as total_atrasos
FROM employees e
JOIN departments d ON e.department_id = d.id
LEFT JOIN events ev ON e.id = ev.employee_id
LEFT JOIN event_types et ON ev.event_type_id = et.id
WHERE e.status = 'Ativo'
GROUP BY e.id;