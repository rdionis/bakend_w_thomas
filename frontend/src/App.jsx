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
  console.log("====================================");
  console.log(users);
  console.log("====================================");
  return (
    <div className="App">
      <ul>
        {users.map((user) => (
          <li style={{ color: user.liked ? "red" : "" }}>
            {`${user.name} ---- ${user.email} `}
            <button
              onClick={(event) => {
                fetch("http://localhost:5000/users/like", {
                  method: "POST",
                  body: JSON.stringify(user),
                  headers: { "content-type": "application/json" },
                })
                  .then((res) => res.json())
                  .then((res) => {
                    console.log(users);
                    const usersClone = [...users];
                    console.log(res);
                    const indexOfUpdatedUser = users.findIndex((u) => u.email === res.user.email);
                    usersClone[indexOfUpdatedUser].liked = true;
                    setUsers(usersClone);
                  });
              }}
            >
              {user.liked ? "Unlike" : "Like"}
            </button>
          </li>
        ))}
      </ul>

      {/* {JSON.stringify(user)} */}
    </div>
  );

  //JSON.stringify will print whatever you want regardless of the data type
}

export default App;
