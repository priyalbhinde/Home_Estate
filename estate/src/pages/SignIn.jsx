import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react';
import { FaEye } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { signInFailure, signInStart, signInSuccess } from '../redux/user/userSlice';


export default function SignIn() {
    const [formData, setFormData] = useState({});
    const { loading, error } = useSelector((state) => state.user);
    const [visible, setVisible] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleVisible = (e) => {
        setVisible(!visible);
    }
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            dispatch(signInStart());
            const res = await fetch('/api/auth/sign-in',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                }
            );
            const data = await res.json();
            if (data.success === false) {
                dispatch(signInFailure(data.message));
                alert(error);
                return;
            }
            else {
                dispatch(signInSuccess(data));
                navigate('/')
            }
        }
        catch(error)
        {
            dispatch(signInFailure(error.message));
                alert(error.message);
        }
       
        
    }
    return (
        <div className='p-3 max-w-lg mx-auto pt-16'>
            <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
            <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                <input type="email" placeholder='email' className='border p-3 rounded-lg ' id='email' onChange={handleChange} required />
                <span className="flex items-center">
                    <input type={visible ? 'text' : 'password'} placeholder='password' className='border p-3 rounded-l-lg w-full focus:outline-none' id='password' onChange={handleChange} required />
                    <button type='button' className="bg-slate-500 p-4 rounded-r-lg hover:bg-green-600" onClick={handleVisible}><FaEye className='text-slate-200' /></button>
                </span>
                <button disabled={loading} className="bg-green-600 text-white p-3 rounded-lg uppercase hover:opacity-90 disabled:opacity-80">Sign in</button>
            </form>
            <div className='flex gap-2 mt-2'>
                <p>Don't have an account?</p>
                <Link to={"/sign-up"}><span className='text-blue-700'>Sign up</span></Link>
            </div>
        </div>
    )
}