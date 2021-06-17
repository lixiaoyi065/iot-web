// 深拷贝
export function depClone() {
  
}
export function stringToArray(arr) {
  console.log("=======")
  return arr.split(','); 
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