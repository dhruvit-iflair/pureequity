import { Component, OnInit, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import { environment } from '../../../../environments/environment';
import { MatPaginator, MatSort, MatTableDataSource, PageEvent, MatDialog} from '@angular/material';

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
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public http:Http) { }

  ngOnInit() {
    var token = JSON.parse(localStorage.getItem('token'));
    this.http.get(environment.api + '/history/user/'+token.user._id).subscribe((res:any)=>{
      var d = res.json();
      if (d && d.transactions) {
        this.dataSource = new MatTableDataSource(d.transactions);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    },(error)=>{
      console.log(error);
    })
  }
  pageEvent(event){
    // console.log(event)
    event = this.page;
    this.i = event.pageIndex * event.pageSize;
  };
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }
}
