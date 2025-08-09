import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FFlowComponent, FCanvasComponent, FFlowModule } from "@foblex/flow"

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FFlowComponent, FCanvasComponent, FFlowModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('ng-rxjs-viewer');
}
