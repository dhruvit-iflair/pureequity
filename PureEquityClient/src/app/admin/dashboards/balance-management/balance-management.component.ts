import { Component, OnInit, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import { environment } from '../../../../environments/environment';
import {MatPaginator, MatTableDataSource, MatSort} from '@angular/material';

@Component({
  selector: 'app-balance-management',
  templateUrl: './balance-management.component.html',
  styleUrls: ['./balance-management.component.css']
})
export class BalanceManagementComponent implements OnInit {
  displayedColumns = ['account', 'transaction_type', 'fees', 'rate', 'value', 'amount', 'time'];
  // dataSource : any;
  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public http:Http) { }
  
  setPagnitionSort() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  ngOnInit() {
      this.http.get(environment.api + '/history').subscribe((res:any)=>{
          var d = res.json();
          if (d.length && d[0].transactions) {
            var transactions = [];
            d.forEach(data => {
              data.transactions.forEach(tr => {
                transactions.push({
                  'account' : tr.account ,
                  'transaction_type' : tr.transaction_type.toString().toUpperCase() ,
                  'fees' : tr.fees.amount ,
                  'rate' : tr.rate.amount  ,
                  'value' : tr.value.amount ,
                  'amount' : tr.amount.amount  ,
                  'time' : tr.time  ,
                  'user': data.user
                })
              });
            });
            this.dataSource = new MatTableDataSource<any>(transactions);
            this.setPagnitionSort();
          }
      },(error)=>{
        console.log(error);
      });
      (<any>$(".srh-btn2")).on('click', function () {
          (<any>$(".app-search2")).toggle(200);
      });
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
}
