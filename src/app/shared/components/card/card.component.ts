import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { RecordsListResolver } from "src/app/home/_resolvers/records-list.resolver";

@Component({
  selector: "app-card",
  templateUrl: "./card.component.html",
  styleUrls: ["./card.component.scss"]
})
export class CardComponent implements OnInit {
  @Input() record: any;

  @Output() clickEvent: EventEmitter<any> = new EventEmitter();
  constructor() {}

  ngOnInit() {
    this.record;
  }
}
