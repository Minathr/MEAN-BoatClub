import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
 
import { appConfig } from '../app.config';
import { User } from '../_models/user';
import { Boat } from '../_models/boat';
 
@Injectable()
export class UserService {
    constructor(private http: HttpClient) {
    }
 
    getAll() {
        return this.http.get<Boat[]>(appConfig.apiUrl + '/api/boats');
    }
 
    getById(_id: string) {
        return this.http.get(appConfig.apiUrl + '/api/user' + _id);
    }
 
    create(user: User) {
        return this.http.post(appConfig.apiUrl + '/token/register', user);
    }
}