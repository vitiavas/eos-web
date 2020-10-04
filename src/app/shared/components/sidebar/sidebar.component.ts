import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"]
})
export class SidebarComponent implements OnInit {
  opened: boolean = true;

  // @Input()
  // get opened() {
  //   return this._opened;
  // }

  // @Output() openedChange = new EventEmitter();

  // set opened(val) {
  //   this._opened = val;
  //   this.openedChange.emit(this._opened);
  // }

  openedHistory: boolean = false;

  constructor() {}

  ngOnInit() {}

  history: any = [
    {
      date: "09/20/20 - 18:30",
      status: "Verification Successful",
      event: "Accessed",
      expanded: false
    },
    {
      date: "09/20/20 - 18:30",
      status: "Verification Successful",
      event: "Accessed",
      expanded: false
    },
    {
      date: "09/20/20 - 18:30",
      status: "Verification Successful",
      event: "Accessed",
      expanded: false
    },
    {
      date: "09/20/20 - 18:30",
      status: "Verification Successful",
      event: "Accessed",
      expanded: false
    }
  ];
}
