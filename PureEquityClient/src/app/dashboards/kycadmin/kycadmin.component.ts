import { Component, ViewChild,OnInit } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, PageEvent, MatDialog} from '@angular/material';
import { DeleteComponent } from '../../shared/dialogs/delete/delete.component';
import { Http } from "@angular/http";
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { environment } from "../../../environments/environment"
import { ToastrService } from 'ngx-toastr';
import { Router, Params, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-kycadmin',
  templateUrl: './kycadmin.component.html',
  styleUrls: ['./kycadmin.component.css']
})
export class KycadminComponent implements OnInit {
  displayedColumns = ['firstName', 'lastName','idType', 'country', 'status', 'action']
  dataSource: MatTableDataSource<any>;
  public i :Number = 0;
  public page : { pageIndex: Number, pageSize: Number, length: Number } = { pageIndex: 0, pageSize: 0, length: 0 } 
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public dialog: MatDialog,public http:Http, public router:Router,public tstr:ToastrService) { }

  ngOnInit() {
    this.http.get(environment.api + '/userdocs/')
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
  delete(row){
    let dialogRef = this.dialog.open(DeleteComponent,{
      data: { title: 'Want to Remove?', content: 'Are you sure?', class:'primary'},
    });
    dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.http.delete(environment.api + '/userdocs/'+row._id)
          .subscribe((res)=>{
            this.tstr.success('KYC Deleted Successfully','Success');
            this.router.navigate(['/kyc']).then(()=>{this.router.navigate(['/kycadmin'])});
          });
        }
    });
  }
  edit(xst){
    this.router.navigate(['/kyc/'+xst.user._id])
  }
  changeStatus(dt){
    var updobj={isApproved:!dt.isApproved}
    this.http.patch(environment.api + '/userdocs/'+dt._id,updobj)
    .subscribe((res)=>{
      if(res.statusText=="OK"){
        this.tstr.success('Status Updated Successfully','Success');
      }
      else{
        this.tstr.error('Internal Server Error','Error');
      }
    });
  }
}
