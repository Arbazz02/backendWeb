// with promises
const asyncHandler = (func)=>{
    return (req,res,next)=>{
        Promise.resolve(func(req,res,next)).catch((Error)=>{
            next(Error)
        })
    }
}




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

export {asyncHandler}