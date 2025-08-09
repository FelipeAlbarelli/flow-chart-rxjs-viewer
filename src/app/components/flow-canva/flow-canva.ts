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
import { canvaStore } from '../../model/canva.store';
import { CommonModule } from '@angular/common';

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
    // this.canvaItems.update(prev => [
    //   ...prev,
    //   {
    //     id: generateGuid(),
    //     text: event.data ?? `node ${prev.length + 1}`,
    //     position: event.rect
    //   }
    // ])
  }

}
