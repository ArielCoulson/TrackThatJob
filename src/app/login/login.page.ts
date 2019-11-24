import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
    private router: Router,
    public alertController: AlertController
  ) {
  }

  ngOnInit() {
  }

  signup() {
    this.router.navigateByUrl('signup');
  }

  login(value: any){
    return new Promise<any>((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(value.email,value.password)
      .then(res => {
        resolve(res);

        let user = firebase.auth().currentUser;
        var email = user.email;

        window.localStorage.setItem('user', JSON.stringify(user));

        if (user.emailVerified) {

          var db = firebase.firestore();
          var voter = db.collection("voters").doc(email);
          voter.get().then(function(doc) {
            if (doc.exists) {
                var address = doc.data().address;
                var birthday = doc.data().birthday;
                var lastname = doc.data().lastname; 
                return address + "/" + birthday + "/" + lastname;
            } else {
                console.log("No such document!");
            }
          }).catch(function(error) {
              console.log("Error getting document:", error);
          }).then((result) => {
            this.router.navigateByUrl('voter/' + result);
          });        
        }
        else {
          alert("Please verify your email!");
        }
      }, err => {
        var errorMessage = err.message;
        alert(errorMessage);
      })
    })
  }

  async forgotPasswordSuccess() {
    const alert = await this.alertController.create({
      header: 'A link has been sent to your email.',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            console.log('User clicked OK')
          }
        }
      ]
    })

    await alert.present();
  }


   async forgotPasswordMessage() {
    const alert = await this.alertController.create({
      header: 'Enter your user email',
      inputs: [
        {
          name: 'email',
          type: 'text',
          placeholder: 'User Email',
        }
      ],
      buttons: [
        {
         text: 'Cancel',
         role: 'cancel',
         handler: () => {
           console.log('User has canceled forgotPassword')
         } 
        },
        {
          text: 'Submit',
          handler: data => {
            this.forgotPassword(data.email);
            this.forgotPasswordSuccess();
            console.log('User has submitted forgotPassword')
          }
        }
      ]
    })

    await alert.present();
   }

   forgotPassword(userEmail) {
     return new Promise<any>((resolve, reject) => {
      var auth = firebase.auth();

      auth.sendPasswordResetEmail(userEmail).then(function() {
        console.log('New password sent to user');
      }).catch(function() {
        alert('Something went wrong!');
        console.log('Something went wrong with forgotPassword.');
        }) 
      })
    }

}
