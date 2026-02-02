import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { ILogin, IRegister } from '../interface/Types';
import { isPlatformBrowser } from '@angular/common';
import { BASE_URL } from '../baseUrl';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  constructor(private _HttpClient: HttpClient) {}
  private readonly _platformId = inject(PLATFORM_ID);
  login(userData: ILogin): Observable<any> {
    return this._HttpClient.post(`${BASE_URL}/auth/login`, userData);
  }
  register(userData: IRegister): Observable<any> {
    return this._HttpClient.post(`${BASE_URL}/auth/register`, userData);
  }
  setToken(token: string): void {
    if (isPlatformBrowser(this._platformId)) {
      localStorage.setItem('token', token);
    }
  }
  getToken(): string | null {
    if (isPlatformBrowser(this._platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }
  logout(): void {
    if (isPlatformBrowser(this._platformId)) {
      localStorage.removeItem('token');
    }
  }

  get isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }
}
