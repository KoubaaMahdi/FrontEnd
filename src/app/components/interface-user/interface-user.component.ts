import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-interface-user',
  templateUrl: './interface-user.component.html',
  styleUrls: ['./interface-user.component.css']
})
export class InterfaceUserComponent {
  currentUserString = localStorage.getItem('currentUser');
  constructor(private router: Router){}
  ngOnInit() {
    if(!this.currentUserString){
      this.router.navigate(['/'])
    }
  }
}
