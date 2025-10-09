import React from 'react'
import{ useSelector,useDispatch  } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useEffect, useState } from 'react'
import Loader from '../../Components/Loader'    
import { setCredientials } from '../../Redux/features/auth/authSlice'
import { Link } from 'react-router-dom'
import { useProfileMutation } from '../../Redux/api/usersApiSlice'


const Profile = () => {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const { userInfo } = useSelector((state) => state.auth)
    const dispatch = useDispatch()
    const [updateProfile, { isLoading: loadingUpdateProfile }] = useProfileMutation()

    useEffect(() => {
    
            setUsername(userInfo.username)
            setEmail(userInfo.email)
        
    }, [userInfo.email, userInfo.username])

   const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
        toast.error('Passwords do not match');
        return;
    }

    try {
        const res = await updateProfile({
            _id: userInfo._id,
            username,
            email,
            password
        }).unwrap();

        dispatch(setCredientials(res.user || res)); // depends on your backend response
        toast.success('Profile Updated Successfully');
    } catch (err) {
        console.error("Profile update error:", err);
        toast.error(err?.data?.message || err.error || 'Failed to update profile');
    }
};




  return (
    <div className='container mx-auto my-4 p-4 max-w-md border rounded'>
        <h1 className='text-2xl font-bold mb-4'>User Profile</h1>
        <form onSubmit={submitHandler} className='space-y-4'>
            <div>
                <label className='block mb-1 font-medium' htmlFor='username'>Username</label>
                <input className='w-full border px-3 py-2 rounded' type='text' id='username' value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div>
                <label className='block mb-1 font-medium' htmlFor='email'>Email</label>
                <input className='w-full border px-3 py-2 rounded' type='email' id='email' value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
                <label className='block mb-1 font-medium' htmlFor='password'>Password</label>
                <input className='w-full border px-3 py-2 rounded' type='password' id='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Enter new password' />
            </div>
            <div>
                <label className='block mb-1 font-medium' htmlFor='confirmPassword'>Confirm Password</label>
                <input className='w-full border px-3 py-2 rounded' type='password' id='confirmPassword' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder='Confirm new password' />
            </div>
            <div>
                <button className='w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600' type='submit' disabled={loadingUpdateProfile}>
                    {loadingUpdateProfile ? 'Updating...' : 'Update Profile'}
                </button>
            </div>

            <Link to='/user-orders' className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'>Orders</Link>
        </form>
        {loadingUpdateProfile && <Loader />}

    </div>
  )
}

export default Profile