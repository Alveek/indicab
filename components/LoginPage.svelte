<script>
  import { auth } from "../firebase.js";
  let email;
  let password = "guest00";
  let showPswInput = false;

  let error = false;

  function logIn() {
    auth.signInWithEmailAndPassword(email, password).catch(err => (error = true));
  }

  function setPsw() {
    if (email === "operator@indigo.ru") {
      password = "";
      showPswInput = true;
    } else {
      password = "guest00";
      showPswInput = false;
    }
  }
</script>

<div class="container">

	<form on:submit|preventDefault = {logIn} id="login-form">
  <h2>Indigo Cabinet</h2>
		<!-- <div class="input-field">
			<label for="login-email">Email address</label>
			<input class="form-control" type="email" id="login-email" required autocomplete="off" bind:value={email} />
		</div> -->
    <div class="input-field">
      <label for="login-user">Войти как: </label>
      <select on:change={(e)=> {
        email = e.target.value;
        setPsw()
        }} id="login-user" bind:value={email}>
        <option value="guest@indigo.ru">Гость</option>
        <option value="operator@indigo.ru">Оператор</option>
      </select>
    </div>
    {#if showPswInput === true}
		<div class="input-field">
			<label for="login-password">Введите пароль:</label>
			<input class="form-control" type="password" id="login-password" required autocomplete="off" bind:value={password}/>
		</div>
    {/if}
		<button class="btn info">Войти</button>
    {#if error}
    <p style="color: red">Неверный пароль</p>
    {/if}
	</form>
</div>


<style>
  .container {
    display: grid;
    place-content: center;
    height: calc(100vh - 60px);
  }

  form {
    /* border: 1px solid #ddd; */
    box-shadow: 1px 2px 5px rgba(0, 0, 0, 0.1);
    border-radius: 3px;
    background: #fff;
    padding: 30px 40px;
  }

  label {
    display: block;
    font-size: 18px;
    margin-bottom: 10px;
  }

  select {
    width: 100%;
    height: 30px;
    margin-bottom: 14px;
  }

  input {
    width: calc(100% - 4px);
    height: 24px;
    margin-bottom: 10px;
    padding-left: 6px;
  }

  button {
    width: 100%;
    /* height: 30px; */
  }

  h2 {
    text-align: center;
    margin-top: 0;
    margin-bottom: 30px;
  }
</style>