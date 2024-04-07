const albumModel = require('../models/albumModel');

exports.getAllAlbums = async (req, res) => {
    try {
        const albums = await albumModel.findAll();
        res.status(200).json(albums);
    } catch (error) {
        res.status(500).send('Error retrieving albums');
    }
};

exports.getAlbumById = async (req, res) => {
    try {
        const album = await albumModel.find(req.params.albumId);
        if (album) {
            res.status(200).json(album);
        } else {
            res.status(404).send('Album not found');
        }
    } catch (error) {
        res.status(500).send('Error retrieving album');
    }
};

exports.addAlbum = async (req, res) => {
    console.log("Inicio de addAlbum", req.body);
    try {
        const newAlbum = await albumModel.create(req.body);
        res.status(201).json(newAlbum);
    } catch (error) {
        res.status(500).send('Error adding album');
    }
};

exports.updateAlbum = async (req, res) => {
    try {
        const updatedAlbum = await albumModel.update(req.params.albumId, req.body);
        if (updatedAlbum) {
            res.status(200).json(updatedAlbum);
        } else {
            res.status(404).send('Album not found');
        }
    } catch (error) {
        res.status(500).send('Error updating album');
    }
};

exports.deleteAlbum = async (req, res) => {
    try {
        const success = await albumModel.remove(req.params.albumId);
        if (success) {
            res.status(200).send('Album deleted successfully');
        } else {
            res.status(404).send('Album not found');
        }
    } catch (error) {
        res.status(500).send('Error deleting album');
    }
};
