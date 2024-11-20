import React from 'react'
import { authSelector, removeAuth } from '@/reducx/reducers/authReducer';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Divider } from 'antd';
import { CgProfile } from 'react-icons/cg';
import { FaBell, FaBox, FaHeart, FaMapMarkerAlt, FaRegCreditCard } from 'react-icons/fa';
import { IoSettingsSharp } from 'react-icons/io5';
import { FiLogOut } from 'react-icons/fi';
import { useRouter } from 'next/router';

interface Props{
    onClose: ()=> void
}

const DrawerDownRight = (props: Props) => {
    const {onClose} = props
    const router = useRouter();
    const dispatch = useDispatch();

    const handleLogout = ()=>{
        localStorage.removeItem("authData");
        dispatch(removeAuth({}));
        onClose();
    }


  return (
    <div className='drawer-right'>
        <Button onClick={()=> {router.push('/account/profile'); onClose()}} size='large' type='text' icon={<CgProfile className='drawer-right-icon' />}>Your profile</Button>
        <Button size='large' type='text' icon={<FaBell className='drawer-right-icon' />}>Notifications</Button>
        <Divider/>
        <Button onClick={()=> {router.push('/account/orders'); onClose()}} size='large' type='text' icon={<FaBox className='drawer-right-icon' />}>My orders</Button>
        <Button size='large' type='text' icon={<FaHeart className='drawer-right-icon' />}>My wishlists</Button>
        <Button size='large' type='text' icon={<FaMapMarkerAlt className='drawer-right-icon' />}>Manage addresses</Button>
        <Button size='large' type='text' icon={<FaRegCreditCard className='drawer-right-icon' />}>Saved cards</Button>
        
        <Divider/>
        <Button size='large' type='text' icon={<IoSettingsSharp className='drawer-right-icon' />}>Settings</Button>
        <Button onClick={()=>handleLogout()} size='large' type='text' icon={<FiLogOut className='drawer-right-icon' />}>Logout</Button>
    </div>
  )
}

export default DrawerDownRight