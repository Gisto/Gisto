import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  private avatar_url = 'https://lh3.googleusercontent.com/-cUfd1s_hV90/AAAAAAAAAAI/AAAAAAAAAAA/AAyYBF7kC3GJJpKrixvfTyjVMZXAhMs8Mw/s64-c-mo/photo.jpg';
  
  constructor() { }

  ngOnInit() {
  }

}
