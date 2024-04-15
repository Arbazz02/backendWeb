// with promises
const asyncHandler = (func)=>{
    (req,res,next)=>{
        Promise.resolve(func(req,res,next)).catch((Error)=>{
            next(Error)
        })
    }
}


export {asyncHandler}

// with try and catch mehtod

// const asyncHandler= (func) => async (req,res,next)=>{
//     try {
//         await func(req,res,next)
//     } catch (error) {
//         res.status(error.code || 500).json({
//             success:false,
//             message:message.error||'Internal Server Error',
//         })
//     }

// }