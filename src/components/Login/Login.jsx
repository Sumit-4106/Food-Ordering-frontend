import React, { useEffect, useState } from 'react'
import { FaArrowRight, FaCheckCircle, FaEye, FaEyeSlash, FaLock, FaUser, FaUserPlus } from 'react-icons/fa'
import { iconClass, inputBase } from '../../assets/dummydata'
import {Link} from 'react-router-dom';
import axios from 'axios'

const url = 'http://localhost:4000'

const Login = ({onLoginSuccess, onClose}) => {

  const [showToast, setShowToast] = useState({ visible: false, message: '', isError: false });
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({username: '', password: '', rememberMe: false});

  useEffect(() => {
    const stored = localStorage.getItem('loginData');
    if(stored) setFormData(JSON.parse(stored));
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post(`${url}/api/user/login`, {
        email: formData.email,
        password: formData.password,
      })
      console.log('Axios Res: ', res)

      if(res.status === 200 && res.data.success && res.data.token) {
        localStorage.setItem('authToken', res.data.token);

        formData.rememberMe ? localStorage.setItem('loginData', JSON.stringify(formData)) : localStorage.removeItem('loginData')

        setShowToast({ visible: true, message: 'Login Successful!', isError: false })
        setTimeout(() => {
          setShowToast({ visible: false, message: '', isError: false })
          onLoginSuccess(res.data.token)
        }, 1500)
      }

      else{
        console.warn('Unexpected Err: ', res.data)
        throw new Error(res.data.message || 'Login Failed')
      }
    } 
    catch (err) {
      console.error('Axios error: ',err);
      if(err.response) {
        console.error('Server res: ', err.response.status, err.response.data)
      }
      const msg = err.response?.data?.message || err.message || 'Login Failed'
      setShowToast({ visible: true, message: msg, isError: true })
      setTimeout(() => {
          setShowToast({ visible: false, message: '', isError: false })
          onLoginSuccess(res.data.token)
        }, 2000)
    }
  }

  const handleChange = ({target : {name, value, type, checked}}) => setFormData(prev => ({...prev, [name]: type === 'checkbox' ? checked : value}));

  const toggleShowPassword = () => setShowPassword(prev => !prev);

  return (
    <div className=' space-y-6 relative'>
      <div className={`fixed top-4 right-4 z-50 transition-all duration-300 
        ${showToast.visible ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0'}`}>
          <div className={`px-4 py-3 rounded-md shadow-lg flex items-center gap-2 text-sm ${showToast.isError ? 'bg-red-600 text-white' : 'bg-green-400 text-white'}`}>

          </div>

          <div className=' bg-green-600 text-white px-4 py-3 rounded-md shadow-lg flex items-center gap-2 text-sm'>
            <FaCheckCircle className=' flex-shrink-0' />
            <span>{showToast.message}</span>
          </div>
      </div>

      <form onSubmit={handleSubmit} className=' space-y-6'>
        <div className=' relative'>
          <FaUser className={iconClass} />
          <input type='email' name='email' placeholder='Email' value={formData.email} onChange={handleChange} 
          className={`${inputBase} pl-10 pr-4 py-3`} />
        </div>
        <div className=' relative'>
          <FaLock className={iconClass} />
          <input type={showPassword ? 'text' : 'password'} name='password' placeholder='Password' value={FormData.password} onChange={handleChange} 
          className={`${inputBase} pl-10 pr-10 py-3`} />
          <button type='button' onClick={toggleShowPassword} className=' absolute right-3 top-1/2 transform -translate-y-1/2 
          text-amber-400'>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <div className=' flex items-center'>
          <label className=' flex items-center'>
            <input type='checkbox' name='rememberMe' checked={formData.rememberMe} onChange={handleChange} className=' form-checkbox
             h-5 w-5 text-amber-600 bg-[#2D1B0E] border-amber-400 rounded focus:ring-amber-600' />
             <span className=' ml-2 text-amber-100'>Remember Me</span>
          </label>
        </div>

        <button className=' w-full py-3 bg-gradient-to-r from-amber-400 to-amber-600 text-[#2D1B0E] font-bold rounded-lg flex
         items-center justify-center gap-2 hover:scale-105 transition-transform'>
          Sign In <FaArrowRight />
        </button>
      </form>

      <div className=' text-center'>
        <Link to='/signup' onClick={onClose} className=' inline-flex items-center gap-2 text-amber-400 hover:text-amber-600 transition-colors'>
          <FaUserPlus /> Create New Account
        </Link>
      </div>
    </div>
  )
}

export default Login
