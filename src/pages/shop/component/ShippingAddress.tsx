import handleAPI from "@/apis/handleAPI";
import AddressComponent from "@/components/AddressComponent";
import { API } from "@/configurations/configurations";
import { AddressResponse } from "@/model/AddressModel";
import { Button, Card, Checkbox, Empty, List, message, Typography } from "antd";
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
  const [isEditAddress, setIsEditAddress] = useState<AddressResponse>();

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
      setAddressSelected(addresses[0]);
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

  const removeAddress = async (item: AddressResponse) => {
    try {
      await handleAPI(`${API.ADDRESSES}/${item.id}`, undefined, "delete");
      message.success("Ok");
      const newAddresses: AddressResponse[] = addresses.filter(
        (i) => i.id !== item.id
      );
      setAddresses(newAddresses);
      newAddresses.length > 0 &&
        item.id === addressSelected?.id &&
        setAddressSelected(newAddresses[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleOnUpdate = (v: AddressResponse) => {
    const newAddress = addresses.filter((i) => i.id !== v.id);
    setAddresses([v, ...newAddress]);
    setAddressSelected(v);
    setIsEditAddress(undefined);
  };

  return (
    <div>
      <Card>
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
                      actions={[
                        <div>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsEditAddress(item);
                            }}
                            size="small"
                            type="link"
                            className="mr-5"
                          >
                            Edit
                          </Button>
                          <Button
                            onClick={async (e) => {
                              e.stopPropagation();
                              await removeAddress(item);
                            }}
                            size="small"
                            className="text-danger"
                            type="text"
                          >
                            Remove
                          </Button>
                        </div>,
                      ]}
                      extra={
                        <Checkbox checked={addressSelected?.id === item.id} />
                      }
                      color="#e0e0e0"
                      title={<Typography.Text>{item.name}</Typography.Text>}
                    >
                      <Typography.Paragraph>
                        {item.address}
                      </Typography.Paragraph>
                      <Typography.Text>
                        {item.phoneNumber}
                      </Typography.Text>
                    </Card>
                  </a>
                </List.Item>
              )}
            ></List>
          </div>
        )}
        <Button
          className="mt-2 mb-3"
          onClick={() => addressSelected && onOk(addressSelected)}
          type="primary"
          size="large"
        >
          Deliver address
        </Button>
      </Card>

      <div className="mt-3">
        <AddressComponent
          onAddNew={(v) => {
            setAddresses((p) => [v, ...p]);
            setAddressSelected(v);
          }}
          onUpdate={(v) => {
            handleOnUpdate(v);
          }}
          address={isEditAddress}
        />
      </div>
    </div>
  );
};

export default ShippingAddress;
