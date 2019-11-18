import { Component, OnInit, ɵCompiler_compileModuleAndAllComponentsAsync__POST_R3__ } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { LoadingController, AlertController } from '@ionic/angular';
/* import { AngularFireAuth } from 'angularfire2/auth'; */
import { ApplicationService, Application } from 'src/app/services/application.service'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit {

  private applications: Application[];
  private loadedApps: Application[];
  private applicationCollection: AngularFirestoreCollection<Application>;
  private user: Observable<firebase.User>;

  constructor(private applicationService: ApplicationService, private afs: AngularFirestore, public loadingCtrl: LoadingController,) {
    this.applicationCollection = this.afs.collection('users').doc('nlW6XvYgazNtRxkREsaB').collection('applications');
    }

  ngOnInit() {
    this.applicationService.getApplications().subscribe(results => {
      this.applications = results;
      this.loadedApps = results;
    });
  }

  favoriteApp(fav: boolean, id: string){
    event.stopPropagation(); 
    console.log("Application ID: " + id);
    
    var appRef = this.applicationCollection.doc(id);

    if(fav) {
      appRef.update({favorite: false});
      console.log("App " + id + " has been unfavorited!")
    } else {
      appRef.update({favorite: true});
      console.log("App " + id + " has been favorited!")
    }
  }

  statusIcon(stat: string) {
    var icon: string;

    switch(stat){
      case 'In Progress':
        icon = 'time';
        break;
      case 'Applied':
        icon = 'filing';
        break;
      case 'Interview':
        icon = 'briefcase';
        break;
      case 'Offer':
        icon = 'trophy';
        break;
    }

    return icon;
  }

  initializeItems(): void {
    this.applications = this.loadedApps;
  }

  filterApps(evt) {
    this.initializeItems();
  
    const searchTerm = evt.srcElement.value;
  
    if (!searchTerm) {
      return;
    }
  
    this.applications = this.applications.filter(currentApp => {
      if (currentApp.company && searchTerm) {
        if (currentApp.company.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });
  }

  async removeApp(app: Application) {
    await this.applicationService.deleteApplication(app.id);
  }

  openApp(){
    console.log("You clicked me!")
  }
}



