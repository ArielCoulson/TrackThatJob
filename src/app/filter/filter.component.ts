import { Component, OnInit } from '@angular/core';
import { PopoverController, NavParams, Events } from '@ionic/angular';
import { OpenNativeSettings } from '@ionic-native/open-native-settings/ngx';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit {

  constructor(
    private events: Events,
    private navParams: NavParams,
    private popoverCtrl: PopoverController) { }

  ngOnInit() {}

  async dismissPopover() {
    try {
      await this.popoverCtrl.dismiss();
    } catch (e) {
        //click more than one time popover throws error, so ignore...
    }
  }

}
