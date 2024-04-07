const express = require('express');
const albumController = require('../controllers/albumController');
const router = express.Router();

router.get('/', albumController.getAllAlbums);
router.get('/:albumId', albumController.getAlbumById);
router.post('/', albumController.addAlbum);
router.put('/:albumId', albumController.updateAlbum);
router.delete('/:albumId', albumController.deleteAlbum);

module.exports = router;
