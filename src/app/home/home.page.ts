import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ApplicationService, Application } from 'src/app/services/application.service'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  private applications: Application[];

  constructor(private applicationService: ApplicationService) {

    /**
     * 
     * afs.collection('/applications', ref => ref.orderBy('date_applied')).valueChanges()
    .subscribe(result => {
      this.applications = result;
    })
     */
    
  }

  ngOnInit() {
    this.applicationService.getApplications().subscribe(applications => {
      this.applications = applications;
    });
  }
}
