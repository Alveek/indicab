<!--
<script>
	import { auth } from "./firebase.js";
	import SupplyList from "./components/SupplyList.svelte";
	import OrderInfo from "./components/OrderInfo.svelte";
	import Header from "./components/Header.svelte";
	import Stats from "./components/Stats.svelte";
	import LoginPage from "./components/LoginPage.svelte";

	let operator;
	let uid;

	$: auth.onAuthStateChanged(user => {
	  operator = user;
	  user ? (uid = user.uid) : "";
	});
</script>



{#await operator, uid}
<p>loading...</p>
	{:then operator}
	{#if operator}
	<div class="container">
		<div class="header">
		<Header {auth} {uid} {operator}/>
	</div>

		<div class="orderinfo">
			<OrderInfo />
		</div>
	</div>

	{:else}
		<LoginPage />
	{/if}

	{:catch}
<p>oops</p>
{/await}



<style>
		
		.orderinfo {
			margin-top: 20px;
		}

		.header {
		  grid-column: 1/-1;
		}

		@media (max-width: 400px) {
		  .container {
		    display: grid;
		    grid-template-columns: 300px;
		    grid-gap: 20px;
		    /* width: 100%; */
		    margin: 0;
		  }

		  .header {
		    grid-row: 1;
		  }

		  .orderinfo {
		    grid-row: 2;
		    margin-left: 20px;
		  }

		
		}
</style>
-->
