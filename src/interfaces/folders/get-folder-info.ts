export interface GetFolderInfo {
    response: {
        action: string
        folder_info: {
            folderkey: string
            name: string
            file_count: string
            folder_count: string
            revision: string
            owner_name: string
            avatar: string
            dropbox_enabled: string
            flag: string
        }
        result: string
        new_key: string
        current_api_version: string
    }
}
