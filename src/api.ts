import axios from "axios";

export const fhirBaseUrl = "REPLACE_WITH_YOUR_FHIR_SERVER_URL";

export const fhirApi = axios.create({
	baseURL: fhirBaseUrl,
	headers: {
		"Cache-Control": "no-cache",
	},
});
