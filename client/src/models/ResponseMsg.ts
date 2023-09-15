export default interface ResponseMsg {
    success: boolean,
    msgHeader?: string,
    msgBody?: string,
    payload?: any
}