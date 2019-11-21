import { Component, OnInit } from '@angular/core';
import { Route, ActivatedRoute } from '@angular/router'; 
import { ApplicationService, Application } from 'src/app/services/application.service'
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { LoadingController, AlertController } from '@ionic/angular';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { IfStmt } from '@angular/compiler';

@Component({
  selector: 'app-company',
  templateUrl: './company.page.html',
  styleUrls: ['./company.page.scss'],
})
export class CompanyPage implements OnInit {
  
  private application: Application;
  private id : string;
  addForm: FormGroup;
  private applicationCollection: AngularFirestoreCollection<Application>;
  private user: Observable<firebase.User>;
  public read: boolean;

  constructor(private applicationService: ApplicationService,public formBuilder: FormBuilder, route: ActivatedRoute, private afs: AngularFirestore) { 
    this.id = route.snapshot.params.id;
    this.applicationService.getApplication(this.id).subscribe(result => {
        this.application = result;
    });
    this.addForm = new FormGroup({
      email: new FormControl(''),
      company: new FormControl('',Validators.compose([
        Validators.required
      ])),
      jobTitle: new FormControl(''),
      jobDescription: new FormControl(''),
      jobLink: new FormControl(''),
      phone: new FormControl(''),
      status: new FormControl(''),
      dateApplied: new FormControl(''),
      dateInterview: new FormControl(''),
      locationInterview: new FormControl(''),
      notesInterview: new FormControl(''),
      dateOffer: new FormControl(''),
      amountOffer: new FormControl('') 
    });
  }

  ngOnInit() {
    console.log("set");
    this.read = true;
  }

  editApp(){
    this.read = false;
    console.log("edit app");
  }

  readonly(){
    return this.read;
  }
  cancel(){
    window.location.reload();
  }

  update(){
    console.log("updated");
    var defaultDate = new Date('1995-12-17T03:24:00');
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

    theApplication.status_info = {interview: {date: defaultDate,location:"", notes:""}, offer:{amount:"",accept_by: defaultDate}};
    theApplication.status_info.interview.date = this.addForm.value.dateInterviewed;
    theApplication.status_info.interview.location = this.addForm.value.loationInterview;
    theApplication.status_info.interview.notes = this.addForm.value.notesInterview;
    theApplication.status_info.offer.amount = this.addForm.value.amountOffer;
    theApplication.status_info.offer.accept_by = this.addForm.value.dateOffer;


    this.applicationService.addApplication(theApplication);

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

    this.applicationCollection = this.afs.collection('users').doc('nlW6XvYgazNtRxkREsaB').collection('applications');
    this.applicationService.updateApplication(this.id,theApplication);

  }
}
