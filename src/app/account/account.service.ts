import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { User } from '../shared/models/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  basUrl = 'https://localhost:44389/api/';
  private currentUserSource = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient, private router:Router) { }

  loadCurrentUser(token: string){
    let headers = new HttpHeaders();
    headers = headers.set('Authorization',`Bearer ${token}`);

    return this.http.get<User>(this.basUrl + 'Account', {headers}).pipe(map(user => {
      localStorage.setItem('token', user.token);
      this.currentUserSource.next(user);
    }))
  }

  login(values:any){
    return this.http.post<User>(this.basUrl + 'Account/Login',values).pipe(
      map(user => {
      localStorage.setItem('token',user.token);
      this.currentUserSource.next(user);
      return user;
    }))
  }
  register(values:any){
    return this.http.post<User>(this.basUrl + 'Account/Register',values).pipe(
      map(user => {
      localStorage.setItem('token',user.token);
      this.currentUserSource.next(user);
    }))
  }

  logout() {
    localStorage.removeItem('token');
    this.currentUserSource.next(null);
    this.router.navigateByUrl('/');
  }

  checkEmailExists(email:string){
    return this.http.get<boolean>(this.basUrl + 'Account/Emailexists?email=' + email);
  }
}
