
import { PAGE } from '@/configurations/configurations'
import { AuthModel } from '@/model/AuthenticationModel'
import { authReducer, authSelector, removeAuth } from '@/reducx/reducers/authReducer'
import { Avatar, Button, Layout } from 'antd'
import Link from 'next/link'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

const HeaderComponent = () => {
  const auth : AuthModel = useSelector(authSelector);
  console.log(auth);
  const dispatch = useDispatch();

  const handleLogout =async ()=>{
    dispatch(removeAuth({}));
  }

  return (
    <div className='p-3'>
      <div className="row">
        <div className="col">papa</div>
        <div className="col text-right">
          {auth.accessToken? 
          <>
            {/* <Avatar /> */}
            <Button onClick={handleLogout}>Logout</Button>
          </>:
          <>
            <Link href={PAGE.LOGIN}>Login</Link>
          </>}
        </div>
      </div>
    </div>  
  )
}

export default HeaderComponent