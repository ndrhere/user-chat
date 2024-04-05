import './App.css';
import { useState } from 'react';
import { useEffect } from 'react';
import React from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:3000', { transports: ['websocket'] })
function App() {

const [users, setUsers] = useState([])
const [name, setName] = useState('');
const [number, setNumber] = useState('')


useEffect(() => {
  socket.on('newUser', (newUser) => {
   setUsers(prevUsers => [...prevUsers, newUser])
  })

  return () => {
    socket.disconnect();
  }
}, [])

const handleSubmit = async (event) => {
event.preventDefault();

try{
  const response = await axios.post('http://localhost:3000/register', {name: name, number: number});
  const data = response.data
  console.log('User registered successfully', data)
}catch(error){
  console.error("Internal error occurred")
}

}

const handleNameChange = (event) => {
  setName(event.target.value)
}

const handleNumberChange = (event) => {
    setNumber(event.target.value)
}



  return (
    <div className="App my-4">


      <h2>Registration Form</h2>
      <form onSubmit={handleSubmit} className="w-50 my-4" style={{margin:"auto"}}>
      <div class="mb-3">
      <label for="name" class="form-label">Name</label>
      <input type="text" class="form-control" id="name" placeholder="Enter your name" value={name} onChange={handleNameChange}/>
      </div>

      <div class="mb-3">
      <label for="number" class="form-label">Number</label>
      <input type="text" class="form-control" id="number" placeholder="Enter your number" value={number} onChange={handleNumberChange}/>
      </div>

      <button type="submit" class="btn btn-primary">Register</button>
      </form>


      <h2>Active Users: </h2>
      <ul>
     {users.map((user) => (
     <li key="user._id">
      {user.name} - {user.number}
     </li>
     ))}
      </ul>
      
    </div>
  );
}

export default App;
