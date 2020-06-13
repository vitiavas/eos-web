import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { RecordsListResolver } from "src/app/home/_resolvers/records-list.resolver";

@Component({
  selector: "app-card",
  templateUrl: "./card.component.html",
  styleUrls: ["./card.component.scss"],
})
// https://dev.to/wescopeland/easier-angular-unit-testing-4aic
export class CardComponent implements OnInit {
  @Input() record: any;
  @Input() isDraft: boolean = false;
  @Output() clickEvent: EventEmitter<any> = new EventEmitter();
  constructor() {}

  visible: boolean = false;

  ngOnInit() {
    this.record;
  }

  click() {
    this.clickEvent.emit(this.record);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.visible = true;
    });
  }
}
