import { Component, OnInit, ɵCompiler_compileModuleAndAllComponentsAsync__POST_R3__ } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { LoadingController, AlertController } from '@ionic/angular';
/* import { AngularFireAuth } from 'angularfire2/auth'; */
import { ApplicationService, Application } from 'src/app/services/application.service'
import { FilterComponent } from 'src/app/filter/filter.component';
import { PopoverController } from '@ionic/angular';
import { stringify } from 'querystring';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit {

  private applications: Application[];
  private loadedApps: Application[];
  private applicationCollection: AngularFirestoreCollection<Application>;

  constructor(private applicationService: ApplicationService, private afs: AngularFirestore, 
    public loadingCtrl: LoadingController) {
    this.applicationCollection = this.afs.collection('users').doc('nlW6XvYgazNtRxkREsaB').collection('applications');
    }

  ngOnInit() {
    console.log("ngoninit");
    this.getAllApps();
  }

  getAllApps(){
    this.applicationService.getApplications().subscribe(results => {
      this.applications = results;
      this.loadedApps = results;
    });

  }

  favoriteApp(fav: boolean, id: string){
    console.log("Before fav: " + this.applications.length);
    event.stopPropagation(); 

    var appRef = this.applicationCollection.doc(id);

    if(fav) {
      appRef.update({favorite: false});
      console.log("App " + id + " has been unfavorited!")
    } else {
      appRef.update({favorite: true});
      console.log("App " + id + " has been favorited!")
    }

    console.log("After fav: " + this.applications.length);
  }

  statusIcon(stat: string) {
    var icon: string;

    switch(stat){
      case 'inprogress':
        icon = 'time';
        break;
      case 'applied':
        icon = 'filing';
        break;
      case 'interview':
        icon = 'briefcase';
        break;
      case 'offer':
        icon = 'trophy';
        break;
      case 'denied':
        icon = 'close';
        break;
      default:
        icon = 'help';
    }

    return icon;
  }

  initializeItems(): void {
    this.applications = this.loadedApps;
  }

  filterSearch(evt) {
    this.initializeItems();
  
    const element = evt.target.tagName;
    const searchTerm = evt.srcElement.value;
    console.log("Tag: " + element + " | Search: " + searchTerm);
  
    if (!searchTerm) {
      return;
    } else if(element === "ION-SEARCHBAR"){
      this.searchBarFilter(searchTerm);
    } else if(element === 'ION-SELECT'){
      if (searchTerm === 'all'){
        this.getAllApps();
      } else if (searchTerm !== "favorite"){
        this.statusFilter(searchTerm);
      } else {
        this.favoriteFilter();
      }
    }  
  }

  searchBarFilter(searchTerm: string){
    this.applications = this.applications.filter(currentApp => {
      if (currentApp.company && searchTerm) {
        if (currentApp.company.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });
  }

  statusFilter(searchTerm: string){
    this.applications = this.applications.filter(currentApp => {
      if (currentApp.status && searchTerm) {
        if (currentApp.status.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });
  }

  favoriteFilter(){
    console.log("favz");
    this.applications = this.applications.filter(currentApp => {
     return currentApp.favorite !== false;
    });
  }

  async removeApp(app: Application) {
    await this.applicationService.deleteApplication(app.id);
  }

  openApp(){
    console.log("You clicked me!")
  }

  /*
  async filterButton(ev: any) {
    console.log("Selected value is " + this.selected)
    const popover = await this.popoverCtrl.create({
        component: FilterComponent,
        event: ev,
        animated: true,
        showBackdrop: true,
        componentProps: {selection: this.selected}
    });
    return await popover.present();
  }*/
}





