import handleAPI from '@/apis/handleAPI';
import { API } from '@/configurations/configurations';
import { ApiResponse } from '@/model/AppModel';
import { LoginRequest, LoginResponse } from '@/model/AuthenticationModel';
import { Button } from 'antd';
import Link from 'next/link';
import React from 'react'
import { useDispatch } from 'react-redux'

const Login = () => {
    const dispatch = useDispatch();
    const handleLogin = async ()=>{
      const api = `${API.LOGIN}`;
      try {
        const value = {
          'email': 'admin', 
          'password': 'admin'
        }
        const res = await handleAPI(api, value, 'post');
        const response: ApiResponse<LoginResponse>= res.data;
        
      } catch (error) {
        
      }
    };

  return (
    <div>
        <Button onClick={handleLogin}>Test login</Button>
        <Link href={'/'}>Logout</Link>
    </div>
  )
}

export default Login