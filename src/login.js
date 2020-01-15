import React, { useState } from "react";
import facade from "./apiFacade";

function LogIn({ login }) {
  const init = { username: "", password: "" };
  const [loginCredentials, setLoginCredentials] = useState(init);

  const performLogin = evt => {
    evt.preventDefault();
    login(loginCredentials.username, loginCredentials.password);
  };
  const onChange = evt => {
    setLoginCredentials({
      ...loginCredentials,
      [evt.target.id]: evt.target.value
    });
  };

  return (
    <div>
      <h2>Login</h2>
      <form onChange={onChange}>
        <input placeholder="User Name" id="username" />
        <br />
        <br />
        <input placeholder="Password" id="password" type="password" />
        <br />
        <br />
        <button onClick={performLogin}>Login</button>
      </form>
    </div>
  );
}
function LoggedIn() {
  return (
    <div>
      <br />
      <h2>You are now logged in!</h2>
    </div>
  );
}

function LoginApp({ loggedIn, setLoggedIn }) {
  const login = (user, pass) => {
    facade.login(user, pass).then(res => setLoggedIn(true));
  };

  return (
    <div>
      {!loggedIn ? (
        <LogIn login={login} />
      ) : (
        <div>
          <LoggedIn />
        </div>
      )}
    </div>
  );
}
export default LoginApp;
