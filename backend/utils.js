import {parseFile} from 'music-metadata';
import * as fs from 'fs';
import {query} from './db.js'


const ALBUM_PATH = './public/Freeze Corleone/LMF/'
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

export async function getAlbumInfo() {
    const metadata_sample = await getRawMetadata(ALBUM_PATH + TRACKS_FILES[0])

    return {
        title: metadata_sample.common.album,
        artist_id: metadata_sample.common.artist,
        release_year: metadata_sample.common.year,
        album_path: ALBUM_PATH,
        album_cover: ALBUM_PATH + "Cover.jpg"
    }
}

function getTrackInfo(metadata, path) {
    return {
        title: metadata.common.title,
        duration: Math.round(metadata.format.duration),
        track_number: metadata.common.track.no,
        genre: "Rap",
        song_path: path,
        album_title: metadata.common.album
    }
}


/** --------------- Database part --------------- **/

export async function addAlbumInDb(db) {
    const data = await getAlbumInfo();

    try {
        await db.run(
            'INSERT INTO albums (title,artist_id,release_year,album_path) VALUES (?,?,?,?)',
            [data.title, data.artist_id, data.release_year, data.album_path]);

        const rows = await db.all('SELECT * FROM albums');
        console.log("SELECT albums succeeded:", rows)
    } catch (error) {
        console.error("Album insert error:", error.message);
    }
}

export async function addTrackInDb(db, data, track_path) {
    try {
        await db.run('INSERT INTO songs (title,album_id,duration,track_number,genre,song_path) VALUES (?,(SELECT id FROM albums WHERE title=?),?,?,?,?)',
            [
                data.title,
                data.album_title,
                data.duration,
                data.track_number,
                data.genre,
                track_path])
    } catch (error) {
        console.error("Track insert error:", error.message);
    }

}

export async function addMultipleTracksDb(db) {
    try {
        for (const file of TRACKS_FILES) {
            const track_path = ALBUM_PATH.replace('./public', '/static') + file
            const metadata = await getRawMetadata(track_path)
            const data = getTrackInfo(metadata, track_path)

            await addTrackInDb(db, data, track_path)
        }
        const rows = await db.all('SELECT * FROM songs');
        console.log("SELECT songs succeeded:", rows)
    } catch (error) {
        console.error("Multiple tracks insert error:", error.message);
    }
}


export async function getAllAlbumsdB() {
    try {
        return (await query('SELECT * FROM albums')).rows;
    } catch (error) {
        console.error("Get All albums error:", error.message);
    }
}


export async function getAlbumInfodB(album_id) {
    try {
        const res = await query('SELECT * FROM albums WHERE id=$1',[album_id])
        return res.rows[0]
    } catch (error) {
        console.error("Get album info error:", error.message);
    }
}

export async function getArtistAlbums(artist_id) {
    try {
        const res = await query('SELECT * FROM albums WHERE artist_id=$1',[artist_id])
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
        const songs = (await query('SELECT * FROM songs WHERE album_id=$1', [album_id])).rows
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