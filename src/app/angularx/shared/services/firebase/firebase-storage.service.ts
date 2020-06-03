import { Injectable } from "@angular/core";
import { FirebaseCoreService } from './firebase-core.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { BehaviorSubject, from, Subject } from 'rxjs';

export interface UploadedFileData {
    downloadUrl: string;
    path: string;
    fileId: string;
}

@Injectable({ providedIn: 'root' })
export class FirebaseStorageService {

    private _storage;
    private _uploadProgress = new BehaviorSubject<number>(0);
    private _downloadURL = new BehaviorSubject<string | null>(null);
    private _done = new Subject<UploadedFileData>();
    private _uploadError = new Subject<any>();

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

    get done() {
        return this._done;
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

    resetServiceInfo() {
        this._uploadProgress.next(0);
        this._downloadURL.next(null);
        this._uploadError.next(null);
        this._done.next(null);
    }

    init() {
        this._uploadProgress.complete();
        this._downloadURL.complete();
        this._done.complete();
        this._uploadError.complete();
        this._uploadProgress = new BehaviorSubject<number>(0);
        this._downloadURL = new BehaviorSubject<string | null>(null);
        this._done = new Subject<UploadedFileData>();
        this._uploadError = new Subject<any>();
    }

    upload(file, metadata: {[name: string]: string} = {}, extensionEnforce: string[] | string | null = null, contentTypeEnforce: string[] | string | null = null): void {
        const fileName = file.name;
        const fileExtension = fileName.split('.').pop();
        const filePath = 'AngularX/' + +(new Date()) + '_' + fileName;
        const fileType = file.type; //image/png, etc
        const fileRef = this._storage.ref().child(filePath);

        //Content-Type enforce
        if (Array.isArray(contentTypeEnforce)) {
            if (!contentTypeEnforce.includes(fileType)) return this._uploadError.next('Invalid content-type.');
        } else if (typeof contentTypeEnforce === 'string') {
            if (!fileType.startsWith(contentTypeEnforce)) return this._uploadError.next('Invalid content-type.');
        }
        
        //Extension enforce
        if (Array.isArray(extensionEnforce)) {
            if (!extensionEnforce.map(ext => ext.replace('.', '')).includes(fileExtension)) return this._uploadError.next('Invalid file type.');
        } else if (typeof extensionEnforce === 'string') {
            if (extensionEnforce.replace('.', '') !== fileExtension) return this._uploadError.next('Invalid file type.');
        }

        //Create fileId if not exists
        if (!('fileId' in metadata)) metadata.fileId = this.generateUniqueId();

        //Integrate fileName to metadata
        if (!('name' in metadata)) metadata.name = fileName;

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
                this._done.next({
                    downloadUrl: downloadURL,
                    path: filePath,
                    fileId: metadata.fileId
                });
            }).catch(error => {
                this._uploadError.next(error);
            });
        });
    }

    deleteFile(filePath: string) {
        return from(
            this._storage.ref().child(filePath).delete()
            .catch(error => { throw new Error(error.message); })
        )
    }

}