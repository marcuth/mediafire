import FormData from "form-data"
import path from "node:path"

import { GetFileInfoResponse, GetLinksResponse, UploadFileResponse } from "./interfaces/files"
import { ActionOnDuplicateFile } from "./enums/action-on-duplicate-file"
import { PollUploadResponse } from "./interfaces/files/poll-upload"
import { ContentType } from "./enums/content-type"
import { MediafireError } from "./error"
import { Mediafire } from "./mediafire"

export type UploadOptions = {
    file: Buffer | NodeJS.ReadableStream
    fileName: string
    folderKey?: string
    actionOnDuplicate?: ActionOnDuplicateFile | `${ActionOnDuplicateFile}`
}

export type FileActionOptions = {
    quickKey: string
}

export type MoveFileOptions = {
    quickKey: string
    folderKey: string
}

export type GetInfoByPathOptions = {
    filePath: string
}

export type PollUploadOptions = {
    uploadKey: string
}

export type UploadToPathOptions = Omit<UploadOptions & {
    filePath: string
}, "folderKey" | "fileName">

export class FilesService {
    constructor(private readonly mediafire: Mediafire, private readonly pollDelay: number) {}

    async upload({ file, fileName, folderKey, actionOnDuplicate }: UploadOptions) {
        const action = "upload/simple"
        const form = new FormData()

        form.append("Filedata", file, { filename: fileName })

        const data = await this.mediafire.request<UploadFileResponse>(action, {
            folder_key: folderKey,
            action_on_duplicate: actionOnDuplicate,
        }, form)

        const resonseData = data.response
        const uploadKey = resonseData.doupload.key
        const pollUploadInfo = await this.pollUpload({ uploadKey: uploadKey })
        const quickKey = pollUploadInfo.doupload.quickkey
        const linksInfo = await this.getLinks({ quickKey: quickKey })
        const downloadLinks = linksInfo.links

        return {
            ...resonseData,
            doupload: {
                result: resonseData.doupload.result,
                upload_key: resonseData.doupload.key,
                quick_key: quickKey,
                download_links: downloadLinks
            }
        }
    }

    async pollUpload({ uploadKey }: PollUploadOptions) {
        const action = "upload/poll_upload"
        
        const data = await this.mediafire.request<PollUploadResponse>(action, {
            key: uploadKey
        })

        const responseData = data.response

        if (!responseData.doupload.quickkey) {
            throw new MediafireError("Not found quick_key in poll upload")
        }

        return responseData
    }

    async getInfo({ quickKey }: FileActionOptions) {
        const action = "file/get_info"

        const data = await this.mediafire.request<GetFileInfoResponse>(action, {
            quick_key: quickKey
        })

        return data.response
    }

    async getInfoByPath({ filePath }: GetInfoByPathOptions) {
        const parts = path.parse(filePath)
        const dirPath = parts.dir
        const fileName = parts.base

        const folderContents = await this.mediafire.folders.getContentsByPath({
            folderPath: dirPath,
            contentType: ContentType.Files
        })

        const file = folderContents.folder_content.files?.find(file => file.filename === fileName)

        if (!file) {
            throw new MediafireError(`File not found: ${fileName} at ${filePath}`)
        }

        return file
    }

    async uploadToPath({ filePath, file, actionOnDuplicate }: UploadToPathOptions) {
        const parts = path.parse(filePath)
        const dirPath = parts.dir
        const fileName = parts.base
        const folderInfo = await this.mediafire.folders.getInfoByPath({ folderPath: dirPath })
        const folderKey = folderInfo.folder_info.folderkey

        return await this.upload({
            file: file,
            fileName: fileName,
            folderKey: folderKey,
            actionOnDuplicate: actionOnDuplicate
        })
    }

    async move({ quickKey, folderKey }: MoveFileOptions) {
        const action = "file/move"
        return await this.mediafire.request<any>(action, {
            quick_key: quickKey,
            folder_key: folderKey
        })
    }

    async getLinks({ quickKey }: FileActionOptions) {
        const action = "file/get_links"

        const data = await this.mediafire.request<GetLinksResponse>(action, {
            quick_key: quickKey
        })

        return data.response
    }

    async delete({ quickKey }: FileActionOptions) {
        const action = "file/delete"

        const data = await this.mediafire.request<any>(action, {
            quick_key: quickKey
        })

        return data
    }
}