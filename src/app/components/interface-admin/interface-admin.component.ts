import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-interface-admin',
  templateUrl: './interface-admin.component.html',
  styleUrls: ['./interface-admin.component.css']
})
export class InterfaceAdminComponent {

  constructor(private router: Router){}
  currentUserString = localStorage.getItem('currentUser');
  async ngOnInit() {
    if(!this.currentUserString){
      this.router.navigate(['/'])
    }
  }
}
