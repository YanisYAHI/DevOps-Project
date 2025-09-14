import {Component, inject, input} from '@angular/core';
import { HomeElementComponent } from '../home-element/home-element.component';
import { HttpClient } from '@angular/common/http';
import { AsyncPipe } from '@angular/common';
import { Album } from '../../models/album';
import {toObservable} from '@angular/core/rxjs-interop';
import {of, switchMap} from 'rxjs';

@Component({
  selector: 'app-albums-list',
  imports: [HomeElementComponent, AsyncPipe],
  templateUrl: './albums-list.component.html',
  styleUrl: './albums-list.component.css',
})
export class AlbumsListComponent {
  private http = inject(HttpClient);

  albums = input<Album[] | null | undefined>(null);

  albums$ = toObservable(this.albums).pipe(
    switchMap(albums => {
      if (albums && albums.length > 0) {
        return of(albums);
      } else {
        return this.http.get<Album[]>('api/all');
      }
    })
  );

}
