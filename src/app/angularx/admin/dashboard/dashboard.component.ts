import { Component, OnInit } from '@angular/core';
import { AngularXDialogService } from '../../shared/services/angularx-dialog/angularx-dialog.service';
import { AngularXLoadingService } from '../../shared/services/angularx-loading/angularx-loading.service';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'angularx-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

    constructor(private _dialogService: AngularXDialogService, private _loadingService: AngularXLoadingService) {}

    ngOnInit(): void {
        this._loadingService.hide();
    }

}