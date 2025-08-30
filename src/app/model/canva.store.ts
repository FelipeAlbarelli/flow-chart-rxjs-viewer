import { map, scan, share, shareReplay, startWith, Subject, tap } from "rxjs"

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

export type CanvaStoreAction = {
    type: "add",
    data: CanvaItem,
} | {
    type: "update",
    id: string,
    data: CanvaItem,
} | {
    type: "remove",
    id: string
} | {
    type: "clear"
} | {
    type: "setStore",
    data: Map<string, CanvaItem>,
}

export type ConnectionAction = {
    type: "add",
    data: Connection,
} | {
    type: "remove",
    data: Connection,
} | {
    type: "removeAllWithInput",
    id: string
} | {
    type: "removeAllWithOutput",
    id: string
} | {
    type: "load",
    data: Map< string, Set<string> >
}

const getStateFromLocalStorage = (key: string): Map<string, CanvaItem> | null => {
    const rawString = localStorage.getItem(key);
    if (rawString == null) {
        return null
    }
    try {
        const parsedRecord = JSON.parse(rawString) as Record<string, CanvaItem>;
        // todo, verify type and structure of parsed
        const recordEntries = Object.entries(parsedRecord);
        return new Map(recordEntries);
    } catch (e) {
        console.error(e);
        console.log(`raw string` , rawString);
        return null
    }
}

const saveStateInLocalStorage = (key: string, state: Map<string, CanvaItem>) => {
    const stateRecord = Object.fromEntries(state.entries());
    const stateString = JSON.stringify(stateRecord);
    localStorage.setItem(key, stateString);
}

export const canvaStore = ({
    localStoreSync,
    localStoreKey
} = {
    localStoreSync : true,
    localStoreKey: "canvaLocalStore"
}) => {

    const initialState = new Map<string, CanvaItem>();

    const nodeActions$ = new Subject<CanvaStoreAction>();

    const connectionActions$ = new Subject<ConnectionAction>();

    let firstAction: CanvaStoreAction = {
        type: "clear"
    }

    if (localStoreSync) {
        const dataFromStorage = getStateFromLocalStorage(localStoreKey);
        if (dataFromStorage) {
            firstAction = {
                type: "setStore",
                data: dataFromStorage
            }
        }
    }

    const nodeState$ = nodeActions$.pipe(
        startWith(firstAction),
        scan((state, action) => {
            switch (action.type) {
                case 'add':
                    state.set(action.data.id,action.data);
                    return state;
                case "update":
                    state.set(action.id, action.data);
                    return state;
                case "clear":
                    state.clear();
                    return state;
                case "remove":
                    state.delete(action.id);
                    return state;
                case "setStore":
                    state.clear();
                    for (const [key, val] of action.data.entries()) {
                        state.set(key, val);
                    }
                    return state;
            }
        }, initialState ?? new Map<string, CanvaItem>()),
        tap(state => {
            console.debug(`canvaStore state changed`, state);
            if (localStoreSync) {
                saveStateInLocalStorage(localStoreKey, state);
            }
        }),
        share(),
    );

    const connectionState$ = connectionActions$.pipe(
        scan((state, action) => {
            switch (action.type) {
                case "add": {
                    const { inputId, outputId } = action.data;
                    const connections = state.get(outputId) ?? new Set<string>();
                    connections.add(inputId);
                    state.set(outputId, connections);
                    return state;
                }
                case "remove": {
                    const { inputId, outputId } = action.data;
                    const connections = state.get(outputId) ?? new Set<string>();
                    connections.delete(inputId);
                    state.set(outputId, connections);
                    return state;
                }
                case "removeAllWithInput": {
                    for ( const [_index, connectionSet] of state.entries() ) {
                        connectionSet.delete(action.id);
                    }
                    return state;
                }
                case "removeAllWithOutput": {
                    state.delete(action.id);
                    return state;
                }
                case "load": {
                    state.clear();
                    for (const [key, connection] of action.data.entries()){
                        state.set(key, connection)
                    }
                    return state;
                }
            }
        }, new Map<string, Set<string>>())
    )

    const nodes$ = nodeState$.pipe(
        map(state => 
            Array.from(state.entries(), ([_key, item]) => item )
        )
    )

    const connections$ = connectionState$.pipe(
        map(state => 
            Array.from(
                state.entries(), ([inputId, connectionSet]) => 
                    Array.from(
                        connectionSet.entries(), 
                        ([_i, outputId]) => ({
                            outputId, 
                            inputId  
                        })
                    )
                
            ).flat()
        )
    )

    return {
        nodeState$,
        nodes$,
        nodeActions$,
        connections$,
    }
}