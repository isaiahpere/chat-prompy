import { connectDB } from "@utils/database";
import Prompt from "@models/prompt";

export const POST = async (req, res) => {
  const { userId, prompt, tag } = await req.json();

  try {
    await connectDB();
    // create new prompt
    const newPrompt = new Prompt({
      creator: userId,
      prompt: prompt,
      tag,
    });
    await newPrompt.save();

    return new Response(JSON.stringify(newPrompt), {
      status: 201,
    });
  } catch (error) {
    // return error
    return new Response(JSON.stringify(error), {
      status: 500,
    });
  }
};
