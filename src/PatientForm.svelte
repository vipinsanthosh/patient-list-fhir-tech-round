<script lang="ts">
  import type { Patient } from "fhir/r4";
  import { fhirApi } from "./api";
  import { navigate } from "svelte-routing";

  export let id: string = ''

  const dateToday = new Date().toISOString().split("T")[0];

  let message: any | undefined = undefined
  let loading = false
  let patientResource: Patient

  let patientLoading = false

  const handleSubmit = async (e: SubmitEvent)=>{
    loading = true
    e.preventDefault();
    let fhirResource: Patient = {
      resourceType: "Patient"
    }
    fhirResource.name = [{
      "given":  firstName ? [firstName] : undefined,
      "family": lastName
    }]
    fhirResource.birthDate = birtDate
    if (phoneNumber) {
      fhirResource.telecom = [{
        system: "phone",
        value: phoneNumber
      }]
    }
    if (gender) {
      fhirResource.gender = gender
    }
    try {
      if (id) {
        await updatePatient(id, fhirResource, patientResource)
      } else {
        await createPatient(fhirResource)
      }
      navigate('/')
    } catch (e: any) {
      message = e?.response?.data
    }
    loading = false;
  }

  const createPatient = async (resource: Patient): Promise<any> => {
    const response = await fhirApi.post('/Patient', resource)
    return response.data
  }

  const updatePatient = async (id: string, resource: Patient, oldResource: Patient): Promise<any> => {
    const response = await fhirApi.put(`/Patient/${id}`, {...oldResource, ...resource})
    return response.data
  }

  const loadPatient = async (id: string) => {
    const patientResponse = await fhirApi.get<Patient>(`/Patient/${id}`)
    const patientResource = patientResponse.data
    console.log({patientResource})
    const name = patientResource.name?.[0]
    firstName = name?.given?.[0]
    lastName = name?.family
    
    if (patientResource.birthDate) {
      birtDate = patientResource.birthDate
    }

    if (patientResource.gender) {
      gender = patientResource.gender
    }
    const phoneContactPoint = patientResource.telecom?.find(a=>a.system == 'phone')
    if (phoneContactPoint) {
      phoneNumber = phoneContactPoint.value
    }
    return patientResource
  }

  let firstName: string | undefined
  let lastName: string | undefined
  let birtDate: string
  let phoneNumber: string | undefined
  let gender: "other" | "male" | "female" | "unknown" | undefined = undefined

  $: if (id) {
    patientLoading = true
    loadPatient(id).then(resource=>{
      patientResource = resource
      patientLoading = false
    })
  }

</script>

<h1 class="text-2xl font-semibold mb-10">
{#if id}
  Updating Patient {id}
{:else}
  Create Patient
{/if}
</h1>
{#if patientLoading}
  Loading...
{:else}
<form class="space-y-3" on:submit={e=>handleSubmit(e)}>
  <div>
    <label for="first_name" class="font-semibold block" >First Name</label>
    <input bind:value={firstName} id="first_name" name="first_name" class="border p-2 w-full" required/>
  </div>
  <div>
    <label for="last_name" class="font-semibold block">Last Name</label>
    <input bind:value={lastName} class="border p-2 w-full  " id="last_name" />
  </div>
  <div>
    <label for="gender" class="font-semibold block">Gender</label>
    <select bind:value={gender} id="gender" class="border p-2 w-full" required>
      <option value={undefined} disabled>Please select...</option>
      <option value="male">Male</option>
      <option value="female">Female</option>
      <option value="other">Other</option>
    </select>
  </div>
  <div>
    <label for="dob" class="font-semibold block">Date of Birth</label>
    <input bind:value={birtDate} class="border p-2 w-full" id="dob" type="date" max={dateToday} required/>
  </div>
  <div>
    <label for="phone" class="font-semibold block">Phone Number</label>
    <input bind:value={phoneNumber} class="border p-2 w-full" id="phone" required/>
  </div>
  <div>
    <button class="p-2 bg-black text-white">{#if loading}
      Loading...
      {:else if id}
      Update
      {:else}
      Create
    {/if}</button>
  </div>
</form>
{/if}


{#if message}
<pre>
  Status:
  {JSON.stringify(message)}
</pre>
{/if}
