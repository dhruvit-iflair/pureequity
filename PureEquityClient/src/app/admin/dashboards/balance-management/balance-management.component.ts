import { Component, OnInit, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import { environment } from '../../../../environments/environment';
import { MatPaginator, MatSort, MatTableDataSource, PageEvent, MatDialog} from '@angular/material';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-balance-management',
  templateUrl: './balance-management.component.html',
  styleUrls: ['./balance-management.component.css']
})
export class BalanceManagementComponent implements OnInit {
  displayedColumns = ['account', 'transaction_type', 'fees', 'rate', 'value', 'amount', 'time'];
  dataSource: MatTableDataSource<any>;
  public page : { pageIndex: Number, pageSize: Number, length: Number } = { pageIndex: 0, pageSize: 0, length: 0 } 
  public i :Number = 0;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public http:Http) { }

  ngOnInit() {
      this.http.get(environment.api + '/history').subscribe((res:any)=>{
          var d = res.json();
          if (d.length && d[0].transactions) {
            var transactions = d[0].transactions;
            this.dataSource = new MatTableDataSource(transactions);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }
      },(error)=>{
        console.log(error);
      });
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
