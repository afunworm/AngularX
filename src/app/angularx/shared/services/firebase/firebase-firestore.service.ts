import { Injectable } from "@angular/core";
import { FirebaseCoreService } from './firebase-core.service';

@Injectable({ providedIn: 'root' })
export class FirebaseFirestoreService {

    constructor(private firebaseCore: FirebaseCoreService) {
    }

}