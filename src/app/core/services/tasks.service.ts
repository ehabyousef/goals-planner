import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_URL } from '../baseUrl';
import { ITask } from '../interface/Types';

@Injectable({
  providedIn: 'root',
})
export class Tasks {
  constructor(private _HttpClient: HttpClient) {}

  getAllTasks(): Observable<any> {
    return this._HttpClient.get(`${BASE_URL}/tasks?page=1&limit=10`);
  }
  getGoalTasks(goalId: string | undefined): Observable<any> {
    return this._HttpClient.get(`${BASE_URL}/tasks/${goalId}`);
  }
  addTask(form: ITask): Observable<any> {
    return this._HttpClient.post(`${BASE_URL}/tasks/addTask`, form);
  }
  updateTask(taskId: string, form: Partial<ITask>): Observable<any> {
    return this._HttpClient.put(`${BASE_URL}/tasks/updateTask/${taskId}`, form);
  }
}
