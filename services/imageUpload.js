import s3 from `../config/s3.config.js`

export const s3FileUpload = async ({ bucketName, key, body, contentType }) => {
    return await s3.upload({
        Bucket: bucketName, // bucketName is like the name of the folder
        Key: key, // key is like the name of the file
        Body: body, // body is like the content of the file
        ContentType: contentType // contentType is like the type of the file (e.g. image/jpeg)
        }).promise()
}

export const s3FileDelete = async ({ bucketName, key }) => {

    return await s3.deleteObject({  // aws treat everything as a object and every file as object
        Bucket: bucketName, // bucketName is like the name of the folder
        Key: key, // key is like the name of the file
        }).promise()
}