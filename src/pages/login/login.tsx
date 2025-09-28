import React, { useState } from "react";
import { Form, Input, Button, Card, Tabs, message } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { authAPI } from "@/services/auth";
import styles from "./login.less";

interface LoginForm {
  username: string;
  password: string;
}

interface RegisterForm {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
}

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");

  const onLogin = async (values: LoginForm) => {
    setLoading(true);
    try {
      const response = await authAPI.login(values);

      if (response && response.access_token) {
        localStorage.setItem("token", response.access_token);
        localStorage.setItem(
          "user",
          JSON.stringify(response.user || { username: values.username }),
        );

        message.success("登录成功！");

        // 跳转到聊天页面
        setTimeout(() => {
          window.location.href = "/chat";
        }, 1000);
      } else {
        message.error("登录失败，请检查用户名和密码");
      }
    } catch (error) {
      console.error("Login error:", error);
      message.error("登录失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  const onRegister = async (values: RegisterForm) => {
    setLoading(true);
    try {
      const { confirmPassword, ...registerData } = values;

      const response = await authAPI.register(registerData);

      if (response && response.username) {
        message.success("注册成功！请登录");

        // 切换到登录标签
        setActiveTab("login");
      } else {
        message.error(response.message || "注册失败");
      }
    } catch (error) {
      console.error("Register error:", error);
      message.error("注册失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <div className={styles.loginHeader}>
          <div className={styles.logo}>
            <span className={styles.mysticalIcon}>🔮</span>
            <h1>神秘预言师</h1>
          </div>
          <p className={styles.subtitle}>陈大师在线算命</p>
        </div>

        <Card className={styles.loginCard}>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            centered
            className={styles.loginTabs}
            items={[
              {
                key: "login",
                label: "登录",
                children: (
                  <Form
                    name="login"
                    onFinish={onLogin}
                    autoComplete="off"
                    size="large"
                    layout="vertical"
                  >
                    <Form.Item
                      label="用户名"
                      name="username"
                      rules={[{ required: true, message: "请输入用户名！" }]}
                    >
                      <Input
                        prefix={<UserOutlined />}
                        placeholder="请输入用户名"
                      />
                    </Form.Item>

                    <Form.Item
                      label="密码"
                      name="password"
                      rules={[{ required: true, message: "请输入密码！" }]}
                    >
                      <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="请输入密码"
                      />
                    </Form.Item>

                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        block
                        className={styles.submitButton}
                      >
                        登录
                      </Button>
                    </Form.Item>
                  </Form>
                ),
              },
              {
                key: "register",
                label: "注册",
                children: (
                  <Form
                    name="register"
                    onFinish={onRegister}
                    autoComplete="off"
                    size="large"
                    layout="vertical"
                  >
                    <Form.Item
                      label="用户名"
                      name="username"
                      rules={[
                        { required: true, message: "请输入用户名！" },
                        { min: 2, message: "用户名至少2个字符！" },
                      ]}
                    >
                      <Input
                        prefix={<UserOutlined />}
                        placeholder="请输入用户名"
                      />
                    </Form.Item>

                    <Form.Item
                      label="邮箱"
                      name="email"
                      rules={[
                        { required: true, message: "请输入邮箱！" },
                        { type: "email", message: "请输入有效的邮箱地址！" },
                      ]}
                    >
                      <Input
                        prefix={<MailOutlined />}
                        placeholder="请输入邮箱"
                      />
                    </Form.Item>

                    <Form.Item
                      label="密码"
                      name="password"
                      rules={[
                        { required: true, message: "请输入密码！" },
                        { min: 6, message: "密码至少6个字符！" },
                      ]}
                    >
                      <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="请输入密码"
                      />
                    </Form.Item>

                    <Form.Item
                      label="确认密码"
                      name="confirmPassword"
                      dependencies={["password"]}
                      rules={[
                        { required: true, message: "请确认密码！" },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue("password") === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(
                              new Error("两次密码不一致！"),
                            );
                          },
                        }),
                      ]}
                    >
                      <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="请确认密码"
                      />
                    </Form.Item>

                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        block
                        className={styles.submitButton}
                      >
                        注册
                      </Button>
                    </Form.Item>
                  </Form>
                ),
              },
            ]}
          />
        </Card>

        <div className={styles.loginFooter}>
          <p>© 2025 神秘预言师 - 专业在线算命服务</p>
        </div>
      </div>
    </div>
  );
}
