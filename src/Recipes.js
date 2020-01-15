import React, { useEffect, useState } from "react";
import facade from "./apiFacade";
import "./App.css";
const RecipeRow = ({ recipe, pickRecipe }) => {
  return (
    <tr>
      <td> {recipe.name} </td>
      <td> {recipe.preparationTime} timer</td>
      <td> {recipe.directions} </td>
      <td> <button id ={recipe.name} onClick={()=>pickRecipe(recipe)}>Vælg</button> </td>
    </tr>
  );
};

export default function Menu() {
  const [recipes, setRecipes] = useState([]);
  const [safedrecipes, setSafedRecipes] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [WeekPlan, setWeekPlan] = useState([]);
  
  const getQuote = async () => {
    try {
      const data = await facade.fetchRecipes();
      setRecipes(data);
      setSafedRecipes(data);
      setFetching(true);
    } catch (error) {
      alert("UPSSS " + error);
    }
  };

  useEffect(() => {
    
    getQuote();
  }, []);

const pickRecipe = (recipe) =>{
// name of recipe
 const name = recipe.name; 

 // returns the status of stock and checks if there is to more then 7 items in the week plan
 const CheckStock = async recipeName => {
  try {
    await recipeName;
    console.log(recipeName)
    const data = await facade.GetStorageForRecipe(recipeName);
console.log(data)

    if (WeekPlan.length >= 7)
 {
   alert("hver uge indeholder kun 7 retter ikke flere. " + name + " blev ikke tilføjet")
 }

 else{

 // if all the ingredience in a recipe is in stock
 if(data.msg === "true"){

 setWeekPlan([...WeekPlan, recipe.name])

 }

 else if (window.confirm("Der er ikke nok " + data.msg + " på lager, vil du stadig tilføje opskriften til ugeplanen?")) {
     
    setWeekPlan([...WeekPlan, recipe.name])
} 
 }


  } catch (error) {
    alert("UPSSS " + error);
  }
};

CheckStock(name);

 
}


  const filterReciepes = () =>{
    const name = document.getElementById("search").value;
    const filteredList = safedrecipes.filter(recipe => recipe.name == name);
    if(filteredList.length > 0)
    {
      setRecipes(filteredList)
    }
    else 
    {

      const filteredList = safedrecipes.filter(recipe => recipe.ingredients.map(ingredient => ingredient.itemName).includes(name));
      if(filteredList.length > 0)
      {
        setRecipes(filteredList)
      }
      else{
        alert("der er ingen opskrifter der passer på: " +name)
      }
    }




   
  }

  const tableItems = recipes.map((recipe, index) => (
    <RecipeRow key={index} recipe={recipe} pickRecipe = {pickRecipe}/>
  ));

  const RecipeTable = () => {
    return fetching ? (
      <table id="table">
        <thead>
          <tr>
            <th>Navn</th>
            <th>Forberedelse</th>
            <th>Instruktioner</th>
            <th>Vælg til ugeplan</th>
          </tr>
        </thead>
        <tbody>{tableItems}</tbody>
      </table>
    ) : (
      <div className="spinner">
        <div className="bounce1"></div>
        <div className="bounce2"></div>
        <div className="bounce3"></div>
      </div>
    );
  };

  const WeekPlanListElement = ({WeekPlan}) =>
  {
    const names =  WeekPlan.map(recipe => recipe).join(", ");
    return(
      <ul>
        <li>
          <h3>
    {names}
    </h3>
     </li>
   
      </ul> 
    );
  }

  
  const WeekPlanList = () => {
    return WeekPlan.length !== 0 ? (
      <div>
        <h3>Ugeplanen:</h3>
    <WeekPlanListElement
    WeekPlan = {WeekPlan}
    />
     </div>
    ) : (
      <h3>vælg opskrifter for at lave en ugeplan</h3>
    );
  };

const SafeWeekPlan = () =>{
 
  const safeToDb = async () =>{
    const year = document.getElementById("year").value;
    const week = document.getElementById("week").value;
    

    const data = await facade.safeWeekPlanInDb([...WeekPlan, week, year]);
    alert(data.msg);
    setWeekPlan([]);
    
  }

  return WeekPlan.length >= 7 ? (
    <div>
     
      
    
    <input id="year" placeholder="skriv årstal"></input>
    <br/>  <br/>
    <input id="week" placeholder="skriv ugetal"></input>
    <br/>  <br/>
    <button onClick={safeToDb} >gem ugeplanen</button>
   </div>
  ) : (
<p>Du skal tilføje {7 - WeekPlan.length} opskrifter for at kunne gemme en ugeplan</p>
  );
}

  return (
    <div>
      <br></br>
      <br></br>
      <h2>Opskrifter</h2>
      <br></br>
      <h4>søg efter Opskrifter efter navn eller ingredienser </h4>
      <p>prøv f.eks. banan brød, banan eller mørkchokolade </p>
      <br></br>
    <input placeholder="Navn på opskrift" id="search"></input>
    <br></br>
    <button onClick={filterReciepes}>søg</button>
    <br></br>
    <br></br>
    <button onClick={() => {setRecipes(safedrecipes)}}>hent alle opskrifter</button>
      <br></br><br></br>
      <RecipeTable />
      <br></br>
      <br></br>
      <br></br>
      <WeekPlanList />
      <br></br>
      <br></br>
      <SafeWeekPlan/>
      <br></br>
    </div>
  );
}
