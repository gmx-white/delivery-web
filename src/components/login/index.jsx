import React from "react";
// import { Navigate } from "react-router-dom";
import { Form, Input, Button, Checkbox, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { userLogin } from "../../utils/service";
import "./index.css";
class Login extends React.Component {
  loginInfoForm = React.createRef();
  loginCheck = async () => {
      this.loginInfoForm.current.validateFields()
      .then(async data => 
        {
          const res = await userLogin(data)
        if (res.data.status === 200){
          message.success('登录成功')
          sessionStorage.setItem("token", res.data.token)
          window.location.href = '/list'
          // Navigate('/list')
          // console.log(this.props);
        } else {
          message.error(res.data.msg)
        }
        }
      )
  }

  render() {
    const formItemLayout = {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 20,
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
    ];
    const passwordRules = [{ required: true, message: "密码不可以为空" }];

    return (
      <div className="login-container">
        <div className="login-content">
          <div className="login-wrapper">
            <Form ref={this.loginInfoForm} name="login">
              <Form.Item
                {...formItemLayout}
                name="username"
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
                rules={passwordRules}
                validateTrigger="onBlur"
              >
                <Input.Password
                  placeholder="请输入密码"
                  prefix={<LockOutlined />}
                />
              </Form.Item>
              <Form.Item>
                <Form.Item name="remember" valuePropName="checked" 
                noStyle
                >
                  <Checkbox style={{float: 'left'}}>记住我</Checkbox>
                </Form.Item>

                <a className="fr" href="">
                  忘记密码
                </a>
              </Form.Item>

              <Form.Item
              style={{marginBottom: '0px'}}
              >
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                  onClick={this.loginCheck}
                >
                  登录
                </Button>
                没有账号？ <a href="/register">立即注册</a>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
