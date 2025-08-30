import { Component, inject, signal, viewChild } from '@angular/core';
import {
  FCanvasComponent,
  FCreateConnectionEvent,
  FCreateNodeEvent,
  FExternalItemDirective,
  FExternalItemPlaceholderDirective,
  FExternalItemPreviewDirective,
  FFlowModule
} from '@foblex/flow';
import {generateGuid} from '@foblex/utils';
import { CanvaItem, canvaStore } from '../../model/canva.store';
import { CommonModule } from '@angular/common';
import { IPoint } from '@foblex/2d';
import { Cards } from '../../services/cards';

@Component({
  selector: 'app-flow-canva',
  imports: [FFlowModule, CommonModule],
  templateUrl: './flow-canva.html',
  styleUrl: './flow-canva.scss'
})
export class FlowCanva {

  readonly cardsService = inject(Cards);

  palatteItems = signal([
    "A", "B" , "C" , "D" , "E"
  ])

  protected fCanvas = viewChild(FCanvasComponent);

  protected onLoaded(): void {
    this.fCanvas()?.resetScaleAndCenter(false);
    console.log('loaded')
  }

  addConnection = (event: FCreateConnectionEvent) => {
    const input = this.cardsService.items().find(item => item.id === event.fInputId) 
    const output = this.cardsService.items().find(item => item.id === event.fOutputId) 
    console.log({event, input, output})
    this.cardsService.addConnection({
      inputId: input?.id ?? "",
      outputId: output?.id ?? ""
    })
  }

  nodeMoved = (event: IPoint, node: CanvaItem) => {
    this.cardsService.updateItem({
      ...node,
      position: event,
    })
  }

  createNode = (event: FCreateNodeEvent) => {
    this.cardsService.addCanvaItem({
        id: generateGuid(),
        text: event.data ?? `node`,
        behaviour: {
          type: "interval",
          param: 250,
        },
        position: event.rect,
    })
  }

  deleteNode = (node: CanvaItem) => {
    this.cardsService.removeItem(node.id);
  }

}
