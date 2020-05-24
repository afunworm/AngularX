import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { AngularXEventService } from '../../services/angularx-event/angularx-event.service';
import { merge as _merge, pickBy as _pickBy, values as _values } from 'lodash';

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

export interface AngularXTableDataSource {
    [index: number]: AngularXTableDataEntry
}

export interface AngularXTableConfigs {
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
    rowHeight?: number | string
}

@Component({
    selector: 'angularx-table',
    templateUrl: './angularx-table.component.html',
    styleUrls: ['./angularx-table.component.scss']
})
export class AngularXTableComponent implements OnInit {

    @Input('dataSource') data: AngularXTableDataSource[] = [];
    @Input('configs') configs: AngularXTableConfigs = {};
    @Input('displayedRows') displayedRows: string[] = []; //What to show, in what order. If displayedRows is false, show all
    @Input('style') tableStyle = {};
    @Input('title') title: string = '';
    @Input('elevation') elevation: number = 5;
    @Input('hovered') hovered: boolean = true;

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
                return '<div class="angularx-field-text">' + JSON.stringify(entry.value) + '</div>';
            } catch (error) {
                return '<div class="angularx-field-text"></div>';
            }
        }

        if (!entry.isURL) return '<div class="angularx-field-text">' + entry.value + '</div>';

        if (entry.openInNewWindow) {
            return `<div class="angularx-field-text"><a href="${entry.value}" target="_BLANK">${entry.value}</a></div>`;
        } else {
            return `<div class="angularx-field-text"><a href="${entry.value}">${entry.value}</a></div>`;
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

        //Elevation level must be 0 - 24
        if (this.elevation < 0 || this.elevation > 24) this.elevation = 5;

        //Configs
        let defaultConfigs = {
            emitters: { onRowClick: 'onRowClick', onNameClick: 'onNameClick', onValueClick: 'onValueClick' },
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
                classes: 'mat-h2',
                styles: {
                    paddingTop: '10px',
                    paddingLeft: '21px',
                    paddingRight: '21px'
                }
            },
            rowHeight: 48
        };
        this.configs = _merge(defaultConfigs, this.configs);

        //Convert class array to class string
        ['nameField', 'valueField', 'extraField', 'entry', 'title'].forEach(fieldName => {
            if (Array.isArray(this.configs[fieldName]?.classes)) {
                this.configs[fieldName].classes = this.configs[fieldName].classes.join(' ');
            }
        });

        //Process displayedRows
        if (this.displayedRows.length === 0) {
            //Display everything
            return;
        }

        let data = [];
        let originalData = this.data;

        for (let i = 0; i < this.displayedRows.length; i++) {
            let currentDisplayedRowId = this.displayedRows[i];
            let entry = _values(
                _pickBy(originalData, (entry, index) => {
                    return entry.id === currentDisplayedRowId;
                })
            )

            if (entry.length === 1) data.push(entry[0]);
        }
        this.data = data;

    }

}