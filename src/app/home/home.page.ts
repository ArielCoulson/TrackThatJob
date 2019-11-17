import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
/* import { AngularFireAuth } from 'angularfire2/auth'; */

import { ApplicationService, Application } from 'src/app/services/application.service'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  private applications: Application[];
  user: Observable<firebase.User>;
  application: Application;

  constructor(private applicationService: ApplicationService, private afs: AngularFirestore) {
    }

  ngOnInit() {
    this.applicationService.getApplications().subscribe(results => {
      this.applications = results;
    });
  }

  favoriteApp(id: string){
    this.applicationService.getApplication(id).subscribe(results => {
      this.application = results;
    });

    if (this.application.favorite == true){
      this.application.favorite = false;
    } else {
      this.application.favorite = true;
    }

    this.applicationService.updateApplication(this.application);

  }
}
