import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostBinding,
  Input,
  OnInit,
  Optional,
  Output,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import {
  ControlValueAccessor,
  FormControl,
  FormGroupDirective,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  Validator,
  Validators,
} from "@angular/forms";
import { FieldValidationComponent } from "../field-validation/field-validation.component";
import { InputTypes } from "./input-types.enum";
import { ValidationsMessages } from "../field-validation/models/validation-messages.model";

let nextId = 0;

const INPUT_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => InputComponent),
  multi: true,
};

const INPUT_VALIDATORS = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => InputComponent),
  multi: true,
};

@Component({
  selector: "app-input",
  providers: [INPUT_VALUE_ACCESSOR, INPUT_VALIDATORS],
  encapsulation: ViewEncapsulation.None,
  styleUrls: ["./input.component.scss"],
  templateUrl: "./input.component.html",
})
export class InputComponent
  implements OnInit, AfterViewInit, ControlValueAccessor, Validator {
  @Input() id: string = `input-${++nextId}`;
  @Input() name: string;
  @Input() label: string = "";
  @Input() type: InputTypes = InputTypes.text;
  @Input() hint: string;
  @Input() placeholder: string = "";
  @Input() disabled: boolean = false;
  @Input() tabindex: number;
  @Input() formControlName: string;
  @Input() rows: number = 6;
  @Input() cssClass: any;

  @Input() validations: ValidationsMessages[];

  @Input() min: number;
  @Input() max: number;

  @Input() minlength: number;
  @Input() maxlength: number;

  @Input() step: number;

  @Input() required: boolean = false;
  @Input() requiredIndicator: string | boolean = "*";

  @Input() passwordToggleEnabled: boolean = false;
  @Input() passwordTextVisible: boolean = false;
  @Input() allowFormatDecimal: boolean = false;
  @Input() autoSelect: boolean = false;
  @Input() autofocus: boolean = false;
  @Input() autocomplete: string = "off";
  @Input() autocorrect: string = "off";
  @Input() spellcheck: string = "off";
  @Input() calendar: boolean = false;
  @Input() time: boolean = false;

  @Output() change = new EventEmitter();
  @Output() blur = new EventEmitter();
  @Output() focus = new EventEmitter();
  @Output() keyup = new EventEmitter();
  @Output() keypress = new EventEmitter();
  @Output() click = new EventEmitter();

  get getClass() {
    return this.cssClass;
  }

  get value(): any {
    return this._value;
  }

  get isPlaceholder(): boolean {
    return !this._value;
  }

  set value(val: any) {
    if (val !== this._value) {
      if (this.allowFormatDecimal) {
        this._value = val.toString().replace(/\./g, ",");
      } else {
        this._value = val;
      }
      this.onChangeCallback(this._value);
    }
  }
  formatNumber(event) {
    this.value = event.toString().replace(/\./g, ",");
  }
  @HostBinding("class")
  readonly getHostCssClasses = "app-input";

  @HostBinding("class.ng-dirty")
  get focusedOrDirty(): any {
    if (this.focused) {
      return true;
    }
    if (typeof this.value === "string") {
      return this.value && this.value.length;
    }
    return typeof this.value !== "undefined" && this.value !== null;
  }

  @HostBinding("class.ng-touched")
  get isTouched(): boolean {
    return this.formGroup ? this.formGroup.touched : false;
  }

  get labelState(): string {
    if (this.placeholder) return "outside";
    if (this.focusedOrDirty) return "outside";
    return "inside";
  }

  get underlineState(): string {
    if (this.focused) return "expanded";
    return "collapsed";
  }

  get requiredIndicatorView(): string {
    if (!this.requiredIndicator || !this.required) return "";
    return this.requiredIndicator as string;
  }

  currentElement: ElementRef;

  get element(): any {
    if (this.type === InputTypes.textarea) return this.textareaControl;
    return this.inputControl;
  }

  focused: boolean = false;
  private _value: any;

  @ViewChild("inputControl") private inputControl: ElementRef;
  @ViewChild("textareaControl") private textareaControl: ElementRef;
  @ViewChild("passwordControl") private passwordControl: ElementRef;
  @ViewChild("fieldValidation")
  private fieldValidation: FieldValidationComponent;

  constructor(
    private cd: ChangeDetectorRef,
    @Optional() public formGroup: FormGroupDirective
  ) {
    this.currentElement = this.inputControl;
  }

  public validate(c: FormControl) {
    if (this.type !== "number") {
      return null;
    }
    return {
      ...Validators.max(this.max)(c),
      ...Validators.min(this.min)(c),
    };
  }

  ngOnInit(): void {
    if (!this.value) this.value = "";
  }

  ngAfterViewInit(): void {
    if (this.autofocus) {
      setTimeout(() => {
        this.element.nativeElement.focus();
      });
    }
    // sometimes the label doesn't update on load
    setTimeout(() => this.cd.markForCheck());
  }

  ngOnChanges(changes) {
    if ("max" in changes || "min" in changes) {
      this.onChangeCallback(this._value);
    }
  }

  isValid() {
    return this.fieldValidation.isValid();
  }

  onChange(event): void {
    event.stopPropagation();
    this.change.emit(this.value);
  }

  onKeyUp(event): void {
    event.stopPropagation();
    this.keyup.emit(event);
  }

  onkeypress(event): void {
    event.stopPropagation();
    this.keypress.emit(event);
  }

  onFocus(event): void {
    event.stopPropagation();

    if (this.autoSelect) {
      setTimeout(() => {
        this.element.nativeElement.select();
      });
    }

    this.focused = true;
    this.focus.emit(event);
    this.onTouchedCallback();
  }

  onBlur(event): void {
    event.stopPropagation();

    this.focused = false;
    this.blur.emit(event);
  }

  writeValue(val: any): void {
    if (val !== this._value) {
      this._value = val;
    }
  }

  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  togglePassword(): void {
    this.passwordTextVisible = !this.passwordTextVisible;

    setTimeout(() => {
      if (this.passwordTextVisible) {
        this.passwordControl.nativeElement.focus();
      } else {
        this.element.nativeElement.focus();
      }
    });
  }

  private onTouchedCallback: () => void = () => {
    // placeholder
  };

  private onChangeCallback: (_: any) => void = () => {
    // placeholder
  };
}
