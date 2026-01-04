import crypto from "node:crypto"
import FormData from "form-data"
import axios from "axios"

import { apiVersion, baseUrl, defaultAppId, filePollDefaultDelay, tokenVersion } from "./utils"
import { UserGetSesionTokenResponse } from "./interfaces/user"
import { FoldersService } from "./folders-service"
import { FilesService } from "./files-service"

export type BaseResponseData = {
    response: {
        new_key?: string
    }
}

export type MediafireOptions = {
    email: string
    password: string
    appId?: string
    fileUploadPollDelay?: number
}

export class Mediafire {
    private readonly email: string
    private readonly password: string
    private accessToken?: string
    private secretKey?: string
    private sessionTime?: string
    readonly appId: string
    readonly folders: FoldersService
    readonly files: FilesService
    readonly api = axios.create({ baseURL: baseUrl })

    constructor({
        email,
        password,
        appId = defaultAppId
    }: MediafireOptions) {
        this.email = email
        this.password = password
        this.appId = appId
        this.folders = new FoldersService(this)
        this.files = new FilesService(this, filePollDefaultDelay)
    }

    private generateAndPutLogInSignature(searchParams: URLSearchParams) {
        const sha1 = crypto.createHash("sha1")

        sha1.update(this.email, "ascii")
        sha1.update(this.password, "ascii")
        sha1.update(this.appId, "ascii")

        const signature = sha1.digest("hex")

        searchParams.append("signature", signature)
    }

    async ensureCredentials() {
        if (!this.accessToken || this.secretKey! || !this.sessionTime) {
            await this.logIn()
        }

        return {
            accessToken: this.accessToken!,
            secretKey: this.secretKey!,
            sessionTime: this.sessionTime!,
        }
    }

    async logIn() {
        const path = "/user/get_session_token.php"

        const searchParams = new URLSearchParams()

        searchParams.append("application_id", this.appId)
        searchParams.append("token_version", tokenVersion.toString())
        searchParams.append("response_format", "json")
        searchParams.append("email", this.email)
        searchParams.append("password", this.password)

        this.generateAndPutLogInSignature(searchParams)

        const response = await this.api.post<UserGetSesionTokenResponse>(path, null, {
            params: searchParams
        })

        const data = response.data.response

        this.accessToken = data.session_token
        this.secretKey = data.secret_key
        this.sessionTime = data.time
    }

    async request<ResponseData extends BaseResponseData>(
        action: string,
        params: Record<string, string | undefined> = {},
        body?: FormData | string
    ) {
        const { accessToken, secretKey, sessionTime } = await this.ensureCredentials()
        const path = `${action}.php`
        const uri = `/api/${apiVersion}/${action}.php`
        const searchParams = new URLSearchParams()

        for (const paramKey in params) {
            const paramValue = params[paramKey]

            if (paramValue) {
                searchParams.append(paramKey, paramValue)
            }
        }

        searchParams.append("response_format", "json")
        searchParams.append("session_token", accessToken)

        searchParams.sort()

        let query = searchParams.toString()

        const secretKeyMod = BigInt(secretKey) % 256n
        const signatureBase = `${secretKeyMod}${sessionTime}${uri}?${query}`
        const signature = crypto.createHash("md5").update(signatureBase).digest("hex")

        const urlWithQuery = `${path}?${query}&signature=${signature}`

        const headers: Record<string, string> = {}
        let payload = body

        if (body instanceof FormData) {
            Object.assign(headers, body.getHeaders())
        } else {
            headers["Content-Type"] = "application/x-www-form-urlencoded"

            if (!body) {
                payload = query + `&signature=${signature}`
            }
        }

        const response = await this.api.post<ResponseData>(urlWithQuery, payload, { headers: headers })

        const responseData = response.data.response

        if (responseData.new_key === "yes") {
            const current = BigInt(secretKey)
            this.secretKey = String((current * 16807n) % 2147483647n)
        }

        return response.data
    }
}