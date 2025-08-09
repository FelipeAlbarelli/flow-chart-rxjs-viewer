import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FFlowComponent, FCanvasComponent, FFlowModule } from "@foblex/flow"
import { FlowCanva } from "./components/flow-canva/flow-canva";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FFlowComponent, FCanvasComponent, FFlowModule, FlowCanva],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('ng-rxjs-viewer');
}
