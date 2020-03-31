<script>
  export let auth;
  export let operator;
  export let uid;

  function reloadPage() {
    window.location.reload();
  }
</script>

<header>
	<div class="logo">
		Indigo Cabinet
	</div>


  {#if operator}
  <div>
  <a class="manual-link" target="_blank" href="https://www.notion.so/IndiCab-1f799538c5104de6beec538c3c58f875">Руководство</a>  
  <div class="logout-btn" on:click={(e)=> {
    auth.signOut().then(() => {
    reloadPage();
    console.log('user signed out');
  })
     
  }}>
  <i class="fas fa-sign-out-alt"></i></div>
  
  </div>
  {/if}

</header>
    {#if uid === 'W28k7LFQkaRq7W1u02mxCmCt9Uv2'}
		<p class="alert">В гостевом режиме редактирование недоступно.</p>
		{/if}

<style>
  header {
    padding: 0 30px;
    height: 60px;
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
    font-size: 24px;
    font-weight: bold;
  }

  .logout-btn {
    align-self: center;
    text-decoration: none;
    text-transform: uppercase;
    color: #fff;
    cursor: pointer;
    display: inline-block;
  }

  .alert {
    color: red;
    margin-left: 40%;
    margin-bottom: 0px;
  }

  .manual-link {
    color: white;
    text-decoration: none;
    justify-self: end;
    align-self: center;
    margin-right: 40px;
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
