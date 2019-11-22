import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';

// i commented this line out cuz it was giving me an error
// import * as CryptoJS from 'crypto-js';

import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

//export const encryptionKey = environment.encryptionKey;
//export const API_URL = environment.API_URL;

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  constructor(
    private router: Router,
    private http: HttpClient
    ) {
    
  }

  ngOnInit() {
  }

  signup(value: any){
    return new Promise<any>((resolve, reject) => {
      if (value.password != value.password2) {
        alert('Passwords do not match!')
      }
      else if (value.lastname == '') {
        alert('Last name cannot be empty');
      }
      else if (value.birthday == '' || (value.birthday[2] != '-' || value.birthday[5] != '-')) {
        alert("Birthday needs to be properly formatted!");
      }
      else if (value.address == '' || value.address.length != 4 || isNaN(value.address)) {
        alert("House number needs to be properly formatted!");
      }
      else {
        this.http.get(/*API_URL*/ + "/signup?address=" + value.address + "&birthday=" + value.birthday + "&lastname=" + value.lastname).subscribe((response) => {
          if (response['status'] == 'none') {
            alert("You are not a registerd voter!");
          }
          else {
            firebase.auth().createUserWithEmailAndPassword(value.email,value.password)
            .then(res => {
              resolve(res);

              var db = firebase.firestore();
              
              /*var ciphertext = CryptoJS.AES.encrypt(value.password, encryptionKey).toString();

              db.collection("users").add({
                email: value.email,
                password: ciphertext,
                isAdmin: false,
              })*/

              db.collection('voters').doc(value.email).set({
                lastname: value.lastname,
                birthday: value.birthday,
                address: value.address
              })

              let user = firebase.auth().currentUser;
              user.sendEmailVerification();
              this.router.navigateByUrl('login');         

            },err => {
              //reject(err);
              var errorCode = err.code;
              var errorMessage = err.message;
              if (errorCode == 'auth/email-already-in-use') {
                alert('The email address is already in use.')
              }
              else if (errorCode == 'auth/invalid-email') {
                alert('The email entered is not valid');
              }
              else {
                alert(errorMessage);
              }
            });
          }
        });
      }
    });
  }
}
