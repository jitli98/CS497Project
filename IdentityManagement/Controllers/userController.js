

exports.getUserInfo = async (req, res, next) => {
    await console.log("Done");
    res.status(200).json({
        status: "success",
        message: "Hello World",
        data: null        
    })
}