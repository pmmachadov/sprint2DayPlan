// Loads environment variables from a .env file into `process.env`
require('dotenv').config();

// Imports the Express library
const express = require('express');

// Imports the routes for the "albums" endpoint
const albumsRoutes = require('./routes/albumsRoutes');

// Imports a custom error handling middleware
const errorHandler = require('./middleware/errorHandler');

// Initializes the Express application
const app = express();

// Retrieves the port number from environment variables or defaults to 3000 if not specified
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies in incoming requests
app.use(express.json());

// Mounts the albumsRoutes on the '/albums' path. Any request to URLs starting with '/albums' will be handled by albumsRoutes
app.use('/albums', albumsRoutes);

// Uses the errorHandler middleware for handling errors across the application
app.use(errorHandler);

// Starts the server on the specified PORT, listening for incoming connections
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
