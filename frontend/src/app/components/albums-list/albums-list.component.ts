import { Component, inject } from '@angular/core';
import { HomeElementComponent } from '../home-element/home-element.component';
import { HttpClient } from '@angular/common/http';
import { AsyncPipe } from '@angular/common';
import { Album } from '../../models/album';
import { PlayBarComponent } from '../play-bar/play-bar.component';

@Component({
  selector: 'app-albums-list',
  imports: [HomeElementComponent, AsyncPipe, PlayBarComponent],
  templateUrl: './albums-list.component.html',
  styleUrl: './albums-list.component.css',
})
export class AlbumsListComponent {
  private http = inject(HttpClient);
  albums$ = this.http.get<Album[]>('/api/all');
}
