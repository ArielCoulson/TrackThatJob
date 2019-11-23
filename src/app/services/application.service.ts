import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Timestamp } from 'rxjs/internal/operators/timestamp';

export interface Application {
  id?: string,
  company: string,
  contact: {
    email: string,
    phone: string
  },
  created_at: Date,
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
  }
}

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  private applications: Observable<Application[]>;
  private applicationCollection: AngularFirestoreCollection<Application>;
  application: Application;

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

  constructor(private afs: AngularFirestore) {
    this.applicationCollection = this.afs.collection('users').doc('nlW6XvYgazNtRxkREsaB').collection<Application>('applications');
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

  updateApplication(id: string, application: Application): Promise<void> {
    return this.applicationCollection.doc(id).update(application);
  }
 
  deleteApplication(id: string): Promise<void> {
    return this.applicationCollection.doc(id).delete();
  }
}
