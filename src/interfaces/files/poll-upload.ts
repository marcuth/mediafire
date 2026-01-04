import { UploadStatus } from "../../enums/upload-status"

export interface PollUploadResponse {
    response: {
        action: string
        doupload: {
            result: string
            status: string
            description: string
            quickkey: string
            hash: string
            filename: string
            size: string
            created: string
            revision: string
            created_utc: string
        }
        result: string
        current_api_version: string
        new_key?: undefined
    }
}
