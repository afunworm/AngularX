import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { AngularXUserService } from '../../../shared/services/angularx-user/angularx-user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import * as _ from 'lodash';
import { pickBy as _pickBy, forEach as _forEach } from 'lodash';
import { AngularXDialogService } from '../../../shared/services/angularx-dialog/angularx-dialog.service';
import { AngularXLoadingService } from '../../../shared/services/angularx-loading/angularx-loading.service';

@Component({
    selector: 'angularx-edit-user-detail',
    templateUrl: './edit-user-detail.component.html',
    styleUrls: ['./edit-user-detail.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class EditUserDetailComponent implements OnInit {

    action: string;
    userData;
    ObjectKeys = Object.keys; //To iterate objects
    customFields = [];
    valueTypeTemplate = {
        //Value type for custom value value: name
        string: 'String', number: 'Number', boolean: 'Boolean', timestamp: 'Timestamp', null: 'Null'
    };
    uid: string;
    isSubmitting: boolean = false;
    photoURL: string = '';
    tempLocation: string = '';
    isUploading: boolean = false;
    uploadingProgress: number = 0;
    @ViewChild('photoFile') photoFile: ElementRef<HTMLElement>;

    constructor(
                private _userService: AngularXUserService,
                private _router: Router,
                private _activatedRoute: ActivatedRoute,
                private _afStorage: AngularFireStorage,
                private _dialogService: AngularXDialogService,
                private _loadingService: AngularXLoadingService) { }

    ngOnInit(): void {

        let uid = this._activatedRoute.snapshot.params['uid'];
        let action = this._activatedRoute.snapshot.params['action'];

        if (uid === undefined || action === undefined) {
            this._router.navigate(['../../../users'], {relativeTo: this._activatedRoute});
            return;
        }

        //Get user
        this._userService.getUser(uid).subscribe(user => {
            //Assign data to component
            this.uid = uid;
            this.action = action;
            this.userData = user;

            //Extract custom field
            _forEach(user, (value, key) => {
                if (!this._userService.isCustomField(key)) return;

                //Process key, value, type and readOnly
                let entry = {key: '', original: '', value: '', type: '', readOnly: false};
                entry.key = key;
                entry.original = key; //Tracking illegal change
                entry.value = value;

                if (typeof value === 'undefined' || value === null) {
                    entry.type = 'null';
                } else if (typeof value === 'string') {
                    entry.type = 'string';
                } else if (typeof value === 'number') {
                    entry.type = 'number';
                } else if (typeof value === 'boolean') {
                    entry.type = 'boolean';
                } else if (value instanceof Date) {
                    entry.type = 'timestamp';
                }

                if (typeof value === 'undefined' || value === null) {
                    entry.readOnly = true;
                } else {
                    entry.readOnly = false;
                }

                this.customFields.push(entry);
            });

            //Sort
            this.customFields = _.orderBy(this.customFields, ['key'],['asc']);

            //Hide loading message
            this._loadingService.hide();
        }, (error) => {
            //Show error
            this._dialogService.alert({
                title: 'An Error Has Occurred',
                message: error
            });
            //Hide loading message
            this._loadingService.hide();
        });

    }

    cancel($event) {
        $event.preventDefault();
        this._router.navigate(['../'], {relativeTo: this._activatedRoute});
    }

    toPhoneDisplayFormat(phone: string) {
        if (!phone) return null;

        if (phone.startsWith('+1')) phone = phone.substring(2); //Get rid of area code
        if (phone.replace(/[^0-9]/g, '').length !== 10) {
            return null;
        }

        return `(${phone.substr(0, 3)}) ${phone.substr(3,3)}-${phone.substr(6,4)}`;
    }

    toFirebaseAuthPhoneFormat(phone: string) {
        phone = phone.replace(/[^0-9]/g, '');
        if (phone.length !== 10) {
            throw new Error('Invalid phone format.');
            return;
        }
        return `+1${phone}`;
    }

    getTimeFromDateObject(dateObject) {
        if (dateObject instanceof Date)
            return dateObject.getHours() + ':' + dateObject.getMinutes() + ' ' + (dateObject.getHours() >= 12 ? 'PM' : 'AM');
        else return '12:00 AM';
    }

    updateNameData(form: NgForm) {
        if (!form.valid) {
            alert('Invalid info provided.');
            return;
        }

        this.isSubmitting = true;
        
        this._userService.updateUser(this.uid, form.value).subscribe(responseData => {
            this._router.navigate(['../'], {relativeTo: this._activatedRoute});
        }, (error) => {
            this.isSubmitting = false;
            this._dialogService.alert({
                title: 'An Error Has Occurred',
                message: error
            });
        });
    }

    updateEmailData(form: NgForm) {
        if (!form.valid) {
            alert('Invalid info provided.');
            return;
        }
        
        this.isSubmitting = true;
        this._userService.updateUser(this.uid, form.value).subscribe(responseData => {
            this._router.navigate(['../'], {relativeTo: this._activatedRoute});
            this.isSubmitting = false;
        }, (error) => {
            this.isSubmitting = false;
            this._dialogService.alert({
                title: 'An Error Has Occurred',
                message: error
            });
        });
    }

    updatePhoneNumberData(form: NgForm) {
        if (!form.valid) {
            alert('Invalid info provided.');
            return;
        }

        this.isSubmitting = true;
        this._userService.updateUser(this.uid, { phoneNumber: this.toFirebaseAuthPhoneFormat(form.value.phoneNumber )}).subscribe(responseData => {
            this._router.navigate(['../'], {relativeTo: this._activatedRoute});
            this.isSubmitting = false;
        }, (error) => {
            this.isSubmitting = false;
            this._dialogService.alert({
                title: 'An Error Has Occurred',
                message: error
            });
        });
    }

    removeDOB(form: NgForm) {
        form.form.patchValue({dob: ''});
        form.control.markAllAsTouched();
        form.control.markAsDirty();
    }

    updateDOBData(form: NgForm) {
        if (!form.valid) {
            alert('Invalid info provided.');
            return;
        }
        
        this.isSubmitting = true;
        let dob = form.value.dob || null;
        this._userService.updateUser(this.uid, {dob: dob}).subscribe(responseData => {
            this._router.navigate(['../'], {relativeTo: this._activatedRoute});
            this.isSubmitting = false;
        }, (error) => {
            this.isSubmitting = false;
            this._dialogService.alert({
                title: 'An Error Has Occurred',
                message: error
            });
        });
    }

    openUploadDialog($event) {
        this.photoFile.nativeElement.click();
        $event.preventDefault();
    }

    onFileSelected($event, form: NgForm) {

        const file = $event.target.files[0];
        const fileName = file.name;
        const filePath = fileName + '_' + +(new Date());
        const fileType = file.type;
        const fileRef = this._afStorage.ref(filePath);
        const task = this._afStorage.upload(filePath, file);

        if (!['image/gif', 'image/jpeg', 'image/png', 'image/jpg'].includes(fileType)) {
            alert('Invalid image.');
            return;
        }

        this.isUploading = true;
        this.tempLocation = fileName;

        //Uploading progress
        task.percentageChanges().subscribe(progress => {
            //progress doesn't have %
            this.uploadingProgress = progress;
        });

        //Upload is completed
        task.snapshotChanges().pipe(
            finalize(() => {
                fileRef.getDownloadURL().subscribe(url => {
                    this.userData.photoURL = url;
                    this.tempLocation = 'Photo uploaded successfully';
                    this.isUploading = false;
                    form.control.markAsDirty();
                });
            }
        )).subscribe();
    }

    updatePhotoURLData(form: NgForm) {
        if (!form.valid || this.isUploading) {
            alert('Invalid info provided.');
            return;
        }

        //@TODO - Remove old images from Cloud Storage
        this.isSubmitting = true;
        this._userService.updateUser(this.uid, { photoURL: form.value.photoURL}).subscribe(responseData => {
            this._router.navigate(['../'], {relativeTo: this._activatedRoute});
            this.isSubmitting = false;
        }, (error) => {
            this.isSubmitting = false;
            this._dialogService.alert({
                title: 'An Error Has Occurred',
                message: error
            });
        });
    }

    validateKeyInput(index: number, form: NgForm) {
        if (this.customFields[index].original === false) return; //Editing is allowed
        
        if (form.value['fieldName_' + index] !== this.customFields[index].key) {
            form.form.controls['fieldName_' + index].setErrors({ 'fieldKeyChanged': true });
            form.control.updateValueAndValidity();
        } else {
            form.control.updateValueAndValidity();
        }
    }

    validateNumberInput(index: number, form: NgForm) {
        if (!/^[+-]?([0-9]*([.][0-9]*)?|[.][0-9]*)$/.test(form.value['fieldNumberValue_' + index])) {
            form.form.controls['fieldNumberValue_' + index].setErrors({ 'pattern': true });
            form.control.updateValueAndValidity();
        } else {
            form.control.updateValueAndValidity();
        }
    }

    addCustomField(form: NgForm) {
        const randomId = Math.random().toString(36).substring(7) + Math.random().toString(36).substring(7);
        this.customFields.push({ key: '', original: false, value: '', type: 'string', readOnly: false });
        form.control.markAsDirty();
    }

    removeCustomField(index: number, form: NgForm) {
        this.customFields[index].type = 'delete';
        form.control.markAsDirty();
    }

    selectValueType(index: number, type: string, form: NgForm) {
        this.customFields[index].type = type;
        form.control.markAsDirty();

        // //Readonly for null
        if (type === 'null') {
            this.customFields[index].value = 'null';
            this.customFields[index].readOnly = true;
        } else {
            this.customFields[index].readOnly = false;
        }

        // //Default value for boolean
        if (type === 'boolean') this.customFields[index].value = true;
    }

    processCustomData(data) {

        //Get all the name fields
        let keys = _(data).pickBy((value, key) => key.startsWith('fieldName_')).map().value();

        let result = [];

        function constructDate(dateObject, timeString) {
            if (!/^\d{1,2}:\d{1,2} (AM|PM)$/.test(timeString)) {
                throw new Error(`${timeString} is not a valid time format`);
                return;
            }

            if (!(dateObject instanceof Date)) {
            throw new Error(`${dateObject} is not a valid Date Object`);
                return;

            }
            let time = timeString.split(' '), ampm = time[1].replace(' ', '');
            let hours = Number(time[0].split(':')[0]), minutes = Number(time[0].split(':')[1]);
            if (ampm.toLowerCase() === 'pm') hours += 12;

            return new Date(dateObject.getFullYear(), dateObject.getMonth(), dateObject.getDate(), hours, minutes);
        }

        //Convert to result
        keys.forEach((key, index) => {
            let type = data['fieldValueType_' + index];

            if (!['string', 'number', 'boolean', 'null', 'timestamp', 'delete'].includes(type)) return;
          
            if (type === 'string') {
                let value = data['fieldValue_' + index];
                result.push({ key: key, value: value, type: 'string'});
            } else if (type === 'number') {
                let value = data['fieldNumberValue_' + index];
                //Number, number string, boolean and null is consider !isNaN()
                //The only valid values are number and number string
                if (!isNaN(value) && typeof value !== 'boolean' && value !== null)
                    result.push({ key: key, value: Number(value), type: 'number'});
            } else if (type === 'boolean') {
                let value = data['fieldBooleanValue_' + index];
                result.push({ key: key, value: !!value, type: 'boolean'});
            } else if (type === 'null') {
                result.push({ key: key, value: null, type: 'null'});
            } else if (type === 'delete') {
                result.push({ key: key, value: null, type: 'delete'});
            } else if (type === 'timestamp') {
                let date = data['timestampDatePicker_' + index];
                let time = data['timestampTimePicker_' + index];
                if (!date || !time) return;

                let value = constructDate(date, time);

                if (value) result.push({ key: key, value: value, type: 'timestamp'});
                else return;
            }
        });

        return result;
    }

    updateCustomData(form: NgForm) {
        if (!form.valid) {
            alert('Invalid info provided.');
            return;
        }
        
        let data = this.processCustomData(form.value);
    
        this.isSubmitting = true;
        let dob = form.value.dob || null;
        this._userService.updateUserCustomData(this.uid, data).subscribe(responseData => {
            this._router.navigate(['../'], {relativeTo: this._activatedRoute});
            this.isSubmitting = false;
        }), (error) => {
            this.isSubmitting = false;
            this._dialogService.alert({
                title: 'An Error Has Occurred',
                message: error
            });
        };
    }

}