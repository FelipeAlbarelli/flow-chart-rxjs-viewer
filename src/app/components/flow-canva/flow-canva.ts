import { Component, signal, viewChild } from '@angular/core';
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

@Component({
  selector: 'app-flow-canva',
  imports: [FFlowModule, CommonModule],
  templateUrl: './flow-canva.html',
  styleUrl: './flow-canva.scss'
})
export class FlowCanva {

  canvaStore = canvaStore();

  palatteItems = signal([
    "A", "B" , "C" , "D" , "E"
  ])

  canvaItems$ = this.canvaStore.items$

  protected fCanvas = viewChild(FCanvasComponent);

  protected onLoaded(): void {
    this.fCanvas()?.resetScaleAndCenter(false);
    console.log('loaded')
  }

  addConnection = (event: FCreateConnectionEvent) => {
    console.log(event)
  }

  nodeMoved = (event: IPoint, node: CanvaItem) => {
    this.canvaStore.actions$.next({
      type: "update",
      id: node.id,
      data: {
        ...node,
        position: event
      }
    })
  }

  createNode = (event: FCreateNodeEvent) => {
    this.canvaStore.actions$.next({
      type: "add",
      data: {
        id: generateGuid(),
        text: event.data ?? `node`,
        behaviour: {
          type: "interval",
          param: 250,
        },
        position: event.rect,
      }
    })
  }

  deleteNode = (node: CanvaItem) => {
    this.canvaStore.actions$.next({
      type: "remove",
      id: node.id
    })
  }

}
