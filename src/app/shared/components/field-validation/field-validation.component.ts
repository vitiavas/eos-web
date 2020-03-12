
import { AfterViewInit, Component, Input, OnInit, Optional, SkipSelf } from "@angular/core";
import { FormControl, FormGroupDirective, FormGroupName, NgControl } from "@angular/forms";
import { ValidationsMessages } from './models/validation-messages.model';

@Component({
  selector: "app-field-validation",
  templateUrl: "./field-validation.component.html",
  styleUrls: ["./field-validation.component.scss"]
})
export class FieldValidationComponent implements OnInit, AfterViewInit {

  
  @Input() validations: ValidationsMessages[];

  isValid() {
    return !(this.ngControl && this.ngControl.errors && this.ngControl.touched);
  }

  isRequired() {
    if (this.ngControl) {
      let control = (<FormControl> this.ngControl.control);
      if (control && control.validator) {
        let validator = control.validator((<any> ''));
        return validator && validator.hasOwnProperty("required");
      }
      return false;
    }
    return false;
  }

  constructor(@Optional() public formGroupDirective: FormGroupDirective, 
              @Optional() public formGroupName: FormGroupName,
              @SkipSelf() @Optional() public ngControl: NgControl
     ) {

  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
  
  }

}

