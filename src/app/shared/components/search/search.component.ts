import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { SharedService } from "src/app/services/shared.service";

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"],
})
export class SearchComponent implements OnInit {
  formVisible: boolean = false;

  searchForm: FormGroup = this.formBuilder.group({
    date: [null],
    from: [null],
  });

  dateClass: any = {
    "margin-bottom": 0,
    color: "#7b92aa",
  };

  timeClass: any = {
    height: "calc(1.5em + .3rem + 2px)",
    "margin-bottom": 0,
    color: "#7b92aa",
  };

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {}

  emitSearch() {
    SharedService.setSearchResult(this.searchForm.value);
  }

  resetSearch() {
    this.searchForm.reset();
    SharedService.clearSearchResult();
  }
}
