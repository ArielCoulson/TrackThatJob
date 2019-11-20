import { Component, OnInit } from '@angular/core';
import { Route, ActivatedRoute } from '@angular/router'; 
import { ApplicationService, Application } from 'src/app/services/application.service'
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-company',
  templateUrl: './company.page.html',
  styleUrls: ['./company.page.scss'],
})
export class CompanyPage implements OnInit {
  
  private application: Application
  private id : string
  
  constructor(private applicationService: ApplicationService,route: ActivatedRoute) { 
    this.id = route.snapshot.params.id;
    this.applicationService.getApplication(this.id).subscribe(result => {
        this.application = result;
    });
  }

  ngOnInit() {
  }



}
