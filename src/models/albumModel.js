const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const albumsFilePath = path.join(__dirname, '..', 'data', 'albums.json');

async function getAlbums() {
    console.log("Inicio de getAlbums");
    try {
        const data = await fs.readFile(albumsFilePath, 'utf8');
        console.log("Fin de getAlbums con éxito");
        return JSON.parse(data);
    } catch (error) {
        console.error("Error en getAlbums:", error);
        if (error.code === 'ENOENT') {
            console.log("El archivo no existe, creando uno nuevo...");
            await saveAlbums([]);
            return [];
        } else {
            throw error;
        }
    }
}

async function saveAlbums(albums) {
    console.log("Inicio de saveAlbums");
    try {
        await fs.writeFile(albumsFilePath, JSON.stringify(albums, null, 2), 'utf8');
        console.log("Fin de saveAlbums con éxito");
    } catch (error) {
        console.error("Error en saveAlbums:", error);
    }
}

async function findAll() {
    console.log("Llamada a findAll");
    return await getAlbums();
}

async function find(id) {
    console.log(`Llamada a find con id: ${id}`);
    const albums = await getAlbums();
    const album = albums.find(album => album.id === id);
    console.log(album ? `Álbum encontrado: ${album.title}` : "Álbum no encontrado");
    return album;
}

async function create(albumData) {
    console.log("Intentando crear nuevo álbum:", albumData);
    const albums = await getAlbums();
    const newAlbum = { ...albumData, id: uuidv4() };
    albums.push(newAlbum);
    console.log("Antes de guardar, total de álbumes:", albums.length);
    await saveAlbums(albums);
    console.log(`Nuevo álbum creado con éxito: ${newAlbum.title}`);
    return newAlbum;
}

async function update(id, albumData) {
    console.log(`Intentando actualizar álbum con id: ${id}`);
    const albums = await getAlbums();
    const index = albums.findIndex(album => album.id === id);
    if (index !== -1) {
        albums[index] = { ...albumData, id };
        await saveAlbums(albums);
        console.log(`Álbum actualizado con éxito: ${albums[index].title}`);
        return albums[index];
    } else {
        console.log("Álbum no encontrado para actualizar");
        return null;
    }
}

async function remove(id) {
    console.log(`Intentando eliminar álbum con id: ${id}`);
    let albums = await getAlbums();
    const lengthBefore = albums.length;
    albums = albums.filter(album => album.id !== id);
    if (lengthBefore !== albums.length) {
        await saveAlbums(albums);
        console.log("Álbum eliminado con éxito");
        return true;
    } else {
        console.log("Álbum no encontrado para eliminar");
        return false;
    }
}

module.exports = { findAll, find, create, update, remove };
