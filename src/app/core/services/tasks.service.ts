import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_URL } from '../baseUrl';

@Injectable({
  providedIn: 'root',
})
export class Tasks {
  constructor(private _HttpClient: HttpClient) {}

  getAllTasks(): Observable<any> {
    return this._HttpClient.get(`${BASE_URL}/tasks?page=1&limit=10`);
  }
}
