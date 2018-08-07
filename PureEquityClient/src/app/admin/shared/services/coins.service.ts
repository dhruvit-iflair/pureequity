import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject, Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { MatSnackBar } from "@angular/material";

@Injectable()
export class CoinsService {
    public coin_balance = new Subject<any>();
    public coin_transactions = new Subject<any>();

    constructor(private http: HttpClient, public snakebar: MatSnackBar) {}

    getCoinTransactions(): Observable<any> {
        return this.coin_transactions.asObservable();
    }
    getCoinBalance(): Observable<any> {
        return this.coin_balance.asObservable();
    }

    refreshCoinBalance() {
        let token = JSON.parse(localStorage.getItem("token"));
        this.http
            .get(environment.api + "/coin_balance/user/" + token.user._id)
            .subscribe(
                balance => this.coin_balance.next(balance),
                error => {
                    console.log(error);
                    if (error.status == 404) {
                        // alert("No coin balance found");
                        this.createCoinBalance();
                    }
                }
            );
    }
    createCoinBalance() {
        let token = JSON.parse(localStorage.getItem("token"));
        let data = {
            user: token.user._id,
            balance: [
                {
                    coin: "btc",
                    balance: 0.0
                },
                {
                    coin: "xrp",
                    balance: 0.0
                },
                {
                    coin: "eth",
                    balance: 0.0
                },
                {
                    coin: "bch",
                    balance: 0.0
                }
            ]
        };
        this.http.post(environment.api + "/coin_balance", data).subscribe(
            success => {
                this.refreshCoinBalance();
            },
            error => {
                console.log(error);
            }
        );
    }
    updateCoinBalance(data) {
        this.http.put(
            environment.api + "/coin_balance/" + data._id,
            data
        ).subscribe(
            success => {
                console.log("UpdateCoinTransaction");
                console.log(success);
                // this.snakebar.open((data.message)?data.message:'Transaction Sucess', "", { duration: 3000 });
                this.refreshCoinBalance();
            },
            error => {
                console.log(error);
            }
        );
    }

    refreshCoinTransaction() {
        let token = JSON.parse(localStorage.getItem("token"));
        this.http
            .get(environment.api + "/coin_transaction/user/" + token.user._id)
            .subscribe(
                transactions => this.coin_transactions.next(transactions),

                error => {
                    console.log(error);
                }
            );
    }
    addCoinTransaction(data: any) {
        this.http.post(environment.api + "/coin_transaction", data).subscribe(
            success => {
                console.log("AddCoinTransaction")
                console.log(success);
                // this.snakebar.open((data.message)?data.message:'Transaction Sucess', "", { duration: 3000 });
                this.refreshCoinTransaction();
            },
            error => {
                console.log(error);
            }
        );
    }
    saveCoinTransaction(data: any) {
        return this.http.post(environment.api + "/coin_transaction", data)
    }
    saveCoinBalance(data) {
        return  this.http.put(
            environment.api + "/coin_balance/" + data._id,
            data
        )
    }
}
