import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Subject } from 'rxjs/Subject';
import { User } from "../interfaces/user.interface";
import { environment } from "../../../environments/environment";
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UsersService {
  private users = new Subject<User[]>();
  private user = new Subject<User>();
  private editUser = new Subject<User>();
  constructor(private http: HttpClient, private toster: ToastrService) { }

  getAllUsers() {
    this.http.get(environment.api + '/users').subscribe((res: User[]) => {
      this.users.next(res);
    }, (error) => {
      console.log(error);
      this.toster.error((error.error['message']) ? error.error.message : error.error, 'Error');
    });
  }
  getUsers(): Observable<User[]> {
    return this.users.asObservable();
  }

  editAUser(ed:User) {
      this.editUser.next(ed);
  }
  editUserData(): Observable<User> {
    return this.editUser.asObservable();
  }
  getAUsers(id: String) {
    this.http.get(environment.api + '/users/' + id).subscribe((res: User) => {
      this.user.next(res);
    }, (error) => {
      console.log(error);
      this.toster.error((error.error['message']) ? error.error.message : error.error, 'Error');
    });
  }
  getUser(): Observable<User> {
    return this.user.asObservable();
  }
  deleteUser(id: String) {
    this.http.delete(environment.api + '/users/' + id).subscribe((res: User) => {
      this.getAllUsers();
      this.toster.success("Deleted User", 'Success');
    }, (error) => {
      console.log(error);
      this.toster.error((error.error['message']) ? error.error.message : error.error, 'Error');
    });
  }
  imageUpload(event:any) {
    let file = event.target.files[0];
    let up = new FormData();
    up.append('image', file);
    return this.http.post(environment.api + "/users/image", up)
  }
  updateUserDetails(data:any){
    return this.http.put(environment.api + '/users/' +data._id, data)
  }
  updateUserProfileDetails(data:any){
    if(data._id) return this.http.put(environment.api + '/user_profile/' +data._id, data)
    return this.http.post(environment.api + '/user_profile', data)    
  }
}
