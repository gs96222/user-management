import { Injectable } from '@angular/core';
import { User } from '../models/app.models';


@Injectable({
  providedIn: 'root'
})
export class ManageUserService {
  private users: User[];
  constructor() {
    this.getUsers();
   }

   get usersList(){
     return this.users;
   }

  //get User Details
  getUsers(){
    const usersList = localStorage.getItem('usersList');

    if(usersList){
      this.users = JSON.parse(usersList) as User[];
    }else this.users = [];
  }

  addUser(userDetail:User){
    this.users.push(userDetail);
    localStorage.setItem('usersList', JSON.stringify(this.users))
  }

  deleteUser(userDetail: User){
    this.users = this.users.filter(item => item.id != userDetail.id);
    localStorage.setItem('usersList', JSON.stringify(this.users))
  }

  updateUser(userDetail: User){
    const userIndex = this.users.findIndex(item => item.id === userDetail.id);
    this.users[userIndex] = userDetail;
    localStorage.setItem('usersList', JSON.stringify(this.users))
  }

  emailExist(email) : boolean{
    return this.users.findIndex(item => item.email === email) != -1;
  }

  userNameExist(userName) : boolean{
    return this.users.findIndex(item => item.userName === userName) != -1;
  }
}