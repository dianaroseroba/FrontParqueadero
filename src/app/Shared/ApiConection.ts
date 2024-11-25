import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable()
export class ApiConection {
  private headers = new HttpHeaders().set('Content-Type', 'application/json');
  private options = { headers: this.headers };
  token: string | null = '';
  baseURL = 'http://localhost:8000/';  // URL base de la API
  private headersAll = {};
  private optionsAll = {};

  constructor(private http: HttpClient) {}

  // LOGIN
  login(data: any): Observable<any> {
    return this.http.post('http://localhost:8000/api-auth/', data, this.options)
      .pipe(
        map((response: any) => {
          this.token = response.token;
          if (typeof this.token === 'string') {
            localStorage.setItem('token', this.token);
          }
          this.headersAll = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', 'Token ' + response.token);
          this.optionsAll = { headers: this.headersAll };
          return response;
        }),
        catchError(this.handleError<any>('login'))
      );
  }

  // GET
  get(finisher: string): Observable<any[]> {
    const url = `${this.baseURL}${finisher}`;
    this.headersAll = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', 'Token ' + this.token);
    this.optionsAll = { headers: this.headersAll };
    return this.http.get<any[]>(url, this.optionsAll)
      .pipe(
        catchError(this.handleError<any[]>('listar', []))
      );
  }

  // POST
  add(finisher: string, data: any) {
    let dJson = JSON.stringify(data);
    let url = `${this.baseURL + finisher}`;
    this.headersAll = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', 'Token ' + this.token);
    this.optionsAll = { headers: this.headersAll };
    return this.http.post(url, dJson, this.optionsAll)
      .pipe(
        catchError(this.handleError<any>('add' + finisher))
      );
  }

  // PUT
  update(finisher: string, data: any, id: number) {
    let dJson = JSON.stringify(data);
    let url = `${this.baseURL + finisher + '/' + id + '/'}`;
    this.headersAll = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', 'Token ' + this.token);
    this.optionsAll = { headers: this.headersAll };
    return this.http.put(url, dJson, this.optionsAll)
      .pipe(
        catchError(this.handleError<any>('actualizar' + finisher))
      );
  }

  // DELETE
  delete(finisher: string, id: number) {
    const url = `${this.baseURL}${finisher}/${id}/`;  // URL con el ID para eliminar el recurso
    this.headersAll = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', 'Token ' + this.token);
    this.optionsAll = { headers: this.headersAll };
    return this.http.delete(url, this.optionsAll)
      .pipe(
        catchError(this.handleError<any>('delete' + finisher))
      );
  }

  // Manejo de errores
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
