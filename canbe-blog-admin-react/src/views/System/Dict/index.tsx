import { Card, Col, Row } from "antd";
import React,{useState} from "react";
import DictLayout from "./DictLayout.tsx";
import styles from "./index.module.scss";
import Left from "./Left";

const Dict: React.FC = () => {

  const [sysDict, setSysDict] = useState<SysDict>({} as SysDict);

  const onSelect = (record:SysDict) => { 
    setSysDict(record);
  };

  return (
    <div className={styles.dictContainer}>
      <Row gutter={16}>
        <Col span={6}>
          <Card className={styles.leftCard}>
            <Left onSelect={onSelect}/>
          </Card>
        </Col>
        <Col span={18}>
          <Card style={{ width: "100%", marginBottom: "20px" }}>
            <div className={styles.dictTitle}>字典类型</div>
            <table className={styles.dictTable}>
              <tbody>
                <tr>
                  <td>类型名称</td>
                  <td>{sysDict.name}</td>
                  <td>类型编码</td>
                  <td>{sysDict.type}</td>
                  <td>状态</td>
                  <td>{sysDict.status}</td>
                </tr>
                <tr>
                  <td>备注</td>
                  <td colSpan={5}>{sysDict.remark}</td>
                </tr>
              </tbody>
            </table>
          </Card>
          <div className={styles.rightPanel}>
            <DictLayout currSysDict={sysDict}/>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Dict;
