export interface CreateFolderResponse {
    response: {
        action: string
        folder_key: string
        upload_key: string
        parent_folderkey: string
        name: string
        description: string
        created: string
        created_utc: string
        privacy: string
        file_count: string
        folder_count: string
        revision: string
        dropbox_enabled: string
        flag: string
        result: string
        new_key: string
        current_api_version: string
        new_device_revision: number
    }
}
