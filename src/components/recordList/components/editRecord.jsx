import React from "react";
import {
  Modal,
  Form,
  InputNumber,
  DatePicker,
  Select,
  message,
  Row,
  Col,
  Radio,
} from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { datetimeFormat } from "../../../utils/dateFormat";
import { modifyRecord } from "../service";
import { statusOptions } from "../datamap";
import { editFormitem, radioOptions } from "./datamap";

export default class EditRecord extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmLoading: false,
    };
  }
  editRecordRef = React.createRef();

  handleCancel = () => {
    this.props.setVisibleFn(false);
  };
  handleOk = () => {
    const { record } = this.props;
    if (record.status == -1) return this.props.setVisibleFn(false);
    this.setState({ confirmLoading: true });
    // this.editRecordRef.current.validateFields().then(values => console.log(values))
    // 请求更改数据库
    const params = {
      record_id: record.record_id,
      ...this.editRecordRef.current.getFieldsValue(),
    };
    // console.log(params);
    modifyRecord(params).then((res) => {
      // console.log(res, "--modifyRes");
      if (res.data.status === 200) {
        message.success("记录修改成功");
      } else {
        message.error("修改失败，请检查修改的信息");
      }
      this.setState({ ...this.state, confirmLoading: false });
    });
    this.props.gatherRecordList();
    this.props.setVisibleFn(false);
  };

  render() {
    const { record, visible } = this.props;
    const isStop = record.status == -1 ? true : false;
    const formLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    };
    return (
      <div className="edit-container">
        <Modal
          open={visible}
          title={record.company}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          cancelText="取消"
          okText="确认"
          confirmLoading={this.state.confirmLoading}
          style={{ minWidth: "540px" }}
        >
          <Form
            ref={this.editRecordRef}
            name="editForm"
            {...formLayout}
          >
            <Row gutter={16}>
              <Col span={10}>
                <Form.Item name="status" label="当前状态">
                  <Select
                    style={{ width: "150px" }}
                    options={statusOptions}
                    defaultValue={record.status}
                    disabled={isStop}
                  ></Select>
                </Form.Item>
              </Col>
            </Row>

            {editFormitem.map((formitem) => (
              <Row gutter={16}>
                <Col span={10}>
                  <Form.Item
                    key={formitem.value}
                    name={formitem.name}
                    label={formitem.label}
                  >
                    {record[formitem.name] ? (
                      <span>{datetimeFormat(record[formitem.name])}</span>
                    ) : (
                      <DatePicker showTime disabled={isStop}></DatePicker>
                    )}
                  </Form.Item>
                </Col>
                <Col span={14}>
                  {record.status !== -1 &&
                  (!record[formitem.name] ||
                    record[formitem.status_name] === 0) ? (
                    <Form.Item
                      name={formitem.status_name}
                      key={formitem.status_name}
                    >
                      <Radio.Group
                        options={radioOptions}
                        defaultValue={0}
                      ></Radio.Group>
                    </Form.Item>
                  ) : record[formitem.status_name] === 1 ? (
                    <CheckCircleOutlined style={{ color: "green" }} />
                  ) : (
                    <CloseCircleOutlined style={{ color: "red" }} />
                  )}
                </Col>
              </Row>
            ))}
            <Row gutter={16}>
              <Col span={16}>
                <Form.Item name="money" label="年薪总包
                "
                labelCol={{span: 3.5}}
                wrapperCol={{span: 20.5}}
                >
                  {record.money ? (
                    <span>{datetimeFormat(record.money)}</span>
                  ) : (
                    <InputNumber
                      placeholder="请输入总包金额"
                      style={{ width: "120px" }}
                      disabled={isStop}
                    />
                  )}
                  &nbsp;万元/年
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    );
  }
}
