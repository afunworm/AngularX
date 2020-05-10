import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { AngularXUserService } from '../../shared/services/angularx-user/angularx-user.service';
import { AngularXTableData } from '../../shared/services/angularx-table/angularx-table.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularXEventService } from '../../shared/services/angularx-event/angularx-event.service';
import { AngularXDialogService } from '../../shared/services/angularx-dialog/angularx-dialog.service';
import { AngularXLoadingService } from '../../shared/services/angularx-loading/angularx-loading.service';
import { pickBy as _pickBy } from 'lodash';

@Component({
    selector: 'angularx-edit-user',
    templateUrl: './edit-user.component.html',
    styleUrls: ['./edit-user.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class EditUserComponent implements OnInit {

    displayedColumns: string[] = ['uid', 'displayName', 'email', 'phoneNumber', 'actions'];
    dataSource: MatTableDataSource<any>;
    editMode: boolean = false;
    dataLoaded: Promise<boolean>;
    data = {
        standard: {},
        custom: {}
    };

    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    buildUserList(list) {
        let result = [];
        for (let uid in list) {
            let data = list[uid];
            result.push({
                uid: uid,
                firstName: data.firstName,
                lastName: data.lastName,
                displayName: data.displayName,
                email: data.email,
                phoneNumber: data.phoneNumber
            })
        }
        return result;
    }

    constructor(private _activatedRoute: ActivatedRoute,
                private _userService: AngularXUserService,
                private _router: Router,
                private _eventService: AngularXEventService,
                private _dialogService: AngularXDialogService,
                private _loadingService: AngularXLoadingService) {}

    ngOnInit() {

        let uid = this._activatedRoute.snapshot.params['uid'];
        if (uid === undefined) {
            //No UID passed in, so fetch and display the user list
            this.editMode = false;
            this._userService.getUsers().subscribe(userData => {
                //Build user list
                let users = this.buildUserList(userData);

                // Assign the data to the data source for the table to render
                this.dataSource = new MatTableDataSource(users);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;

                //Inform template that data has loaded
                this.dataLoaded = Promise.resolve(true);

                //Hide loading message
                this._loadingService.hide();
            }, (error) => {
                //Show error
                this._dialogService.alert({
                    title: 'An Error Has Occurred',
                    message: error
                });
                //Hide loading message
                this._loadingService.hide();
            });
        } else {
            //Display the user details of the queried UID
            this.editMode = true;
            this._userService.getUser(uid).subscribe(userData => {

                //Setup a listener for AngularXTable's callbacks
                this._eventService.register('onClick');
                this._eventService.get('onClick').subscribe(command => {
                    let f = ''; let p = [];
                    for (let cmd in command) {
                        f = cmd; p = command[cmd];
                    }

                    switch(f) {
                        case 'navigate':
                            this._router.navigate(p, {relativeTo: this._activatedRoute});
                            break;
                        default:
                            break;
                    }
                });
                
                let data: AngularXTableData = {
                    data: [],
                    configs: {
                        emitters: {
                            onRowClick: 'onClick' //Tell AngularXTable to emit event to 'onClick' (created above) on rowclick
                        }
                    }
                };
                
                data.data.push({ id: 'emailVerified', name: 'Email Verification', value: userData.emailVerified });
                data.data.push({ id: 'disabled', name: 'Status', value: userData.disabled });
                data.data.push({
                    id: 'firstName', name: 'First Name', value: userData.firstName,
                    onRowClick: {'navigate': ['name']}
                });
                data.data.push({
                    id: 'lastName', name: 'Last Name', value: userData.lastName,
                    onRowClick: {'navigate': ['name']}
                });
                data.data.push({
                    id: 'displayName', name: 'Display Name', value: userData.displayName,
                    onRowClick: {'navigate': ['name']}
                });
                data.data.push({
                    id: 'email', name: 'Email', value: userData.email,
                    onRowClick: {'navigate': ['email']}
                });
                data.data.push({
                    id: 'phoneNumber', name: 'Phone Number', value: userData.phoneNumber,
                    onRowClick: {'navigate': ['phoneNumber']}
                });

                //Display DOB nicely
                function formatDOB(date) {
                    if (!date) return null;
                    date = new Date(date);
                    let m = (date.getMonth() + 1), d = date.getDate(), y = date.getFullYear();
                    m = m < 10 ? '0' + m : m; d = d < 10 ? '0' + d: d;
                    return `${m}/${d}/${y}`;
                }
                data.data.push({
                    id: 'dob', name: 'Date of Birth', value: formatDOB(userData.dob),
                    onRowClick: {'navigate': ['dob']}
                });

                if (userData.photoURL) {
                    if (userData.photoURL.startsWith('http:') || userData.photoURL.startsWith('https:'))
                        data.data.push({
                            id: 'photoURL', name: 'Photo URL', value: userData.photoURL, isURL: true, openInNewWindow: true,
                            onRowClick: {'navigate': ['photoURL']}
                        });
                    else
                        data.data.push({
                            id: 'photoURL', name: 'Photo URL', value: userData.photoURL,
                            onRowClick: {'navigate': ['photoURL']}
                        });
                } else {
                    data.data.push({
                        id: 'photoURL', name: 'Photo URL', value: userData.photoURL,
                        onRowClick: {'navigate': ['photoURL']}
                    });
                }

                data.configs.displayedRows = ['firstName', 'lastName', 'displayName', 'email', 'emailVerified', 'phoneNumber', 'dob', 'photoURL'];
                this.data.standard = data;

                //Custom data: Anything that is not standard data
                data = {
                    data: [],
                    configs: {
                        emitters: {
                            onRowClick: 'onClick' //Tell AngularXTable to emit event to 'onClick' (created above) on rowclick
                        }, nameField: {
                            styles: {
                                textTransform: 'none'
                            }
                        }
                    }
                };
                let customFields = _pickBy(userData, (value, key) => this._userService.isCustomField(key));
                if (Object.keys(customFields).length === 0) {
                    data.data.push({
                        id: 'noInfo', name: 'NO CUSTOM INFO', value: 'No custom information found for this user. Click to add.',
                        onRowClick: {'navigate': ['custom']}
                    });
                } else {
                    for (let key in customFields) {
                        data.data.push({
                            id: key, name: key, value: userData[key],
                            onRowClick: {'navigate': ['custom']}
                        });
                    }
                }
                this.data.custom = data;

                //Inform template that data has loaded
                this.dataLoaded = Promise.resolve(true);

                //Hide loading message
                this._loadingService.hide();

            }, (error) => {
                //Show error
                this._dialogService.alert({
                    title: 'An Error Has Occurred',
                    message: error
                });
                //Hide loading message
                this._loadingService.hide();
            });
        }
        
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    editUser(uid) {
        this._router.navigate(['../edit/' + uid], {relativeTo: this._activatedRoute});
    }

    toCustom() {
        this._router.navigate(['custom'], {relativeTo: this._activatedRoute});
    }

}