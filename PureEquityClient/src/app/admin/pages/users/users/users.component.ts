import { Component, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, PageEvent, MatDialog } from '@angular/material';
import { User } from '../../../shared/interfaces/user.interface';
import { UsersService } from '../../../shared/services/users.service';
import { DeleteComponent } from '../../../shared/dialogs/delete/delete.component';
import { ReviewTransactionsComponent } from '../../review-transactions/review-transactions.component';
import { EditUserComponent } from '../edit-user/edit-user.component';
import { Router } from '@angular/router';
import { NewUserComponent } from "../new-user/new-user.component";
import { CsvService } from '../../../shared/services/csv.service';
import { from } from 'rxjs/observable/from';
declare var $: any;
@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss']
})
export class UsersComponent {
    displayedColumns = ['username', 'firstName', 'lastName', 'created_at', 'action']
    dataSource: MatTableDataSource<User>;
    public i: Number = 0; x = false;
    public exportData: Array<any> = [];
    public page: { pageIndex: Number, pageSize: Number, length: Number } = { pageIndex: 0, pageSize: 0, length: 0 }
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    public sub :any;
    constructor(
        private userService: UsersService,
        public dialog: MatDialog,
        public router: Router,
        public csvservice: CsvService,
    ) {}
    ngOnInit() {
        this.sub = this.userService.getUsers().subscribe((res: User[]) => {
            let sortedUsers = this.sortData(res);
            this.dataSource = new MatTableDataSource(sortedUsers);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.exportData = res;
        })
        this.userService.getAllUsers();
        (<any>$(".srh-btn2, .cl-srh-btn2")).on('click', function () {
            (<any>$(".app-search2")).toggle(200);
        });
    }
    pageEvent(event) {
        // console.log(event)
        event = this.page;
        this.i = event.pageIndex * event.pageSize;
    };
    view(_id) {
        // console.log(_id);
    }
    expandfilter() {
        if (!this.x) {
            document.getElementById('searchfilter').setAttribute('style', 'width: 35%;');
            this.x = true;
        }
        else {
            this.x = false;
            document.getElementById('searchfilter').setAttribute('style', 'width: 0%;');
        }
    }
    sortData(data:any){
        return data.sort((a, b) => {
            let aDate: Date = new Date(a.created_at);
            let bDate: Date = new Date(b.created_at);
            // console.log(aDate.getTime());
            return bDate.getTime() - aDate.getTime();
        });
    }
    transactions(user: User) {
        localStorage.setItem('trnId', user._id.toString());
        let dialogRef = this.dialog.open(ReviewTransactionsComponent, {
            height: 'auto',
            width: '70%',
            panelClass: 'setup'
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                console.log(result);
            }
        });
    }
    exportToCSV() {
        this.exportData.map((data: any) => {
            return (data.created_at) ? data.created_at = new Date(data.created_at) : data.created_at = ' ';
        })
        let options = {
            doc_title: 'User Management',
            doc_table_header: `No,Email,First Name,Last Name,Role,Middle Name, Place of Birth,Gender, Country Code, Contact Number, Social Link, Country, ZipCode,City,StreetAddress,Apartment,Mobile Verified, Email Verified, 2FA Enable, Created At`,
            doc_data: this.exportData,
            doc_key: [
                'username', 'firstName', 'lastName',
                {
                    "role": ['name'],
                },
                {
                    "user_profile": [
                        {
                            'personal': [
                                'middleName',
                                'placeOfBirth',
                                'gender',
                                'countryCode',
                                'contactNumber',
                                'socialLink'
                            ]
                        },
                        {
                            'address': [
                                'country',
                                'zipcode',
                                'city',
                                'streetAddress',
                                'apartment'
                            ]
                        }
                    ]
                },
                'isVerifyMobile', 'isVerifyEmail',
                'is2FAEnabled', 'created_at'
            ],
            doc_file_name: `User_${Date.now()}.csv`
        }
        this.csvservice.convert(options);
    }

    edit(user: User) {
        this.userService.getAUsers(user._id);
        let dialogRef = this.dialog.open(EditUserComponent, {
            data: user,
            height: 'auto',
            width: '50%',
            panelClass: 'setup'
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                console.log(result);
                this.userService.getAllUsers();
            }
        });

        //this.router.navigate(['/admin/users/edit',user._id]);

    }
    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
        this.dataSource.filter = filterValue;
    }
    delete(user: User) {
        let dialogRef = this.dialog.open(DeleteComponent, {
            data: { title: 'Delete?', content: 'Are you sure to delete ' + user.username + ' ?', class: 'warn' },
            panelClass: 'setupchecker'
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.userService.deleteUser(user._id);
            }
        });
    }
    addUser() {
        let dialogRef = this.dialog.open(NewUserComponent, {
            height: 'auto',
            width: '50%',
            panelClass: 'setup'
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                console.log(result);
            }
        });
    }
    ngOnDestroy(): void{
        this.sub.unsubscribe();
    }
}


