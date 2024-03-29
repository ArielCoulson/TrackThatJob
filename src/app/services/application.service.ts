import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import * as firebase from 'firebase';
import { AuthenticateService } from "../../app/services/authentication.service"
import { Timestamp } from 'rxjs/internal/operators/timestamp';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';

export interface Application {
  id?: string,
  company: string,
  contact: {
    email: string,
    phone: string
  },
  date_applied: Date,
  description: string,
  favorite: boolean,
  job_title: string,
  link: string,
  status: string,
  status_info: {
    interview: {
      date: Date,
      location: string,
      notes: string
    },
    offer: {
      accept_by: Date,
      amount: string
    }
  },
  created_at: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  private applications: Observable<Application[]>;
  private applicationCollection: AngularFirestoreCollection<Application>;
  application: Application;
  private userID: any;

  /**
   * 
   * For the constructor below, we need to change it to grab applications from the USER
   * EX:
        * constructor(private db: AngularFirestore,
                private afAuth: AngularFireAuth,
                private authService: AuthService) {
      let currentUser = this.authService.getCurrentUser();
      if(this.afAuth.auth.currentUser) {
        let user = this.afAuth.auth.currentUser.uid;
      }

      if (currentUser) {
        this.refreshApplicationCollection(currentUser.uid)
      }
      }
      refreshApplicationCollection(userId) {
      this.applicationCollection = this.afs.collection('users').doc(nlW6XvYgazNtRxkREsaB).collection<Application>('applications');
        this.applications = this.applicationCollection.snapshotChanges().pipe(
          map(actions => actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return {id, ... data};
          }))
        )
      }
   */

  constructor(private afs: AngularFirestore, private authService: AuthenticateService, private afAuth: AngularFireAuth) {
    let currentUser = localStorage.getItem('uid');

      if(this.afAuth.auth.currentUser) {
        let user = this.afAuth.auth.currentUser.uid;
      }

      if (currentUser) {
        this.userID = currentUser;
        this.refreshApplicationCollection(currentUser);
      }
  }
  
  ngoninit(){
    let currentUser = localStorage.getItem('uid');
    console.log('ACCESSED ID', currentUser);

      if(this.afAuth.auth.currentUser) {
        let user = this.afAuth.auth.currentUser.uid;
      }

      if (currentUser) {
        this.userID = currentUser;
        this.refreshApplicationCollection(currentUser);
      }
  }


  refreshApplicationCollection(userId) {
    this.applicationCollection = this.afs.collection('users').doc(userId).collection<Application>('applications');
    this.applications = this.applicationCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getApplicationCollection(): AngularFirestoreCollection<Application> {
    console.log("The user is: " + this.userID);
    return this.applicationCollection;
  }

  getApplications(): Observable<Application[]> {
    return this.applications;
  }

 
  getApplication(id: string): Observable<Application> {
    return this.applicationCollection.doc<Application>(id).valueChanges().pipe(
      take(1),
      map(application => {
        this.application = application;
        return this.application;
      })
    );
  }
 
  addApplication(application: Application): Promise<DocumentReference> {
    return this.applicationCollection.add(application);
  }

  async updateApplication(id: string, application: Application): Promise<void> {
    await this.applicationCollection.doc(id).update(application);
  }
 
  async deleteApplication(id: string): Promise<void> {
    await this.applicationCollection.doc(id).delete();
  }
}
