
exports.getUserProfile = async (req, res, next) => {
    const username = req.body.username;

    // Get 10 most recent submission from SubmissionHistory MicroService

    res.status(200).json({
        status: "success",
        message: "User Profile successfully retrieved.",
        data: {
            username: username,
            score: 99999,
            recentSubmissions: [
                null, null, null
            ],
            numberOfAcceptedSubmissions: 999
        }  
    })
}