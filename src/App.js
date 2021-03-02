import React, { useEffect, useState } from 'react';
import './components/App.css';
import { Login } from './components/Login';
import Swal from 'sweetalert2'
import { BrowserRouter as HashRouter, Route, Switch } from 'react-router-dom'
import { TodoApp } from './components/TodoApp';
import { NewTask } from './components/NewTask';
import { UserProfile } from './components/UserProfile';
import axios from 'axios';

function App() {
  localStorage.setItem("Username", "juan@gmail.com");
  localStorage.setItem("Password", "pass");
  //localStorage.setItem("isLoggedIn","false")

  let isLogged = localStorage.getItem("isLoggedIn");

  isLogged = (isLogged === "true" ? true : false)

  const [isLoggedIn, setisLoggedIn] = useState(isLogged)

  const [items, setitems] = useState([])

  const [user, setuser] = useState({
    name: "",
    email: "",
    password: "",

  });


  useEffect(() => {
    axios.get("https://taskplanner-9ccca-default-rtdb.firebaseio.com/user.json")
      .then(response => {
        let result = response.data;
        let user = Object.keys(result).map(key => result[key]);
        setuser(user[0]);
        console.log(user)
      }).catch(error => {
        alert("Fallo de Conexión con DB");
      });
  }, []);


  useEffect(() => {
    axios.get("https://taskplanner-9ccca-default-rtdb.firebaseio.com/items.json")
      .then(response => {
        let result = response.data;
        let items = Object.keys(result).map(key => result[key]);
        setitems(items);
        console.log(items);
      }).catch(error => {
        alert("Fallo de Conexión con DB");
      });
  }, []);

  const handleAddTask = (newTask) => {
    axios.post("https://taskplanner-9ccca-default-rtdb.firebaseio.com/items.json", newTask)
      .then(response => {
        const newItems = [...items, newTask];
        setitems(newItems);
      }).catch(error => {
        alert("Fallo de Conexión con DB");
      });
  }

  const handleUpdateProfile = (newName, newPassword) => {

    const newUser = {
      "name": newName,
      "email": localStorage.getItem("Username"),
      "password": newPassword
    };
    console.log(newName)
    axios.put("https://taskplanner-9ccca-default-rtdb.firebaseio.com/user/-MUeMBXGH97zZZ59Uc9i.json", newUser)
      .then(response => {
        console.log(user)
        setuser(newUser);
        console.log(user)
        window.location.href = "/";
      }).catch(error => {
        alert("Fallo de Conexión con DB");
      });
  };

  const handleSuccessfullyLogin = (e) => {
    Swal.fire({
      title: 'Login succesfull',
      text: 'Welcome',
      timer: 2000,
      timerProgressBar: false,
      icon: 'success',
      showConfirmButton: false
    })
    localStorage.setItem("isLoggedIn", "true");
    setisLoggedIn(true)
  }

  const handleFailedLogin = (e) => {
    Swal.fire({
      title: 'Error!',
      text: 'User or Password incorrect',
      timer: 2000,
      timerProgressBar: false,
      icon: 'error',
      showConfirmButton: false
    })
    localStorage.setItem("isLoggedIn", "false");
    setisLoggedIn(false)
  }

  const LoginView = () => (
    <Login successful={handleSuccessfullyLogin} failed={handleFailedLogin} />
  );

  const TodoAppView = () => (
    <TodoApp items={items} addTask={handleAddTask} />
  );

  const ProfileView = () => (
    <UserProfile user={user} handleUpdateProfile={handleUpdateProfile} />
  );

  const correct = isLoggedIn ? TodoAppView : LoginView

  return (
    <div>

      <HashRouter basename="/">
        <div>
          <Switch>
            <Route exact path="/" component={correct} />
            <Route path="/new" component={NewTask} />
            <Route path="/profile" component={isLoggedIn ? ProfileView : LoginView} />
          </Switch>

        </div>
      </HashRouter>
    </div>

  )
}

export default App;
