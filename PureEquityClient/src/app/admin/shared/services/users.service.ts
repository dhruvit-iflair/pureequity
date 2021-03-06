import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs/Subject";
import { User } from "../interfaces/user.interface";
import { environment } from "../../../../environments/environment";
import { ToastrService } from "ngx-toastr";
import { Observable } from "rxjs/Observable";
import { MatSnackBar } from "@angular/material";

@Injectable()
export class UsersService {
    private users = new Subject<User[]>();
    private user = new Subject<User>();
    private usersDoc = new Subject<any[]>();
    private editUser = new Subject<User>();
    public currentUser = new Subject<any>();
    constructor(
        private http: HttpClient,
        private snakebar: MatSnackBar,
        private toster: ToastrService
    ) {
        this.userdocs();
    }

    getAllUsers() {
        this.http.get(environment.api + "/users").subscribe(
            (res: User[]) => {
                this.users.next(res);
            },
            error => {
                // console.log(error);
                this.snakebar.open(
                    error.error["message"] ? error.error.message : error.error,
                    "",
                    { duration: 5000 }
                );
                // this.toster.error((error.error['message']) ? error.error.message : error.error, 'Error');
            }
        );
        this.userdocs();
    }
    getUsers(): Observable<User[]> {
        return this.users.asObservable();
    }

    editAUser(ed: User) {
        this.editUser.next(ed);
    }
    editUserData(): Observable<User> {
        return this.editUser.asObservable();
    }
    getAUsers(id: String) {
        this.http.get(environment.api + "/users/" + id).subscribe(
            (res: User) => {
                this.user.next(res);
            },
            error => {
                console.log(error);
                this.snakebar.open(
                    error.error["message"] ? error.error.message : error.error,
                    "",
                    { duration: 5000 }
                );
                // this.toster.error((error.error['message']) ? error.error.message : error.error, 'Error');
            }
        );
    }
    getUser(): Observable<User> {
        return this.user.asObservable();
    }
    deleteUser(id: String) {
        this.http.delete(environment.api + "/users/" + id).subscribe(
            (res: User) => {
                this.getAllUsers();
                this.snakebar.open("Deleted User", "", { duration: 5000 });
                // this.toster.success("Deleted User", 'Success');
            },
            error => {
                console.log(error);
                this.snakebar.open(
                    error.error["message"] ? error.error.message : error.error,
                    "",
                    { duration: 5000 }
                );
                // this.toster.error((error.error['message']) ? error.error.message : error.error, 'Error');
            }
        );
    }
    imageUpload(event: any) {
        let file = event.target.files[0];
        let up = new FormData();
        up.append("image", file);
        return this.http.post(environment.api + "/users/image", up);
    }
    updateUserDetails(data: any) {
        return this.http.put(environment.api + "/users/" + data._id, data);
    }
    updateUserProfileDetails(data: any) {
        if (data._id)
            return this.http.put(
                environment.api + "/user_profile/" + data._id,
                data
            );
        return this.http.post(environment.api + "/user_profile", data);
    }
    changePassword(data: any) {
        if (data._id)
            return this.http.put(
                environment.api + "/change_password/" + data._id,
                data
            );
    }
    userdocs() {
        this.http.get(environment.api + "/userdocs/").subscribe((res: any) => {
            this.usersDoc.next(res);
        });
    }
    getKYC(): Observable<any[]> {
        return this.usersDoc.asObservable();
    }
    newUser(data: any) {
        return this.http.post(environment.api + "/users", data);
    }
    getCurrentUser(): Observable<any> {
        // console.log(this.currentUser.subscribe)
        return this.currentUser.asObservable();
    }
    updateCurrentUser(data: any){
        this.currentUser.next(data);
    }
}
