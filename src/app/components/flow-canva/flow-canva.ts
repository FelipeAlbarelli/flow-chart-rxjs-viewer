import { Component } from '@angular/core';
import { FFlowModule } from "@foblex/flow"


@Component({
  selector: 'app-flow-canva',
  imports: [FFlowModule],
  templateUrl: './flow-canva.html',
  styleUrl: './flow-canva.scss'
})
export class FlowCanva {


  onLoaded = () => {
    console.log('loaded')
  }

}
