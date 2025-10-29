import React from "react";
import { Col, Row, Card, Space } from "antd";
import styles from "./index.module.scss";
import { UserOutlined } from "@ant-design/icons";

const Index: React.FC = () => {
  return (
    <Space direction="vertical" size={24} style={{ width: "100%" }}>
      <Row gutter={16}>
        <Col span={6}>
          <Card size="small" hoverable>
            <div className={styles.card}>
              <div>
                <p>文章数</p>
                <p>136</p>
              </div>
              <div>
                <UserOutlined style={{ fontSize: "30px" }} />
              </div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small" hoverable>
            <div className={styles.card}>
              <div>
                <p>用户数</p>
                <p>123</p>
              </div>
              <div>
                <UserOutlined style={{ fontSize: "30px" }} />
              </div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small" hoverable>
            <div className={styles.card}>
              <div>
                <p>留言板</p>
                <p>1109</p>
              </div>
              <div>
                <UserOutlined style={{ fontSize: "30px" }} />
              </div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small" hoverable>
            <div className={styles.card}>
              <div>
                <p>总访问量</p>
                <p>576</p>
              </div>
              <div>
                <UserOutlined style={{ fontSize: "30px" }} />
              </div>
            </div>
          </Card>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={6}>
          <Card size="small" hoverable>
            <div className={styles.card}>
              <div>
                <p>文章数</p>
                <p>136</p>
              </div>
              <div>
                <UserOutlined style={{ fontSize: "30px" }} />
              </div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small" hoverable>
            <div className={styles.card}>
              <div>
                <p>用户数</p>
                <p>123</p>
              </div>
              <div>
                <UserOutlined style={{ fontSize: "30px" }} />
              </div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small" hoverable>
            <div className={styles.card}>
              <div>
                <p>留言板</p>
                <p>1109</p>
              </div>
              <div>
                <UserOutlined style={{ fontSize: "30px" }} />
              </div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small" hoverable>
            <div className={styles.card}>
              <div>
                <p>总访问量</p>
                <p>576</p>
              </div>
              <div>
                <UserOutlined style={{ fontSize: "30px" }} />
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </Space>
  );
};

export default Index;
