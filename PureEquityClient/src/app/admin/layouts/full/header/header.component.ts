import { Component } from '@angular/core';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { Router } from '@angular/router';
import { User } from '../../../shared/interfaces/user.interface';
import { EditUserComponent } from '../../../pages/users/edit-user/edit-user.component';
import { MatDialog} from '@angular/material';
import { environment } from '../../../../../environments/environment';
import { UsersService } from '../../../shared/services/users.service';
import { ProfileComponent } from '../../../pages/users/profile/profile.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: []
})
export class AppHeaderComponent {
    public config: PerfectScrollbarConfigInterface = {};
    user:User;
    public picPoint = environment.picPoint + '/users/profileImage/';  
    
    // This is for Notifications
    notifications: Object[] = [{
      round: 'round-danger',
      icon: 'ti-link',
      title: 'Luanch Admin',    
      subject: 'Just see the my new admin!',
      time: '9:30 AM'  
    }, {
      round: 'round-success',
      icon: 'ti-calendar',
      title: 'Event today',    
      subject: 'Just a reminder that you have event',
      time: '9:10 AM'
    }, {
      round: 'round-info', 
      icon: 'ti-settings',
      title: 'Settings',    
      subject: 'You can customize this template as you want',
      time: '9:08 AM'
    }, {
      round: 'round-primary',
      icon: 'ti-user',
      title: 'Pavan kumar',    
      subject: 'Just see the my admin!',
      time: '9:00 AM'
    }];
    
    // This is for Mymessages
    mymessages: Object[] = [{
      useravatar: 'assets/images/users/1.jpg',
      status: 'online',
      from: 'Pavan kumar',    
      subject: 'Just see the my admin!',
      time: '9:30 AM'  
    }, {
      useravatar: 'assets/images/users/2.jpg',
      status: 'busy',
      from: 'Sonu Nigam',    
      subject: 'I have sung a song! See you at',
      time: '9:10 AM'
    }, {
      useravatar: 'assets/images/users/2.jpg',
      status: 'away',
      from: 'Arijit Sinh',    
      subject: 'I am a singer!',
      time: '9:08 AM'
    }, {
      useravatar: 'assets/images/users/4.jpg',
      status: 'offline',
      from: 'Pavan kumar',    
      subject: 'Just see the my admin!',
      time: '9:00 AM'
    }];
    constructor(private router:Router,public dialog: MatDialog,private userService: UsersService){
      var u = JSON.parse(localStorage.getItem('token'));
      this.user = u.user
    }
    goToProfile(){
      if (this.user.role.name == 'admin') {
        this.router.navigate(['/admin/users/'+ this.user._id]);        
      } else {
        this.router.navigate(['/users/'+ this.user._id]);
      }
        // this.userService.getAUsers(this.user._id);
        //  let dialogRef = this.dialog.open(ProfileComponent,{
        //    data: this.user,
        //    height:'600px'
        //  });
        // dialogRef.afterClosed().subscribe(result => {
        //     if (result) {
        //       console.log(result);
        //     }
        // });
    }
    logout(){
      localStorage.clear();
      this.router.navigate(['/login']);
    };
}
