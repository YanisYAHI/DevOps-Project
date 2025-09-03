import { inject, Injectable } from '@angular/core';
import { Song } from '../../models/song';
import { AudioService } from '../Audio/audio.service';
import { HttpClient } from '@angular/common/http';
import { Album } from '../../models/album';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private queue: Song[] = [];

  private song_index: number = 0;
  private audioService = inject(AudioService);
  private http = inject(HttpClient);
  private playlist: Song[] = [];
  private is_repeat = false;
  private current_song : Song | null = null;

  current_time$ = this.audioService.current_time$;
  duration$ = this.audioService.duration$;
  playing$ = this.audioService.playing$;
  private currentSongSubject = new BehaviorSubject<Song | null>(null);
  currentSong$ = this.currentSongSubject.asObservable();

  constructor() {
    this.audioService.getEnded$().subscribe(() => {
      console.log(this.is_repeat)
      if(this.is_repeat){
        this.playSong()
      }
      else if (this.queue.length > 0){
        this.nextSong()
      }
    })
  }

  setFirstSong(song : Song) {
    this.queue = []
    this.song_index = 0
    this.currentSongSubject.next(song);
    this.current_song = song;
  }


  fillQueue(){
    this.http
      .get<{album:Album,tracks:Song[]}>('/api/album/' + this.current_song?.album_id)
      .subscribe({
        next: (data) => {
          this.playlist = data.tracks;
          this.queue = this.playlist.filter(
            (song) => song.track_number >= this.current_song!.track_number,
          );
          console.log(this.queue);
        },
        error: (err) => {
          console.error('fillQueue() player.service.ts error : ', err);
        },
      });
  }

  playSong() {
    console.log(this.queue)
    const url = '/api/' + this.current_song?.id;
    if (this.audioService.getCurrentSrc() !== url) {
      this.audioService.load(url);
    }
    this.audioService.play().catch((err) => {
      console.warn('play() failed:', err);
    });

    if(this.queue.length === 0){
      this.fillQueue()
    }

  }

  pauseSong() {
    this.audioService.pause();
  }

  nextSong() {
    if(this.song_index >= this.queue.length){
      return
    }
    console.log(this.queue)
    console.log(this.current_song)
    console.log(this.song_index)
    this.song_index +=1;
    this.current_song = this.queue[this.song_index]!
    this.currentSongSubject.next(this.current_song)
    console.log(this.song_index)

    console.log(this.current_song)
    this.playSong()
  }

  replaySong() {
    const url = '/api/' + this.current_song?.id;
    this.audioService.load(url);
  }

  previousSong() {
    if(this.current_song!.duration < 2){
      this.current_song = this.queue[this.song_index]!
      this.replaySong()
    }
    else{
      this.song_index -=1;
      this.current_song = this.queue[this.song_index]!
      this.currentSongSubject.next(this.current_song)
      this.playSong()
    }
  }

  shuffle() {
    const arr = this.playlist
    let random_nb, tmp;
    let i = arr.length;
    while (--i > 0){
      random_nb = Math.floor(Math.random() * (i + 1));
      tmp = arr[random_nb]
      arr[random_nb] = arr[i]
      arr[i] = tmp
    }
    this.queue = arr
  }

  unshuffle() {
    this.queue = this.playlist.filter(
      (song) => song.track_number > this.current_song!.track_number,
    );
  }

  setRepeat(bool: boolean) {
    this.is_repeat = bool;
  }

  seek(value: number) {
    this.audioService.seek(value);
  }

  getQueue(){
    return this.queue;
  }

}
