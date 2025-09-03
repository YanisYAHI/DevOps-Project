import { Component, inject, input } from '@angular/core';
import { Album } from '../../models/album';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-element',
  imports: [RouterLink],
  templateUrl: './home-element.component.html',
  styleUrl: './home-element.component.css',
})
export class HomeElementComponent {
  router = inject(Router);
  album = input.required<Album>();
}
