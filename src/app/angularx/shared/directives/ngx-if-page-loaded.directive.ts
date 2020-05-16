import { Directive, TemplateRef, ViewContainerRef, OnInit, Input, OnDestroy } from '@angular/core';
import { AngularXLoadingService } from '../services/angularx-loading/angularx-loading.service';
import { Subscription } from 'rxjs';

@Directive({
    selector: '[ngxIfPageLoaded]'
})
export class NgxIfPageLoadedDirective implements OnInit, OnDestroy {

    @Input('ngxIfPageLoaded') condition = true;
    private _loadingSubscription: Subscription;

    constructor(private _loadingService: AngularXLoadingService,
                private _templateRef: TemplateRef<any>,
                private _viewContainerRef: ViewContainerRef) {

    }

    ngOnInit(): void {

        //Clear the view while the page is loading
        this._viewContainerRef.clear();

        this._loadingSubscription = this._loadingService.isPageLoading.subscribe(loading => {

            //Clear the content everytime loading is emitted
            this._viewContainerRef.clear();

            //If loading is done and the condition is met
            if (!loading && !!this.condition) {
                //Create view
                this._viewContainerRef.createEmbeddedView(this._templateRef);
            }

        });

    }
    
    ngOnDestroy(): void {
        //Clean up
        this._viewContainerRef.clear();
        this._loadingSubscription.unsubscribe();
    }

}
