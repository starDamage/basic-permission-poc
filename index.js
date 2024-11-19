const express = require('express');
const { checkPermission } = require('./permissions');

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

//  Take this from database per user.
const permission = {
    chat: { read: false, write: true, update: true, delete: true, all: false },
    job: { read: false, write: false, update: true, delete: true, all: true },
    request: { read: false, write: true, update: true, delete: true, all: true },
};


app.use((req, res, next) => {
    // Mock user data for testing
    req.user = {
        id: 1,
        username: 'akshay',
        permissions: permission,
    };
    next();
});

// Routes using permission middleware
app.get('/chat', checkPermission('chat', 'read'), (req, res) => {
    res.send('Chat resource: Read access granted.');
});

app.post('/chat', checkPermission('chat', 'write'), (req, res) => {
    res.send('Chat resource: Write access granted.');
});

app.put('/job', checkPermission('job', 'update'), (req, res) => {
    res.send('Job resource: Update access granted.');
});

app.delete('/request', checkPermission('request', 'delete'), (req, res) => {
    res.send('Request resource: Delete access granted.');
});

// New endpoint to add or update permissions
app.post('/permissions', (req, res) => {
    const { resource, permissions } = req.body;

    if (!resource || !permissions) {
        return res.status(400).json({ message: 'Resource and permissions are required.' });
    }

    // Add or update permissions for the resource
    if (!req.user.permissions[resource]) {
        // New resource, add it
        req.user.permissions[resource] = {};
    }

    req.user.permissions[resource] = {
        ...req.user.permissions[resource],
        ...permissions, // Update or add new permissions
    };

    res.status(200).json({
        message: `Permissions for resource '${resource}' added/updated successfully.`,
        updatedPermissions: req.user.permissions,
    });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
