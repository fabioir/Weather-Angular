import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})

export class AboutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    const body = document.getElementsByTagName("body");
    body[0].classList.add("initial-view"); //Sets tbe background image in the styles.css
  }

}

/**This component shows somw general information about the app */