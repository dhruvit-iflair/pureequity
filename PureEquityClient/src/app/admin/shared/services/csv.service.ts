import { Injectable } from "@angular/core";

@Injectable()
export class CsvService {
    constructor() { }
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
    convert(data: CSVData) {
        var csv = "";
        // Add title to the sheet
        csv = `${data.doc_title} \r\n\n`;
        // Add header to the table
        csv += `${data.doc_table_header} \r\n`;
        // loop through the array to convert data into csv string.
        data.doc_data.forEach((single_data, i) => {
            // Add index to first cell of row
            csv += `${i + 1},`;

            // Collect All Data from One Object of data to csv row.
            csv += this.forRow(single_data, data.doc_key);

            // Ending of a row
            csv += "\r\n";
        });
        // Download file after Completion
        let file = {
            csv_file_name: data.doc_file_name,
            csv_data: csv
        };
        this.downloadFile(file);
    }
    /*
      * Download file after data is converted into csv file's string.
      * @params: Object  {
      *   csv_file_name:String,
      *   csv_data:String  // data which is converted from convert();
      * }
      */
    downloadFile(file) {
        // Convert all data into Blob Little hack to download file from client side,
        var blob = new Blob([file.csv_data], { type: "text/csv;charset=utf-8;" });
        // Check for IE Support
        if (navigator.msSaveBlob) {
            // IE 10+
            navigator.msSaveBlob(blob, file.csv_file_name);
        }
        // Rest browser will download it in anyway.
        else {
            // Create anchor tag dynamic
            var link = document.createElement("a");
            if (link.download !== undefined) {
                // feature detection
                // Browsers that support HTML5 download attribute
                var url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", file.csv_file_name);
                link.style.visibility = "hidden";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
    }
    /*
    * Check all of the key and validate data,
    * if key contains object than reloop againg and check for more inner object.
    * @params : Data as an Object,
    *           Keys as an Array of keys in string or an object.
    */
    forRow(data, mKeys) {
        // Check if mKeys is an array for initializing
        if (mKeys.length) {
            let csv_data = "";
            // Loop through array for individual index for array
            mKeys.forEach(iKey => {
                if (typeof iKey === "string") {
                  (data[iKey] == true || data[iKey] == false )? csv_data += `${data[iKey]},` : csv_data += `${(data[iKey])? ' '+ data[iKey] : '    '},`;
                }
                else if(typeof iKey === "object"){
                    console.log(iKey);
                    // Grab all of the keys from json object.
                    let newKeys = Object.keys(iKey);
                    // Loop through all of the keys and search for data.
                    newKeys.forEach(jKey => {
                        console.log(data[jKey], iKey[jKey]);
                        console.log(this.forRow((data[jKey])? data[jKey]: {} , iKey[jKey]));
                        csv_data +=this.forRow((data[jKey])? data[jKey]: {} , iKey[jKey])
                    });
                }
            });
            return csv_data;
        }
    }
}
export interface CSVData {
    doc_title: String;
    doc_table_header: String;
    doc_data: Array<any>;
    doc_key: Array<any>; // With respect to table headers
    doc_file_name: String;
}
