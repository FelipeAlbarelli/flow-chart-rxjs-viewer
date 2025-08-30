import { Injectable, OnInit, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { skipUntil, Subject } from 'rxjs';

export type Behaviour = {
  type: "interval",
  param: number, // interval(param). eg: interval(100) emits every 100ms
} | {
  type: "map",
  param: string, // cb to apply on incoming data. eg: map(x => x+1)
}

export type CanvaItem = {
  id: string,
  position: {
      x: number,
      y: number
  },
  text: string,
  behaviour: Behaviour
}

export type Connection = {
  outputId: string, 
  inputId: string 
}

const getStateFromLocalStorage = () => {
  const rawStringCantaItems = localStorage.getItem("cards-canva-item");
  const rawStringConnections = localStorage.getItem("cards-connections");
  try {
    const parsedItems = JSON.parse(rawStringCantaItems ?? "[]") as CanvaItem[];
    const parsedConnections = JSON.parse(rawStringConnections ?? "[]") as Connection[];
    // todo, verify type and structure of parsed
    return {
      items: parsedItems,
      connections: parsedConnections
    }
  } catch (e) {
    console.error(e);
    console.log(`raw string` , rawStringCantaItems);
    return {
      items: [],
      connections: []
    }
  }
}

const saveOnLocalStorage = (items: CanvaItem[]) => {
  try {
    const stringfied = JSON.stringify(items);
    localStorage.setItem("cards-canva-item", stringfied);
  } catch (e) {
    console.error(e)
  }
}

@Injectable({
  providedIn: 'root'
})
export class Cards implements OnInit {

  init$ = new Subject<void>()

  private readonly initialState = getStateFromLocalStorage()

  items = signal<CanvaItem[]>(this.initialState.items)

  connections = signal<Connection[]>(this.initialState.connections)

  items$ = toObservable(this.items);

  constructor() {
    this.items$.pipe(
      // skipUntil(this.init$)
    ).subscribe(items => {
      console.log(items)
      saveOnLocalStorage(items); 
    })
  }

  addCanvaItem = (item: CanvaItem) => {
    this.items.update(prev => [
      ...prev,
      item
    ])
  }

  removeItem = (itemId: string) => {
    this.items.update(prev => 
      prev.filter(item => item.id === itemId)
    )
  }

  updateItem = (item: CanvaItem) => {
    this.items.update(prev => 
      prev.map( currItem => currItem.id === item.id ? item : currItem)
    )
  }

  addConnection = (conn: Connection) => {
    this.connections.update(prev => [
      ...prev,
      conn
    ])
  }

  ngOnInit(): void {
    this.init$.next();
    this.init$.complete();
  }
  
}
