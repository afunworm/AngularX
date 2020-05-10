import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularXUserService } from '../../shared/services/angularx-user/angularx-user.service';
import { AngularXLoadingService } from '../../shared/services/angularx-loading/angularx-loading.service';

@Component({
    selector: 'angularx-add-user',
    templateUrl: './add-user.component.html',
    styleUrls: ['./add-user.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AddUserComponent implements OnInit {

    isSubmitting: boolean = false;

    constructor(private _router: Router,
                private _activatedRoute: ActivatedRoute,
                private _userService: AngularXUserService,
                private _loadingService: AngularXLoadingService) { }

    ngOnInit(): void {
        //Hide loading message
        this._loadingService.hide();
    }

    cancel() {
        this._router.navigate(['../'], {relativeTo: this._activatedRoute});
    }
    
    addUser(form: NgForm) {
        if (!form.valid) {
            alert('Invalid info provided.');
            return;
        }
        
        this.isSubmitting = true;

        this._userService.createUser(form.value).subscribe(responseData => {
            this._router.navigate(['../../users'], {relativeTo: this._activatedRoute});
            this.isSubmitting = false;
        });
    }

}