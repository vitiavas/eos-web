import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Optional,
  forwardRef,
} from "@angular/core";
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  FormGroupDirective,
} from "@angular/forms";

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CheckboxComponent),
  multi: true,
};

@Component({
  selector: "app-checkbox",
  templateUrl: "./checkbox.component.html",
  styleUrls: ["./checkbox.component.scss"],
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR],
})
export class CheckboxComponent implements OnInit, ControlValueAccessor {
  checked: boolean = false;

  get value(): any {
    return this.checked;
  }

  set value(val: any) {
    if (val !== this.checked) {
      this.checked = val;
    }
    this.onChangeCallback(this.checked);
  }

  constructor(
    private cd: ChangeDetectorRef,
    @Optional() public formGroup: FormGroupDirective
  ) {}

  ngOnInit(): void {
    if (!this.value) this.value = "";
  }

  writeValue(val: any): void {
    if (val !== this.checked) {
      this.checked = val;
    }
  }

  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  private onTouchedCallback: () => void = () => {
    // placeholder
  };

  private onChangeCallback: (_: any) => void = () => {
    // placeholder
  };
}
