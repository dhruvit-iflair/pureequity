import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject, Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { MatSnackBar } from "@angular/material";

@Injectable()
export class MoneyService {
    public money_balance = new Subject<any>();
    public money_transactions = new Subject<any>();

    constructor(private http: HttpClient, public snakebar: MatSnackBar) {}

    getMoneyTransactions(): Observable<any> {
        return this.money_transactions.asObservable();
    }
    getMoneyBalance(): Observable<any> {
        return this.money_balance.asObservable();
    }

    refreshMoneyBalance() {
        let token = JSON.parse(localStorage.getItem("token"));
        this.http
            .get(environment.api + "/money_balance/user/" + token.user._id)
            .subscribe(
                balance => this.money_balance.next(balance),
                error => {
                    console.log(error);
                    if (error.status == 404) {
                        // alert("No coin balance found");
                        this.createMoneyBalance();
                    }
                }
            );
    }
    createMoneyBalance() {
        let token = JSON.parse(localStorage.getItem("token"));
        let data = {
            user: token.user._id,
            balance: [
                {
                    coin: "usd",
                    balance: 0.0
                },
                {
                    coin: "eur",
                    balance: 0.0
                }
            ]
        };
        this.http.post(environment.api + "/money_balance", data).subscribe(
            success => {
                this.refreshMoneyBalance();
            },
            error => {
                console.log(error);
            }
        );
    }
    updateMoneyBalance(data) {
        return this.http.put(
            environment.api + "/money_balance/" + data._id,
            data
        );
    }

    refreshMoneyTransaction() {
        let token = JSON.parse(localStorage.getItem("token"));
        this.http
            .get(environment.api + "/money_transaction/user/" + token.user._id)
            .subscribe(
                transactions => this.money_transactions.next(transactions),

                error => {
                    console.log(error);
                }
            );
    }
    addMoneyTransaction(data: any) {
        return this.http.post(environment.api + "/money_transaction", data);
    }
}
