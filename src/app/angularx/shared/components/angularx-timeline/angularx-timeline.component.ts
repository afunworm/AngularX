import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';

export class TimelineDataEntry {
    date?: string | Date;
    title: string | null;
    content?: string | null;
}

export class TimelineDataSource {
    [index: number]: TimelineDataEntry
}

@Component({
    selector: 'angularx-timeline',
    templateUrl: './angularx-timeline.component.html',
    styleUrls: ['./angularx-timeline.component.scss']
})
export class AngularXTimelineComponent implements OnInit {

constructor() { }

    @Input('dataSource') data: TimelineDataSource = [];
    @Input('type') type: 'default' | 'simple' | 'centered' = 'default';
    @Input('color') color: 'primary' | 'accent' | 'warn' = 'primary';
    @Input('format') format: string = 'MMMM Do, YYYY'; //https://momentjs.com/docs/#/displaying/format/
    timelineClass: 'timeline' | 'timeline timeline-split' | 'timeline timeline-centered' = 'timeline timeline-split';

    ngOnInit(): void {

        //Timeline class
        if (this.type === 'simple') this.timelineClass = 'timeline';
        else if (this.type === 'centered') this.timelineClass = 'timeline timeline-centered';
        else this.timelineClass = 'timeline timeline-split';

        //Timeline color
        if (!['primary', 'accent', 'warn'].includes(this.color)) this.color = 'primary';

    }

    isTitleOnly(entry: TimelineDataEntry): boolean {
        return !entry.content && !entry.date;
    }

    formatTimelineDate(date: Date | string): string {
        if (date instanceof Date) return moment(date).format(this.format);
        
        return date.toString();
    }

}