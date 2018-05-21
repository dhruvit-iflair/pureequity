import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { map, catchError } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class BankdetailsService {
  public Bankdetail = new Subject<any>();
  public Bankdetails = new Subject<any>();
  public UserBankdetail = new Subject<any>();
  constructor(private http: HttpClient, public toaster: ToastrService) { }

  get() {
    this.http.get(environment.api + '/bankdetails').subscribe((response) => {
      this.Bankdetails.next(response);
    }, 
    (error) => {
      // this.toaster.error('Something went wrong, please try again later', 'Error');
      console.log(error);
    });
  }
  getBankdetails(): Observable<any> {
    return this.Bankdetails.asObservable();
  }
  getById(id: String) {
    this.http.get(environment.api + '/bankdetails/' + id).subscribe((response) => {
      this.Bankdetail.next(response);
    },
    (error) => {
      // this.toaster.error('Something went wrong, please try again later', 'Error');
      console.log(error);
    });
  }
  getBankdetailById(): Observable<any> {
    return this.Bankdetail.asObservable();
  }
  getByUserId(id: String) {
    this.http.get(environment.api + '/bankdetails/user/' + id).subscribe((response) => {
      this.UserBankdetail.next(response);
    }, 
    (error) => {
      this.UserBankdetail.next();      
      // this.toaster.error((error.error['message']) ? error.error.message : error.error, 'Error');      
      console.log(error);
    });
  }
  getBankdetailByUserId(): Observable<any> {
    return this.UserBankdetail.asObservable();
  }
  post(data: any) {
    return this.http.post(environment.api + '/bankdetails', data)
  }
  put(id: String, data: any) {
    return this.http.put(environment.api + '/bankdetails/' + id, data)
  }
  delete(id: String) {
    return this.http.delete(environment.api + '/bankdetails/' + id)
  }

  handelError(error) {
    this.toaster.error('Something went wrong, please try again later', 'Error');
    console.log(error);
  }

}
