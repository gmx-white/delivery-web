import {
  Button,
  Form,
  Input,
  DatePicker,
  Select,
  Divider,
  Tag,
  Popover,
  message,
  Popconfirm,
  Pagination,
} from "antd";
import React from "react";
import {
  HomeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FormOutlined,
  DeleteOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import {
  deliveryIcon,
  filterIcon,
  writtenIcon,
  interviewIcon,
  offerIcon,
  statusOptions,
  interviewOptions,
} from "./datamap";
import { getRecordList, modifyDesc, deleteRecord } from "./service";
import { dateFormat, datetimeFormat } from "../../utils/dateFormat";
import sortIcon from "../../assets/img/icon-sort.png";
import sortIconUp from "../../assets/img/icon-sort-up.png";
import sortIconDown from "../../assets/img/icon-sort-down.png";
import sortIconUpHover from "../../assets/img/icon-sort-up-hover.png";
import sortIconDownHover from "../../assets/img/icon-sort-down-hover.png";
import EditRecord from "./components/editRecord";
import AddRecord from "./components/addRecord";

import "./index.css";

const { RangePicker } = DatePicker;
class RecordList extends React.Component {
  constructor() {
    super();
    this.state = {
      // 搜索栏状态
      company: "",
      startDate: null,
      endDate: null,
      selectedStatus: 0,
      // 筛选栏状态
      sortType: "date",
      sortOptions: [
        { name: "按投递日期", value: "date", isUp: 0 },
        { name: "按流程进度", value: "status", isUp: undefined },
        { name: "按年薪", value: "money", isUp: undefined },
      ],
      // 表格数据
      tableSource: [],
      // 编辑框
      isEditOpen: false,
      pagesize: 10,
      pagenum: 1,
      total: 0,
      // 新增框
      isAddOpen: false,
    };
    this.gatherRecordList();
    this.editRecordSource = null;
  }
  listSearchForm = React.createRef();
  changeSortType(e, option) {
    const newOptions = this.state.sortOptions.map((item) => {
      if (item.value !== option.value) {
        return { ...item, isUp: undefined };
      } else {
        return { ...item, isUp: !item.isUp ? 1 : 0 };
      }
    });
    // 回调函数里面发请求
    this.setState(
      {
        // ...this.state,
        sortType: option.value,
        sortOptions: newOptions,
      },
      this.gatherRecordList
    );
  }
  // 请求投递列表s
  gatherRecordList = (pagenum = 1, pagesize = 10) => {
    const params = {
      c_name: this.state.company,
      start_date: this.state.startDate,
      end_date: this.state.endDate,
      status: this.state.selectedStatus,
      sort_type: this.state.sortType,
      up: this.state.sortOptions.filter(
        (item) => item.value === this.state.sortType
      )[0].isUp,
      pagenum,
      pagesize,
    };
    getRecordList(params).then((res) => {
      console.log(res.data);
      if (res.data.status === 200) {
        console.log(res.data.data);
        this.setState({ tableSource: res.data.data, total: res.data.total });
      }
    });
  };
  // 分页切换
  onChangePage = (pagenum, pagesize) => {
    // console.log(pagenum, pagesize);
    this.gatherRecordList(pagenum, pagesize);
    this.setState({ pagenum, pagesize });
  };
  // 删除投递记录
  deleteConfirm(e, record_id) {
    // console.log("delete", record_id);
    let params = {
      record_id,
    };
    deleteRecord(params).then((res) => {
      if (res.data.status === 200) {
        message.success(res.data.msg);
      }
    });
    // 删除完重新拉一遍列表
    this.gatherRecordList();
  }
  // 编辑投递记录
  editRecord(e, item) {
    // console.log(item);
    this.editRecordSource = item;
    this.setVisibleFn(true);
  }
  // 新增投递记录
  addRecord = () => {
    this.setAddVisibleFn(true);
  };
  // 流程进度提示框
  popoverContent = (
    <ul className="tip-content">
      <li>
        <span
          className="tool-color"
          style={{ backgroundColor: "#ffd591" }}
        ></span>
        <span>流程尚未开始或等待结果中</span>
      </li>
      <li>
        <span
          className="tool-color"
          style={{ backgroundColor: "#b7eb8f" }}
        ></span>
        <span>当前流程通过</span>
      </li>
      <li>
        <span
          className="tool-color"
          style={{ backgroundColor: "#ffccc7" }}
        ></span>
        <span>当前流程终止</span>
      </li>
    </ul>
  );
  // 编辑框弹出
  setVisibleFn = (bool) => {
    this.setState({ isEditOpen: bool });
  };
  // 新增框弹出
  setAddVisibleFn = (bool) => {
    this.setState({ isAddOpen: bool });
  };
  // 备注修改
  updateDesc = (e, record_id, desc_name) => {
    let params = {
      record_id,
      desc_name,
      desc: e.target.value,
    };
    modifyDesc(params).then((res) => {
      // if (res.data.status === 200) {
      //   message.success(res.data.msg);
      // }
      // if (res.data.status === 500) {
      //   message.error(res.data.msg);
      // }
    });
  };

  render() {
    const { sortType, sortOptions, tableSource, isEditOpen, isAddOpen } =
      this.state;

    return (
      <div className="record-list-container">
        <header className="record-header">xxx的秋招记录</header>
        <Button
          className="record-logout"
          type="default"
          onClick={() => {
            window.location.href = "./";
          }}
        >
          退出
        </Button>
        <div className="record-list-wrapper">
          <div className="record-list-search">
            <Form
              ref={this.listSearchForm}
              name="listSearch"
              layout="inline"
              style={{ margin: "30px 0 0 64px" }}
            >
              <Form.Item name="company" label="企业">
                <Input
                  placeholder="请输入企业名称"
                  prefix={<HomeOutlined />}
                  allowClear
                  onChange={(e) =>
                    this.setState(
                      { company: e.target.value },
                      this.gatherRecordList
                    )
                  }
                />
              </Form.Item>
              <Form.Item label="投递日期" name="date">
                <RangePicker
                  onChange={(value, dateString) =>
                    this.setState(
                      {
                        // ...this.state,
                        startDate: dateString[0],
                        endDate: dateString[1],
                      },
                      this.gatherRecordList
                    )
                  }
                ></RangePicker>
              </Form.Item>
              <Form.Item label="当前状态" name="status">
                <Select
                  defaultValue={0}
                  options={statusOptions}
                  // value={this.state.selectedStatus}
                  onChange={(value) =>
                    this.setState(
                      { selectedStatus: value },
                      this.gatherRecordList
                    )
                  }
                  style={{ width: "128px" }}
                  popupClassName="search-status-selector"
                  getPopupContainer={(e) => e.parentNode}
                ></Select>
              </Form.Item>
            </Form>
            <div className="record-add">
              <Button type="primary" onClick={this.addRecord}>
                新增记录
              </Button>
            </div>
          </div>
          <div className="record-list-sort">
            <div className="sort-inner">
              <div className="list-sort-options">
                <ul>
                  {sortOptions.map((item) => (
                    <li
                      className={sortType === item.value ? "selected" : ""}
                      onClick={(e) => this.changeSortType(e, item)}
                      key={item.value}
                    >
                      {item.name}{" "}
                      <span className={item.isUp ? "up" : "down"}>
                        {sortType === item.value ? (
                          item.isUp ? (
                            <img
                              src={sortIconUp}
                              className="img-sort-up"
                              alt="sort-up"
                            />
                          ) : (
                            <img
                              src={sortIconDown}
                              className="img-sort-down"
                              alt="sort-down"
                            />
                          )
                        ) : (
                          <img src={sortIcon} alt="sort-icon" />
                        )}
                        <img
                          src={sortIconUpHover}
                          className="img-sort-up-hover"
                          alt="sort-up-hover"
                        />
                        <img
                          src={sortIconDownHover}
                          className="img-sort-down-hover"
                          alt="sort-down-hover"
                        />
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <Divider orientation="left" plain></Divider>
              <div className="list-wrapper"></div>
            </div>
          </div>
          <div className="record-list-show">
            {tableSource.map((item, i) => (
              <div className="record-card-wrapper" key={item.record_id}>
                <div className="record-card-title">
                  <div className="card-company-title">
                    <span className="card-icon">
                      <img src={item.link + "/favicon.ico"} alt="" />
                    </span>
                    <a href={item.link} target="_blank">
                      {item.company + "---" + item.office}
                    </a>
                  </div>
                  <div className="operator">
                    {/* 编辑按钮 */}
                    <div
                      className="record-edit"
                      onClick={(e) => this.editRecord(e, item)}
                    >
                      <span className="operation-icon">编辑</span>
                      <FormOutlined
                        style={{
                          fontSize: "32px",
                          color: "#3e6ef9",
                          verticalAlign: "middle",
                        }}
                      />
                    </div>
                    {/* 删除按钮 */}
                    <Popconfirm
                      title="删除记录后不可恢复，确认删除吗?"
                      onConfirm={(e) => this.deleteConfirm(e, item.record_id)}
                      // onCancel={cancel}
                      okText="确认"
                      cancelText="再想想"
                    >
                      <div
                        className="record-delete"
                        // onClick={(e) => this.deleteRecord(e, item.record_id)}
                      >
                        <span className="operation-icon">删除</span>
                        <DeleteOutlined
                          style={{
                            fontSize: "32px",
                            color: "red",
                            verticalAlign: "middle",
                          }}
                        />
                      </div>
                    </Popconfirm>
                  </div>
                </div>
                <br />
                <div className="record-card-content">
                  <ul className="record-card-baseinfo">
                    <li>
                      投递日期：
                      <Tag color="#d3e0ff">
                        <span style={{ color: "#316ef9" }}>
                          {dateFormat(item.date)}
                        </span>
                      </Tag>
                    </li>
                    <li>
                      投递地点：{" "}
                      <Tag color="#d3e0ff">
                        <span style={{ color: "#316ef9" }}>
                          {item.city ? item.city : "----"}
                        </span>
                      </Tag>
                    </li>
                    <li>
                      当前状态：
                      <Tag color="#d3e0ff">
                        {item.status === 0
                          ? deliveryIcon
                          : item.status === 1
                          ? filterIcon
                          : item.status === 2
                          ? writtenIcon
                          : item.status === 3
                          ? interviewIcon
                          : offerIcon}
                        <span style={{ color: "#316ef9" }}>
                          {statusOptions.map((op) => {
                            if (op.value === item.status) return op.label;
                          })}
                        </span>
                      </Tag>
                    </li>
                    <li>
                      笔试时间：{" "}
                      {!item.write_date ? (
                        "--"
                      ) : item.write_status === -1 ? (
                        <Tag color="red">{datetimeFormat(item.write_date)}</Tag>
                      ) : item.write_date === 0 ? (
                        <Tag color="warning">
                          {datetimeFormat(item.write_date)}
                        </Tag>
                      ) : (
                        <Tag color="green">
                          {datetimeFormat(item.write_date)}
                        </Tag>
                      )}
                      {!i && (
                        <Popover
                          title="温馨提示"
                          content={this.popoverContent}
                          getPopupContainer={(target) => target.parentNode}
                        >
                          <QuestionCircleOutlined />
                        </Popover>
                      )}
                    </li>
                  </ul>
                  {item.first_date && (
                    <Divider orientation="left">面试情况</Divider>
                  )}

                  {item.first_date && (
                    <div className="interview-process">
                      <ul className="interview-process-wrapper">
                        {interviewOptions.map((interview) => {
                          return (
                            item[interview.status_name] && (
                              <li>
                                {interview.label}：{" "}
                                {
                                  <Tag
                                    color={
                                      item[interview.status_name] === 0
                                        ? "warning"
                                        : item[interview.status_name] === 1
                                        ? "success"
                                        : "error"
                                    }
                                  >
                                    {datetimeFormat(item[interview.name])}
                                  </Tag>
                                }
                                {item[interview.status_name] === 1 && (
                                  <CheckCircleOutlined
                                    style={{ color: "green" }}
                                  />
                                )}
                                {item[interview.status_name] === -1 && (
                                  <CloseCircleOutlined
                                    style={{ color: "red" }}
                                  />
                                )}
                                <label
                                  htmlFor={interview.desc_name}
                                  style={{ marginLeft: "24px" }}
                                >
                                  备注：{" "}
                                </label>
                                <Input
                                  style={{ width: "200px" }}
                                  id={interview.desc_name}
                                  defaultValue={item[interview.desc_name]}
                                  onBlur={(e) =>
                                    this.updateDesc(
                                      e,
                                      item.record_id,
                                      interview.desc_name
                                    )
                                  }
                                ></Input>
                              </li>
                            )
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <Pagination
            total={this.state.total}
            current={this.state.pagenum}
            showTotal={() => `共${this.state.total}条数据`}
            pageSize={this.state.pagesize}
            pageSizeOptions={[2, 5, 10, 20]}
            defaultCurrent={1}
            showSizeChanger
            onChange={this.onChangePage}
            style={{ display: "flex", justifyContent: "flex-end" }}
          />
        </div>
        {/* 编辑框 */}
        {isEditOpen && (
          <EditRecord
            record={this.editRecordSource}
            setVisibleFn={this.setVisibleFn}
            visible={isEditOpen}
            gatherRecordList={this.gatherRecordList}
          />
        )}
        {/* 新增框 */}
        {isAddOpen && (
          <AddRecord
            setAddVisibleFn={this.setAddVisibleFn}
            visible={isAddOpen}
            gatherRecordList={this.gatherRecordList}
          />
        )}
      </div>
    );
  }
}

export default RecordList;
