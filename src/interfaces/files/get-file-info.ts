export interface GetFileInfoResponse {
    response: {
        action: string
        file_info: {
            quickkey: string
            filename: string
            ready: string
            created: string
            downloads: string
            description: string
            size: string
            privacy: string
            password_protected: string
            hash: string
            filetype: string
            mimetype: string
            owner_name: string
            flag: string
            parent_folderkey: string
            revision: string
            view: string
            edit: string
            links: {
                normal_download: string
            }
            created_utc: string
        }
        result: string
        new_key: string
        current_api_version: string
    }
}
