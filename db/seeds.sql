INSERT INTO departments(name)
VALUES
('Engineering'),
('Sales & Marketing'),
('Human Resources'),
('Security'),
('Office Management'),
('Accounting');

INSERT INTO roles(title, salary, department_id)
VALUES
('Full-Stack Developer', 70000, 1),
('Sales Rep', 69000, 2),
('Payroll Specialist', 50000, 3),
('CyberSecurity Officer', 100000, 4),
('Receptionist', 45000, 5),
('Accountant', 80000, 6);

INSERT INTO employees(id, first_name, last_name, role_id, manager_id)
VALUES
(1, 'Mark', 'Miller', 1, NULL),
(2, 'Tyrion', 'Lannister', 2, NULL),
(3, 'Tywin', 'Lannister', 3, NULL),
(4, 'Jim', 'Holden', 4, NULL),
(5, 'Naomi', 'Ngata', 4, 4),
(6, 'Stannis', 'Baratheon', 5, NULL),
(7, 'Petyr', 'Baelish', 6, NULL),
(8, 'Katie', 'Grimm', 1, 1),
(9, 'Podrick', 'Payne', 2, 2),
(10, 'Gregor', 'Clegane', 3, 3),
(11, 'Osmyund', 'Kettleblack', 6, 7),
(12, 'Davos', 'Seaworth', 5, 6);