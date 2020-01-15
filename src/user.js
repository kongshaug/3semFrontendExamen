import React, { useState, useEffect } from "react";
import facade from "./apiFacade";

function UserApp() {
  const [data, setData] = useState("");
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await facade.fetchData("user");
        setData(data.msg);
        setFetching(true);
      } catch (error) {
        console.log(error);
        alert("UPSSS Not authenticated - do login");
      }
    };
    getData();
  }, []);

  return fetching ? (
    <div>
      <br />
      <h2>{data}</h2>
    </div>
  ) : (
    <div className="spinner">
      <div className="bounce1"></div>
      <div className="bounce2"></div>
      <div className="bounce3"></div>
    </div>
  );
}

export default UserApp;
