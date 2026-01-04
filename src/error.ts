export class MediafireError extends Error { 
    constructor(message: string) {
        super(message)
        this.name = "MediafireError"
    }
}