import { Component, OnInit } from '@angular/core';
import { ApplicationService, Application } from 'src/app/services/application.service'
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage implements OnInit {

  addForm: FormGroup;
  private application: Application;

  error_messages = {
    'email': [
      {type: 'required', message: 'Email is required.'},
      {type: 'minLength', message: 'min length is 6'}
    ],

  }
  constructor(public loadingCtrl: LoadingController, public formBuilder: FormBuilder,public applicationService: ApplicationService) {
      this.addForm = this.formBuilder.group({
        email: new FormControl('',Validators.compose([
          Validators.required
        ])),
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

  async add(){
    const loading = await this.loadingCtrl.create();

    //weird issue existing with the date field. 
    var defaultDate = new Date('1995-12-17T03:24:00');
    const theApplication = {} as Application;
    theApplication.company = this.addForm.value.company;
    theApplication.job_title = this.addForm.value.jobTitle;
    theApplication.contact = {email: "", phone:""};
    theApplication.contact.email = "test";
    theApplication.contact.phone = "test";
    theApplication.description = this.addForm.value.jobDescription;
    theApplication.link = this.addForm.value.jobLink;
    theApplication.status = this.addForm.value.status;
    theApplication.date_applied = this.addForm.value.dateApplied;
    //theApplication.status_info = {interview: {date: defaultDate,location:"", notes:""}, offer:{amount:"",date:defaultDate}};
    theApplication.status_info.interview.date = this.addForm.value.dateInterviewed;
    theApplication.status_info.interview.location = this.addForm.value.loationInterview;
    theApplication.status_info.interview.notes = this.addForm.value.notesInterview;
    theApplication.status_info.offer.amount = this.addForm.value.amountOffer;
    //theApplication.status_info.offer.date = this.addForm.value.dateOffer;


    this.applicationService.addApplication(theApplication);


    return await loading.present();
    console.log('email: ', this.addForm.value.email);
  }
}
