-- Database Schema for Disaster Management System

CREATE DATABASE IF NOT EXISTS disaster_management;
USE disaster_management;

-- Disasters table
CREATE TABLE disasters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    type ENUM('earthquake', 'flood', 'fire', 'hurricane', 'tornado', 'tsunami', 'other') NOT NULL,
    severity ENUM('low', 'medium', 'high', 'critical') NOT NULL,
    location VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    description TEXT,
    status ENUM('active', 'monitoring', 'resolved') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Resources table
CREATE TABLE resources (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type ENUM('medical', 'food', 'water', 'shelter', 'equipment', 'personnel') NOT NULL,
    quantity INT NOT NULL,
    available_quantity INT NOT NULL,
    location VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    contact_phone VARCHAR(20),
    status ENUM('available', 'deployed', 'maintenance') DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Volunteers table
CREATE TABLE volunteers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT,
    skills TEXT,
    availability ENUM('available', 'busy', 'unavailable') DEFAULT 'available',
    experience_years INT DEFAULT 0,
    emergency_contact VARCHAR(255),
    emergency_phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Incidents table
CREATE TABLE incidents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    type ENUM('rescue', 'medical', 'fire', 'infrastructure', 'other') NOT NULL,
    priority ENUM('low', 'medium', 'high', 'emergency') NOT NULL,
    location VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    reporter_name VARCHAR(255),
    reporter_phone VARCHAR(20),
    status ENUM('reported', 'assigned', 'in_progress', 'resolved') DEFAULT 'reported',
    assigned_to INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_to) REFERENCES volunteers(id) ON DELETE SET NULL
);

-- Evacuation routes table
CREATE TABLE evacuation_routes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    start_location VARCHAR(255) NOT NULL,
    end_location VARCHAR(255) NOT NULL,
    distance_km DECIMAL(8, 2),
    estimated_time_minutes INT,
    route_description TEXT,
    capacity INT,
    status ENUM('active', 'blocked', 'maintenance') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO disasters (title, type, severity, location, description) VALUES
('Flood Alert - Central District', 'flood', 'high', 'Central District, Mumbai', 'Heavy rainfall causing flooding in low-lying areas'),
('Forest Fire - Hill Region', 'fire', 'medium', 'Aarey Forest, Mumbai', 'Controlled forest fire spreading slowly');

INSERT INTO resources (name, type, quantity, available_quantity, location, contact_person, contact_phone) VALUES
('Medical Kit', 'medical', 100, 85, 'Municipal Hospital', 'Dr. Sharma', '+91-9876543210'),
('Emergency Food Packets', 'food', 500, 500, 'Relief Center A', 'Raj Kumar', '+91-9876543211'),
('Water Bottles (1L)', 'water', 1000, 800, 'Distribution Center', 'Priya Singh', '+91-9876543212');

INSERT INTO volunteers (name, email, phone, address, skills) VALUES
('Amit Patel', 'amit@example.com', '+91-9876543213', 'Andheri West, Mumbai', 'First Aid, Emergency Response'),
('Sunita Shah', 'sunita@example.com', '+91-9876543214', 'Bandra East, Mumbai', 'Medical Training, Communication');

INSERT INTO evacuation_routes (name, start_location, end_location, distance_km, estimated_time_minutes, route_description) VALUES
('Route A - North Evacuation', 'Flood Zone North', 'Safety Shelter North', 5.2, 45, 'Main highway route avoiding flood-prone areas'),
('Route B - Emergency Exit', 'City Center', 'Emergency Camp West', 8.1, 60, 'Secondary route through elevated areas');