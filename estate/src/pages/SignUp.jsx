import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react';
import { FaEye } from 'react-icons/fa';

export default function SignUp() {
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [visible1, setVisible1] = useState(false);
    const [visible2, setVisible2] = useState(false);
    const navigate = useNavigate();

    const handleVisible1 = (e) => {
        setVisible1(!visible1);
    }
    const handleVisible2 = (e) => {
        setVisible2(!visible2);
    }
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (formData.password1 != formData.password2) {
            alert("Passwords do not match");
            setLoading(false);
        }
        else {
            const res = await fetch('/api/auth/sign-up',
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
                setLoading(false);
                alert(data.message);
            }
            else {
                navigate('/sign-in')
            }

        }
    }
    return (
        <div className='p-3 max-w-lg mx-auto pt-16'>
            <h1 className="text-3xl text-center font-semibold my-5">Sign Up</h1>
            <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                <input type="text" placeholder='username' className='border p-3 rounded-lg ' id='username' onChange={handleChange} required />
                <input type="email" placeholder='email' className='border p-3 rounded-lg ' id='email' onChange={handleChange} required />
                <input type="text" placeholder='phone' className='border p-3 rounded-lg ' id='phone' onChange={handleChange} required />
                <span className="flex items-center">
                    <input type={visible1 ? 'text' : 'password'} placeholder='password' className='border p-3 rounded-l-lg w-full focus:outline-none' id='password1' onChange={handleChange} required />
                    <button type='button' className="bg-slate-500 p-4 rounded-r-lg hover:bg-green-600" onClick={handleVisible1}><FaEye className='text-slate-200' /></button>
                </span>
                <span className="flex items-center">
                    <input type={visible2 ? 'text' : 'password'} placeholder='confirm password' className='border p-3 rounded-l-lg w-full focus:outline-none' id='password2' onChange={handleChange} required />
                    <button type='button' className="bg-slate-500 p-4 rounded-r-lg hover:bg-green-600" onClick={handleVisible2}><FaEye className='text-slate-200' /></button>
                </span>
                <button disabled={loading} className="bg-green-600 text-white p-3 rounded-lg uppercase hover:opacity-90 disabled:opacity-80">Sign up</button>
            </form>
            <div className='flex gap-2 mt-2'>
                <p>Have an account?</p>
                <Link to={"/sign-in"}><span className='text-blue-700'>Sign in</span></Link>
            </div>
        </div>
    )
}