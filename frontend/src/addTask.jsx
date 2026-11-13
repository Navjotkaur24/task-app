import {useState} from 'react';
import {API} from './api';
function AddTask({onAdded}){
    const [title,setTitle]=useState('');
    const [description,setDescription]=useState('');
    async function handleSubmit(e){
        e.preventDefault();
        
        const res=await fetch(`${API}/tasks`,{
            method:'POST',
            headers:{'Content-Type':'application/json'
             
            },
            credentials:'include',
            body:JSON.stringify({title,description})
        });
        const data=await res.json();
        if(res.ok){
            console.log('Task added!');
            onAdded();
        setTitle('');
        setDescription('');
        }else{
            console.log(data.error);
        }
    }
    return (
        <form onSubmit={handleSubmit}>
            <input
            type='text'
            placeholder='add a task'
            value={title}
            onChange={(e)=>setTitle(e.target.value)}
            ></input>
            <input
            type='text'
            placeholder='add a description'
            value={description}
            onChange={(e)=>setDescription(e.target.value)}
            ></input>
            <button type='submit' className='add'>Add Task</button>
        </form>
    )
}
export default AddTask;