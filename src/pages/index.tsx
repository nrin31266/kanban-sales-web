import { AuthModel } from '@/model/AuthenticationModel'
import { Button } from 'antd'
import React from 'react'
import { useSelector } from 'react-redux'
import Login from './auth/login'

const HomePage = () => {

  return <>
    <div className="row">
      <div className="col">
        <h1 className='title-danger'>Hello</h1>
      </div>
    </div>
  </>
}
  
export default HomePage;