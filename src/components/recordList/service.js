import request from "../../utils/request";

// 获取投递列表
const getRecordList = async (params) => {
  console.log("parmas", params);
  return await request.post('/list/record', params)
}

// 修改投递记录
const modifyRecord = async (params) => {
  // console.log("parmas", params);
  return await request.put('/list/edit', params)
}
// 修改备注
const modifyDesc = async (params) => {
  // console.log("parmas", params);
  return await request.post('/list/desc', params)
}
// 删除记录
const deleteRecord = async (params) => {
  // console.log("parmas", params);
  return await request.delete('/list/delete', {params})
}
// 新增记录
const addRecord = async (params) => {
  // console.log("parmas", params);
  return await request.post('/list/add', params)
}
export {getRecordList, modifyRecord, modifyDesc, deleteRecord, addRecord} 