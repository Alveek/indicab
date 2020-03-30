<script>
  export let auth;
  export let operator;
  export let uid;
</script>

<header>
	<div class="logo">
		Indigo Cabinet
	</div>

  {#if operator}
  <div class="logout-btn" on:click={(e)=> {
    auth.signOut().then(() => {
    console.log('user signed out');
  })
  }}><i class="fas fa-sign-out-alt"></i></div>
  {/if}

</header>
    {#if uid === 'W28k7LFQkaRq7W1u02mxCmCt9Uv2'}
		<p class="alert">В гостевом режиме редактирование недоступно.</p>
		{/if}

<style>
  header {
    padding: 0 30px;
    height: 60px;
    /* background: #303f9f; */
    background: linear-gradient(to right, #3b309f, #303f9f);
    display: grid;
    grid-template-columns: repeat(2, max-content);
    align-content: center;
    justify-content: space-between;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
  .logo {
    color: white;
    text-transform: uppercase;
    /* margin-left: 30px; */
    font-size: 24px;
    font-weight: bold;
  }

  .logout-btn {
    align-self: center;
    text-decoration: none;
    text-transform: uppercase;
    color: #fff;
    cursor: pointer;
  }

  .alert {
    color: red;
    margin-left: 40%;
    margin-bottom: 0px;
  }

  @media (max-width: 400px) {
    header {
      width: 100%;
    }

    .alert {
      display: none;
    }
  }
</style>