<script lang="ts">
	import { Router, Link, Route } from "svelte-routing";
	import PatientList from "./PatientList.svelte";
</script>

<Router>
	<main>
		<div class="max-w-md mx-auto my-10">
			<Route path="/">
				<PatientList></PatientList>
			</Route>
			<Route path="/patient">
				<PatientForm></PatientForm>
			</Route>
			<Route path="/patient/:id" component={PatientForm}></Route>
		</div>
	</main>
</Router>
