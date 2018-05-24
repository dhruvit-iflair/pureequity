import { Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, PageEvent, MatDialog} from '@angular/material';
import { DeleteComponent } from '../../../shared/dialogs/delete/delete.component';
import { Http } from "@angular/http";
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { environment } from "../../../../../environments/environment"
import { ToastrService } from 'ngx-toastr';
import { Router, Params, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-maillist',
  templateUrl: './maillist.component.html',
  styleUrls: ['./maillist.component.css']
})
export class MaillistComponent implements OnInit {
  displayedColumns = ['title', 'subject', 'action']
  dataSource: MatTableDataSource<any>;
  public i :Number = 0;
  public page : { pageIndex: Number, pageSize: Number, length: Number } = { pageIndex: 0, pageSize: 0, length: 0 } 
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public dialog: MatDialog,public http:Http, public router:Router,public tstr:ToastrService) { }

  ngOnInit() {
    this.http.get(environment.api + '/mails/')
    .subscribe((res)=>{
      var x=res.json();
      this.dataSource = new MatTableDataSource(x);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
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
    this.router.navigate(['/mail']);
  }
  delete(row){
    let dialogRef = this.dialog.open(DeleteComponent,{
      data: { title: 'Want to Remove?', content: 'Are you sure?' },
    });
    dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.http.delete(environment.api + '/mails/'+row._id)
          .subscribe((res)=>{
            this.tstr.success('Mail Template Deleted Successfully!','Success');
            this.router.navigate(['/mail']).then(()=>{this.router.navigate(['/mails'])});
          });
        }
    });
  }
  edit(xst){
    this.router.navigate(['/mail/'+xst._id])
  }

}
