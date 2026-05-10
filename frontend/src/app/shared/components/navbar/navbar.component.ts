import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar navbar-expand-lg navbar-davivienda">
      <div class="container">
        <a class="navbar-brand d-flex align-items-center gap-2" routerLink="/surveys">
          <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
            <rect width="40" height="40" rx="8" fill="white" fill-opacity="0.15"/>
            <path d="M20 8L8 16v16h8v-8h8v8h8V16L20 8z" fill="white"/>
          </svg>
          <span>Banco | Encuestas</span>
        </a>
        <div class="navbar-nav ms-auto d-flex flex-row gap-3">
          <a class="nav-link" routerLink="/surveys" routerLinkActive="active">Mis encuestas</a>
        </div>
      </div>
    </nav>
  `
})
export class NavbarComponent {}
