import { Injectable } from "@angular/core";
import { FirebaseCoreService } from './firebase-core.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FirebaseStorageService {

    private _storage;
    private _uploadProgress = new BehaviorSubject<number>(0);
    private _downloadURL = new BehaviorSubject<string | null>(null);
    private _uploadError = new BehaviorSubject<any>(null);

    constructor(private _afStorage: AngularFireStorage,
                _firebaseCore: FirebaseCoreService) {
        this._storage = _firebaseCore.getStorageInstance();
    }

    get progress() {
        return this._uploadProgress;
    }
    
    get downloadURL() {
        return this._downloadURL;
    }
    
    get error() {
        return this._uploadError;
    }

    get errors() {
        return this._uploadError;
    }

    private generateUniqueId(maxLength: number = 28) {

        let random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

        let acceptable = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < maxLength; i++) {
            result += acceptable[random(0, acceptable.length - 1)];
        }

        return result;
    }

    upload(file, metadata: {[name: string]: string} = {}, contentTypeEnforce: string[] | string | null = null): void {

        const fileName = file.name;
        const filePath = 'AngularX/ ' + +(new Date()) + '_' + fileName;
        const fileType = file.type; //image/png, etc
        const fileRef = this._storage.ref().child(filePath);

        //Content-Type enforce
        if (Array.isArray(contentTypeEnforce)) {
            if (!contentTypeEnforce.includes(fileType)) return this._uploadError.next('Invalid file type.');
        } else if (typeof contentTypeEnforce === 'string') {
            if (!fileType.startsWith(contentTypeEnforce)) return this._uploadError.next('Invalid file type.');
        }

        //Reset service info
        this._uploadProgress.next(0);
        this._downloadURL.next(null);
        this._uploadError.next(null);

        //Create fileId if not exists
        if (!('fileId' in metadata)) metadata.fileId = this.generateUniqueId();

        const task = fileRef.put(file, { customMetadata: metadata });

        task.on('state_changed', snapshot => {

            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            this._uploadProgress.next(progress);

        }, error => {

            this._uploadError.next(error);

        }, () => {

            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            task.snapshot.ref.getDownloadURL().then(downloadURL => {
                this._downloadURL.next(downloadURL);
            }).catch(error => {
                this._uploadError.next(error);
            });

        });

    }

}