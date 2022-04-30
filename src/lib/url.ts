export class UrlManipulator {

    window: Window & typeof globalThis;
    public searchParams: Map<string, string> = new Map()

    constructor(window: Window & typeof globalThis) {
        this.window = window;

        if (window.location.search.length > 1) {
            if (window.location.search.includes('=')) {
                if (window.location.search.includes('&')) {
                    window.location.search.substring(1).split('&').forEach((value) => {
                        const keyValue = value.split('=')
                        this.searchParams.set(keyValue[0], keyValue[1] ?? '')
                    })
                } else {
                    const keyValue = window.location.search.substring(1).split('=')
                    this.searchParams.set(keyValue[0], keyValue[1]  ?? '')
                }
            } else {
                if (window.location.search.includes('&')) {
                    window.location.search.substring(1).split('&').forEach((value) => {
                        this.searchParams.set(value, '')
                    })
                } else {
                    this.searchParams.set(window.location.search.substring(1), '')
                }
            }
        }
    }

    stringify(params: Map<string, string>) {
        let stringified = ''

        params.forEach((value, key) => {
            let temp = ''
            if (value) {
                temp = `${key}=${value}`
            } else {
                temp = key
            }

            if (stringified.length === 0) {
                stringified += `?${temp}`
                return
            }

            stringified += `&${temp}`
        })

        return stringified
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