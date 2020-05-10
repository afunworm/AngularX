import { Component, OnInit, Input } from '@angular/core';
import { AngularXLoadingService } from './angularx-loading.service';

@Component({
    selector: 'angularx-loading',
    templateUrl: './angularx-loading.component.html',
    styleUrls: ['./angularx-loading.component.scss']
})
export class AngularxLoadingComponent implements OnInit {

    isDialogLoading: boolean = false;
    isBarLoading: boolean = false;
    @Input('message') message: string;
    @Input('title') title: string;
    @Input('mode') mode: string;
    @Input('color') color: string;
    @Input('value') value: number;
    
    constructor(private _loadingService: AngularXLoadingService) { }

    ngOnInit(): void {

        //Set default message & title & mode & color & value
        this._loadingService.set('message', this.message);
        this._loadingService.set('title', this.title);
        this._loadingService.set('mode', this.mode);
        this._loadingService.set('color', this.color);
        this._loadingService.set('value', this.value);

        //Subscribe and get value of isDialogLoading and isBarLoading
        this._loadingService.status('dialog').subscribe(loading => {
            this.isDialogLoading = loading;
        });
        this._loadingService.status('bar').subscribe(loading => {
            this.isBarLoading = loading;
        });
        //Subscribe on message and title as well, so they can all be handled from service
        this._loadingService.title.subscribe(title => {
            this.title = title;
        });
        this._loadingService.message.subscribe(message => {
            this.message = message;
        });
        //Subscribe on mode change
        this._loadingService.mode.subscribe(mode => {
            this.mode = mode;
        });
        //Subscribe on color change
        this._loadingService.color.subscribe(color => {
            this.color = color;
        });
        //Subscribe on value change
        this._loadingService.value.subscribe(value => {
            this.value = value;
        });
    }

}
