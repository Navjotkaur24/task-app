import {useState} from 'react';
import {API} from './api';
function Login({onLogin}){
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const [error,setError]=useState('');
    async function handleSubmit(e){
        e.preventDefault();
        const res=await fetch(`${API}/auth/login`,{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            credentials:'include',
            body:JSON.stringify({email,password})
        });
        const data=await res.json();
        if(res.ok){
            
            console.log('Saved!');
            setError('');
            onLogin();
        }else{
            console.log(data.error);
            setError(data.error);
        }
    }
    return (
        <form onSubmit={handleSubmit}>
            <input
            placeholder='email'
            type='text'
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            ></input>
            <input
            placeholder='password'
            type='password'
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            ></input>
            <button type='submit' className='login'>login</button>

        </form>
    )

}
export default Login;