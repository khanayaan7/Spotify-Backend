const { ImageKit } = require("@imagekit/nodejs")

const imagekit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
})

async function uploadFile(file) {
    const result = await imagekit.files.upload({
        file,
        fileName: "music" + Date.now(),
        folder: "spotify-project-music",
    })

    return result;
}

module.exports = { uploadFile };