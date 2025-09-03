import { Routes } from '@angular/router';
import { AlbumsListComponent } from './components/albums-list/albums-list.component';
import { SongsListComponent } from './components/songs-list/songs-list.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ArtistProfileComponent } from './components/artist-profile/artist-profile.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: AlbumsListComponent },
  { path: 'album/:album_id', component: SongsListComponent },
  { path: 'artist/:artist_id', component: ArtistProfileComponent },
  { path: '**', redirectTo: '404', pathMatch: 'full' },
  { path: '404', component: PageNotFoundComponent },
];
