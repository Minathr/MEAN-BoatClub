import { Component, OnInit } from '@angular/core';
 
import { User } from '../_models/user';
import { Boat } from '../_models/boat';
import { UserService } from '../_services/user.service';
import { appConfig } from '../app.config';
import { Config } from 'protractor';

@Component({
    moduleId: module.id,
    templateUrl: 'home.component.html'
})
 
export class HomeComponent implements OnInit {
    currentUser: User;
    boats: Boat[] = [];
    apiUrl = appConfig.apiUrl;
 
    constructor(private userService: UserService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }
 
    ngOnInit() {
        this.loadAllBoats();
    }
 
    private loadAllBoats() {
        this.userService.getAll().subscribe(boats => { this.boats = boats;});
    }
}