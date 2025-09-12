import {Component, inject, input} from '@angular/core';
import { HomeElementComponent } from '../home-element/home-element.component';
import { HttpClient } from '@angular/common/http';
import { AsyncPipe } from '@angular/common';
import { Album } from '../../models/album';
import { PlayBarComponent } from '../play-bar/play-bar.component';
import {toObservable} from '@angular/core/rxjs-interop';
import {Observable, of, switchMap} from 'rxjs';

@Component({
  selector: 'app-albums-list',
  imports: [HomeElementComponent, AsyncPipe, PlayBarComponent],
  templateUrl: './albums-list.component.html',
  styleUrl: './albums-list.component.css',
})
export class AlbumsListComponent {
  private http = inject(HttpClient);

  albums = input<Album[] | null | undefined>(null);

  albums$ = toObservable(this.albums).pipe(
    switchMap(albums => {
      if (albums && albums.length > 0) {
        return of(albums); // utiliser ceux du parent
      } else {
        return this.http.get<Album[]>('api/all'); // fallback
      }
    })
  );

}
