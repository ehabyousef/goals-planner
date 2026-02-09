import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  searchQuery = signal<string>('');

  setSearchQuery(query: string): void {
    this.searchQuery.set(query.toLowerCase().trim());
  }

  clearSearch(): void {
    this.searchQuery.set('');
  }
}
