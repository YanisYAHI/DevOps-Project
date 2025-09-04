import express from 'express';
import cors from 'cors';
import {
    getAllAlbumTracksdB,
    getAllAlbumsdB,
    getAlbumInfodB,
    getArtistInfodb,
    getTrackInfodB,
} from './utils.js'
import * as fs from "node:fs";


const app = express();
const PORT = 3000;

app.use(cors());
app.use('/static', express.static('public'));


app.get('/api/all',async (req, res) => {
    try{
        const albums_info = await getAllAlbumsdB()
        res.json(albums_info)
    }
    catch(error){
        console.error('Error GET :', error)
        res.status(500).send('Server Error')
    }
})


app.get('/api/artist/:artist_id',async (req, res) => {
    try{
        const artist_info = await getArtistInfodb(req.params.artist_id)
        res.json(artist_info)
    } catch(error) {
        if (error.message.includes('not found')) {
            res.status(404).send('Not found');
        } else {
            console.error('Error GET :', error)
            res.status(500).send('Server Error')
        }
    }
})

app.get('/api/album/:album_id',async (req, res) => {
    try{
        const tracks = await getAllAlbumTracksdB(req.params.album_id)
        const album_info = await getAlbumInfodB(req.params.album_id)
        res.json({album:album_info,tracks:tracks})
    }
    catch(error) {
        if (error.message.includes('not found')) {
            res.status(404).send('Not found');
        } else {
            console.error('Error GET :', error)
            res.status(500).send('Server Error')
        }
    }
})

app.get('/api/:song_id', async (req, res) => {
        try {
            const tmp = await getTrackInfodB(req.params.song_id)
            console.log(tmp)
            const song_path = (await getTrackInfodB(req.params.song_id)).song_path.replace('/static','/musics')
            console.log("aajajajja", song_path)
            const range = req.headers.range || 0;
            const parts = range.replace(/bytes=/, '').split('-')
            const song_size = fs.statSync(song_path).size;
            const CHUNK_SIZE = 10 ** 6;
            const start = parseInt(parts[0])
            const end = Math.min(start + CHUNK_SIZE - 1, song_size - 1)
            const chunk = fs.createReadStream(song_path, {start, end})

            const head = {
                "Content-Range": `bytes ${start}-${end}/${song_size}`,
                "Accept-Ranges": "bytes",
                "Content-Length": CHUNK_SIZE,
                "Content-Type": "audio/flac"
            }

            res.writeHead(206, head)
            chunk.pipe(res)
        } catch (error) {
            if (error.message.includes('not found')) {
                res.status(404).send('Not found');
            } else {
                console.error('Error GET :', error)
                res.status(500).send('Server Error')
            }
        }
    }
)


app.listen(PORT, ()=> {
    console.log('Server listening on port ', PORT)
})