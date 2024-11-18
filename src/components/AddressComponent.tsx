import handleAPI from "@/apis/handleAPI";
import { API } from "@/configurations/configurations";
import { AddressResponse } from "@/model/AddressModel";
import { SelectModel } from "@/model/FormModel";
import { replaceName } from "@/utils/replaceName";
import {
  Button,
  Card,
  Checkbox,
  Form,
  Input,
  message,
  Select,
  Typography,
} from "antd";
import axios from "axios";
import { useEffect, useRef, useState } from "react";

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

interface Props {
  onAddNew: (v: AddressResponse) => void;
  onUpdate: (v: AddressResponse) => void;
  address?: AddressResponse;
}

const AddressComponent = (props: Props) => {
  const { onAddNew, address, onUpdate } = props;
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

  useEffect(() => {
    if (address) {
      form.setFieldsValue(address);
      setIsDefault(address.isDefault ?? false);
      setLocationValues({
        district: address.district,
        province: address.province,
        ward: address.ward,
      });
      const provinceCode = findCode(
        locationData.provinces,
        address.province
      )?.value;
      if (provinceCode) {
        getDistricts(provinceCode).then((data: SelectModel[]) => {
          if (data && data.length) {
            const districtCode = findCode(data, address.district)?.value;
            if (districtCode) {
              getWards(districtCode);
            }
          }
        });
      }
    }
  }, [address]);

  const findCode = (selects: SelectModel[], label: string) => {
    return selects.find((e) => e.label === label);
  };

  const handleSubmit = async (v: any) => {
    const items: any = { ...locationData };
    Object.entries(locationValues).forEach(([key, value]) => {
      if (Number.parseInt(value as string)) {
        const selects: SelectModel[] = items[key + "s"];
        const item = selects.find((e) => e.value === value);
        if (item) {
          console.log(`${key} label: ${item.label}`);
          v[key] = item.label;
        } else {
          message.error("Location error");
        }
      }
    });

    v.isDefault = isDefault;
    setIsLoading(true);

    const api = address ? `${API.ADDRESSES}/${address.id}` : API.ADDRESSES;

    try {
      const res = await handleAPI(api, v, address ? "put" : "post");
      if (address) {
        onUpdate(res.data.result);
      } else {
        onAddNew(res.data.result);
      }
      form.resetFields();
      setLocationValues({ ward: "", district: "", province: "" });
      setLocationData((p) => ({ ...p, districts: [], wards: [] }));
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getProvinces = async () => {
    setIsLoading(true);
    try {
      const res: any = await axios(
        "https://vn-public-apis.fpo.vn/provinces/getAll?limit=-1"
      );
      const selects = res.data.data.data.map((v: ProvincesResponse) => ({
        label: v.name,
        value: v.code,
      }));
      setLocationData((pre) => ({
        ...pre,
        provinces: selects,
      }));
      return selects;
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDistricts = async (provinceCode: string) => {
    setIsLoading(true);
    try {
      const res = await axios(
        `https://vn-public-apis.fpo.vn/districts/getByProvince?provinceCode=${provinceCode}&limit=-1`
      );
      const selects = res.data.data.data.map((v: ProvincesResponse) => ({
        label: v.name,
        value: v.code,
      }));
      setLocationData((pre) => ({
        ...pre,
        districts: selects,
      }));
      return selects;
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getWards = async (districtCode: string) => {
    setIsLoading(true);
    try {
      const res = await axios(
        `https://vn-public-apis.fpo.vn/wards/getByDistrict?districtCode=${districtCode}&limit=-1`
      );
      const selects = res.data.data.data.map((v: ProvincesResponse) => ({
        label: v.name,
        value: v.code,
      }));
      setLocationData((pre) => ({
        ...pre,
        wards: selects,
      }));
      return selects;
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <Typography.Title level={3}>
        {address ? "Update" : "Add new"}
        {" address"}
      </Typography.Title>
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
        <Form.Item
          name={"province"}
          label={"Province"}
          rules={[{ required: true }]}
        >
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
        <Form.Item
          name={"district"}
          label={"District"}
          rules={[{ required: true }]}
        >
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
            onChange={() => setIsDefault(!isDefault)}
          >
            Make this address default?
          </Checkbox>
        </Form.Item>
      </Form>
      <Button type="primary" size="large" onClick={() => form.submit()}>
        {address ? "Update" : "Add new"}
        {" address"}
      </Button>
    </Card>
  );
};

export default AddressComponent;
