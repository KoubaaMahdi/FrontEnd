import { Component ,Input} from '@angular/core';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})
export class PersonComponent {
  @Input() name: string = '';
  @Input() notification: string = '';
  @Input() date :string=' ';
  @Input() message :string=' ';
  @Input () active : string='';
  toggleActive(clickedDiv: any){
    console.log()
    
  }
  
}
