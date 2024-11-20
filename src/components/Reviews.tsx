import { authSelector } from '@/reducx/reducers/authReducer'
import { Form } from 'antd'
import React from 'react'
import { useSelector } from 'react-redux'
interface Props{
  productId: string
}

const Reviews = (props: Props) => {
  const {productId} = props
  
  const auth = useSelector(authSelector);
  
  const [form] = Form.useForm();


  return (
    <div>Reviews</div>
  )
}

export default Reviews