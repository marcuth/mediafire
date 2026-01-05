import { GetFolderContentsResponse } from "./interfaces/folders/get-contents"
import { GetFolderInfo } from "./interfaces/folders/get-info"
import { OrderDirection } from "./enums/order-direction"
import { ContentType } from "./enums/content-type"
import { OrderBy } from "./enums/order-by"
import { Details } from "./enums/details"
import { Mediafire } from "./mediafire"
import { MediafireError } from "./error"
import { rootFolderKey } from "./utils"
import { CreateFolderResponse } from "./interfaces/folders/create"

export type GetFolderInfoOptions = {
    folderKey: string
    deviceId?: string
    details?: Details | `${Details}`
}

export type GetFolderContentOptions = {
    folderKey: string
    contentType?: ContentType | `${ContentType}`
    filter?: string
    orderBy?: OrderBy | `${OrderBy}`
    orderDirection?: OrderDirection | `${OrderDirection}`
    chunk?: number
    details?: Details | `${Details}`
}

export type GetInfoByPathOptions = {
    folderPath: string
}

export type GetFolderContentsByPathOptions = Omit<GetFolderContentOptions &  {
    folderPath: string
}, "folderKey">

export type CreateOptions = {
    name: string
    parentKey?: string
}

export type CreateByPathOptions = {
    folderPath: string
}

export type EnsureAndGetInfoByPathOptions = {
    folderPath: string
}

export class FoldersService {
    constructor(private readonly mediafire: Mediafire) { }

    async getInfo({ folderKey, deviceId, details }: GetFolderInfoOptions) {
        const action = "folder/get_info"

        const data = await this.mediafire.request<GetFolderInfo>(action, {
            folder_key: folderKey,
            device_id: deviceId,
            details: details,
        })

        return data.response
    }

    async getContents({
        folderKey,
        contentType = ContentType.Both,
        filter,
        orderBy,
        orderDirection,
        chunk,
        details
    }: GetFolderContentOptions) {
        const action = "folder/get_content"

        const data = await this.mediafire.request<GetFolderContentsResponse>(action, {
            folder_key: folderKey,
            content_type: contentType,
            filter: filter,
            order_by: orderBy,
            order_direction: orderDirection,
            chunk: chunk?.toString(),
            details: details,
        })

        return data.response
    }

    async getInfoByPath({ folderPath }: GetInfoByPathOptions) {
        const parts = folderPath.split(/[\\/]/).filter(part => part.length > 0)
        
        if (parts.length === 0) {
            return this.getInfo({ folderKey: rootFolderKey })
        }

        let currentFolderKey = rootFolderKey

        for (let i = 0; i < parts.length; i++) {
            const partName = parts[i]

            const folderContents = await this.getContents({
                folderKey: currentFolderKey,
                contentType: ContentType.Folders
            })

            const contents = folderContents.folder_content
            const nextFolder = contents.folders?.find(folder => folder.name === partName)

            if (!nextFolder) {
                throw new MediafireError(`Folder not found: ${partName} at ${folderPath}`)
            }

            currentFolderKey = nextFolder.folderkey
            
            if (i === parts.length - 1) {
                return this.getInfo({ folderKey: currentFolderKey })
            }
        }

        throw new MediafireError("Folder not found")
    }

    async getContentsByPath({ folderPath, ...options }: GetFolderContentsByPathOptions) {
        const info = await this.getInfoByPath({ folderPath: folderPath })

        return await this.getContents({
            folderKey: info.folder_info.folderkey,
            ...options
        })
    }

    async create({ name, parentKey = rootFolderKey }: CreateOptions) {
        const action = "folder/create"

        const data = await this.mediafire.request<CreateFolderResponse>(action, {
            foldername: name,
            parent_key: parentKey,
        })

        return data.response
    }

    async createByPath({ folderPath }: CreateByPathOptions) {
        const parts = folderPath.split(/[\\/]/).filter(part => part.length > 0)
        let currentFolderKey = rootFolderKey
        let lastCreatedFolder: CreateFolderResponse["response"] | null = null

        for (const partName of parts) {
            const folderContents = await this.getContents({
                folderKey: currentFolderKey,
                contentType: ContentType.Folders
            })

            const existingFolder = folderContents.folder_content.folders?.find(
                folder => folder.name === partName
            )

            if (existingFolder) {
                currentFolderKey = existingFolder.folderkey
            } else {
                const newFolder = await this.create({ 
                    name: partName, 
                    parentKey: currentFolderKey 
                })

                currentFolderKey = newFolder.folder_key
                lastCreatedFolder = newFolder
            }
        }

        if (!lastCreatedFolder) {
            throw new MediafireError(`The folder at the specified "${folderPath}" path already existed!`)
        }

        return lastCreatedFolder
    }

    async ensureAndGetInfoByPath({ folderPath }: EnsureAndGetInfoByPathOptions) {
        try {
            return await this.getInfoByPath({ folderPath })
        } catch (error) {
            if (error instanceof MediafireError && error.message.includes("not found")) {
                const { folder_key } = await this.createByPath({ folderPath })
                return await this.getInfo({ folderKey: folder_key })
            }
            
            throw error
        }
    }
}