const asyncHandler = (fun)=> async (req, res, next)=>  {

    try {
        await fun(req,res,next)
    } catch (error) {
        res.status(error.code|| 500).json({
            success:false,
            message:error.message,
        })
    }
}

/*
  const asyncHandler = function (fun) {
  return function (req, res, next) {
    return fun(req, res, next)
      .then(() => {})
      .catch((error) => {
        res.status(error.code || 500).json({
          success: false,
          message: error.message,
        });
      });
  };
};

 */

export default asyncHandler;



// const asyncHandler = ()=>  {}
// const asyncHandler = (fun)=>  {}
// const asyncHandler = (fun)=>()=>  {}
// const asyncHandler = (fun)=> async ()=>  {}


