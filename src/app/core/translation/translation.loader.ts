import { TranslateLoader } from '@ngx-translate/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
// import { ApiEndpoints } from '../http/api-endpoints';
// import _ = require('lodash');



export function HttpLoaderFactory(http: HttpClient) {
    return new CustomHttpTranslateLoader(http);
}
export class CustomHttpTranslateLoader implements TranslateLoader {

    public constructor(
        private http: HttpClient
    ) { }

    public getTranslation(lang: string): Observable<Object> {
        return this.http.get('./assets/i18n/' + lang + '.json');
    }
}
