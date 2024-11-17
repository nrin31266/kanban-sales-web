import handleAPI from "@/apis/handleAPI";
import AddressComponent from "@/components/AddressComponent";
import { API } from "@/configurations/configurations";
import { AddressResponse } from "@/model/AddressModel";
import { Button, Card, Checkbox, Empty, List, Typography } from "antd";
import { AxiosResponse } from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Skeleton } from "antd";
import { ApiResponse } from "@/model/AppModel";

interface Props {
  onOk: (v: AddressResponse) => void;
}

const ShippingAddress = (props: Props) => {
  const { onOk } = props;
  const [addressSelected, setAddressSelected] = useState<AddressResponse>();
  const [addresses, setAddresses] = useState<AddressResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const isFirstSelected = useRef(true);

  useEffect(() => {
    getAddresses();
  }, []);

  useEffect(() => {
    if (addresses && addresses.length > 0 && isFirstSelected.current) {
      isFirstSelected.current = false;
      addresses.forEach((item) => {
        if (item.isDefault) {
          setAddressSelected(item);
          return;
        }
      });
    }
  }, [addresses]);

  useEffect(() => {
    console.log(addresses);
  }, [addresses]);

  const getAddresses = async () => {
    setIsLoading(true);
    try {
      const res: AxiosResponse<ApiResponse<AddressResponse[]>> =
        await handleAPI(API.ADDRESSES);
      setAddresses(res.data.result);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div>
        <Typography.Title level={3}>Select deliver address</Typography.Title>
        <Typography.Paragraph type="secondary">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque, culpa.
          At voluptas magni delectus, molestiae corporis dolor incidunt sapiente
          iste debitis nostrum soluta maxime ratione voluptatum provident autem.
          Architecto, similique!
        </Typography.Paragraph>
        {isLoading ? (
          <Skeleton active />
        ) : addresses.length < 1 ? (
          <Empty className="mt-4" />
        ) : (
          <div>
            <List
              grid={{ gutter: 16, column: 2 }}
              dataSource={addresses}
              renderItem={(item) => (
                <List.Item
                  style={
                    item.id === addressSelected?.id
                      ? {
                          border: "1px solid blue",
                          borderRadius: 7,
                        }
                      : {}
                  }
                  key={item.id}
                  className="address-item"
                >
                  <a onClick={() => setAddressSelected(item)}>
                    <Card
                      extra={<Checkbox checked={addressSelected?.id === item.id}/>}
                      color="#e0e0e0"
                      title={<Typography.Text>{item.name}</Typography.Text>}
                    >
                        <Typography.Paragraph>{item.address}</Typography.Paragraph>
                    </Card>
                  </a>
                </List.Item>
              )}
            ></List>
          </div>
        )}
      </div>
      <Button
        onClick={() => addressSelected && onOk(addressSelected)}
        type="primary"
        size="large"
      >
        Deliver address
      </Button>
      <div>
        <AddressComponent
          onAddNew={(v) => {
            setAddresses((p) => [v, ...p]);
            setAddressSelected(v);
          }}
        />
      </div>
    </div>
  );
};

export default ShippingAddress;
