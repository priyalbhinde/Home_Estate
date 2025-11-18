import { FaPlusSquare, FaSearch, FaUserCircle } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Header() {
    const { currentUser } = useSelector(state => state.user)
    const location = useLocation();
    return (
        <header className='bg-slate-200 shadow-md fixed top-0 left-0 z-20 w-full'>
            <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
                <Link to='/'>
                    <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
                        <span className='text-green-600'>Home</span>
                        <span className='w-1'></span>
                        <span className='text-gray-500'>Estate</span>
                    </h1>
                </Link>
                <ul className="flex gap-4">
                    <Link to='/'>
                        <li className={`hidden sm:inline hover:text-green-500 hover:cursor-pointer ${location.pathname === '/' ? 'text-green-500 font-semibold' : ''}`}>Home</li>
                    </Link>
                </ul>
                    
                
                <span className="gap-7 flex items-center">
                    <Link to="/search">
                <button type='button'><FaSearch className='text-slate-700 hover:text-emerald-500' /></button>
                </Link>
                <Link to="/create-listing">
                <button className='border-2 border-emerald-500 rounded-lg'><FaPlusSquare className=' bg-slate-300 text-2xl border-none text-white hover:bg-emerald-500'/></button>
                </Link>
                <Link to="/profile">
                {currentUser ?
                    <button className="border-green-600 border rounded-lg text-green-600 flex items-center p-2 hover:bg-green-600 hover:text-white"><FaUserCircle className='mx-2' />{currentUser.username}</button>
                    :
                        <button className='hidden sm:inline hover:text-white hover:cursor-pointer bg-green-500 text-white hover:bg-green-600 px-3 py-2 rounded'>Sign in</button>
                    
                }
                </Link>
                </span>
            </div>
        </header>
    )
}