import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { AngularXEventService } from '../../services/angularx-event/angularx-event.service';
import { merge as _merge } from 'lodash';

export interface AngularXTableDataEntry {
    id: string,
    name: string,
    value: string | object | boolean,
    //By default, AngularX won't wrap the value, meaning the text will appear on 1 line
    valueWrap?: boolean,
    button?: { template: string, class?: string, click: () => {} },
    //Wrap the value inside <a> if this is set to true
    isURL?: boolean,
    //Should the embed URL be opened in new tab?
    openInNewWindow?: boolean,
    //Callback for onRowClick
    onRowClick?: {}
}

export interface AngularXTableData {
    configs?: {
        emitters?: {
            onRowClick?: string,
            onNameClick?: string,
            onValueClick?: string
        },
        nameField?: {
            classes?: string[] | string,
            styles?: { [name: string]: string | number | boolean },
            colspan?: number
        },
        valueField?: {
            classes?: string[] | string,
            styles?: { [name: string]: string | number | boolean },
            colspan?: number
        },
        extraField?: {
            classes?: string[] | string,
            styles?: { [name: string]: string | number | boolean },
            colspan?: number
        },
        entry?: {
            classes?: string[] | string,
            styles?: { [name: string]: string | number | boolean }
        },
        title?: {
            text: string,
            classes?: string[] | string,
            styles?: { [name: string]: string | number | boolean }
        }
        //How tall should each entry is?
        rowHeight?: number | string,
        //What to show, in what order. If displayedRows is false, show all.
        displayedRows?: string[] | boolean
    },
    data: AngularXTableDataEntry[]
}

@Component({
    selector: 'angularx-table',
    templateUrl: './angularx-table.component.html',
    styleUrls: ['./angularx-table.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AngularXTableComponent implements OnInit {

    @Input('data') injectedData: AngularXTableData;
    @Input('style') tableStyle;
    @Input('title') title: string;
    data;
    configs;

    constructor(private _eventService: AngularXEventService) {}

    isObject(item) {
        return (item && typeof item === 'object' && !Array.isArray(item));
    }

    getEntryById(id, entries) {
        for (let i = 0; i < entries.length; i++) {
            let entry = entries[i];

            if (entry.id === id) return entry;
        }
        return false;
    }

    //Output value can be an URL
    processOutputValue(entry) {

        if (typeof entry.value !== 'string') {
            try {
                return JSON.stringify(entry.value)
            } catch (error) {
                return '';
            }
        }

        if (!entry.isURL) return entry.value;

        if (entry.openInNewWindow) {
            return `<a href="${entry.value}" target="_BLANK">${entry.value}</a>`;
        } else {
            return `<a href="${entry.value}">${entry.value}</a>`;
        }
    }

    //Emit an event on row click
    emitOnRowClick(command) {
        let emitterName = this.configs.emitters.onRowClick;

        if (this._eventService.exists(emitterName))
            this._eventService.get(emitterName).next(command);
    }

    //Emit an event on name click
    emitOnNameClick(command) {
        let emitterName = this.configs.emitters.onNameClick;

        if (this._eventService.exists(emitterName))
            this._eventService.get(emitterName).next(command);
    }

    //Emit an event on value click
    emitOnValueClick(command) {
        let emitterName = this.configs.emitters.onValueClick;

        if (this._eventService.exists(emitterName))
            this._eventService.get(emitterName).next(command);
    }

    ngOnInit(): void {

        let defaults = {
            emitters: {
                onRowClick: 'onRowClick',
                onNameClick: 'onNameClick',
                onValueClick: 'onValueClick'
            },
            colspan: {name: 2, value: 4, extra: 1},
            nameField: {
                classes: [], colspan: 2,
                styles: {
                    textTransform: 'uppercase',
                    fontWeight: 'bold',
                    fontSize: '0.9em',
                    opacity: '0.5'
                }
            },
            valueField: { classes: [], styles: {}, colspan: 4 },
            extraField: { classes: [], styles: {}, colspan: 1 },
            entry: {
                classes: [],
                styles: {
                    cursor: 'pointer'
                }
            },
            title: {
                text: '',
                classes: 'mat-h2',
                styles: {
                    paddingTop: '10px',
                    paddingLeft: '21px',
                    paddingRight: '21px'
                }
            },
            rowHeight: 48,
            displayedRows: false
        };

        //Merge @Input('title') to configs.title.text
        defaults.title.text = this.title;

        this.configs = _merge(defaults, this.injectedData.configs);

        //Convert class array to class string
        ['nameField', 'valueField', 'extraField', 'entry', 'title'].forEach(fieldName => {
            if (Array.isArray(this.configs[fieldName]?.classes)) {
                this.configs[fieldName].classes = this.configs[fieldName].classes.join(' ');
            }
        });

        //Process displayedRows
        if (this.configs.displayedRows === false) {
            this.data = this.injectedData.data;
            return;
        }

        let data = [];
        let originalData = this.injectedData.data;

        for (let i = 0; i < this.configs.displayedRows.length; i++) {
            let currentId = this.configs.displayedRows[i];

            if (this.getEntryById(currentId, originalData) !== false)
                data.push(this.getEntryById(currentId, originalData));
        }
        this.data = data;

    }

}