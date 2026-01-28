import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_URL } from '../baseUrl';

@Injectable({
  providedIn: 'root',
})
export class GoalService {
  constructor(private _HttpClient: HttpClient) {}

  getAllGoals(): Observable<any> {
    return this._HttpClient.get(`${BASE_URL}/goals?page=1&limit=10`);
  }
}
