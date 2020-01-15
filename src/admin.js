import React, { useState, useEffect } from "react";
import facade from "./apiFacade";

function AdminApp() {
  const [data, setData] = useState([]);
  const [MoreInfo, setMoreInfo] = useState({});
  const [fetching, setFetching] = useState(false);

  

  const getData = async (endpoint) => {
    try {
      const data = await endpoint;
      setData(data);
      console.log(data)
      setFetching(true);
    } catch (error) {
      console.log(error);
      alert("UPSSS Not authenticated - do login");
    }
  };

  const ShowDetails = () =>{
    return MoreInfo.recipes !== undefined ?(
      <div>
      <h3>Alle de vare du skal bruge til at lave retten:</h3>
    <p>{MoreInfo.recipes.map(recipe => recipe.ingredients.map(ingridient =>ingridient.itemName).join(", ") ).join(", ")}</p>
    </div>
    ) : (
    <p>vælg en opskrift</p>
    )
    
  }

  const RecipeRow = ({ plan,  }) => {
    return (
      <tr>
        <td> {plan.week} </td>
    <td> {plan.year}</td>
    <td> {plan.recipes.map(rec => rec.name).join(", ")}</td>
        <td> <button onClick={()=>{setMoreInfo(plan); console.log(MoreInfo)}}>Vælg</button> </td>
      </tr>
    );
  };

  const tableItems = data.map((plan, index) => (
    <RecipeRow key={index} plan={plan} />
  ));

  useEffect(() => {
    
    getData(facade.allWeekDayPlans());
  }, []);

  return fetching ? (
    <div>
      <table id="table">
        <thead>
          <tr>
            <th>Week</th>
            <th>Year</th>
            <th>opskrifter</th>
            <th>Vælg til ugeplan</th>
          </tr>
        </thead>
       <tbody>{tableItems}</tbody>
      </table>
      <ShowDetails/>
    </div>
  ) : (
    <div className="spinner">
      <div className="bounce1"></div>
      <div className="bounce2"></div>
      <div className="bounce3"></div>
    </div>
  );
}

export default AdminApp;
