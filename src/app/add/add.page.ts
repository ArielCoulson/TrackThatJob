import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { LoadingController, AlertController } from '@ionic/angular';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { IfStmt } from '@angular/compiler';

@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage implements OnInit {

  addForm: FormGroup;
  private application: Application;
  private applicationCollection: AngularFirestoreCollection<Application>;
  private user: Observable<firebase.User>;

  error_messages = {
    'email': [
      {type: 'required', message: 'Email is required.'},
      {type: 'minLength', message: 'min length is 6'}
    ],

  }
  constructor(public loadingCtrl: LoadingController, public formBuilder: FormBuilder,public applicationService: ApplicationService, private afs: AngularFirestore) {
      this.addForm = this.formBuilder.group({
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
  }

  isInterview(){
    if(this.addForm.value.status == 'interview'){
      console.log("interview");
      return true;
    }
    return false;
  }
  

  isOffer(){
    if(this.addForm.value.status == 'offer'){
      return true;
    }
    return false;
  }

  add(){
    //const loading = await this.loadingCtrl.create();

    //sorry this is ugly Ill clean it up
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
<<<<<<< HEAD
    theApplication.status_info = {interview: {date: defaultDate,location:"", notes:""}, offer:{amount:"",accept_by: defaultDate}};
    theApplication.status_info.interview.date = this.addForm.value.dateInterviewed;
    theApplication.status_info.interview.location = this.addForm.value.loationInterview;
    theApplication.status_info.interview.notes = this.addForm.value.notesInterview;
    theApplication.status_info.offer.amount = this.addForm.value.amountOffer;
    theApplication.status_info.offer.accept_by = this.addForm.value.dateOffer;


    this.applicationService.addApplication(theApplication);
=======
    theApplication.status_info = {interview:{date:defaultDate,location:"",notes:""},offer:{accept_by:defaultDate,amount:""}};
>>>>>>> 38d3709d3c3305b264f7dc75560a25a326f2b933

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
    this.applicationCollection.add(theApplication);
  }
}
