import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async (req, res) => {
  console.log("Incoming request to OpenAI Dalle API");

  const response = await openai.createImage({
    prompt: req.body.prompt,
    n: 1,
    size: "256x256",
  });

  response.status(200).json({ url: response.data.data[0].url });
};
