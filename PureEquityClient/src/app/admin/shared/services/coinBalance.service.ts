import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Subject } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class CoinBalanceService {
    public coinBalance = new Subject<any>();

    constructor(public http: HttpClient, public snakebar:MatSnackBar) { }

    getCoinBalance(): Observable<any> {
        return this.coinBalance.asObservable();
    }

    refreshCoinBalance() {
        let token = JSON.parse(localStorage.getItem('token'));
        this.http.get(environment.api + '/coin_balance/user/' + token.user._id)
            .subscribe(
                balance => this.coinBalance.next(balance),
                error => {
                    console.log(error)
                    if (error.status == 404) {
                        // alert("No coin balance found");
                        this.createCoinBalance();
                    }
                });
    }

    createCoinBalance() {
        let token = JSON.parse(localStorage.getItem('token'));
        let data = {
            user: token.user._id,
            balance: [{
                coin: 'usd',
                balance: 0.0000
            }]
        }
        this.http.post(environment.api + '/coin_balance', data).subscribe(
            (success) => {
                this.refreshCoinBalance();
            },
            (error) => {
                console.log(error);
            }
        )
    }
    saveTransaction(data){
        return this.http.post(environment.api + '/transaction',data);
    }
    updateCoinBalance(data){
        // if (data._id) {
        var request = this.http.put(environment.api + '/coin_balance/'+data._id, data)
        // } else {
        //     var request = this.http.post(environment.api + '/coin_balance', data)
        // }
        request.subscribe(
            (success) => {
                this.refreshCoinBalance();
                this.snakebar.open("Transactions Success your money will be deposited soon", "", { duration: 5000 });
            },
            (error) => {
                console.log(error);
            }
        )
    }
}
