import axios from "axios";
import { fhirBaseUrl } from "./env";

export const fhirApi = axios.create({
	baseURL: fhirBaseUrl,
	headers: {
		"Cache-Control": "no-cache",
	},
});
