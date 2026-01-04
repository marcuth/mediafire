export interface GetFolderContentsResponse {
    response: {
        action: string
        asynchronous: string
        folder_content: {
            chunk_size: string
            content_type: string
            chunk_number: string
            folderkey: string
            folders?: Array<{
                folderkey: string
                name: string
                description: string
                tags: string
                privacy: string
                created: string
                revision: string
                flag: string
                file_count: string
                folder_count: string
                dropbox_enabled: string
                created_utc: string
            }>
            files?: Array<{
                quickkey: string
                hash: string
                filename: string
                description: string
                size: string
                privacy: string
                created: string
                password_protected: string
                mimetype: string
                filetype: string
                view: string
                edit: string
                revision: string
                flag: string
                downloads: string
                views: string
                links: {
                    normal_download: string
                }
                created_utc: string
            }>
            more_chunks: string
            revision: string
        }
        result: string
        new_key: string
        current_api_version: string
    }
}