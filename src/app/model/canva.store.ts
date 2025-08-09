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

export type CanvaStoreActions = {
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

    const actions$ = new Subject<CanvaStoreActions>();

    let firstAction: CanvaStoreActions = {
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

    const state$ = actions$.pipe(
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

    const items$ = state$.pipe(
        map(state => 
            Array.from(state.entries(), ([key, item]) => item )
        )
    )

    return {
        state$,
        items$,
        actions$
    }
}