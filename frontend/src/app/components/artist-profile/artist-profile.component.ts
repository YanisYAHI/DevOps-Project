import { Component, inject, OnInit } from '@angular/core';
import { PlayBarComponent } from '../play-bar/play-bar.component';
import { Artist } from '../../models/artist';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-artist-profile',
  imports: [PlayBarComponent, AsyncPipe],
  templateUrl: './artist-profile.component.html',
  styleUrl: './artist-profile.component.css',
})
export class ArtistProfileComponent implements OnInit {
  artist_id!: string;
  artist_info$!: Observable<Artist>;
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private router = inject(Router);

  ngOnInit() {
    this.artist_id = this.route.snapshot.paramMap.get('artist_id')!;
    console.log(this.artist_id);
    this.artist_info$ = this.http.get<Artist>(`api/artist/${this.artist_id}`).pipe(
      catchError((error) => {
        console.log('error loading artist:', error);
        this.router.navigate(['404']);
        return of({ id: '', album_count: 0 });
    }),
    );
    console.log(this.artist_info$);
  }
}
