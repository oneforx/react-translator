import translation_worker from "../workers/translation_worker";

export default class WorkerBuilder extends Worker {
    constructor (worker: Function) {
        const code = worker.toString();
        const blob = new Blob([`(${code})()`]);
        super(URL.createObjectURL(blob), { name: "TranslationWorker" });
    }
}