export class UrlManipulator {

    window: Window & typeof globalThis;

    constructor(window: Window & typeof globalThis) {
        this.window = window;
    }

    get(index: number) {
        return window.location.pathname.split('/')[index]
    }

    ifPresent(index: number, callback: Function) {
        const path = this.get(index)

        if (path) {
            callback(path);
        }
    }
}