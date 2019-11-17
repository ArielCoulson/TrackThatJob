import { Component, OnInit } from '@angular/core';
import { ApplicationService, Application } from 'src/app/services/application.service'
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage implements OnInit {

  addForm: FormGroup;

  error_messages = {
    'email': [
      {type: 'required', message: 'Email is required.'},
      {type: 'minLength', message: 'min length is 6'}
    ],

  }
  constructor(
    public formBuilder: FormBuilder
  ) {
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

  add(){
    console.log('email: ', this.addForm.value.email);
  }
}
