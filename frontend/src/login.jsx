import {useState} from 'react';
import {API} from './api';
function Login({onLogin}){
    const[mode,setMode]=useState('login');
    const[name,setName]=useState('');
    const [email,setEmail]=useState('');
    const [password,setPassword]=useState('');
    const [error,setError]=useState('');
    const[info,setInfo]=useState('');
    async function handleSubmit(e){
        e.preventDefault();
        const isLogin=mode==='login';
        const url=isLogin?`${API}/auth/login`:`${API}/auth/signup`;
        const body=isLogin?{email,password}:{name,email,password};
        const res=await fetch(url,{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            credentials:'include',
            body:JSON.stringify(body)
        });
        const data=await res.json();
        if(res.ok){
            setError('');
           if(isLogin){
            onLogin();
           }else{
            setInfo('Account created! Please log in.');
            setMode('login');
            setPassword('');
           }
        }else{
            setInfo('');
            setError(data.error);
        }
    }
    return (
        <form onSubmit={handleSubmit}>
        {mode==='signup' && (
            <input
            placeholder='name'
            type='text'
            value={name}
            onChange={(e)=>setName(e.target.value)}
            >
            </input>
        )}
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
            
            <button type='submit' className='login'>{mode==='login'?'login':'signup'}</button>
            {error && <p>{error}</p>}
            {info && <p>{info}</p>}
            <p>
                {mode==='login'?"No account?":"Already have an account?"}
                <button
                type="button"
                onClick={()=>{
                    setMode(mode==='login'?'signup':'login');
                    setError('');
                    setInfo('');
                }}
                >
                    {mode==='login'?'Create account':'Back to login'}
                    
                </button>
            </p>

        </form>
    )

}
export default Login;

