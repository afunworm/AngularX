import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { AngularXTableData } from '../../shared/services/angularx-table/angularx-table.component';
import { AngularXUserService, UsersDataInterface } from '../../shared/services/angularx-user/angularx-user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularXDialogService } from '../../shared/services/angularx-dialog/angularx-dialog.service';
import { AngularXLoadingService } from '../../shared/services/angularx-loading/angularx-loading.service';

@Component({
    selector: 'angularx-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class UsersComponent implements OnInit {

    userData: UsersDataInterface = {};
    objectKeys = Object.keys;
    totalUsers: number = 0;
    selectedUserId: string;
    isLoading = false;

    constructor(public dialog: MatDialog,
                private _userService: AngularXUserService,
                private _router: Router,
                private _activatedRoute: ActivatedRoute,
                private _dialogService: AngularXDialogService,
                private _loadingService: AngularXLoadingService) {
        
    }

    ngOnInit(): void {

        const forceReload = !!this._activatedRoute.snapshot.queryParams['forceReload'];

        this._userService.getUsers(forceReload).subscribe((usersData: UsersDataInterface) => {
            //Assign user data
            this.userData = usersData;
            
            //Process user data
            for (let uid in this.userData) {
                let currentUser = this.userData[uid];
                
                this.userData[uid].phoneNumber = currentUser.phoneNumber ? currentUser.phoneNumber : 'Unknown';
                this.userData[uid].email = currentUser.email ? currentUser.email : 'Unknown';
                this.userData[uid].displayName = currentUser.displayName ? currentUser.displayName : 'No Name Provided';
            }

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

    convertToDialogData(userData) {

        let data: {extra: AngularXTableData, standard: AngularXTableData, custom: AngularXTableData, original: any, infoType: 'standard' | 'extra' | 'custom' } = {
            extra: {
                data: [], configs: {
                    displayedRows: ['lastSignInTime', 'creationTime']
                }
            },
            standard: {
                data: [], configs: {
                    displayedRows: ['firstName', 'lastName', 'displayName', 'email', 'phoneNumber', 'dob', 'photoURL']
                }
            },
            custom: {
                data: [], configs: {
                    nameField: {
                        styles: {
                            textTransform: 'none'
                        }
                    }, valueField: {
                        styles: {
                            textTransform: 'none'
                        }
                    }
                } 
            },
            original: userData,
            infoType: 'standard'
        };

        let standardFields = this._userService.getFields('standard');
        let standardDict = {
            displayName: 'Display Name',
            email: 'Email',
            firstName: 'First Name',
            lastName: 'Last Name',
            phoneNumber: 'Phone Number',
            photoURL: 'Profile Photo',
            dob: 'Date of Birth'
        };
        function formatDOB(date) {
            if (!date) return null;
            date = new Date(date);
            let m = (date.getMonth() + 1), d = date.getDate(), y = date.getFullYear();
            m = m < 10 ? '0' + m : m; d = d < 10 ? '0' + d: d;
            return `${m}/${d}/${y}`;
        }
        for (let i = 0; i < standardFields.length; i++) {
            let field = standardFields[i];

            let value = userData[field];
            let entry = {
                id: field,
                name: standardDict[field],
                value: value,
                isURL: false,
                openInNewWindow: false,
            };
            //Check for photoURL
            if (field === 'photoURL' && value !== null) {
                if (!value.startsWith('http:') && !value.startsWith('https:')) entry.value = 'No Photo Provided';
                else {
                    entry.isURL = true;
                    entry.openInNewWindow = true;
                }
            }
            //Convert DOB to string
            if (field === 'dob') entry.value = formatDOB(entry.value);

            data.standard.data.push(entry);
        }

        //Extra field is only metadata
        let extraDict = {
            creationTime: 'Created At',
            lastSignInTime: 'Last Signin At'
        };
        for (let key in userData.metadata) {
            //Only pass in accepted values
            if (!extraDict[key]) continue;
            let value = userData.metadata[key];
            let entry = {
                id: key,
                name: extraDict[key],
                value: value
            };
            data.extra.data.push(entry);
        }

        //Custom fields - anything that is not standard/extra
        for (let key in userData) {
            if (this._userService.isCustomField(key))
                data.custom.data.push({
                    id: key,
                    name: key,
                    value: userData[key]
                });
        }

        return data;

    }

    viewUser(uid) {

        //Prevent user from clicking
        this.isLoading = true;

        this._userService.getUser(uid).subscribe(userData => {

            let data = this.convertToDialogData(userData);
            
            const dialogRef = this.dialog.open(UserDialog, {
                width: '800px',
                position: {
                    top: '10%'
                },
                data: data
            });

            this.isLoading = false;
        }, (error) => {
            this.isLoading = false;
            this._dialogService.alert({
                title: 'An Error Has Occurred',
                message: error
            });
        })
        
    }

    editUser(uid) {
        this._router.navigate(['../user/edit/' + uid], {relativeTo: this._activatedRoute});
    }

}

/*-------------------------------------------------------*
 * Dialog Component
 *-------------------------------------------------------*/
@Component({
    selector: 'user-dialog',
    templateUrl: './user-dialog.html',
})
export class UserDialog {

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<UserDialog>) {}

}