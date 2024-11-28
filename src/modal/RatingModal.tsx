import handleAPI from "@/apis/handleAPI";
import { API } from "@/configurations/configurations";
import { OrderProductResponse, OrderResponse } from "@/model/PaymentModel";
import { changeFileListToUpload, processFileList } from "@/utils/uploadFile";
import {
  Button,
  Form,
  message,
  Modal,
  Rate,
  Typography,
  Upload,
  UploadFile,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { UploadChangeParam } from "antd/es/upload";
import React, { useState } from "react";

interface Props {
  visible: boolean;
  onClose: () => void;
  onFinish: (v: any) => void;
  orderProduct: OrderProductResponse;
  order: OrderResponse;
}

const RatingModal = (props: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const { onClose, onFinish, visible, order, orderProduct } = props;
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);
  const handleClose = () => {
    onClose();
    form.resetFields();
    setFileList([]);
    form.setFieldValue("rating", 5);
  };
  const handleSubmit = async (v: any) => {
    v.orderId = order.id;
    v.subProductId = orderProduct.subProductId;
    v.productId = orderProduct.productId;
    v.orderProductId = orderProduct.id;
    setIsLoading(true);
    const photoUrl = await processFileList(fileList);
    v.imageUrls = photoUrl;
    console.log(v);
    try {
      const res = await handleAPI(API.RATING, v, 'post');
      handleClose();
      onFinish(res.data.result);
    } catch (error: any) {
      console.log(error);
      message.error(error.message);
    }finally{
      setIsLoading(false);
    }
  };
  const handleChangeFile = (val: UploadChangeParam<UploadFile<any>>) => {
    const files: UploadFile[] = val.fileList;
    setFileList(changeFileListToUpload(files));
  };
  return (
    <Modal
      open={visible}
      footer={false}
      onCancel={handleClose}
      title={
        <>
          <div>
            <Typography.Text>{"Rating: "}</Typography.Text>
            <Typography.Text>
              {'"'}
              {orderProduct.name}
              {'"'}
            </Typography.Text>
          </div>
        </>
      }
    >
      <div>
        <div>
          <Form layout="vertical" form={form} onFinish={handleSubmit}>
            <Form.Item
              initialValue={5}
              label="Score"
              name="rating"
              rules={[{ required: true }]}
            >
              <Rate allowClear={false} />
            </Form.Item>
            <Form.Item label="Comment" name="comment">
              <TextArea
                showCount
                maxLength={1000}
                style={{ height: "10vh" }}
                placeholder="Review product"
                allowClear
              />
            </Form.Item>
          </Form>
          <div className="mb-3">
            <Upload
              listType="picture-card"
              accept="image/*"
              fileList={fileList}
              multiple
              onChange={handleChangeFile}
            >
              {fileList.length <= 2 && "Upload"}
            </Upload>
          </div>
        </div>
      </div>
      <div>
        <div style={{ justifyContent: "end" }} className="d-flex">
          <Button disabled={isLoading} loading={isLoading} onClick={() => form.submit()} type="primary">
            Rating
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default RatingModal;
