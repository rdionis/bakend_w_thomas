import "./App.css";
import { useState } from "react";
function App() {
  const [user, setUsers] = useState({});
  fetch("http://localhost:5000/users/5")
    .then((res) => res.json())
    .then((res) => {
      console.log("====================================");
      console.log(res);
      console.log("====================================");
      setUsers(res);
    });
  return <div className="App">{JSON.stringify(user)}</div>;

  //JSON.stringify will print whatever you want regardless of the data type
}

export default App;
