import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"]
})
export class SearchComponent implements OnInit {
  @Output() searchEvent: EventEmitter<any> = new EventEmitter();

  searchForm: FormGroup = this.formBuilder.group({
    date: [null],
    from: [null],
    to: [null]
  });

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {}

  emitSearch() {
    this.searchEvent.emit({
      ...this.searchForm.value
    });
  }
}
