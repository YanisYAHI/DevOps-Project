import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Slider } from 'primeng/slider';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPauseCircle, faPlayCircle } from '@fortawesome/free-regular-svg-icons';
import {
  faCirclePause,
  faCirclePlay,
  faShuffle,
  faVolumeHigh,
  faVolumeMute,
  faVolumeLow,
} from '@fortawesome/free-solid-svg-icons';
import { faForwardStep, faBackwardStep, faRepeat, faBarsStaggered} from '@fortawesome/free-solid-svg-icons';
import { PlayerService } from '../../services/Player/player.service';
import { SliderChangeEvent } from 'primeng/slider';
import { WaitingListComponent } from '../waiting-list/waiting-list.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-play-bar',
  imports: [
    FormsModule,
    Slider,
    FontAwesomeModule,
    WaitingListComponent,
    DatePipe,
  ],
  templateUrl: './play-bar.component.html',
  styleUrl: './play-bar.component.css',
})

export class PlayBarComponent {
  fa_pause_empty = faPauseCircle;
  fa_pause_full = faCirclePause;
  fa_play_full = faCirclePlay;
  fa_play_empty = faPlayCircle;

  faForwardStep = faForwardStep;
  faBackwardStep = faBackwardStep;

  faRepeat = faRepeat;
  fa_shuffle = faShuffle;

  fa_volumehigh = faVolumeHigh;
  fa_volumemute = faVolumeMute;
  fa_volumelow = faVolumeLow;

  faBarsStaggered = faBarsStaggered;

  hovered = false;
  playing = false;
  is_shuffle = false;
  is_repeat = false;
  show_waiting_list = false;

  playerService = inject(PlayerService);
  current_time = 0;
  duration = 0;

  volume = 100;

  constructor() {
    this.playerService.current_time$.subscribe(
      (time) => (this.current_time = time),
    );
    this.playerService.duration$.subscribe((dur) => (this.duration = dur));
    this.playerService.playing$.subscribe((p) => (this.playing = p));
  }

  playSong() {
    this.playerService.playSong();
  }

  pauseSong() {
    this.playerService.pauseSong();
  }

  togglePLayPause() {
    if(this.duration === 0){
      return
    }
    if (this.playing) {
      this.pauseSong();
    } else {
      this.playSong();
    }
  }

  seek(event: SliderChangeEvent) {
    this.playerService.seek(event.value!);
  }

  nextSong() {
    this.playerService.nextSong();
  }

  previousSong() {
    this.playerService.previousSong();
  }

  shuffleQueue() {
    this.is_shuffle = !this.is_shuffle;
    if (this.is_shuffle) {
      this.playerService.shuffle();
    } else {
      this.playerService.unshuffle();
    }
  }

  repeatQueue() {
    this.is_repeat = !this.is_repeat;
    this.playerService.setRepeat(this.is_repeat);
  }

  getQueue() {
    return this.playerService.getQueue();
  }

  toggleWaitingList() {
    this.show_waiting_list = !this.show_waiting_list;
  }

  setVolume(event: any) {
    this.volume = event.value;
    this.playerService.setVolume(this.volume);
  }
}
