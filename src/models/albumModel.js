const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const albumsFilePath = path.join(__dirname, '..', 'data', 'albums.json');

async function getAlbums() {
    console.log("Inicio de getAlbums");
    try {
        const data = await fs.readFile(albumsFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error en getAlbums:", error);
        if (error.code === 'ENOENT') {
            await saveAlbums([]);
            return [];
        } else {
            throw error;
        }
    }
}

async function saveAlbums(albums) {
    try {
        await fs.writeFile(albumsFilePath, JSON.stringify(albums, null, 2), 'utf8');
    } catch (error) {
        console.error("Error en saveAlbums:", error);
    }
}

async function findAll() {
    return await getAlbums();
}

async function find(id) {
    const albums = await getAlbums();
    const album = albums.find(album => album.id === id);
    return album;
}

async function create(albumData) {
    const albums = await getAlbums();
    const newAlbum = { ...albumData, id: uuidv4() };
    albums.push(newAlbum);
    await saveAlbums(albums);
    return newAlbum;
}

async function update(id, albumData) {
    const albums = await getAlbums();
    const index = albums.findIndex(album => album.id === id);
    if (index !== -1) {
        albums[index] = { ...albumData, id };
        await saveAlbums(albums);
        return albums[index];
    } else {
        return null;
    }
}

async function remove(id) {
    let albums = await getAlbums();
    const lengthBefore = albums.length;
    albums = albums.filter(album => album.id !== id);
    if (lengthBefore !== albums.length) {
        await saveAlbums(albums);
        return true;
    } else {
        return false;
    }
}

module.exports = { findAll, find, create, update, remove };
