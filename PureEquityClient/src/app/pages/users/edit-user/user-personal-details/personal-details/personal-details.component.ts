import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators,} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { environment } from "../../../../../../environments/environment";


@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.scss'],
})
export class PersonalDetailsComponent implements OnInit {


  private _value: any;
  @Input() personal : FormGroup;

  constructor(private _formBuilder: FormBuilder,public toster: ToastrService) { }


  ngOnInit(): void {
  }
  
}
