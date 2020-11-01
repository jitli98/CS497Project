import express from "express";
import {
	evaluateSubmission,
	getSubmissionStatus,
	isSupportedProgrammingLanguage
} from "./submissionTester";
import bodyParser from "body-parser";

const server = express();

server.use(bodyParser.text());

server.post("/submitSolution", async (req: express.Request, res: express.Response) => {
	const code: string = req.body;
	const requiredParameters = ["challengeId", "challengeName", "userId", "userName", "programmingLanguage"];
	for (const param of requiredParameters) {
		if (typeof req.query[param] != "string") {
			res.status(400).json({message: `Query parameter '${param}' was not specified.`});
			return;
		}
	}

	if (!code) {
		res.status(400).json({message: "Code must be specified in request body."});
		return;
	}

	const challengeId = Number.parseInt(req.query.challengeId as string);
	const challengeName = req.query.challengeName as string;
	const userId = Number.parseInt(req.query.userId as string);
	const userName = req.query.userName as string;
	const language = req.query.programmingLanguage as string;

	if (!isSupportedProgrammingLanguage(language)) {
		res.status(400).json({message: "Illegal programming language specified"});
		return;
	}

	if (!challengeId) {
		res.status(400).json({message: "Invalid challenge ID."});
		return;
	}

	if (!userId) {
		res.status(400).json({message: "Invalid user ID."});
		return;
	}

	const submissionId = await evaluateSubmission(code, language, challengeId, challengeName, userId, userName);
	res.status(200).json({
		submissionId: submissionId
	});
});

server.get("/getSubmissionStatus", async (req: express.Request, res: express.Response) => {
	if (typeof req.query.submissionId != "string") {
		res.status(400).json({message: "submissionId was not specified."});
		return;
	}

	const status = await getSubmissionStatus(req.query.submissionId);

	if (status) {
		res.status(200).json({
			status: status
		});
	} else {
		res.status(404).json({
			message: "Submission not found"
		});
	}
});

server.listen(8080)
