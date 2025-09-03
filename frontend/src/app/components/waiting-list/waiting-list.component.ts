import { Component, inject, input } from '@angular/core';
import { Song } from '../../models/song';
import { PlayerService } from '../../services/Player/player.service';

@Component({
  selector: 'app-waiting-list',
  imports: [],
  templateUrl: './waiting-list.component.html',
  styleUrl: './waiting-list.component.css'
})
export class WaitingListComponent {

  songs = input.required<Song[]>();
  private playerService = inject(PlayerService);
  current_song$: Song | null = null;

  constructor() {
    this.playerService.currentSong$.subscribe(
      (song: Song | null) => (this.current_song$ = song),
    );
  }

}
