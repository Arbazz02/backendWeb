import {v2 as cloudinary} from 'cloudinary';
import fs from "fs"

cloudinary.config({ 
  cloud_name: process.env.CLOUDINIRY_CLOUD_NAME , 
  api_key: process.env.CLOUDINIRY_API_KEY, 
  api_secret: process.env.CLOUDINIRY_API_SCRECT 
});

const uploadOnCloudinary = async (localfilepath)=>{
    try {
        if(!localfilepath) return "file is not uploaded"
        const response = await cloudinary.uploader.upload(localfilepath,{
            resource_type:"auto"
        })//   FILE has been UPLOAD ON CLOUDINARY
        console.log("file is uploaded succesfully on cloudinary",response.url)
        return response
    } catch (error) {
        fs.unlinkSync(localfilepath); // delete local file after uploading to clodinary 
        return  `failed to upload the image ${error}`;
    }
}

export {uploadOnCloudinary}