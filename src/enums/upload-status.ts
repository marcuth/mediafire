export enum UploadStatus {
    Unknown = "0",
    Ready = "2",
    UploadInProgress = "3",
    UploadCompleted = "4",
    WaitingForVerification = "5",
    VerifyingFile = "6",
    FinishedVerification = "11",
    UploadInProgressSecondary = "17",
    WaitingForAssembly = "18",
    AssemblingFile = "19",
    NoMoreRequests = "99"
}