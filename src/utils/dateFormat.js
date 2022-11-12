import moment from 'moment'
function datetimeFormat(dateString){
  return moment(dateString).format('YYYY-MM-DD HH:mm:ss');
}

function dateFormat(dateString){
  return moment(dateString).format('YYYY-MM-DD');
}

export {dateFormat, datetimeFormat}