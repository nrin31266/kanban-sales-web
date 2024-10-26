import handleAPI from '@/apis/handleAPI';
import { API, PAGE } from '@/configurations/configurations';
import { ApiResponse } from '@/model/AppModel';
import { LoginRequest, LoginResponse } from '@/model/AuthenticationModel';
import { Button } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react'
import { useDispatch } from 'react-redux'

const login = () => {
    const dispatch = useDispatch();
    const router = useRouter();
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
        <Link href={PAGE.HOME}>Go home</Link>
        <Link href={PAGE.REGISTER}>Register</Link>
    </div>
  )
}

export default login