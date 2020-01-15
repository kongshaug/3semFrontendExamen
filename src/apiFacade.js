import URL from "./Settings";

const url = URL; //CHANGE WHEN PUT UP

function handleHttpErrors(res) {
  if (!res.ok) {
    return Promise.reject({ status: res.status, fullError: res.json() });
  }
  return res.json();
}

function apiFacade() {
  /* Insert utility-methods from a latter step (d) here (REMEMBER to uncomment in the returned object when you do)*/

  const setToken = token => {
    localStorage.setItem("jwtToken", token);
  };
  const getToken = () => {
    return localStorage.getItem("jwtToken");
  };
  const loggedIn = () => {
    const loggedIn = getToken() != null;
    return loggedIn;
  };
  const logout = () => {
    localStorage.removeItem("jwtToken");
  };

  const getTokenInfo = () => {
    let jwt = localStorage.getItem("jwtToken");
    let jwtData = jwt.split(".")[1];
    let decodedJwtJsonData = window.atob(jwtData);
    let decodedJwtData = JSON.parse(decodedJwtJsonData);
    return decodedJwtData;
  };

  const login = (user, password) => {
    const options = makeOptions("POST", true, {
      username: user,
      password: password
    });
    return fetch(url + "/api/login", options)
      .then(handleHttpErrors)
      .then(res => {
        setToken(res.token);
      });
  };
  const fetchData = role => {
    const options = makeOptions("GET", true); //True add's the token
    return fetch(url + "/api/info/" + role, options).then(handleHttpErrors);
  };
  const makeOptions = (method, addToken, body) => {
    var opts = {
      method: method,
      headers: {
        "Content-type": "application/json",
        Accept: "application/json"
      }
    };
    if (addToken && loggedIn()) {
      opts.headers["x-access-token"] = getToken();
    }
    if (body) {
      opts.body = JSON.stringify(body);
    }
    return opts;
  };

  async function getQuotes() {
    const data = await fetch(url + "/api/quotes/").then(handleHttpErrors);
    return data;
  }

  const fetchRecipes = () => {
    const options = makeOptions("GET", true); 
    return fetch(url + "/api/info/allRecipes", options).then(handleHttpErrors);
  };

  const GetStorageForRecipe = (receieName) => {
    const options = makeOptions("GET", true); 
    return fetch(url + "/api/info/storecheck/" + receieName, options).then(handleHttpErrors);
  };
  const safeWeekPlanInDb = (planList) => {
    const options = makeOptions("POST", true, planList); 
    return fetch(url + "/api/info/addWeekplan", options).then(handleHttpErrors);
  };
  
  const allWeekDayPlans = () => {
    const options = makeOptions("GET", true); 
    return fetch(url + "/api/info/allWeekDayPlans", options).then(handleHttpErrors);
  };
  

  return {
    makeOptions,
    setToken,
    getToken,
    loggedIn,
    login,
    logout,
    fetchData,
    getTokenInfo,
    getQuotes,
    fetchRecipes,
    GetStorageForRecipe,
    safeWeekPlanInDb,
    allWeekDayPlans
  };
}
const facade = apiFacade();
export default facade;
