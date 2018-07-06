import { Component, OnInit, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import { environment } from '../../../../environments/environment';
import { MatPaginator, MatSort, MatTableDataSource, PageEvent, MatDialog,MatDialogRef} from '@angular/material';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-review-transactions',
  templateUrl: './review-transactions.component.html',
  styleUrls: ['./review-transactions.component.css']
})
export class ReviewTransactionsComponent implements OnInit {
  displayedColumns = ['account', 'transaction_type', 'fees', 'rate', 'value', 'amount', 'time'];
  dataSource: MatTableDataSource<any>;
  public page : { pageIndex: Number, pageSize: Number, length: Number } = { pageIndex: 0, pageSize: 0, length: 0 } 
  public i :Number = 0;
  // @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ViewChild(MatSort) sort: MatSort;
  private paginator: MatPaginator;
  private sort: MatSort;

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  constructor(public http:Http, private acRoute: ActivatedRoute) { }

  ngOnInit() {
    this.acRoute.params.subscribe((params) => {
      var id;
      if (params && params.id) {
         id = params.id;
      } 
      else if(localStorage.getItem('trnId')){
         id=localStorage.getItem('trnId');
      }
      else {
          var usr = JSON.parse(localStorage.getItem('token'));
           id = usr.user._id;
      }
      this.http.get(environment.api + '/history/user/'+id).subscribe((res:any)=>{
          var d = res.json();
          if (d && d.transactions) {
            this.dataSource = new MatTableDataSource(d.transactions);
            // this.dataSource.paginator = this.paginator;
            // this.dataSource.sort = this.sort;
          }
      },(error)=>{
        console.log(error);
      })  
    });
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    if(localStorage.getItem('trnId'))
    localStorage.removeItem('trnId');
  }
  pageEvent(event){
    // console.log(event)
    event = this.page;
    this.i = event.pageIndex * event.pageSize;
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }
}
