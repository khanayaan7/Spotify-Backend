const musicModel = require("../models/music.model")
const albumModel = require("../models/album.model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const { uploadFile } = require("../services/storage.service");

async function createMusic(req, res) {

    const { title } = req.body;
    const file = req.file;
    const decode = req.user;

    const result = await uploadFile(file.buffer.toString("base64"))

    const music = await musicModel.create({
        uri: result.url,
        title,
        artist: decode.id
    })

    res.status(201).json({
        success: true,
        message: "Music created successfully",
        music: {
            id: music._id,
            title: music.title,
            uri: music.uri,
            artist: music.artist
        }
    })

}

const createAlbum = async (req, res) => {

    const { title, musicIds } = req.body;
    const decode = req.user;

    const album = await albumModel.create({
        title,
        tracks: musicIds,
        artist: decode.id
    })

    res.status(201).json({
        success: true,
        message: "Album created successfully",
        album: {
            id: album._id,
            title: album.title,
            tracks: album.tracks,
            artist: album.artist
        }
    })
}


const getMusics = async (req, res) => {
    const musics = await musicModel.find().limit(10).populate("artist", "username email")

    res.status(200).json({
        success: true,
        message: "Music fetched successfully",
        musics
    })
}

async function getAllAlbum(req, res) {
    const albums = await albumModel.find().select("title artist").populate("artist", "username email");
    console.log(albums)

    res.status(200).json({
        success: true,
        message: "Albums fetched successfully",
        albums: albums
    })
}

async function getAlbumById(req, res) {
    const album = await albumModel.findById(req.params.id).populate("artist", "username email")

    res.status(200).json({
        success: true,
        message: "Album fetched successfully",
        album
    })
}


module.exports = { createMusic, createAlbum, getMusics, getAllAlbum, getAlbumById }