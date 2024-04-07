require('dotenv').config();
const express = require('express');
const albumsRoutes = require('./routes/albumsRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/albums', albumsRoutes);
app.use(errorHandler);

app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
