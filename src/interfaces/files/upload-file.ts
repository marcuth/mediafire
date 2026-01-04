export interface UploadFileResponse {
    response: {
        action: string
        doupload: {
            result: string
            key: string
        }
        server: string
        result: string
        new_key: string
        current_api_version: string
    }
}
