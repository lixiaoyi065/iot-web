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
export function isEffectiveEditor(gist, key, dataIndex, val) {
  if (gist.length === 0) {
    return false
  }
  return gist.some(item => {
    if (item.key === key) {
      return item[dataIndex] === val
    }
    return false
  })
}

/**
 * 判断值是否唯一
 * @param {*} dataArr : 依据
 * @param {*} key ：判断的key
 * @param {*} val ：判断的字段值
 * true: 唯一 
 */
export function isRepeat(dataArr, key, val) {
  let len = 1;
  if (dataArr.length > 0) {
    dataArr.forEach(item => {
      if (item[key] === val) {
        len++;
      }
    })
    if (len > 1) {
      return false
    } else {
      return true
    }
  } else {
    return true
  }
}

export function hasKey(dataList, key, val) {
  dataList.some()
}


//防抖
export function debounce(fn, wait, immediate = false){
  let timer, startTimeStamp = 0;
  let context, args;
 
  let run = (timerInterval) => {
    timer = setTimeout(() => {
      let now = (new Date()).getTime();
      let interval = now - startTimeStamp
      if (interval < timerInterval) {
        startTimeStamp = now;
        run(wait - interval);
      } else {
        if (!immediate) {
          fn.apply(context, args);
        }
        clearTimeout(timer);
        timer = null;
      }
			
    }, timerInterval);
  }
 
  return function () {
    context = this;
    args = arguments;
    let now = (new Date()).getTime();
    startTimeStamp = now;
 
    if (!timer) {
      if (immediate) {
        fn.apply(context, args);
      }
      run(wait);
    }
  }
}