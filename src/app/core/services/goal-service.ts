import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retry } from 'rxjs';
import { BASE_URL } from '../baseUrl';
import { ICategories, IGoal } from '../interface/Types';

@Injectable({
  providedIn: 'root',
})
export class GoalService {
  constructor(private _HttpClient: HttpClient) {}

  getAllGoals(page: number = 1, limit: number = 6): Observable<any> {
    return this._HttpClient.get(`${BASE_URL}/goals?page=${page}&limit=${limit}`);
  }
  singleGoal(id: string): Observable<any> {
    return this._HttpClient.get(`${BASE_URL}/goals/${id}`);
  }

  addGoal(data: FormData | IGoal): Observable<any> {
    return this._HttpClient.post(`${BASE_URL}/goals/addGoal`, data);
  }

  updateGoal(id: string | undefined, data: FormData): Observable<any> {
    return this._HttpClient.put(`${BASE_URL}/goals/updateGoal/${id}`, data);
  }

  allCategories(): Observable<any> {
    return this._HttpClient.get(`${BASE_URL}/categories`);
  }

  addCategory(data: ICategories): Observable<any> {
    return this._HttpClient.post(`${BASE_URL}/categories/addCategory`, data);
  }
  deleteCategory(categoryId: string | undefined) {
    return this._HttpClient.delete(
      `${BASE_URL}/categories/deleteCategory/${categoryId}`,
    );
  }
}
