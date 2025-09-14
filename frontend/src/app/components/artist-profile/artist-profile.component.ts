import { Component, inject, OnInit } from '@angular/core';
import { Artist } from '../../models/artist';
import { ActivatedRoute, Router } from '@angular/router';
import {catchError, Observable, of, tap} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AsyncPipe } from '@angular/common';
import {Album} from '../../models/album';
import {AlbumsListComponent} from '../albums-list/albums-list.component';

@Component({
  selector: 'app-artist-profile',
  imports: [AsyncPipe, AlbumsListComponent],
  templateUrl: './artist-profile.component.html',
  styleUrl: './artist-profile.component.css',
})
export class ArtistProfileComponent implements OnInit {
  artist_id!: string;
  artist_info$!: Observable<{artist_info:Artist,albums:Album[]} | null>;
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private router = inject(Router);

  ngOnInit() {
    this.artist_id = this.route.snapshot.paramMap.get('artist_id')!;
    this.artist_info$ = this.http.get<{artist_info:Artist,albums:Album[]}>(`api/artist/${this.artist_id}`).pipe(
      tap((data) => console.log('API response:', data)),
      catchError((error) => {
        console.log('error loading artist:', error);
        this.router.navigate(['404']);
        return of();
    }),
    );
    console.log(this.artist_info$);
  }
}
