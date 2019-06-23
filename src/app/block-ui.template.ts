import {Component} from '@angular/core';

@Component({
  selector: "block-temp",
  styles: [`
    :host {
      text-align: center;
      color: #fff;
    }
  `],
  template: `
  <div class="block-ui-template">
       <p> Loading... </p>
  </div>
`
})

export class BlockUITemplateComponent {
  message: any
}
