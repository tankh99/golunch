export default interface TrackingInfo {
    userID: number,
    startTime: string | Date,
    endTime: string | Date,
    distance: number,
    speed: number,
    date?: any,
    publicKey: string
}