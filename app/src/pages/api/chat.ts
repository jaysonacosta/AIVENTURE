import { Configuration, OpenAIApi, CreateChatCompletionRequest } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async (req, res) => {
  console.log("Incoming request to OpenAI Chat API");
  try {
    const chatCompletion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: req.body.conversation,
    });
    console.log(JSON.stringify(chatCompletion.data.choices[0].message));

    res.status(200).json({
      conversation: [
        ...req.body.conversation,
        chatCompletion.data.choices[0].message,
      ],
    });
  } catch (error) {
    console.log("Error in OpenAI API call");
    console.log(error);
    res.status(500).json({ error: "Error in OpenAI API call" });
  }
};
