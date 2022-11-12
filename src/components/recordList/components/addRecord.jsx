import { Form, Modal, Input, DatePicker, message } from "antd";
import moment from "moment";
import React from "react";
import { addRecord } from "../service";
import {dateFormat} from "../../../utils/dateFormat"

export default class AddRecord extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmLoading: false,
    };
  }
  addRecordRef = React.createRef();
  addRecordComfirm = () => {
    this.addRecordRef.current.validateFields()
    .then((values) => {
      const params = {...values, date: dateFormat(values.date)}
      addRecord(params).then(res => {
        // console.log(res);
        if(res.data.status === 200) {
          message.success("新建成功")
        } else if (res.data.status === 100){
          message.error("必填字段不能为空")
        }
        this.props.gatherRecordList()
      })
      this.props.setAddVisibleFn(false);
    })
    .catch((err) => {})
  };
  cancelAdd = () => {
    // 清除表单

    this.props.setAddVisibleFn(false);
  };
  render() {
    const { visible } = this.props;
    const formLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
    };
    return (
      <div className="addrecord-container">
        <Modal
          open={visible}
          title="新建投递记录"
          onOk={this.addRecordComfirm}
          onCancel={this.cancelAdd}
          okText="确认"
          cancelText="取消"
          confirmLoading={this.state.confirmLoading}
        >
          <Form
            ref={this.addRecordRef}
            name="addForm"
            // preserve={false}
            {...formLayout}
          >
            <Form.Item
              name="company"
              label="公司名称"
              rules={[
                {
                  required: true,
                  message: "公司名称不可以为空",
                  trigger: "blur",
                },
              ]}
            >
              <Input placeholder="请输入公司名称" />
            </Form.Item>
            <Form.Item
              name="link"
              label="投递网址"
            >
              <Input placeholder="请输入公司网址" />
            </Form.Item>
            <Form.Item name="office" label="部门">
              <Input placeholder="请输入投递部门" />
            </Form.Item>
            <Form.Item name="station" label="岗位">
              <Input placeholder="请输入岗位" />
            </Form.Item>
            <Form.Item name="city" label="投递地点">
              <Input placeholder="请输入投递地点" />
            </Form.Item>
            <Form.Item
              name="date"
              label="投递时间"
              rules={[{ required: true, message: "请选择投递时间" }]}
            >
              <DatePicker
                disabledDate={(curdate) =>
                  curdate.diff(moment().format("YYYY-MM-DD"), "days") > 0
                }
              ></DatePicker>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}
