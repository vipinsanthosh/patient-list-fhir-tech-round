<script lang="ts">
	import type { Patient } from "fhir/r4";
	import clsx from "clsx";
	import { fhirApi } from "./api";

	let page = 0;
	let searchTerm: string = "";

	const isPhoneNumber = (searchTerm: string) => {
		if (parseInt(searchTerm)) {
			return true;
		}
		return false;
	};

	let timer: NodeJS.Timeout;

	const debounce = (v: EventTarget | null) => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			searchTerm = (v as HTMLInputElement)?.value;
		}, 300);
	};

	const fetchPatients = async (page: number, searchTerm: string) => {
		let searchParams: {
			phone?: string | undefined;
			name?: string | undefined;
		} = {};
		if (searchTerm) {
			if (isPhoneNumber(searchTerm)) {
				searchParams.phone = searchTerm;
			} else {
				searchParams.name = searchTerm;
			}
		}
		console.log({ searchParams });
		const patientResponse = await fhirApi.get("/Patient", {
			params: {
				_sort: "_lastUpdated",
				_count: 20,
				_offset: page * 20, // also called _skip in some servers.
				...searchParams,
			},
		});
		const patients = patientResponse.data;
		return patients;
	};
</script>

<p class="mb-2">
	<a class="p-2 bg-black text-white" href="/patient">Create Patient</a>
</p>
<h1 class="text-2xl font-semibold">Patients on the Server</h1>
<input
	on:keyup={(e) => debounce(e.target)}
	class="w-full border p-2"
	placeholder="Search by name or phone number (exact)"
/>
{#await fetchPatients(page, searchTerm)}
	loading...
{:then patientBundle}
	{#each patientBundle?.entry || [] as patient}
		<p class="py-2 hover:bg-gray-200 px-1 cursor-pointer">
			<a href={`/patient/${patient?.resource?.id}`}>
				{patient?.resource?.name?.[0]?.given?.[0]} - {patient?.resource
					?.gender || ""} - {patient?.resource?.birthDate || ""}
			</a>
		</p>
	{/each}
{/await}
<div class="mt-4">
	<button
		class={clsx("p-2  text-white", {
			"bg-black": page !== 0,
			"bg-gray-300": page === 0,
		})}
		on:click={() => page--}
		disabled={page == 0}>Previous</button
	>
	<button class="p-2 bg-black text-white" on:click={() => page++}>Next</button>
</div>
