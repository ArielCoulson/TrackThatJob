import { Component, ViewChild, OnInit } from '@angular/core';
import { PopoverController, NavParams, Events } from '@ionic/angular';
import { HomePage } from '../home/home.page'
//import { OpenNativeSettings } from '@ionic-native/open-native-settings/ngx';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit {

  options = [
    "My Favorites",
    "In Progress",
    "Applied",
    "Interview",
    "Offer",
    "Denied"
  ];

  selected: string;

  constructor(
    private events: Events,
    private navParams: NavParams,
    private popoverCtrl: PopoverController) {
      
  }

  ngOnInit() {
    this.selected = this.navParams.get('selection');
  }

  select(option: string){
    console.log("Selected value is " + this.selected)
    this.selected = option;
  }

  async dismissPopover() {
    try {
      await this.popoverCtrl.dismiss();
    } catch (e) {
        //click more than one time popover throws error, so ignore...
    }
  }

}
