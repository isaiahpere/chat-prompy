import { connectDB } from "@utils/database";
import Prompt from "@models/prompt";

// GET
export const GET = async (req, { params }) => {
  try {
    // connect to db
    await connectDB();

    // by prompt by id
    const prompt = await Prompt.findById(params.id);

    // return not found
    if (!prompt) return new Response("Prompt Not Found", { status: 404 });

    // return found prompt
    return new Response(JSON.stringify(prompt));
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify(error), { status: 500 });
  }
};

// PATCH
export const PATCH = async (req, { params }) => {
  // destruct items
  const { prompt, tag } = await req.json();
  try {
    // connect to db
    await connectDB();

    // get collection object
    const existingPrompt = await Prompt.findById(params.id);

    // return not found
    if (!existingPrompt)
      return new Response("Prompt Not Found", { status: 404 });

    // append changes and save
    existingPrompt.prompt = prompt;
    existingPrompt.tag = tag;
    await existingPrompt.save();

    // return updated item
    return new Response(JSON.stringify(existingPrompt), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify(`Failed to update the prompt, ${error}`)
    );
  }
};

// DELETE
export const DELETE = async (req, { params }) => {
  try {
    // connect to db
    await connectDB();

    // delete item
    const deletedItem = await Prompt.findByIdAndRemove(params.id);

    if (!deletedItem) return new Response("Prompt Not Found", { status: 404 });

    return new Response(JSON.stringify(deletedItem), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify(error), { status: 500 });
  }
};
