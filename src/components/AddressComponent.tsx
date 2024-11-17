import { SelectModel } from "@/model/FormModel";
import { replaceName } from "@/utils/replaceName";
import {
  Button,
  Checkbox,
  Form,
  Input,
  message,
  Select,
  Typography,
} from "antd";
import axios, { AxiosResponse } from "axios";
import React, { useEffect, useRef, useState } from "react";

interface AddressRequest {
  name: string;
  phoneNumber: string;
  houseNo: string;
  province: string;
  district: string;
  ward: string;
  isDefault: boolean;
}

export interface ProvincesResponse {
  _id: string;
  name: string;
  slug: string;
  type: string;
  name_with_type: string;
  code: string;
  isDeleted: boolean;
}

const AddressComponent = () => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const initLoad = useRef(true);
  const [isDefault, setIsDefault] = useState(false);
  const [locationData, setLocationData] = useState<{
    provinces: SelectModel[];
    districts: SelectModel[];
    wards: SelectModel[];
  }>({
    provinces: [],
    districts: [],
    wards: [],
  });
  const [locationValues, setLocationValues] = useState<{
    ward: string | undefined;
    district: string | undefined;
    province: string | undefined;
  }>({
    ward: undefined,
    district: undefined,
    province: undefined,
  });

  useEffect(() => {
    if (initLoad.current) {
      getProvinces();
      initLoad.current = false;
    }
  }, []);

  const handleSubmit = async (v: any) => {
  
    const items: any = { ...locationData };
    Object.entries(locationValues).forEach(([key, value]) => {
      const selects: SelectModel[] = items[key + 's']; 
      const item = selects.find((e) => e.value === value);
      if (item) {
        console.log(`${key} label: ${item.label}`);
        v[key] = item.label;
      }else{
        message.error('Address error. Please re-select')
        return;
      }
    });
    
    v.isDefault = isDefault;
    console.log(v)
   
  
    
  };
  


  const getProvinces = async () => {
    try {
      const res: any = await axios(
        "https://vn-public-apis.fpo.vn/provinces/getAll?limit=-1"
      );
      setLocationData((pre) => ({
        ...pre,
        provinces: res.data.data.data.map((v: ProvincesResponse) => ({
          label: v.name,
          value: v.code,
        })),
      }));
    } catch (error) {
      console.log(error);
    }
  };

  
  const getDistricts = async (provinceCode: string) => {
    try {
      const res = await axios(
        `https://vn-public-apis.fpo.vn/districts/getByProvince?provinceCode=${provinceCode}&limit=-1`
      );
      setLocationData((pre) => ({
        ...pre,
        districts: res.data.data.data.map((v: ProvincesResponse) => ({
          label: v.name,
          value: v.code,
        })),
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const getWards = async (districtCode: string) => {
    try {
      const res = await axios(
        `https://vn-public-apis.fpo.vn/wards/getByDistrict?districtCode=${districtCode}&limit=-1`
      );
      setLocationData((pre) => ({
        ...pre,
        wards: res.data.data.data.map((v: ProvincesResponse) => ({
          label: v.name,
          value: v.code,
        })),
      }));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Typography.Title level={3}>Add new address</Typography.Title>
      <Form
        layout="vertical"
        disabled={isLoading}
        onFinish={handleSubmit}
        form={form}
      >
        <Form.Item name={"name"} label={"Name"} rules={[{ required: true }]}>
          <Input allowClear />
        </Form.Item>
        <Form.Item
          name={"phoneNumber"}
          label={"Phone number"}
          rules={[{ required: true }]}
        >
          <Input allowClear />
        </Form.Item>
        <Form.Item
          name={"houseNo"}
          label={"House no"}
          rules={[{ required: true }]}
        >
          <Input allowClear />
        </Form.Item>

        {/* Province */}
        <Form.Item name={"province"} label={"Province"} rules={[{ required: true }]}>
          <Select
            value={locationValues.province}
            onChange={async (v) => {
              await getDistricts(v);
              // Reset district và ward khi tỉnh thay đổi
              setLocationValues({ district: "", province: v, ward: "" });
              // Reset lại giá trị của các Select trên giao diện
              form.setFieldsValue({
                district: undefined,
                ward: undefined,
              });
            }}
            optionLabelProp="label"
            showSearch
            filterOption={(input, option) =>
              (replaceName(option?.label as string) ?? "").includes(
                replaceName(input)
              )
            }
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? "")
                .toLowerCase()
                .localeCompare((optionB?.label ?? "").toLowerCase())
            }
            placeholder={"Select province"}
            options={locationData.provinces}
          />
        </Form.Item>

        {/* District */}
        <Form.Item name={"district"} label={"District"} rules={[{ required: true }]}>
          <Select
            value={locationValues.district}
            onChange={async (v) => {
              await getWards(v);
              // Reset ward khi district thay đổi
              setLocationValues((p) => ({ ...p, district: v, ward: "" }));
              // Reset lại giá trị ward trên giao diện
              form.setFieldsValue({
                ward: undefined,
              });
            }}
            disabled={!locationValues.province}
            optionLabelProp="label"
            showSearch
            filterOption={(input, option) =>
              (replaceName(option?.label as string) ?? "").includes(
                replaceName(input)
              )
            }
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? "")
                .toLowerCase()
                .localeCompare((optionB?.label ?? "").toLowerCase())
            }
            placeholder={"Select district"}
            options={locationData.districts}
          />
        </Form.Item>

        {/* Ward */}
        <Form.Item name={"ward"} label={"Ward"} rules={[{ required: true }]}>
          <Select
            value={locationValues.ward}
            onChange={(v) => setLocationValues((p) => ({ ...p, ward: v }))}
            disabled={!locationValues.district}
            optionLabelProp="label"
            showSearch
            filterOption={(input, option) =>
              (replaceName(option?.label as string) ?? "").includes(
                replaceName(input)
              )
            }
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? "")
                .toLowerCase()
                .localeCompare((optionB?.label ?? "").toLowerCase())
            }
            placeholder={"Select ward"}
            options={locationData.wards}
          />
        </Form.Item>

        <Form.Item name={"isDefault"}>
          <Checkbox
            checked={isDefault}
            onChange={() =>
              setIsDefault(!isDefault)
            }
          >
            Make this address default?
          </Checkbox>
        </Form.Item>
      </Form>
      <Button type="primary" size="large" onClick={() => form.submit()}>
        Add new address
      </Button>
    </div>
  );
};

export default AddressComponent;
