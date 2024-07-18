import { Honeypot } from "remix-utils/honeypot/server";
import { generateSeed } from "./utils/generateSeed.server";

// Create a new Honeypot instance, the values here are the defaults, you can

const criptoSeed = generateSeed()
const seed = `${process.env.HONEYPOT_SEED}-${criptoSeed}-Besis`;

if (!process.env.HONEYPOT_SEED) {
	console.warn("HONEYPOT_SEED not found in environment. Using generated seed.");
  }

// customize them
export const honeypot = new Honeypot({
	randomizeNameFieldName: false,
	nameFieldName: "document__name",
	validFromFieldName: "document__type", // null to disable it
	encryptionSeed: seed,
});
