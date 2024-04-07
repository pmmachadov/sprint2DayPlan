const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const albumsFilePath = path.join(__dirname, '../data/albums.json');

const getAlbums = async () => {
    console.log("Llamada a getAlbums");
    try {
        const data = await fs.readFile(albumsFilePath, 'utf8');
        console.log("getAlbums: Lectura de archivo completada");
        return JSON.parse(data);
    } catch (error) {
        console.error("Error en getAlbums:", error);
        throw error;
    }
};

const saveAlbums = async (albums) => {
    console.log("Inicio de saveAlbums (asincrónico)");
    try {
        const data = JSON.stringify(albums, null, 2);
        await fs.writeFile(albumsFilePath, data, 'utf8');
        console.log("Fin de saveAlbums con éxito (asincrónico)");
    } catch (error) {
        console.error("Error en saveAlbums (asincrónico):", error);
    }
};

const findAll = async () => {
    console.log("Llamada a findAll");
    return await getAlbums();
};

const find = async (id) => {
    console.log(`Llamada a find con id: ${id}`);
    const albums = await getAlbums();
    const found = albums.find(album => album.id === id);
    console.log(found ? `Álbum encontrado: ${found.title}` : "Álbum no encontrado");
    return found;
};

const create = async (albumData) => {
    console.log("Llamada a create");
    const albums = await getAlbums();
    const newAlbum = { ...albumData, id: uuidv4() };
    console.log(`Creando nuevo álbum: ${newAlbum.title}`);
    albums.push(newAlbum);
    await saveAlbums(albums);
    console.log(`Nuevo álbum agregado: ${newAlbum.title}`);
    return newAlbum;
};

const update = async (id, albumData) => {
    console.log(`Llamada a update con id: ${id}`);
    let albums = await getAlbums();
    const index = albums.findIndex(album => album.id === id);
    if (index !== -1) {
        console.log(`Actualizando álbum: ${albums[index].title}`);
        albums[index] = { ...albumData, id };
        await saveAlbums(albums);
        console.log(`Álbum actualizado: ${albums[index].title}`);
        return albums[index];
    } else {
        console.log("Álbum no encontrado para actualizar");
        return null;
    }
};

const remove = async (id) => {
    console.log(`Llamada a remove con id: ${id}`);
    let albums = await getAlbums();
    const lengthBefore = albums.length;
    albums = albums.filter(album => album.id !== id);
    if (lengthBefore !== albums.length) {
        await saveAlbums(albums);
        console.log("Álbum eliminado");
        return true;
    } else {
        console.log("Álbum no encontrado para eliminar");
        return false;
    }
};

module.exports = { findAll, find, create, update, remove };
