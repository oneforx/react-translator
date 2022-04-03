import { useCallback, useEffect, useMemo, useState } from "react";
import WorkerBuilder from "../util/worker-builder";


type OnMessageFunction = (
    (message: MessageEvent<any>) => void
)


type OnErrorFunction = (
    (message: ErrorEvent) => void
)

export const useServiceWorker = (
    worker: Function,
    onMesssage?: OnMessageFunction,
    onMessageError?: OnMessageFunction,
    onError?: OnErrorFunction
) => {
    const [ messages, setMessages ] = useState([]);
    
    const translationWorker = useMemo(() => {
        return window.Worker ? new WorkerBuilder(worker) : null;
    }, [])

    const builtInOnMessage = useCallback((message: MessageEvent<any>) => {
        console.log("builtIn", message);
    }, []);

    const builtInOnMessageError = useCallback((message: MessageEvent<any>) => {
        console.error("builtIn", message);
    }, []);

    const builtInOnError = useCallback((message: ErrorEvent) => {
        console.error("builtIn", message);
    }, []);

    useEffect(() => {
        if (translationWorker) {
            translationWorker.onmessage = (message) => onMesssage ? onMesssage(message) : builtInOnMessage(message);
            translationWorker.onmessageerror = (message) => onMessageError ? onMessageError(message) : builtInOnMessageError(message);
            translationWorker.onerror = (message) => onError ? onError(message) : builtInOnError(message);
        }
    }, []);

    return translationWorker;
}