import { MediaMatcher } from '@angular/cdk/layout';
import { Component, OnInit, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AngularXDialogService } from '../shared/services/angularx-dialog/angularx-dialog.service';

@Component({
    selector: 'angularx-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss', './admin.theme.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AdminComponent implements OnInit {

    mobileQuery: MediaQueryList;
    private _sessionSubscription: Subscription;

    mainNavItems = [
        { link: '/angularx-admin/dashboard', icon: 'dashboard', label: 'Dashboard' },
        {
            icon: 'people',
            label: 'Manage Users',
            items: [
                { link: '/angularx-admin/users', icon: 'chevron_right', label: 'All Users' },
                { link: '/angularx-admin/user/add', icon: 'chevron_right', label: 'Add User' },
                { link: '/angularx-admin/user/edit', icon: 'chevron_right', label: 'Edit User' }
            ]
        }
    ];

    accountNavItems = [
        {
            onSelected: () => {
                this.logOut();
            },
            icon: 'power_settings_new',
            label: 'Log Out'
        }
    ];

    navConfig = {
        interfaceWithRoute: true,
        paddingAtStart: true,
        fontColor: 'rgba(0,0,0,0.87)',
        highlightOnSelect: true
    };

    private _mobileQueryListener: () => void;

    constructor(changeDetectorRef: ChangeDetectorRef,
                media: MediaMatcher,
                private _afAuth: AngularFireAuth,
                private _router: Router,
                private _dialogService: AngularXDialogService) {
        this.mobileQuery = media.matchMedia('(max-width: 600px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this._mobileQueryListener);
    }

    ngOnInit(): void {
        //Get user
        this._sessionSubscription = this._afAuth.user.subscribe(user => {
            if (!user) {
                this._sessionSubscription.unsubscribe();
                this._router.navigate(['/']);
            }
            user.getIdToken().then(token => {
                console.log(token);
            });
        });
    }

    ngOnDestroy(): void {
        this.mobileQuery.removeListener(this._mobileQueryListener);
    }

    logOut() {
        this._dialogService.confirm({
            message: 'Do you wish to log out?',
            cancelButton: { text: 'No' },
            okButton: { text: 'Yes' },
        }).afterClosed().subscribe(confirm => {
            if (confirm) this._afAuth.signOut();
        })
    }

}