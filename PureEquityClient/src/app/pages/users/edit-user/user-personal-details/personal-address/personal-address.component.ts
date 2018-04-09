import { Component, OnInit, Input} from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-personal-address',
  templateUrl: './personal-address.component.html',
  styleUrls: ['./personal-address.component.scss']
})
export class PersonalAddressComponent implements OnInit {
  @Input() address : FormGroup;

  constructor() { }

  ngOnInit() {
  }

}
