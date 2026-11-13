import {useState ,useEffect} from 'react';
import {API} from './api';
import Login from './login'
import AddTask from './addTask'
function App(){
  const [tasks,setTasks]=useState([]);
  const [loggedIn,setLoggedIn]=useState(false);
  function loadTasks(){
  fetch(`${API}/tasks`,{credentials:'include',cache:'no-store'}
  ).then((res)=>res.json()).then((data)=>{if (Array.isArray(data))setTasks(data)});
 }
 useEffect(()=>{
  fetch(`${API}/auth/me`,{credentials:'include'}).then((res)=>{
    if(res.ok)setLoggedIn(true)
  })
 },[]);
 useEffect(()=>{
  if(loggedIn)loadTasks();
 },[loggedIn]);
 async function deleteTask(id){
  await fetch(`${API}/tasks/${id}`,{
    method:'DELETE',
    credentials:'include'
  });
  loadTasks();
 }
async function logout(){
 await fetch(`${API}/auth/logout`,{
  method:'POST',
  credentials:'include'
 })
  setLoggedIn(false);
 }
 return(
 <div>
 <h1>Tasks</h1>
 {loggedIn? (<button onClick={logout}className="logout">Logout</button>): <Login onLogin={()=>setLoggedIn(true)}  />}

  {loggedIn && <AddTask onAdded={loadTasks} />}
  {tasks.map((t)=>{
    return <p key={t._id}>{t.title}- {t.description}
    <button onClick={()=>deleteTask(t._id)} className="delete">Delete Task</button>
    </p>
  })}
</div>
 )
}
export default App;