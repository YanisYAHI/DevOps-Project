import {Component, inject, input} from '@angular/core';
import { HomeElementComponent } from '../home-element/home-element.component';
import { HttpClient } from '@angular/common/http';
import { AsyncPipe } from '@angular/common';
import { Album } from '../../models/album';
import { PlayBarComponent } from '../play-bar/play-bar.component';
import {toObservable} from '@angular/core/rxjs-interop';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-albums-list',
  imports: [HomeElementComponent, AsyncPipe, PlayBarComponent],
  templateUrl: './albums-list.component.html',
  styleUrl: './albums-list.component.css',
})
export class AlbumsListComponent {
  private http = inject(HttpClient);
  albums$!: Observable<Album[] | null | undefined>;
  albums = input<Album[] | null | undefined>(null);

  ngOnInit() {
    if (this.albums()){
      console.log("IF sqdqsd:",this.albums())
      console.log("IF qsdqsd",this.albums);
      this.albums$ = toObservable(this.albums)
    }
    else{
      console.log("sqdqsd:",this.albums())
      console.log("qsdqsd",this.albums);
      this.albums$ = this.http.get<Album[] | null>('api/all')
    }
  }

}
