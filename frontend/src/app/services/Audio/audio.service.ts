import { Injectable } from '@angular/core';
import { BehaviorSubject, fromEvent, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  private audio = new Audio();
  private current_src = '';

  private currentTimeSubject = new BehaviorSubject(0);
  current_time$ = this.currentTimeSubject.asObservable();

  private durationSubject = new BehaviorSubject(0);
  duration$ = this.durationSubject.asObservable();

  private playingSubject = new BehaviorSubject(false);
  playing$ = this.playingSubject.asObservable();

  private ended$ = fromEvent(this.audio, 'ended');

  constructor() {
    this.audio.ontimeupdate = () => {this.currentTimeSubject.next(this.audio.currentTime);}
    this.audio.onloadedmetadata = () => {this.durationSubject.next(this.audio.duration)}

    this.audio.onplay = () => this.playingSubject.next(true);
    this.audio.onpause = () => this.playingSubject.next(false);
    this.audio.onended = () => this.playingSubject.next(false);
  }

  getCurrentSrc(){
    return this.current_src;
  }

  getEnded$(): Observable<Event> {
    return this.ended$;
  }

  load(src: string){
    if(this.current_src === src){
      return;
    }
    this.current_src = src;
    this.audio.src = src;
    this.audio.load();
  }

  play(): Promise<void>{
    return this.audio.play();
  }

  pause(){
    this.audio.pause();
  }

  seek(seconds: number) {
    this.audio.currentTime = seconds;
  }

  setVolume(volume: number){
    this.audio.volume = volume;
  }

}
