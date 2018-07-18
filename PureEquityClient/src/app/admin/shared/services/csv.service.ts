import { Injectable } from '@angular/core';

@Injectable()
export class CsvService {

  constructor() { }

  // convert Json to CSV data
  // ConvertToCSV(objArray) {
  //   var str = '';
  //   var row = "";
  //   for (var i = 0; i <= objArray.length - 1; i++) {
  //       var arrData = objArray[i];
  //       if (i == 0) {
  //           str = "User Management" + '\r\n\n';
  //           str += "No,Email,First Name,Last Name,Created On \r\n";
  //       }
  //       str += i + 1 + ',' +
  //           arrData.username+ ',' +
  //           arrData.firstName+ ',' +
  //           arrData.lastName + ',' +
  //           arrData.created_at + ',' + '\r\n';
  //       if (i == objArray.length - 1) {
  //           var fName = `user_${Date.now()}.csv`;
  //           var blob = new Blob([str], { type: 'text/csv;charset=utf-8;' });
  //           if (navigator.msSaveBlob) { // IE 10+
  //               navigator.msSaveBlob(blob, fName);
  //           }
  //           else {
  //               var link = document.createElement("a");
  //               if (link.download !== undefined) { // feature detection
  //                   // Browsers that support HTML5 download attribute
  //                   var url = URL.createObjectURL(blob);
  //                   link.setAttribute("href", url);
  //                   link.setAttribute("download", fName);
  //                   link.style.visibility = 'hidden';
  //                   document.body.appendChild(link);
  //                   link.click();
  //                   document.body.removeChild(link);
  //               }
  //           }
  //       }
  //   }
  // }

  /*
  * Convert all data using key value pair.
  * @params: Object  {
  *   doc_title:String,
  *   doc_table_header:String,
  *   doc_data:Array<any>,
  *   doc_key: Array<String>, // With respect to table headers
  *   doc_file_name:String
  * }
  */
  convert(data:CSVData) {
      var csv = '';
      // Add title to the sheet
      csv = `${data.doc_title} \r\n\n`;
      // Add header to the table
      csv += `${data.doc_table_header} \r\n`;
      // loop through the array to convert data into csv string.
      data.doc_data.forEach((single_data,i) => {
        // Add index to first cell of row
        csv += `${i+1},`
          data.doc_key.forEach((single_key,j) => {
              // Add Data for each key with cell
              csv += `${single_data[single_key]},`
          });
        // Ending of a row
        csv +='\r\n'
      });
      // Download file after Completion
      let file = {
        csv_file_name:data.doc_file_name,
        csv_data:csv
      }
      this.downloadFile(file);
  }
  /*
  * Download file after data is converted into csv file's string.
  * @params: Object  {
  *   csv_file_name:String,
  *   csv_data:String  // data which is converted from convert();
  * }
  */
  downloadFile(file){
      // Convert all data into Blob Little hack to download file from client side,
      var blob = new Blob([file.csv_data], { type: 'text/csv;charset=utf-8;' });
      // Check for IE Support
      if (navigator.msSaveBlob) { // IE 10+
          navigator.msSaveBlob(blob, file.csv_file_name);
      }
      // Rest browser will download it in anyway.
      else {
          // Create anchor tag dynamic
          var link = document.createElement("a");
          if (link.download !== undefined) { // feature detection
              // Browsers that support HTML5 download attribute
              var url = URL.createObjectURL(blob);
              link.setAttribute("href", url);
              link.setAttribute("download", file.csv_file_name);
              link.style.visibility = 'hidden';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
          }
      }
  }
}
export interface CSVData {
  doc_title:String,
  doc_table_header:String,
  doc_data:Array<any>,
  doc_key: Array<string>, // With respect to table headers
  doc_file_name:String
}
