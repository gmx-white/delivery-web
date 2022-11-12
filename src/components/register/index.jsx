import React from "react";
import { Form, Input, Button, Checkbox, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { checkUsername, registerUser } from "../../utils/service";
import "./style.css";

class Register extends React.Component {
  registerRef = React.createRef();
  // 点击注册回调
  registerIn = () => {
    this.registerRef.current.validateFields()
    .then(values => {
      // console.log(values);
      registerUser(values).then(res => {
        if(res.data?.status === 200) {
          message.success(res.data.msg)
          // TODO 账号密码写进redux
          window.location.href='/login'
        } else {
          message.error("注册失败")
        }
      })
    })
  }
  render() {
    const formItemLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 18,
      },
    };
    const userRules = [
      { required: true, message: "账号不可以为空", trigger: "blur" },
      {
        max: 16,
        min: 3,
        message: "账号长度为3-16个字符",
        validateTrigger: "onBlur",
      },
      () => ({
        async validator(_, value) {
          const { data } = await checkUsername({ username: value });
          if (data.status === 200) {
            return Promise.resolve();
          } else {
            return Promise.reject(new Error("用户已经存在了"));
          }
        },
      }),
    ];
    
    return (
      <div className="register-container">
        <div className="register-content">
          <div className="register-wrapper">
            <Form ref={this.registerRef} name="registerForm">
              <Form.Item
                name="username"
                {...formItemLayout}
                label="账号"
                rules={userRules}
                validateTrigger="onBlur"
              >
                <Input placeholder="请输入账号" prefix={<UserOutlined />} />
              </Form.Item>
              <Form.Item
                {...formItemLayout}
                name="pwd"
                label="密码"
                rules={[
                  { required: true, message: "密码不可以为空" },
                  { min: 6, max: 16, message: "密码长度在6-16个字符之间" },
                ]}
                validateTrigger="onBlur"
              >
                <Input.Password
                  placeholder="请输入密码"
                  prefix={<LockOutlined />}
                />
              </Form.Item>
              <Form.Item
                {...formItemLayout}
                name="pwdconfirm"
                label="确认密码"
                rules={[
                  {
                    required: true,
                    message: "请输入确认密码",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("pwd") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("两次密码不一致"));
                    },
                  }),
                ]}
                validateTrigger="onBlur"
              >
                <Input.Password
                  placeholder="请输入密码"
                  prefix={<LockOutlined />}
                />
              </Form.Item>
              <Button type="primary" block style={{ marginBottom: "10px" }}
              onClick={this.registerIn}>
                注册
              </Button>
              <Button
                type="default"
                block
                onClick={() => (window.location.href = "/login")}
              >
                已有账号，去登录
              </Button>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}

export default Register;
