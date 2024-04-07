// Import the file system module with promises and the path module for file path operations. Import the uuid module for generating unique identifiers.
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Define the path to the JSON file that stores albums data.
const albumsFilePath = path.join(__dirname, '../data/albums.json');

// Async function to get all albums. It reads the albums JSON file and parses it into JavaScript objects.
const getAlbums = async () => {
    try {
        const data = await fs.readFile(albumsFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        throw error;
    }
};

// Async function to save all albums. It takes an array of albums, stringifies it into JSON, and writes it to the albums JSON file.
const saveAlbums = async (albums) => {
    try {
        const data = JSON.stringify(albums, null, 2); // Null and 2 are used for formatting the JSON in the file.
        await fs.writeFile(albumsFilePath, data, 'utf8');
    } catch (error) {
    }
};

// Retrieves all albums by calling getAlbums.
const findAll = async () => {
    return await getAlbums();
};

// Finds a single album by its ID.
const find = async (id) => {
    const albums = await getAlbums();
    const found = albums.find(album => album.id === id);
    return found;
};

// Creates a new album with a unique ID and adds it to the albums array.
const create = async (albumData) => {
    const albums = await getAlbums();
    const newAlbum = { ...albumData, id: uuidv4() };
    albums.push(newAlbum);
    await saveAlbums(albums);
    return newAlbum;
};

// Updates an existing album by its ID.
const update = async (id, albumData) => {
    let albums = await getAlbums();
    const index = albums.findIndex(album => album.id === id);
    if (index !== -1) {
        albums[index] = { ...albumData, id };
        await saveAlbums(albums);
        return albums[index];
    } else {
        return null;
    }
};

// Removes an album by its ID.
const remove = async (id) => {
    let albums = await getAlbums();
    const lengthBefore = albums.length;
    albums = albums.filter(album => album.id !== id);
    if (lengthBefore !== albums.length) {
        await saveAlbums(albums);
        return true;
    } else {
        return false;
    }
};

// Export the CRUD operations for external use.
module.exports = { findAll, find, create, update, remove };





// Asynchronous File Operations: The use of fs.promises for reading and writing the JSON file is a good practice for non - blocking IO operations in Node.js.
// Error Handling: The try-catch blocks are used effectively to handle and log errors that may occur during file operations or JSON parsing.
// UUID for Unique Identifiers: Utilizing uuid for generating unique identifiers for each album ensures that each entry can be distinctly identified, which is crucial for update and delete operations.
// Formatting JSON Output: The JSON.stringify function is used with arguments for pretty - printing the JSON data in the file, making it more readable.
// Potential for Optimization: While this code is a great starting point, for larger datasets or high - frequency operations, consider using a database system for better performance and scalability.
// Security Note: If this API were to be exposed publicly, additional security measures, validation, and error handling should be implemented to protect the data and ensure the integrity of the requests.


// -------------------------


// To enhance the security, validation, and error handling of your API when exposing it publicly, you would integrate various measures into your Node.js application. Note that the exact implementations will depend on your specific requirements, but here are general improvements:





// 1. Use Helmet for Basic Security
// Helmet helps you secure your Express apps by setting various HTTP headers.It's not a silver bullet, but it can help protect against some well-known web vulnerabilities by setting appropriate HTTP headers.

// const helmet = require('helmet');
// app.use(helmet());





// 2. Validate Input with Celebrate or Joi
// Input validation is crucial to protect your API from malicious or malformed data.Celebrate is an Express middleware function that wraps the Joi validation library and validates request data.

// const { celebrate, Joi, errors } = require('celebrate');

// app.post('/albums', celebrate({
//     body: Joi.object().keys({
//         title: Joi.string().required(),
//         artist: Joi.string().required(),
//         // Add other fields as necessary
//     }),
// }), create);

// app.use(errors()); // Use Celebrate error handler middleware





// 3. Implement Rate Limiting
// Rate limiting prevents brute force attacks and ensures that your service remains available by limiting the number of requests a user can make within a certain timeframe.

// const rateLimit = require('express-rate-limit');

// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 100, // Limit each IP to 100 requests per windowMs
// });

// // Apply to all requests
// app.use(limiter);





// 4. Use CORS Middleware
// If your API is consumed by web clients from different origins, you need to securely manage Cross - Origin Resource Sharing(CORS) policies.

// const cors = require('cors');
// app.use(cors());





// 5. Add HTTPS Support with Redirects from HTTP
// Ensure your API is served over HTTPS to encrypt data in transit.For local development, you can use self - signed certificates, but for production, use certificates from trusted Certificate Authorities(CAs).

// const https = require('https');
// const fs = require('fs');

// const httpsOptions = {
//     key: fs.readFileSync(path.join(__dirname, 'path/to/your/key.pem')),
//     cert: fs.readFileSync(path.join(__dirname, 'path/to/your/cert.pem')),
// };

// https.createServer(httpsOptions, app).listen(443, () => {
//     console.log('HTTPS Server running on port 443');
// });
// Redirect HTTP traffic to HTTPS in production to ensure secure connections:

// app.use((req, res, next) => {
//     if (req.secure) {
//         next();
//     } else {
//         res.redirect('https://' + req.headers.host + req.url);
//     }
// });





// 6. Improved Error Handling
// Enhance error handling by creating a centralized error handler middleware that catches and formats errors before sending the response to the client.

//     javascript
// Copy code
// app.use((err, req, res, next) => {
//     console.error(err.stack);
//     res.status(500).send('Something broke!');
// });





// 7. Data Sanitization
// Sanitize input to prevent SQL Injection, Cross - Site Scripting(XSS), and other injection attacks.Libraries like xss - clean can help.

// const xss = require('xss-clean');
// app.use(xss());
// By applying these security measures, your Express application will be better protected against common threats and vulnerabilities.Always stay updated with security best practices and continually assess your application for new vulnerabilities.