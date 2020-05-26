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

    data;

    constructor(private _dialogService: AngularXDialogService, private _loadingService: AngularXLoadingService) {}

    ngOnInit(): void {
        this.data = [
            { date: new Date(), title: 'Event #1', content: 'ContLorem ipsum dolor sit, amet consectetur adipisicing elit. Obcaecati quo commodi aspernatur maxime. Facere magnam aliquam vitae commodi quos odio suscipit provident in, repellat obcaecati repudiandae nam quis unde cupiditate! Velit similique consequatur quod esse asperiores cum voluptate odit harum temporibus eos? Fuga dignissimos dolor itaque aliquam perspiciatis neque facilis?ent' },
            { date: new Date(), title: 'Event #2', content: 'ContLorem ipsum dolor sit, amet consectetur adipisicing elit. Obcaecati quo commodi aspernatur maxime. Facere magnam aliquam vitae commodi quos odio suscipit provident in, repellat obcaecati repudiandae nam quis unde cupiditate! Velit similique consequatur quod esse asperiores cum voluptate odit harum temporibus eos? Fuga dignissimos dolor itaque aliquam perspiciatis neque facilis?ent' },

            { title: '01/01/2020' },
        
            { date: new Date(), title: 'Event #1', content: 'ContLorem ipsum dolor sit, amet consectetur adipisicing elit. Obcaecati quo commodi aspernatur maxime. Facere magnam aliquam vitae commodi quos odio suscipit provident in, repellat obcaecati repudiandae nam quis unde cupiditate! Velit similique consequatur quod esse asperiores cum voluptate odit harum temporibus eos? Fuga dignissimos dolor itaque aliquam perspiciatis neque facilis?ent' },
            { date: new Date(), title: 'Event #2', content: 'ContLorem ipsum dolor sit, amet consectetur adipisicing elit. Obcaecati quo commodi aspernatur maxime. Facere magnam aliquam vitae commodi quos odio suscipit provident in, repellat obcaecati repudiandae nam quis unde cupiditate! Velit similique consequatur quod esse asperiores cum voluptate odit harum temporibus eos? Fuga dignissimos dolor itaque aliquam perspiciatis neque facilis?ent' }
        ];
        this._loadingService.pageLoaded();
    }

}