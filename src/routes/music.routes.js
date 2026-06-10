const express = require("express");
const router = express.Router();
const { createMusic, createAlbum, getMusics, getAllAlbum, getAlbumById } = require("../controllers/music.controller");
const multer = require("multer");
const { authArtist, authUser } = require("../middlewares/auth.middleware");

const upload = multer({
    storage: multer.memoryStorage()
});


router.post('/upload', authArtist, upload.single("music"), createMusic)
router.post('/uploadAlbum', authArtist, createAlbum)
router.get('/getAll', authUser, getMusics)
router.get('/getAllAlbum', authUser, getAllAlbum)
router.get('/getAlbumById/:id', authUser, getAlbumById)

module.exports = router;