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

  private applications: any[];
  private loadedApps: any[];
  private applicationCollection: AngularFirestoreCollection<Application>;
  private application: Application;
  element: string;
  searchTerm: string;

  constructor(private applicationService: ApplicationService, private afs: AngularFirestore, 
    public loadingCtrl: LoadingController) {
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
    event.stopPropagation(); 

    this.applicationService.getApplication(id).subscribe(app => {
      this.application = app;

      if(this.application.favorite){
        this.application.favorite = false;
      } else {
        this.application.favorite = true;
      }
      
      this.updateApp(id, this.application);
    });
  }

  async updateApp(id: string, app: Application){
    await this.applicationService.updateApplication(id, app);

    this.filterSearchHelper(this.element, this.searchTerm);
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
    this.element = evt.target.tagName;
    this.searchTerm = evt.srcElement.value;
    console.log("Tag: " + this.element + " | Search: " + this.searchTerm);
  
    this.filterSearchHelper(this.element, this.searchTerm);
  }

  filterSearchHelper(el: string, term: string){
    this.initializeItems();

    if (!term) {
      return;
    } else if(el === "ION-SEARCHBAR"){
      this.searchBarFilter(term);
    } else if(el === 'ION-SELECT'){
      if (term === 'all'){
        this.getAllApps();
      } else if (term !== "favorite"){
        this.statusFilter(term);
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

    this.filterSearchHelper(this.element, this.searchTerm);
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





