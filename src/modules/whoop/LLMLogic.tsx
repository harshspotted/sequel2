import OpenAI from "openai";
import Groq from "groq-sdk";
import { MessageType } from "../../helpers/types/message.types";
import {
	getSelectedAIConfiguration,
	getAIKey,
	getAssistantId,
	getThreadId,
	storeThreadId,
	storeAssistantId,
	getFiles,
	getJournalData,
	getOrgans,
} from "../../helpers/storage";

class EventEmitter extends EventTarget {
	emit(eventName: string, detail?: any) {
		this.dispatchEvent(new CustomEvent(eventName, { detail }));
	}

	on(eventName: string, listener: EventListener) {
		this.addEventListener(eventName, listener);
	}

	off(eventName: string, listener: EventListener) {
		this.removeEventListener(eventName, listener);
	}
}

export const ChatEmitter = new EventEmitter();

const assistantInstruction = `
  You are Chat PA, a virtual assistant specialized in PDF analysis, health analysis and data tracking. 
  Your capabilities include reading texts, monitoring and analyzing health data from big stringified JSONs. You assist in extracting and interpreting data from all the available sources, providing insights, and offering advice based on the information contained within these documents. 
  Aim to generate the most accurate answers possible. If detailed analysis takes considerable time, provide a concise overview instead. For requests demanding succinct answers only, prioritize accuracy and take the necessary time to compute those answers.
  Use the context provided in other messages to give the most accurrate response.
  Your responses should be as precise and clear as possible, unless instructed otherwise.`;

async function makeWhoopMessages(
	openai: OpenAI,
	content: string,
	threadId: string
): Promise<void> {
	if (content) {
		const parsedContext = JSON.parse(content);

		if (!parsedContext) return;
		const whoopData = parsedContext.whoop;
		const workoutData = whoopData?.workoutData;
		const sleepData = whoopData?.sleep;
		const recoveryData = whoopData?.recoveryData;

		if (workoutData) {
			console.log("Making Workout Messages");
			await openai.beta.threads.messages.create(threadId, {
				role: "user",
				content: `Here's my workout data. Use it to analyze patterns and give overviews ${JSON.stringify(
					workoutData
				)}`,
			});
		}

		if (sleepData) {
			await openai.beta.threads.messages.create(threadId, {
				role: "user",
				content: `Here's my sleep data. Use it to analyze patterns and give overviews ${JSON.stringify(
					sleepData
				)}`,
			});
		}

		if (recoveryData) {
			await openai.beta.threads.messages.create(threadId, {
				role: "user",
				content: `Here's my recovery data. Use it to analyze patterns and give overviews ${JSON.stringify(
					recoveryData
				)}`,
			});
		}
	}
}

async function makeJournalMessages(
	openai: OpenAI,
	content: string,
	threadId: string
): Promise<void> {
	if (content) {
		const parsedContext = JSON.parse(content);

		if (!parsedContext) return;
		const journalData = parsedContext.journal;

		if (journalData && !!journalData.length) {
			await openai.beta.threads.messages.create(threadId, {
				role: "user",
				content: `Here's my journal data. Use it to analyze patterns and give overviews ${JSON.stringify(
					journalData
				)}`,
			});
		}
	}
}

async function makeFilesMessages(
	openai: OpenAI,
	content: string,
	threadId: string
): Promise<void> {
	if (content) {
		const parsedContext = JSON.parse(content);

		if (!parsedContext) return;
		const filesData = parsedContext.files;

		if (filesData && !!filesData.length) {
			const messageCreationPromises = filesData.map(
				async (file: { name: string; content: string; createdDate: number }) => {
					return openai.beta.threads.messages.create(threadId, {
						role: "user",
						content: `Here's my ${
							file.name
						} data. Use it to analyze patterns and give overviews ${JSON.stringify(
							file.content
						)}`,
					});
				}
			);
			await Promise.all(messageCreationPromises);
		}
	}
}

async function makeTestsMessage(
	openai: OpenAI,
	content: string,
	threadId: string
): Promise<void> {
	if (content) {
		const parsedContext = JSON.parse(content);

		if (!parsedContext) return;
		const testsData = parsedContext.tests;

		if (testsData && !!testsData.length) {
			await openai.beta.threads.messages.create(threadId, {
				role: "user",
				content: `Here's my tests data, use this context to make your answers ${JSON.stringify(
					testsData
				)}`,
			});
		}
	}
}

async function makeSupplementsMessage(
	openai: OpenAI,
	content: string,
	threadId: string
): Promise<void> {
	if (content) {
		const parsedContext = JSON.parse(content);

		if (!parsedContext) return;
		const testsData = parsedContext.supplements;

		if (testsData && !!testsData.length) {
			await openai.beta.threads.messages.create(threadId, {
				role: "user",
				content: `Here's my supplements data, use this context to make your answers ${JSON.stringify(
					testsData
				)}`,
			});
		}
	}
}

async function makeTherapiesMessage(
	openai: OpenAI,
	content: string,
	threadId: string
): Promise<void> {
	if (content) {
		const parsedContext = JSON.parse(content);

		if (!parsedContext) return;
		const testsData = parsedContext.therapies;

		if (testsData && !!testsData.length) {
			await openai.beta.threads.messages.create(threadId, {
				role: "user",
				content: `Here's my therapies data, use this context to make your answers ${JSON.stringify(
					testsData
				)}`,
			});
		}
	}
}

async function getOrCreateThread(openai: OpenAI): Promise<string> {
	let threadId = getThreadId();
	if (!threadId) {
		const thread = await openai.beta.threads.create();
		threadId = thread.id;
		storeThreadId(threadId);
	}
	return threadId;
}

async function getOrCreateAssistant(openai: OpenAI): Promise<string> {
	let assistantId = getAssistantId();
	if (!assistantId) {
		const assistantInstruction = `
    You are Chat PA, a virtual assistant specialized in PDF analysis, health analysis and data tracking. 
    Your capabilities include reading texts, monitoring and analyzing health data from big stringified JSONs. You assist in extracting and interpreting data from all the available sources, providing insights, and offering advice based on the information contained within these documents. 
    Aim to generate the most accurate answers possible. If detailed analysis takes considerable time, provide a concise overview instead. For requests demanding succinct answers only, prioritize accuracy and take the necessary time to compute those answers.
    Use the context provided in other messages to give the most accurrate response.
    Your responses should be as precise and clear as possible, unless instructed otherwise.`;

		const assistant = await openai.beta.assistants.create({
			name: `Chat Assistant`,
			instructions: assistantInstruction,
			tools: [{ type: "code_interpreter" }],
			model: "gpt-3.5-turbo",
		});
		assistantId = assistant.id;
		storeAssistantId(assistantId);
	}
	return assistantId;
}

const extraPrompDetails = `You are health assistant, a virtual assistant specialized in health data analysis.
You assist in answering health-related questions, providing insights, and offering advice based on the health data available in the files, data & journal.
Though you do not provide medical diagnoses, you also DO NOT give generic advice. You should provide the most accurate, specific answers possible.

Reply to the user's question thoughtfully, and make sure you answer in full.`;

export async function getAnswer(
	question: string,
	content: string
): Promise<MessageType> {
	const prompt = `
    ${extraPrompDetails}

    Question:
    ${question}
`;

	const selectedAIConfiguration = getSelectedAIConfiguration();
	let response: MessageType = { message: "", isSent: false };
	if (selectedAIConfiguration === "sequelsOpenAI") {
		const AIKey = getAIKey();
		if (AIKey !== "") {
			const openai = new OpenAI({
				apiKey: AIKey,
				dangerouslyAllowBrowser: true,
			});

			const assistantId = await getOrCreateAssistant(openai);
			const threadId = await getOrCreateThread(openai);

			try {
				const parsedContent = JSON.parse(content);
				if (!parsedContent) {
					throw new Error("No parsed content");
				}
				if (parsedContent.whoop) {
					await makeWhoopMessages(openai, content, threadId);
				}
				if (parsedContent.journal) {
					await makeJournalMessages(openai, content, threadId);
				}
				if (parsedContent.files) {
					await makeFilesMessages(openai, content, threadId);
				}
				if (parsedContent.supplements) {
					await makeSupplementsMessage(openai, content, threadId);
				}
				if (parsedContent.tests) {
					await makeTestsMessage(openai, content, threadId);
				}
				if (parsedContent.therapies) {
					await makeTherapiesMessage(openai, content, threadId);
				}
			} catch (e) {
				console.error(e);
				throw new Error();
			}

			await openai.beta.threads.messages.create(threadId, {
				role: "user",
				content: prompt,
			});

			const streamPromise = new Promise<MessageType>((resolve, reject) => {
				openai.beta.threads.runs
					.createAndStream(threadId, {
						assistant_id: assistantId,
					})
					.on("textDelta", (textDelta) =>
						ChatEmitter.emit("updateMessage", textDelta.value)
					)
					.on("messageDone", (message) => {
						ChatEmitter.emit("finishedMessage");
						// @ts-ignore
						resolve({ message: message.content[0].text.value, isSent: false });
					})
					.on("error", () => {
						reject({
							message: "Error occurred during streaming.",
							isSent: false,
						});
						throw new Error();
					});
			});

			response = await streamPromise;
		} else {
			response = { message: "AI Key is missing!", isSent: false };
		}
	} else {
		const AIKey = getAIKey();
		if (AIKey !== "") {
			const model =
				selectedAIConfiguration === "groqLlama"
					? "llama3-70b-8192"
					: "mixtral-8x7b-32768";
			const groq = new Groq({
				apiKey: AIKey,
				dangerouslyAllowBrowser: true,
			});
			const stream = await groq.chat.completions
				.create({
					messages: [
						{
							role: "assistant",
							content: assistantInstruction,
						},
						{
							role: "assistant",
							content: `Here's all the content you'll need for giving the user a good response. All the data in whoop key is 
              related to health, in files key is about user files, in journal key is about the user journal, 
              in tests key is about the tests recommended by us and user info, therapies key is also therapies recommended and user info, supplements keys
              is also supplements recommended and user info ${content}`,
						},
						{
							role: "system",
							content: extraPrompDetails,
						},
						{
							role: "user",
							content: prompt,
						},
					],
					model: model,
					temperature: 0.5,
					top_p: 1,
					stop: null,
					stream: true,
				})
				.catch((e) => {
					console.error(e);
					throw new Error();
				});
			let finalMessage = "";
			for await (const chunk of stream) {
				ChatEmitter.emit("updateMessage", chunk.choices[0]?.delta?.content || "");
				finalMessage += chunk.choices[0]?.delta?.content || "";
			}
			ChatEmitter.emit("finishedMessage");
			return { message: finalMessage, isSent: false };
		} else {
			response = { message: "AI Key is missing!", isSent: false };
		}
	}
	return response;
}

export async function removeExistingThread() {
	storeThreadId("");
	storeAssistantId("");
}

export async function getOrganHealthAssessment() {
	const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

	if (!API_KEY) {
		throw new Error("OpenAI API key is required for this feature.");
	}

	try {
		let files, journal, organs;
		try {
			files = getFiles();
		} catch (e) {
			console.error(e);
		}

		try {
			journal = getJournalData();
		} catch (e) {
			console.error(e);
		}

		try {
			organs = getOrgans();
		} catch (e) {
			console.error(e);
		}

		const prompt = `
	
You are a health assitant GPT. You review files & journals associated with a users health and return the score, & reason, for their internal organs.
Specifically, you read their labs, & journals, and try to understand what is happening to their internal organs. You are given a list of orgamns that you need to return the status and reason for status for.

You have access to the following data:


============= Files: ==============
${JSON.stringify(files).slice(0, 270_000)}



============= Journal: =============
${JSON.stringify(journal).slice(0, 50_000)}


============= Existing Organs Data: =============
${JSON.stringify(organs, null, 2)}

==================================

You will return a JSON in the following format:

type Status: "Unhealthy" | "Moderate" | "Healthy" | "Unsure"
{
	"heart" : {
		"status": Status,
		"reason": "",
	},
	"brain": {
		"status": Status,
		"reason": "",
	},
	"lung": {
		"status": Status,
		"reason": "",

	},
	"gastrointestinal_tract": {
		"status": Status,
		"reason": "",
	},
	"joints": {
		"status": Status,
		"reason": "",

	},
	"hair": {
		"status": Status,
		"reason": "",
	},
	"skin": {
		"status": Status,
		"reason": "",
	},
	"eye": {
		"status": Status,
		"reason": "",
	},
	"ear": {
		"status": Status,
		"reason": "",
	},
	"oral": {
		"status": Status,
		"reason": "",
	}
}


Remoember to return a JSON with all the organs & their status & reason filled it, without FAIL.
If you believe that there is limited data to gather about for an organ, you can return "Unsure" for that organ; however, this should be very unlikely & it almost impossible that there is no indication of the status & reason for an organ.
You have to infer the status & reason for an organ, it will obviously never be explicity mentioned. You have to infer it.
Return the filled in object below:
`;

		const response = await fetch("https://api.openai.com/v1/chat/completions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${API_KEY}`,
			},
			body: JSON.stringify({
				model: "gpt-3.5-turbo",
				messages: [
					{
						role: "user",
						content: prompt,
					},
				],
				response_format: {
					type: "json_object",
				},
			}),
		});

		const data = await response.json();
		const json = data.choices[0].message.content;
		const jsonObject = JSON.parse(json);

		return jsonObject;
	} catch (err) {
		console.log(err);
		return [];
	}
}

export async function getInsightsData(moduleName: string, newData: any) {
	try {
		const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

		if (!API_KEY) {
			throw new Error("OpenAI API key is required for this feature.");
		}

		const prompt = `
For your next message I want you to follow this strict instruction: 
Use the data available about ${moduleName} and provide me a few insights about it, return only the insights WITHOUT any other comments"

Data: ${newData}

Only return the insights, do not return any other text.
`;
		const response = await fetch("https://api.openai.com/v1/chat/completions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${API_KEY}`,
			},
			body: JSON.stringify({
				model: "gpt-3.5-turbo",
				messages: [
					{
						role: "user",
						content: prompt,
					},
				],
			}),
		});

		const data = await response.json();
		const json = data.choices[0].message.content;
		return json;
	} catch (err) {
		console.log(err);
		return null;
	}
}
