import sqlite3 from 'sqlite3';
import {open} from "sqlite";
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

export async function initDb() {
    return open({
        filename: 'music.db',
        driver: sqlite3.Database
    });
}

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

// export async function getAllAlbumsdB(db) {
//     try {
//         return await db.all('SELECT * FROM albums');
//     } catch (error) {
//         console.error("Get All albums error:", error.message);
//     }
// }

export async function getAllAlbumsdB() {
    try {
        return (await query('SELECT * FROM albums')).rows;
    } catch (error) {
        console.error("Get All albums error:", error.message);
    }
}

// export async function getAlbumInfodB(db,album_id) {
//     try {
//         return await db.get('SELECT * FROM albums WHERE id=?',[album_id]);
//     } catch (error) {
//         console.error("Get album info error:", error.message);
//     }
// }

export async function getAlbumInfodB(album_id) {
    try {
        return (await query('SELECT * FROM albums WHERE id=?',[album_id])).rows;
    } catch (error) {
        console.error("Get album info error:", error.message);
    }
}


// export async function getTrackInfodB(db,track_id) {
//     try {
//         return await db.get('SELECT * FROM songs WHERE id=?',[track_id]);
//     } catch (error) {
//         console.error("Get album info error:", error.message);
//     }
// }

export async function getTrackInfodB(track_id) {
    try {
        return (await query('SELECT * FROM songs WHERE id=$1',[track_id])).rows[0];
    } catch (error) {
        console.error("Get track info error:", error.message);
    }
}


// export async function getAllAlbumTracksdB(db, album_id) {
//     try {
//         const songs = await db.all('SELECT * FROM songs WHERE album_id=?', [album_id])
//         if (songs === undefined || songs.length === 0) {
//             throw new Error("Album not found");
//         }
//         return songs;
//     } catch (error) {
//         console.error("Get All tracks tracks error:", error.message);
//         throw error;
//     }
// }


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


// export async function getArtistInfodb(db,artist_id) {
//     try {
//         const artist_infos = await db.get('SELECT * FROM artists WHERE id=?',[artist_id]);
//         if (artist_infos === undefined){
//             throw new Error("Artist not found");
//         }
//         return artist_infos;
//     } catch (error) {
//         console.error("Get Artist info error:", error.message);
//         throw error;
//     }
// }


export async function getArtistInfodb(artist_id) {
    try {
        const artist_infos = await query('SELECT * FROM artists WHERE id=$1',[artist_id]);
        if (artist_infos.rows.length === 0){
            throw new Error("Artist not found");
        }
        return artist_infos.rows;
    } catch (error) {
        console.error("Get Artist info error:", error.message);
        throw error;
    }
}

async function main() {

    const db = await initDb();
    try {
        //const meta = getTrackInfo(getRawMetadata(ALBUM_PATH+TRACKS_FILES[0]),ALBUM_PATH+TRACKS_FILES[0]);
        //const m = await getRawMetadata(ALBUM_PATH+TRACKS_FILES[0])
        //const a = await getAllAlbumTracks(db,5)
        //console.log(a)
        //await addMultipleTracksDb(db)
        const k = await getArtistInfodb('Damso')
        console.log(k);
    } catch (error) {
        console.error("Main error:", error.message);
    } finally {
        await db.close()
        console.log("Database closed.")
    }

}

//main()