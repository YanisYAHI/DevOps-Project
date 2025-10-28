import {parseFile} from 'music-metadata';
import * as fs from 'fs';
import {query} from './db.js'


const ALBUM_PATH = './public/The Witcher 3/The Witcher 3 - Wild Hunt Extended Soundtrack (2015)/'
const ARTIST_PATH = './public/The Witcher 3/'
//const TRACKS_FILES = getFiles(ALBUM_PATH)


async function getRawMetadata(path) {
    try {
        return await parseFile(path);
    } catch (error) {
        console.error('Error parsing metadata:', error.message);
    }
}

function getFiles(path) {
    let file_list = [];
    const files = fs.readdirSync(path)
    files.forEach(file => {
        file_list.push(file)
    })
    file_list.pop();
    return file_list;
}

function getAlbums(path){
    return fs.readdirSync(path, {withFileTypes: true})
        .filter(entry => entry.isDirectory())
        .map(entry => entry.name)
}

async function getAlbumInfo() {
    const metadata_sample = await getRawMetadata(ALBUM_PATH + TRACKS_FILES[0])

    return {
        title: metadata_sample.common.album,
        artist_id: metadata_sample.common.artist,
        release_year: metadata_sample.common.year,
        cover_path: `/musics/${metadata_sample.common.artist}/${metadata_sample.common.album}/Cover.jpg`
    }
}

function getTrackInfo(metadata, path) {
    return {
        title: metadata.common.title,
        duration: Math.round(metadata.format.duration),
        track_number: metadata.common.track.no,
        genre: "Folk",
        song_path: (ALBUM_PATH+path).replace('./public/','/musics/'),
        album_title: metadata.common.album
    }
}

async function getArtist(){
    const metadata = await getAlbumInfo()
    return {artist_id: metadata.artist_id, album_count:getAlbums(ARTIST_PATH).length, artist_cover:(ARTIST_PATH+"Banner.jpg").replace('./public/','/musics/')}
}

console.log(getTrackInfo(await getRawMetadata(ALBUM_PATH+TRACKS_FILES[0]),TRACKS_FILES[0]))

/** --------------- Database part --------------- **/

async function insertArtistDb(){
    const artist_id = (await getArtist()).artist_id
    const album_count = (await getAlbums(ARTIST_PATH)).length
    const artist_cover = (await getArtist()).artist_cover

    try {
        return (await query('INSERT INTO artists(id,album_count,artist_cover) VALUES($1,$2,$3) RETURNING *',[artist_id,album_count,artist_cover]))
    } catch (error) {
        console.error("Insert artist db error:", error.message)
    }
}

async function insertAlbumDb(){
    const album_info = await getAlbumInfo()
    const title = album_info.title;
    const artist_id = album_info.artist_id;
    const release_year = album_info.release_year;
    const cover_path = album_info.cover_path;

    try {
        return (await query('INSERT INTO albums(title,artist_id,release_year,cover_path) VALUES($1,$2,$3,$4) RETURNING *',[title,artist_id,release_year,cover_path]))
    } catch (error) {
        console.error("Insert album db error:", error.message)
    }
}

async function insertTracksDb(){
    try{
        for (const file of TRACKS_FILES){
            const rawMetadata = await getRawMetadata(ALBUM_PATH+file)
            const track_info = getTrackInfo(rawMetadata, file)
            const album_id = (await query('SELECT id FROM albums WHERE title=$1',[track_info.album_title])).rows[0].id

            await query('INSERT INTO songs(title,album_id,duration,track_number,genre,song_path) VALUES($1,$2,$3,$4,$5,$6) RETURNING *',[track_info.title,album_id,track_info.duration,track_info.track_number,track_info.genre,track_info.song_path])
        }
    } catch (error) {
        console.error("Insert tracks db error:", error.message)
    }

}


async function main(){
    await insertArtistDb();
    await insertAlbumDb();
    await insertTracksDb();
}
/** --------------- GET Database part --------------- **/


export async function getAllAlbumsdB() {
    try {
        return (await query('SELECT * FROM albums')).rows;
    } catch (error) {
        console.error("Get All albums error:", error.message);
    }
}


export async function getAlbumInfodB(album_id) {
    try {
        const res = await query('SELECT * FROM albums WHERE id=$1 ORDER BY id',[album_id])
        return res.rows[0]
    } catch (error) {
        console.error("Get album info error:", error.message);
    }
}

export async function getArtistAlbums(artist_id) {
    try {
        const res = await query('SELECT * FROM albums WHERE artist_id=$1 ORDER BY id',[artist_id])
        return res.rows
    } catch (error) {
        console.error("Get artist albums error:", error.message);
    }
}


export async function getTrackInfodB(track_id) {
    try {
        return (await query('SELECT * FROM songs WHERE id=$1',[track_id])).rows[0];
    } catch (error) {
        console.error("Get track info error:", error.message);
    }
}


export async function getAllAlbumTracksdB(album_id) {
    try {
        const songs = (await query('SELECT * FROM songs WHERE album_id=$1 ORDER BY id', [album_id])).rows
        if (songs === undefined || songs.length === 0) {
            throw new Error("Album not found");
        }
        return songs;
    } catch (error) {
        console.error("Get All tracks tracks error:", error.message);
        throw error;
    }
}


export async function getArtistInfodb(artist_id) {
    try {
        const artist_infos = await query('SELECT * FROM artists WHERE id=$1',[artist_id]);
        if (artist_infos.rows.length === 0){
            throw new Error("Artist not found");
        }
        return artist_infos.rows[0];
    } catch (error) {
        console.error("Get Artist info error:", error.message);
        throw error;
    }
}