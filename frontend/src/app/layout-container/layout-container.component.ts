import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-layout-container',
  templateUrl: './layout-container.component.html',
  styleUrls: ['./layout-container.component.scss']
})
export class LayoutContainerComponent implements OnInit {
  @Input() width: string;
  @Input() height: string;
  @Input() marginTop: string;
  @Input() marginBottom: string;

  constructor() { }

  ngOnInit(): void {
  }

}
