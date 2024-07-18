import { toolAction } from "~/utils/toolUtils";
import ConverterTool from "./$lang.convert.$sourceFormat.$targetFormat";
import { ActionFunction } from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
  return toolAction(request);
};

const ConvertPage = ConverterTool;

export default ConvertPage;
