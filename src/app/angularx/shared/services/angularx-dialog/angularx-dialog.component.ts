import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AngularXDialogInterface } from './angularx-dialog.interface';
import { merge as _merge } from 'lodash';

@Component({
    selector: 'angularx-dialog',
    templateUrl: './angularx-dialog.component.html'
})
export class AngularXDialogComponent implements OnInit {

    //Configs has already been taken care of by the service
    constructor(@Inject(MAT_DIALOG_DATA) public configs: AngularXDialogInterface) {}

    ngOnInit() {
    }

    /**
     * Checks if the dialog message is HTML
     */
    // get isDialogMsgHtml(): boolean {
    // console.log(typeof this.config.body);
    // return typeof this.config.body === 'object';
    // }

}