import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Song } from '../../models/song';
import { AsyncPipe, DatePipe } from '@angular/common';
import {catchError, map, Observable, of} from 'rxjs';
import { PlayBarComponent } from '../play-bar/play-bar.component';
import { PlayerService } from '../../services/Player/player.service';
import { Album } from '../../models/album';
import {faCirclePause, faCirclePlay, faCompactDisc, faPlay} from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {faPauseCircle, faPlayCircle} from '@fortawesome/free-regular-svg-icons';
import { take } from 'rxjs/operators';


@Component({
  selector: 'app-songs-list',
  imports: [AsyncPipe, PlayBarComponent, DatePipe, FaIconComponent, RouterLink],
  templateUrl: './songs-list.component.html',
  styleUrl: './songs-list.component.css',
})
export class SongsListComponent implements OnInit {
  album_id!: string;
  data$!: Observable<{ album: Album; tracks: Song[] } | null>;
  current_song: Song | null = null;
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private router = inject(Router);
  private playerService = inject(PlayerService);
  duration = 0;
  albumDuration$!: Observable<number>;


  playing = false;
  hovered = false;
  faCompactDisc = faCompactDisc;
  fa_pause = faPlay;
  fa_pause_full = faCirclePause;
  fa_play_full = faCirclePlay;
  fa_play_empty = faPlayCircle;


  constructor() {
    this.playerService.currentSong$.subscribe(
      (song: Song | null) => (this.current_song = song),
    );
    this.playerService.playing$.subscribe((p) => (this.playing = p));
    this.playerService.duration$.subscribe((dur) => (this.duration = dur));
  }

  ngOnInit() {
    this.album_id = this.route.snapshot.paramMap.get('album_id')!;
    this.data$ = this.http
      .get<{ album: Album; tracks: Song[] }>(`api/album/${this.album_id}`)
      .pipe(
        catchError((error) => {
          console.log('error loading album');
          this.router.navigate(['404']);
          return of(null);
        }),
      );
    this.albumDuration$ = this.data$.pipe(
      map((data) => {
        if (!data) return 0;
        let res = 0
        for (let song of data.tracks) {
          res += song.duration;
        }
        return Math.round(res/60)
      })
    )
  }

  playSong() {
    this.playerService.playSong();
  }

  pauseSong() {
    this.playerService.pauseSong();
  }

  playSelectedSong(song: Song) {
    this.playerService.setFirstSong(song);
    this.playSong();
  }

  togglePLayPause() {
    if(this.duration === 0){
      this.data$.pipe(take(1)).subscribe((data) => {
        if (data && data.tracks.length > 0){
          const first_song = data.tracks[0];
          this.playSelectedSong(first_song)
        }
      })
    }
    if (this.playing) {
      this.pauseSong();
    } else {
      this.playSong();
    }
  }

  getAlbumDuration(): Observable<number> {
    return this.data$.pipe(
      take(1),
      map((data) => {
        if (!data) return 0;
        return data.tracks.reduce((sum, song) => sum + song.duration, 0);
      })
    );
  }

}
