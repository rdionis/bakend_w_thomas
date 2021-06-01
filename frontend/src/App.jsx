import "./App.css";
import { useState, useEffect } from "react";
function App() {
  const [users, setUsers] = useState([]);
  //componentDidMount
  useEffect(() => {
    fetch("http://localhost:5000/users")
      .then((res) => res.json())
      .then((res) => {
        console.log("====================================");
        console.log(res);
        console.log("====================================");
        setUsers(res);
      });
  }, []);
  return (
    <div className="App">
      <ul>
        {users.map((user) => (
          <li>{`${user.name} ---- ${user.email}`}</li>
        ))}
      </ul>

      {/* {JSON.stringify(user)} */}
    </div>
  );

  //JSON.stringify will print whatever you want regardless of the data type
}

export default App;