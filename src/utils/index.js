// 深拷贝
export function depClone() {
  
}
export function stringToArray(arr) {
  return arr && arr.length > 0 ? arr.split(',') : null
}

export function setCookie (key, value, day) {
  let expires = day * 86400 * 1000  // 时间转化成 ms
  let date = new Date( + new Date() + expires) // 当前时间加上要存储的时间
  document.cookie = `${key}=${value};expires=${date.toUTCString()}`
}

export function getCookie(cname){
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i=0; i<ca.length; i++) 
  {
    var c = ca[i].trim();
    if (c.indexOf(name)===0) return c.substring(name.length,c.length);
  }
  return "";
}

//下载文件
export function downFile(res, fileName) {
  const blob = new Blob([res], { type: 'text/plain;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  let a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);
}

/**
 * 判断是否为有效编辑
 * gist: 依据
 * key：判断对象的key
 * dataIndex: 判断字段
 * val: 判断的字段值
 * return bool
 */
export function isEffectiveEditor(gist, key, dataIndex, val){
  return gist.some(item => {
    if(item.key === key){
      console.log(item[dataIndex] === val)
      return item[dataIndex] === val
    }
  })
}