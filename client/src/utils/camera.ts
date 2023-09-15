
export function getUserMedia(){
    return new Promise((resolve) => {
        let constraints = {
            video: true,
        }
        navigator.mediaDevices.getUserMedia(constraints)
            .then((stream: any) => {
                console.log(stream);
                return resolve(stream);
            })
    })
}

function getMediaSuccess(stream: any){

}

function getMediaError(err: any){
    console.log(err)
}