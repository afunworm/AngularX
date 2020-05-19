import { Component, OnInit, Input } from '@angular/core';
import { merge as _merge } from 'lodash';
import { isObject as _isObject } from 'lodash';

@Component({
    selector: 'angularx-wrapper',
    templateUrl: './angularx-wrapper.component.html',
    styleUrls: ['./angularx-wrapper.component.scss']
})
export class AngularxWrapperComponent implements OnInit {

    @Input('ngxClass') classes: string | string[] = [];
    @Input('ngxStyle') styles: { [name: string]: string | boolean | number } = {};
    @Input('elevation') elevation: number = 5;
    @Input('width') width: number | string = '900px';
    @Input('padding') padding: number | string = '32px';
    @Input('align') align: 'center' | 'left' | 'right' | 'flex-start' | 'flex-end' | 'space-between' | 'space-around' = 'flex-start';
    @Input('contentAlign') contentAlign: 'left' | 'right' | 'center' = 'left';
    @Input('borderRadius') borderRadius: string | number = '0px';

    constructor() { }

    ngOnInit(): void {

        //Convert class array to string
        if (Array.isArray(this.classes)) this.classes = this.classes.join(' ');

        //Elevation level must be 0 - 24
        if (this.elevation < 0 || this.elevation > 24) this.elevation = 5;

        //Assign the elevation to the custom classes
        this.classes = 'mat-elevation-z' + this.elevation + ' ' + this.classes;

        //Correction for alignment
        if (!['left', 'right', 'center'].includes(this.contentAlign)) this.contentAlign = 'left';
        if (!['center', 'left', 'right', 'flex-start', 'flex-end', 'space-between', 'space-around'].includes(this.align)) this.align = 'flex-start';

        //Check for custom styles
        let defaultStyles = {
            overflow: 'hidden',
            width: this.width,
            padding: this.padding,
            textAlign: this.contentAlign,
            contentAlign: this.contentAlign,
            borderRadius: this.borderRadius
        }
        if (_isObject(this.styles)) this.styles = _merge(defaultStyles, this.styles);
        else this.styles = defaultStyles;

    }

}
