import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Song } from '../../models/song';
import { AsyncPipe, DatePipe } from '@angular/common';
import { catchError, Observable, of } from 'rxjs';
import { PlayBarComponent } from '../play-bar/play-bar.component';
import { PlayerService } from '../../services/Player/player.service';
import { Album } from '../../models/album';
import {faCompactDisc} from '@fortawesome/free-solid-svg-icons';
import {faPlay} from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

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
  faCompactDisc = faCompactDisc;
  faPlay = faPlay;


  constructor() {
    this.playerService.currentSong$.subscribe(
      (song: Song | null) => (this.current_song = song),
    );
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
  }

  playSelectedSong(song: Song) {
    this.playerService.setFirstSong(song);
    this.playerService.playSong();
  }
}
