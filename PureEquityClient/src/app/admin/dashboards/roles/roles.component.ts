import { Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, PageEvent, MatDialog,MatSnackBar} from '@angular/material';
import { DeleteComponent } from '../../shared/dialogs/delete/delete.component';
import { RoleComponent } from './role/role.component';
import { Http } from "@angular/http";
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { environment } from "../../../../environments/environment"
import { ToastrService } from 'ngx-toastr';
import { Router, Params, ActivatedRoute } from '@angular/router';
declare var $:any;

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit {
  displayedColumns = ['name', 'status','created_at', 'action']
  dataSource: MatTableDataSource<any>;
  public i :Number = 0;
  public page : { pageIndex: Number, pageSize: Number, length: Number } = { pageIndex: 0, pageSize: 0, length: 0 } 
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public dialog: MatDialog,public http:Http, public router:Router,private snakebar:MatSnackBar,public tstr:ToastrService) { }

  ngOnInit() {
    this.http.get(environment.api + '/role/').subscribe((res)=>{
      var x=res.json();
      this.dataSource = new MatTableDataSource(x);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
    (<any>$(".srh-btn2, .cl-srh-btn2")).on('click', function () {
        (<any>$(".app-search2")).toggle(200);
    });
  }
  pageEvent(event){
    event = this.page;
    this.i = event.pageIndex * event.pageSize;
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  create(){
    this.router.navigate(['/admin/role']);
  }
  delete(row){
    let dialogRef = this.dialog.open(DeleteComponent,{
      data: { title: 'Want to Remove?', content: 'Are you sure?', class:'warn' },
      panelClass:'setupchecker'
    });
    dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.http.delete(environment.api + '/role/'+row._id)
          .subscribe((res)=>{
        this.snakebar.open('Role Deleted Successfully!','',{duration: 5000});            
            // this.tstr.success('Role Removed Successfully!','Success');
            this.router.navigate(['/']).then(()=>{this.router.navigate(['/admin/roles'])});
          });
        }
    });
  }
  edit(xst){
    //this.router.navigate(['/admin/role/'+xst._id])
     let dialogRef = this.dialog.open(RoleComponent,{
       data: xst,
       height:'auto',
       panelClass: 'setup'
     });
    dialogRef.afterClosed().subscribe(result => {
        if (result) {
          console.log(result);
        }
    });
  }

}
