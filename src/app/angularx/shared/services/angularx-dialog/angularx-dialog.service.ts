import { Injectable } from '@angular/core';
import { AngularXDialogComponent } from './angularx-dialog.component';
import { AngularXDialogInterface } from './angularx-dialog.interface';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { merge as _merge } from 'lodash';

@Injectable()
export class AngularXDialogService {

    constructor(private dialog: MatDialog) {}

    open(type: 'alert' | 'confirm', configs: AngularXDialogInterface | string, matDialogConfigs: MatDialogConfig<AngularXDialogInterface> = {}): MatDialogRef<AngularXDialogComponent, string> {

        //Setting defaults for matDialogConfigs
        let matDialogConfigDefault: MatDialogConfig = {
            width: '400px',
            position: {
                top: '15%'
            }
        }
        matDialogConfigs = _merge(matDialogConfigDefault, matDialogConfigs);

        //Setting defaults for configs
        let configDefault: AngularXDialogInterface = {
            type: type,
            title: type === 'alert' ? 'Alert' : 'Confirmation',
            message: '',
            cancelButton: { color: 'default', text: 'Cancel' },
            okButton: { color: 'default', text: 'Done' }
        }

        if (typeof configs === 'string') configs = _merge(configDefault, { message: configs });
        else configs = _merge(configDefault, configs);

        matDialogConfigs.data = (configs as AngularXDialogInterface);

        return this.dialog.open<AngularXDialogComponent, AngularXDialogInterface, string>(AngularXDialogComponent, matDialogConfigs);

    }

    alert(configs: AngularXDialogInterface | string, matDialogConfigs: MatDialogConfig<AngularXDialogInterface> = {}): MatDialogRef<AngularXDialogComponent, string> {
        return this.open('alert', configs, matDialogConfigs);
    }

    confirm(configs: AngularXDialogInterface | string, matDialogConfigs: MatDialogConfig<AngularXDialogInterface> = {}): MatDialogRef<AngularXDialogComponent, string> {
        return this.open('confirm', configs, matDialogConfigs);
    }

}