import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retry } from 'rxjs';
import { BASE_URL } from '../baseUrl';
import { IGoal } from '../interface/Types';

@Injectable({
  providedIn: 'root',
})
export class GoalService {
  constructor(private _HttpClient: HttpClient) {}

  getAllGoals(page: number = 1, limit: number = 6): Observable<any> {
    return this._HttpClient.get(`${BASE_URL}/goals?page=${page}&limit=${limit}`);
  }

  addGoal(data: IGoal): Observable<any> {
    return this._HttpClient.post(`${BASE_URL}/goals/addGoal`, data);
  }
  allCategories(): Observable<any> {
    return this._HttpClient.get(`${BASE_URL}/categories`);
  }
}
