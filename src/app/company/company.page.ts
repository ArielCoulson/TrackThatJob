import { Component, OnInit } from '@angular/core';
import { Route, ActivatedRoute } from '@angular/router'; 
import { ApplicationService, Application } from 'src/app/services/application.service'
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { LoadingController, AlertController } from '@ionic/angular';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { IfStmt } from '@angular/compiler';
import { setupPlatforms } from '@ionic/core/dist/types/utils/platform';

@Component({
  selector: 'app-company',
  templateUrl: './company.page.html',
  styleUrls: ['./company.page.scss'],
})
export class CompanyPage implements OnInit {
  
  private application: Application;
  private applicationTest: Application;
  private id : string;
  addForm: FormGroup;
  private applicationCollection: AngularFirestoreCollection<Application>;
  private user: Observable<firebase.User>;
  public read: boolean;

  constructor(private applicationService: ApplicationService,public formBuilder: FormBuilder, route: ActivatedRoute, private afs: AngularFirestore) { 
    this.id = route.snapshot.params.id;
    this.applicationService.getApplication(this.id).subscribe(result => {
        this.application = result;
        this.setupTheForm(); 
    });

    this.addForm = new FormGroup({
      email: new FormControl(''),
      company: new FormControl('',Validators.compose([
        Validators.required
      ])),
      jobTitle: new FormControl('',Validators.compose([
        Validators.required
      ])),
      jobDescription: new FormControl(''),
      jobLink: new FormControl(''),
      phone: new FormControl(''),
      status: new FormControl('',Validators.compose([
        Validators.required
      ])),
      dateApplied: new FormControl(''),
      dateInterview: new FormControl(''),
      locationInterview: new FormControl(''),
      notesInterview: new FormControl(''),
      dateOffer: new FormControl(''),
      amountOffer: new FormControl('') 
    });

    //console.log(this.application.company);
  }

  setupTheForm(){
    this.addForm = new FormGroup({
      email: new FormControl(this.application.contact.email),
      company: new FormControl(this.application.company,Validators.compose([
        Validators.required
      ])),
      jobTitle: new FormControl(this.application.job_title),
      jobDescription: new FormControl(this.application.description),
      jobLink: new FormControl(this.application.link),
      phone: new FormControl(this.application.contact.phone),
      status: new FormControl(this.application.status),
      dateApplied: new FormControl(this.application.date_applied),
      dateInterview: new FormControl(this.application.status_info.interview.date),
      locationInterview: new FormControl(this.application.status_info.interview.location),
      notesInterview: new FormControl(this.application.status_info.interview.notes),
      dateOffer: new FormControl(this.application.status_info.offer.accept_by),
      amountOffer: new FormControl(this.application.status_info.offer.amount) 
    });
  }

  ngOnInit() {
    console.log("set");
    this.read = true;
  
  }

  editApp(){
    this.read = false;
    this.addForm.value.copmany = this.application.company;
    this.addForm.value.jobTitle = this.application.job_title;
    this.addForm.value.email = this.application.contact.email;
    this.addForm.value.phone = this.application.contact.phone;
    this.addForm.value.jobDescription = this.application.description;
    this.addForm.value.jobLink = this.application.link;
    this.addForm.value.status = this.application.status;
    this.addForm.value.dateApplied = this.application.date_applied;

    this.addForm.value.dateInterview = this.application.status_info.interview.date;
    this.addForm.value.locationInterview = this.application.status_info.interview.location;
    this.addForm.value.notesInterview = this.application.status_info.interview.notes;
    this.addForm.value.amountOffer = this.application.status_info.offer.amount;
    this.addForm.value.dateOffer = this.application.status_info.offer;
  }

  readonly(){
    return this.read;
  }
  cancel(){
    window.location.reload();
  }

  async update(){
  
    //console.log("this is the company value", this.addForm.value.company);
    var defaultDate = new Date();
    const theApplication = {} as Application;
    theApplication.company = this.addForm.value.company;
    theApplication.job_title = this.addForm.value.jobTitle;
    theApplication.contact = {email: "", phone:""};
    theApplication.contact.email = this.addForm.value.email;
    theApplication.contact.phone = this.addForm.value.phone;
    theApplication.description = this.addForm.value.jobDescription;
    theApplication.link = this.addForm.value.jobLink;
    theApplication.status = this.addForm.value.status;
    theApplication.date_applied = this.addForm.value.dateApplied;
    theApplication.status_info = {interview:{date:defaultDate,location:"",notes:""},offer:{accept_by:defaultDate,amount:""}};

    if(this.addForm.value.dateInterview != undefined)
      theApplication.status_info.interview.date = this.addForm.value.dateInterview;
    
    if(this.addForm.value.loationInterview != undefined)
      theApplication.status_info.interview.location = this.addForm.value.locationInterview;
     
    if(this.addForm.value.notesInterview != undefined)
      theApplication.status_info.interview.notes = this.addForm.value.notesInterview;
    
    if(this.addForm.value.amountOffer != undefined)
      theApplication.status_info.offer.amount = this.addForm.value.amountOffer;
    
    if(this.addForm.value.dateOffer != undefined)
      theApplication.status_info.offer.accept_by = this.addForm.value.dateOffer;

    //this.applicationCollection = this.afs.collection('users').doc('nlW6XvYgazNtRxkREsaB').collection('applications');
    await this.applicationService.updateApplication(this.id, theApplication);
    window.location.reload();
  }

  isOffer(){
    if(this.addForm.value.status == 'offer')
      return true;
    return false;
  }
  isInterview(){
    if(this.addForm.value.status == 'interview')
      return true;
    return false;

  }
}
