import { Injectable } from "@angular/core";

import { Observable, Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class SharedService {
  constructor() {}

  public static searchResult: any = new Subject<any>();

  public static setSearchResult(searchResult: any) {
    SharedService.searchResult.next({ ...searchResult });
  }

  public static clearSearchResult() {
    SharedService.searchResult.next();
  }

  public static getSearchResult(): Observable<any> {
    return SharedService.searchResult.asObservable();
  }
}
