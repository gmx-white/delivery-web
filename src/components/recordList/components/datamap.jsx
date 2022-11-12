const editFormitem = [
  {value: 0, name: "write_date", label: "笔试时间", status_name: "write_status"},
  {value: 1, name: "first_date", label: "一面时间", status_name: "first_status"},
  {value: 2, name: "second_date", label: "二面时间", status_name: "second_status"},
  {value: 3, name: "third_date", label: "三面时间", status_name: "third_status"},
  {value: 4, name: "hr_date", label: "hr面时间", status_name: "hr_status"}
]

const radioOptions = [
  {label: '等待中', value: 0},
  {label: '已通过', value: 1},
  {label: '未通过', value: -1},
]

export {editFormitem, radioOptions}