import { Component, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, PageEvent, MatDialog} from '@angular/material';
import { User } from '../../../shared/interfaces/user.interface';
import { UsersService } from '../../../shared/services/users.service';
import { DeleteComponent } from '../../../shared/dialogs/delete/delete.component';
import { ReviewTransactionsComponent } from '../../review-transactions/review-transactions.component';
import { EditUserComponent } from '../edit-user/edit-user.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {
  displayedColumns = ['username', 'firstName', 'lastName','created_at', 'action']
  dataSource: MatTableDataSource<User>;
  public i :Number = 0;x=false;
  public page : { pageIndex: Number, pageSize: Number, length: Number } = { pageIndex: 0, pageSize: 0, length: 0 } 
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private userService: UsersService, public dialog: MatDialog, public router:Router) {
    this.userService.getUsers().subscribe((res: User[]) => {
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }
  ngOnInit() {
    this.userService.getAllUsers();
    (<any>$(".srh-btn2, .cl-srh-btn2")).on('click', function () {
        (<any>$(".app-search2")).toggle(200);
    });
  }
  pageEvent(event){
    // console.log(event)
    event = this.page;
    this.i = event.pageIndex * event.pageSize;
  };
  view(_id){
    // console.log(_id);
  }
  expandfilter(){
    if(!this.x){
      document.getElementById('searchfilter').setAttribute('style', 'width: 35%;');
      this.x=true;
    }
    else{
      this.x=false;
      document.getElementById('searchfilter').setAttribute('style', 'width: 0%;');
    }
  }

  transactions(user:User){
    localStorage.setItem('trnId',user._id.toString());
    let dialogRef = this.dialog.open(ReviewTransactionsComponent,{
      height:'auto',
      width: '-webkit-fill-available',
      panelClass: 'setup'
    });
   dialogRef.afterClosed().subscribe(result => {
       if (result) {
         console.log(result);
       }
   });
  }

  edit(user:User){
    this.userService.getAUsers(user._id);
     let dialogRef = this.dialog.open(EditUserComponent,{
       data: user,
       height:'auto',
       panelClass: 'setup'
     });
    dialogRef.afterClosed().subscribe(result => {
        if (result) {
          console.log(result);
        }
    });
    
    //this.router.navigate(['/admin/users/edit',user._id]);

  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  delete(user:User){
    let dialogRef = this.dialog.open(DeleteComponent,{
      data: { title: 'Delete?', content: 'Are you sure to delete ' + user.username + ' ?', class:'warn' },
      panelClass:'setupchecker'
    });
    dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.userService.deleteUser(user._id);    
        }
    });
  }
}


