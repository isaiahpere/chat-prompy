import { connectDB } from "@utils/database";
import Prompt from "@models/prompt";

export const GET = async (req, { params }) => {
  try {
    const { id } = params;
    await connectDB();

    const prompts = await Prompt.find({
      creator: id, // mongoId
    }).populate("creator");

    console.log("PROMPTS");
    console.log(prompts);

    return new Response(JSON.stringify(prompts), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify(error), { status: 500 });
  }
};
