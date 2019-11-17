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
      amount: string,
      date: Date
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  private applications: Observable<Application[]>;
  private applicationCollection: AngularFirestoreCollection<Application>;

  /**
   * This seems way easier. Trying to understand the point of a service. May be too complex for this app
   * afs.collection('/applications', ref => ref.orderBy('date_applied').where('date_applied', '>', currentTime)).valueChanges()
    .subscribe(result => {
      this.applications = result;
    })
   */

  constructor(private afs: AngularFirestore) {
    this.applicationCollection = this.afs.collection<Application>('applications');
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
        application.id = id;
        return application
      })
    );
  }
 
  addApplication(application: Application): Promise<DocumentReference> {
    return this.applicationCollection.add(application);
  }
 
  updateApplication(application: Application): Promise<void> {
    return this.applicationCollection.doc(application.id).update(
      { company: application.company,
        contact: {
          email: application.contact.email,
          phone: application.contact.phone
        },
        date_applied: application.date_applied,
        description: application.description,
        favorite: application.favorite,
        job_title: application.job_title,
        link: application.link,
        status: application.status,
        status_info: {
          interview: {
            date: application.status_info.interview.date,
            location: application.status_info.interview.location,
            notes: application.status_info.interview.notes
          },
          offer: application.status_info.offer
        } 
    });
  }
 
  deleteApplication(id: string): Promise<void> {
    return this.applicationCollection.doc(id).delete();
  }
}
