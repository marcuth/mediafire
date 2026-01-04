export interface GetLinksResponse {
    response: {
        action: string
        links: {
            quickkey: string
            normal_download: string
            one_time: {
                download: string
            }
        }[]
        one_time_key_request_count: string
        one_time_key_request_max_count: string
        result: string
        new_key: string
        current_api_version: string
    }
}
