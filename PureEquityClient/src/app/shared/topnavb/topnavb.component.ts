import { Component, OnInit } from '@angular/core';
import { TopnavbService } from './topnavb.service';
@Component({
  selector: 'app-topnavb',
  templateUrl: './topnavb.component.html',
  styleUrls: ['./topnavb.component.css']
})
export class TopnavbComponent implements OnInit {

  constructor(private topnav:TopnavbService) { }
  public navItems=this.topnav;

  ngOnInit() {
    console.log(this.navItems);
  }

}
