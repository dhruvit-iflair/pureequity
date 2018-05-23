import { Component, OnInit, Input} from '@angular/core';
import { FormGroup } from '@angular/forms';
declare var require: any;
@Component({
  selector: 'app-personal-address',
  templateUrl: './personal-address.component.html',
  styleUrls: ['./personal-address.component.scss']
})

export class PersonalAddressComponent implements OnInit {
  @Input() address : FormGroup;
  @Input() personalDetailsFormGroup : FormGroup;
  countries = require('./countries.json');
  constructor() { }

  ngOnInit() {
  }

}
