import { OrderProductResponse, OrderResponse } from '@/model/PaymentModel'
import { Modal, Typography } from 'antd'
import React, { useState } from 'react'

interface Props{
  visible: boolean,
  onClose: ()=> void,
  onFinish: (v: any)=> void
  orderProduct: OrderProductResponse,
  order: OrderResponse
}

const RatingModal = (props: Props) => {
  const [ isLoading, setIsLoading ] = useState(false);
  const {onClose, onFinish, visible}= props
  const handleClose = ()=>{
    onClose();
  }
  return (
    <Modal
      open={visible}
      footer= {false}
      onCancel={handleClose}
      title={
        <>
          <div>
            <Typography.Text>{'Rating: '}</Typography.Text>
            <Typography.Text>{'"'}{}{'"'}</Typography.Text>
          </div>
        </>
      }
    >

    </Modal>
  )
}

export default RatingModal