import { Component, signal, viewChild } from '@angular/core';
import {
  FCanvasComponent,
  FCreateNodeEvent,
  FExternalItemDirective,
  FExternalItemPlaceholderDirective,
  FExternalItemPreviewDirective,
  FFlowModule
} from '@foblex/flow';
import {generateGuid} from '@foblex/utils';

@Component({
  selector: 'app-flow-canva',
  imports: [FFlowModule],
  templateUrl: './flow-canva.html',
  styleUrl: './flow-canva.scss'
})
export class FlowCanva {

  palatteItems = signal([
    "A", "B" , "C" , "D" , "E"
  ])

  canvaItems = signal([{
    id: generateGuid(),
    text: "node 1",
    position: {x: 0, y:0},
  }])

  protected fCanvas = viewChild(FCanvasComponent);

  protected onLoaded(): void {
    this.fCanvas()?.resetScaleAndCenter(false);
    console.log('loaded')
  }

  createNode = (event: FCreateNodeEvent) => {
    this.canvaItems.update(prev => [
      ...prev,
      {
        id: generateGuid(),
        text: event.data ?? `node ${prev.length + 1}`,
        position: event.rect
      }
    ])
  }

}
