// Disaster Management System - Frontend JavaScript

// API Base URL
const API_BASE_URL = 'http://localhost:5000/api';

// Global variables
let currentData = {
    disasters: [],
    resources: [],
    volunteers: [],
    incidents: [],
    evacuationRoutes: []
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    loadDashboardData();
    showSection('dashboard');
});

// Navigation functionality
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            showSection(section);
            
            // Update active nav link
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Show specific section
function showSection(sectionName) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));
    
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.add('active');
        loadSectionData(sectionName);
    }
}

// Load data for specific section
function loadSectionData(section) {
    switch(section) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'disasters':
            loadDisasters();
            break;
        case 'resources':
            loadResources();
            break;
        case 'volunteers':
            loadVolunteers();
            break;
        case 'incidents':
            loadIncidents();
            break;
        case 'evacuation':
            loadEvacuationRoutes();
            break;
    }
}

// API call helper function
async function apiCall(endpoint, method = 'GET', data = null) {
    showLoading(true);
    try {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };
        
        if (data && method !== 'GET') {
            options.body = JSON.stringify(data);
        }
        
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API call error:', error);
        showMessage('Error connecting to server. Please try again later.', 'error');
        return null;
    } finally {
        showLoading(false);
    }
}

// Dashboard functions
async function loadDashboardData() {
    try {
        const stats = await apiCall('/dashboard-stats');
        if (stats) {
            document.getElementById('active-disasters-count').textContent = stats.active_disasters;
            document.getElementById('available-resources-count').textContent = stats.available_resources;
            document.getElementById('available-volunteers-count').textContent = stats.available_volunteers;
            document.getElementById('pending-incidents-count').textContent = stats.pending_incidents;
        }
        
        const disasters = await apiCall('/disasters');
        if (disasters) {
            displayRecentDisasters(disasters.slice(0, 5));
        }
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

function displayRecentDisasters(disasters) {
    const container = document.getElementById('recent-disasters-list');
    container.innerHTML = '';
    
    if (disasters.length === 0) {
        container.innerHTML = '<p>No recent disasters to display.</p>';
        return;
    }
    
    disasters.forEach(disaster => {
        const disasterElement = document.createElement('div');
        disasterElement.className = 'disaster-item';
        disasterElement.innerHTML = `
            <h4>${disaster.title}</h4>
            <p><strong>Type:</strong> ${disaster.type} | <strong>Severity:</strong> ${disaster.severity}</p>
            <p><strong>Location:</strong> ${disaster.location}</p>
            <p><strong>Status:</strong> ${disaster.status}</p>
        `;
        container.appendChild(disasterElement);
    });
}

// Disasters functions
async function loadDisasters() {
    const disasters = await apiCall('/disasters');
    if (disasters) {
        currentData.disasters = disasters;
        displayDisasters(disasters);
    }
}

function displayDisasters(disasters) {
    const container = document.getElementById('disasters-list');
    container.innerHTML = '';
    
    if (disasters.length === 0) {
        container.innerHTML = '<p>No disasters to display.</p>';
        return;
    }
    
    disasters.forEach(disaster => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-badge severity-${disaster.severity}">${disaster.severity} severity</div>
            <h3>${disaster.title}</h3>
            <p><strong>Type:</strong> ${disaster.type}</p>
            <p><strong>Location:</strong> ${disaster.location}</p>
            <p><strong>Description:</strong> ${disaster.description || 'No description available'}</p>
            <div class="card-badge status-${disaster.status}">${disaster.status}</div>
            <div style="margin-top: 1rem;">
                <button class="btn warning" onclick="updateDisasterStatus(${disaster.id}, '${disaster.status}')">
                    Update Status
                </button>
            </div>
        `;
        container.appendChild(card);
    });
}

// Resources functions
async function loadResources() {
    const resources = await apiCall('/resources');
    if (resources) {
        currentData.resources = resources;
        displayResources(resources);
    }
}

function displayResources(resources) {
    const container = document.getElementById('resources-list');
    container.innerHTML = '';
    
    if (resources.length === 0) {
        container.innerHTML = '<p>No resources to display.</p>';
        return;
    }
    
    resources.forEach(resource => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h3>${resource.name}</h3>
            <p><strong>Type:</strong> ${resource.type}</p>
            <p><strong>Available:</strong> ${resource.available_quantity}/${resource.quantity}</p>
            <p><strong>Location:</strong> ${resource.location}</p>
            <p><strong>Contact:</strong> ${resource.contact_person || 'N/A'}</p>
            <p><strong>Phone:</strong> ${resource.contact_phone || 'N/A'}</p>
            <div class="card-badge status-${resource.status}">${resource.status}</div>
        `;
        container.appendChild(card);
    });
}

// Volunteers functions
async function loadVolunteers() {
    const volunteers = await apiCall('/volunteers');
    if (volunteers) {
        currentData.volunteers = volunteers;
        displayVolunteers(volunteers);
    }
}

function displayVolunteers(volunteers) {
    const container = document.getElementById('volunteers-list');
    container.innerHTML = '';
    
    if (volunteers.length === 0) {
        container.innerHTML = '<p>No volunteers to display.</p>';
        return;
    }
    
    volunteers.forEach(volunteer => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h3>${volunteer.name}</h3>
            <p><strong>Email:</strong> ${volunteer.email}</p>
            <p><strong>Phone:</strong> ${volunteer.phone}</p>
            <p><strong>Address:</strong> ${volunteer.address || 'Not provided'}</p>
            <p><strong>Skills:</strong> ${volunteer.skills || 'Not specified'}</p>
            <p><strong>Experience:</strong> ${volunteer.experience_years} years</p>
            <div class="card-badge status-${volunteer.availability}">${volunteer.availability}</div>
        `;
        container.appendChild(card);
    });
}

// Incidents functions
async function loadIncidents() {
    const incidents = await apiCall('/incidents');
    if (incidents) {
        currentData.incidents = incidents;
        displayIncidents(incidents);
    }
}

function displayIncidents(incidents) {
    const container = document.getElementById('incidents-list');
    container.innerHTML = '';
    
    if (incidents.length === 0) {
        container.innerHTML = '<p>No incidents to display.</p>';
        return;
    }
    
    incidents.forEach(incident => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-badge priority-${incident.priority}">${incident.priority} priority</div>
            <h3>${incident.title}</h3>
            <p><strong>Type:</strong> ${incident.type}</p>
            <p><strong>Location:</strong> ${incident.location}</p>
            <p><strong>Description:</strong> ${incident.description}</p>
            <p><strong>Reporter:</strong> ${incident.reporter_name || 'Anonymous'}</p>
            <p><strong>Phone:</strong> ${incident.reporter_phone || 'Not provided'}</p>
            <div class="card-badge status-${incident.status}">${incident.status}</div>
        `;
        container.appendChild(card);
    });
}

// Evacuation routes functions
async function loadEvacuationRoutes() {
    const routes = await apiCall('/evacuation-routes');
    if (routes) {
        currentData.evacuationRoutes = routes;
        displayEvacuationRoutes(routes);
    }
}

function displayEvacuationRoutes(routes) {
    const container = document.getElementById('evacuation-routes-list');
    container.innerHTML = '';
    
    if (routes.length === 0) {
        container.innerHTML = '<p>No evacuation routes to display.</p>';
        return;
    }
    
    routes.forEach(route => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h3>${route.name}</h3>
            <p><strong>From:</strong> ${route.start_location}</p>
            <p><strong>To:</strong> ${route.end_location}</p>
            <p><strong>Distance:</strong> ${route.distance_km} km</p>
            <p><strong>Estimated Time:</strong> ${route.estimated_time_minutes} minutes</p>
            <p><strong>Capacity:</strong> ${route.capacity} people</p>
            <p><strong>Description:</strong> ${route.route_description || 'No description available'}</p>
            <div class="card-badge status-${route.status}">${route.status}</div>
        `;
        container.appendChild(card);
    });
}

// Form functions
function showDisasterForm() {
    const formHTML = `
        <h2>Create Disaster Alert</h2>
        <form id="disaster-form">
            <div class="form-group">
                <label for="disaster-title">Title *</label>
                <input type="text" id="disaster-title" name="title" required>
            </div>
            <div class="form-group">
                <label for="disaster-type">Type *</label>
                <select id="disaster-type" name="type" required>
                    <option value="">Select type</option>
                    <option value="earthquake">Earthquake</option>
                    <option value="flood">Flood</option>
                    <option value="fire">Fire</option>
                    <option value="hurricane">Hurricane</option>
                    <option value="tornado">Tornado</option>
                    <option value="tsunami">Tsunami</option>
                    <option value="other">Other</option>
                </select>
            </div>
            <div class="form-group">
                <label for="disaster-severity">Severity *</label>
                <select id="disaster-severity" name="severity" required>
                    <option value="">Select severity</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                </select>
            </div>
            <div class="form-group">
                <label for="disaster-location">Location *</label>
                <input type="text" id="disaster-location" name="location" required>
            </div>
            <div class="form-group">
                <label for="disaster-description">Description</label>
                <textarea id="disaster-description" name="description"></textarea>
            </div>
            <div style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 2rem;">
                <button type="button" class="btn" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn primary">Create Alert</button>
            </div>
        </form>
    `;
    
    document.getElementById('modal-body').innerHTML = formHTML;
    document.getElementById('modal').style.display = 'block';
    
    document.getElementById('disaster-form').addEventListener('submit', handleDisasterSubmit);
}

async function handleDisasterSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    const result = await apiCall('/disasters', 'POST', data);
    if (result) {
        showMessage('Disaster alert created successfully!', 'success');
        closeModal();
        loadDisasters();
        loadDashboardData();
    }
}

function showResourceForm() {
    const formHTML = `
        <h2>Add Resource</h2>
        <form id="resource-form">
            <div class="form-group">
                <label for="resource-name">Resource Name *</label>
                <input type="text" id="resource-name" name="name" required>
            </div>
            <div class="form-group">
                <label for="resource-type">Type *</label>
                <select id="resource-type" name="type" required>
                    <option value="">Select type</option>
                    <option value="medical">Medical</option>
                    <option value="food">Food</option>
                    <option value="water">Water</option>
                    <option value="shelter">Shelter</option>
                    <option value="equipment">Equipment</option>
                    <option value="personnel">Personnel</option>
                </select>
            </div>
            <div class="form-group">
                <label for="resource-quantity">Total Quantity *</label>
                <input type="number" id="resource-quantity" name="quantity" required min="0">
            </div>
            <div class="form-group">
                <label for="resource-available">Available Quantity *</label>
                <input type="number" id="resource-available" name="available_quantity" required min="0">
            </div>
            <div class="form-group">
                <label for="resource-location">Location *</label>
                <input type="text" id="resource-location" name="location" required>
            </div>
            <div class="form-group">
                <label for="resource-contact">Contact Person</label>
                <input type="text" id="resource-contact" name="contact_person">
            </div>
            <div class="form-group">
                <label for="resource-phone">Contact Phone</label>
                <input type="tel" id="resource-phone" name="contact_phone">
            </div>
            <div style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 2rem;">
                <button type="button" class="btn" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn primary">Add Resource</button>
            </div>
        </form>
    `;
    
    document.getElementById('modal-body').innerHTML = formHTML;
    document.getElementById('modal').style.display = 'block';
    
    document.getElementById('resource-form').addEventListener('submit', handleResourceSubmit);
}

async function handleResourceSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    // Convert numeric fields
    data.quantity = parseInt(data.quantity);
    data.available_quantity = parseInt(data.available_quantity);
    
    if (data.available_quantity > data.quantity) {
        showMessage('Available quantity cannot exceed total quantity!', 'error');
        return;
    }
    
    const result = await apiCall('/resources', 'POST', data);
    if (result) {
        showMessage('Resource added successfully!', 'success');
        closeModal();
        loadResources();
        loadDashboardData();
    }
}

function showVolunteerForm() {
    const formHTML = `
        <h2>Register Volunteer</h2>
        <form id="volunteer-form">
            <div class="form-group">
                <label for="volunteer-name">Full Name *</label>
                <input type="text" id="volunteer-name" name="name" required>
            </div>
            <div class="form-group">
                <label for="volunteer-email">Email *</label>
                <input type="email" id="volunteer-email" name="email" required>
            </div>
            <div class="form-group">
                <label for="volunteer-phone">Phone *</label>
                <input type="tel" id="volunteer-phone" name="phone" required>
            </div>
            <div class="form-group">
                <label for="volunteer-address">Address</label>
                <textarea id="volunteer-address" name="address"></textarea>
            </div>
            <div class="form-group">
                <label for="volunteer-skills">Skills/Expertise</label>
                <textarea id="volunteer-skills" name="skills" placeholder="e.g., First Aid, Medical Training, Communication"></textarea>
            </div>
            <div class="form-group">
                <label for="volunteer-emergency-contact">Emergency Contact Name</label>
                <input type="text" id="volunteer-emergency-contact" name="emergency_contact">
            </div>
            <div class="form-group">
                <label for="volunteer-emergency-phone">Emergency Contact Phone</label>
                <input type="tel" id="volunteer-emergency-phone" name="emergency_phone">
            </div>
            <div style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 2rem;">
                <button type="button" class="btn" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn primary">Register</button>
            </div>
        </form>
    `;
    
    document.getElementById('modal-body').innerHTML = formHTML;
    document.getElementById('modal').style.display = 'block';
    
    document.getElementById('volunteer-form').addEventListener('submit', handleVolunteerSubmit);
}

async function handleVolunteerSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    const result = await apiCall('/volunteers', 'POST', data);
    if (result) {
        showMessage('Volunteer registered successfully!', 'success');
        closeModal();
        loadVolunteers();
        loadDashboardData();
    }
}

function showIncidentForm() {
    const formHTML = `
        <h2>Report Incident</h2>
        <form id="incident-form">
            <div class="form-group">
                <label for="incident-title">Incident Title *</label>
                <input type="text" id="incident-title" name="title" required>
            </div>
            <div class="form-group">
                <label for="incident-type">Type *</label>
                <select id="incident-type" name="type" required>
                    <option value="">Select type</option>
                    <option value="rescue">Rescue</option>
                    <option value="medical">Medical Emergency</option>
                    <option value="fire">Fire</option>
                    <option value="infrastructure">Infrastructure</option>
                    <option value="other">Other</option>
                </select>
            </div>
            <div class="form-group">
                <label for="incident-priority">Priority *</label>
                <select id="incident-priority" name="priority" required>
                    <option value="">Select priority</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="emergency">Emergency</option>
                </select>
            </div>
            <div class="form-group">
                <label for="incident-location">Location *</label>
                <input type="text" id="incident-location" name="location" required>
            </div>
            <div class="form-group">
                <label for="incident-description">Description *</label>
                <textarea id="incident-description" name="description" required></textarea>
            </div>
            <div class="form-group">
                <label for="incident-reporter">Reporter Name</label>
                <input type="text" id="incident-reporter" name="reporter_name">
            </div>
            <div class="form-group">
                <label for="incident-reporter-phone">Reporter Phone</label>
                <input type="tel" id="incident-reporter-phone" name="reporter_phone">
            </div>
            <div style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 2rem;">
                <button type="button" class="btn" onclick="closeModal()">Cancel</button>
                <button type="submit" class="btn emergency">Report Incident</button>
            </div>
        </form>
    `;
    
    document.getElementById('modal-body').innerHTML = formHTML;
    document.getElementById('modal').style.display = 'block';
    
    document.getElementById('incident-form').addEventListener('submit', handleIncidentSubmit);
}

async function handleIncidentSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    const result = await apiCall('/incidents', 'POST', data);
    if (result) {
        showMessage('Incident reported successfully!', 'success');
        closeModal();
        loadIncidents();
        loadDashboardData();
    }
}

// Quick action functions
function reportIncident() {
    showSection('incidents');
    setTimeout(() => showIncidentForm(), 300);
}

function registerVolunteer() {
    showSection('volunteers');
    setTimeout(() => showVolunteerForm(), 300);
}

function createDisasterAlert() {
    showSection('disasters');
    setTimeout(() => showDisasterForm(), 300);
}

// Update disaster status
async function updateDisasterStatus(disasterId, currentStatus) {
    const statusOptions = ['active', 'monitoring', 'resolved'];
    const currentIndex = statusOptions.indexOf(currentStatus);
    const nextStatus = statusOptions[(currentIndex + 1) % statusOptions.length];
    
    const data = { status: nextStatus };
    const result = await apiCall(`/disasters/${disasterId}`, 'PUT', data);
    
    if (result) {
        showMessage(`Disaster status updated to ${nextStatus}!`, 'success');
        loadDisasters();
        loadDashboardData();
    }
}

// Modal functions
function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

// Click outside modal to close
window.addEventListener('click', function(event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        closeModal();
    }
});

// Loading spinner functions
function showLoading(show) {
    const loading = document.getElementById('loading');
    loading.style.display = show ? 'flex' : 'none';
}

// Message functions
function showMessage(text, type = 'success') {
    const message = document.getElementById('message');
    const messageText = document.getElementById('message-text');
    
    messageText.textContent = text;
    message.className = `message ${type}`;
    message.style.display = 'flex';
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        hideMessage();
    }, 5000);
}

function hideMessage() {
    document.getElementById('message').style.display = 'none';
}

// Utility functions
function formatDate(dateString) {
    return new Date(dateString).toLocaleString();
}

function capitalizeFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Error handling for API calls
window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
    showMessage('An unexpected error occurred. Please refresh the page and try again.', 'error');
});

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Escape key to close modal
    if (event.key === 'Escape') {
        closeModal();
        hideMessage();
    }
    
    // Ctrl/Cmd + N for new incident (quick report)
    if ((event.ctrlKey || event.metaKey) && event.key === 'n') {
        event.preventDefault();
        reportIncident();
    }
});

// Auto-refresh dashboard data every 5 minutes
setInterval(() => {
    const activeSection = document.querySelector('.section.active');
    if (activeSection && activeSection.id === 'dashboard') {
        loadDashboardData();
    }
}, 300000); // 5 minutes

console.log('Disaster Management System initialized successfully!');