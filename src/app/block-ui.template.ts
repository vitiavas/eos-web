import {Component} from '@angular/core';

@Component({
  selector: "block-temp",
  styles: [`
    :host {
      text-align: center;
      color: #fff;
    }
    .loader {
      border: 3px solid #f3f3f3 !important; /* Light grey */
      border-top: 3px solid #00a3ce !important; /* Blue */
      border-radius: 50%;
      width: 10em;
      height: 10em;
      animation: spin 1s linear infinite;
  
      &.loader-sm{
        width: 5em !important;
        height: 5em !important;
      }
    }
    .block-ui-wrapper {
      background-color: black !important;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `],
  template: `
  <div class="block-ui-template">
       <div class="loader"> Loading... </div>
  </div>
`
})

export class BlockUITemplateComponent {
  message: any
}
