import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  history;
  constructor(public http:Http) { }

  ngOnInit() {
  }
  // Final Code for Download CSV Function
  download() {
    var token = JSON.parse(localStorage.getItem('token'));
    this.http.get(environment.api + '/history/user/'+token.user._id).subscribe((res:any)=>{
      var d = res.json();
      if (d && d.transactions) {
        this.history = d;
        this.ConvertToCSV(this.history.transactions);
      }
    },(error)=>{
      console.log(error);
    })
  }
  // convert Json to CSV data 
  ConvertToCSV(objArray) {
    var str = '';
    var row = "";
    for (var i = 0; i <= objArray.length - 1; i++) {
        var arrData = objArray[i];
        if (i == 0) {
            str = "Transaction Report" + '\r\n\n';
            str += "No,Type,DateTime,Account,Ammount,Value, Rate, Fees\r\n";
        }
        str += i + 1 + ',' +
            arrData.transaction_type.toString().toUpperCase() + ',' +
            arrData.time + ',' +
            arrData.account + ',' +
            arrData.amount.amount +' ' + arrData.amount.currency + ',' +
            arrData.value.amount +' ' + arrData.value.currency + ',' +
            arrData.rate.amount +' ' + arrData.rate.currency + ',' + 
            arrData.fees.amount +' ' + arrData.fees.currency + ',' + '\r\n';
        if (i == objArray.length - 1) {
            var fName = 'Transactions.csv';
            var blob = new Blob([str], { type: 'text/csv;charset=utf-8;' });
            if (navigator.msSaveBlob) { // IE 10+
                navigator.msSaveBlob(blob, fName);
            } 
            else {
                var link = document.createElement("a");
                if (link.download !== undefined) { // feature detection
                    // Browsers that support HTML5 download attribute
                    var url = URL.createObjectURL(blob);
                    link.setAttribute("href", url);
                    link.setAttribute("download", fName);
                    link.style.visibility = 'hidden';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            }
        }
    }
  }
}
