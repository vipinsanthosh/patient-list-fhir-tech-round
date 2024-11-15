import axios from 'axios'

export const fhirBaseUrl = 'http://localhost:8080/fhir'

export const fhirApi = axios.create({baseURL: fhirBaseUrl, headers: {
  // https://hapifhir.io/hapi-fhir/docs/server_jpa/configuration.html
  'Cache-Control': 'no-cache'
}},)