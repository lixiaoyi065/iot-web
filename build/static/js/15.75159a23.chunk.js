(this.webpackJsonpreact_staging=this.webpackJsonpreact_staging||[]).push([[15],{226:function(e,t,n){"use strict";var r=n(227).CopyToClipboard;r.CopyToClipboard=r,e.exports=r},227:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.CopyToClipboard=void 0;var r=a(n(0)),o=a(n(228));function a(e){return e&&e.__esModule?e:{default:e}}function i(e){return(i="function"===typeof Symbol&&"symbol"===typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"===typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function c(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function s(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}function l(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function u(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function f(e,t){return!t||"object"!==i(t)&&"function"!==typeof t?d(e):t}function p(e){return(p=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function d(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function m(e,t){return(m=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function b(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var y=function(e){function t(){var e,n;l(this,t);for(var a=arguments.length,i=new Array(a),c=0;c<a;c++)i[c]=arguments[c];return b(d(n=f(this,(e=p(t)).call.apply(e,[this].concat(i)))),"onClick",(function(e){var t=n.props,a=t.text,i=t.onCopy,c=t.children,s=t.options,l=r.default.Children.only(c),u=(0,o.default)(a,s);i&&i(a,u),l&&l.props&&"function"===typeof l.props.onClick&&l.props.onClick(e)})),n}var n,a,i;return function(e,t){if("function"!==typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&m(e,t)}(t,e),n=t,(a=[{key:"render",value:function(){var e=this.props,t=(e.text,e.onCopy,e.options,e.children),n=s(e,["text","onCopy","options","children"]),o=r.default.Children.only(t);return r.default.cloneElement(o,function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?c(n,!0).forEach((function(t){b(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):c(n).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}({},n,{onClick:this.onClick}))}}])&&u(n.prototype,a),i&&u(n,i),t}(r.default.PureComponent);t.CopyToClipboard=y,b(y,"defaultProps",{onCopy:void 0,options:void 0})},228:function(e,t,n){"use strict";var r=n(229),o={"text/plain":"Text","text/html":"Url",default:"Text"};e.exports=function(e,t){var n,a,i,c,s,l,u=!1;t||(t={}),n=t.debug||!1;try{if(i=r(),c=document.createRange(),s=document.getSelection(),(l=document.createElement("span")).textContent=e,l.style.all="unset",l.style.position="fixed",l.style.top=0,l.style.clip="rect(0, 0, 0, 0)",l.style.whiteSpace="pre",l.style.webkitUserSelect="text",l.style.MozUserSelect="text",l.style.msUserSelect="text",l.style.userSelect="text",l.addEventListener("copy",(function(r){if(r.stopPropagation(),t.format)if(r.preventDefault(),"undefined"===typeof r.clipboardData){n&&console.warn("unable to use e.clipboardData"),n&&console.warn("trying IE specific stuff"),window.clipboardData.clearData();var a=o[t.format]||o.default;window.clipboardData.setData(a,e)}else r.clipboardData.clearData(),r.clipboardData.setData(t.format,e);t.onCopy&&(r.preventDefault(),t.onCopy(r.clipboardData))})),document.body.appendChild(l),c.selectNodeContents(l),s.addRange(c),!document.execCommand("copy"))throw new Error("copy command was unsuccessful");u=!0}catch(f){n&&console.error("unable to copy using execCommand: ",f),n&&console.warn("trying IE specific stuff");try{window.clipboardData.setData(t.format||"text",e),t.onCopy&&t.onCopy(window.clipboardData),u=!0}catch(f){n&&console.error("unable to copy using clipboardData: ",f),n&&console.error("falling back to prompt"),a=function(e){var t=(/mac os x/i.test(navigator.userAgent)?"\u2318":"Ctrl")+"+C";return e.replace(/#{\s*key\s*}/g,t)}("message"in t?t.message:"Copy to clipboard: #{key}, Enter"),window.prompt(a,e)}}finally{s&&("function"==typeof s.removeRange?s.removeRange(c):s.removeAllRanges()),l&&document.body.removeChild(l),i()}return u}},229:function(e,t){e.exports=function(){var e=document.getSelection();if(!e.rangeCount)return function(){};for(var t=document.activeElement,n=[],r=0;r<e.rangeCount;r++)n.push(e.getRangeAt(r));switch(t.tagName.toUpperCase()){case"INPUT":case"TEXTAREA":t.blur();break;default:t=null}return e.removeAllRanges(),function(){"Caret"===e.type&&e.removeAllRanges(),e.rangeCount||n.forEach((function(t){e.addRange(t)})),t&&t.focus()}}},230:function(e,t,n){"use strict";t.a="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAACT0lEQVRYR+2Xv4sTURDHv7MbkisUDCgS8McpaGehWFh46v0BJyeCrQSSnUUsBKtrJIKljUXMzqaxkOvuTlGwE0VBtFKv9QecgqJgxMIiEEfe4YUVk30v8ZKLmNftvpl5n/edmX1vCSM2aMR4MAayZcRJoTiO51T1CgDPFjBlvqmqZ8IwvJ0WwwlIRB4AOP4XMKuuqnotDMMLPQHV6/U9rVbrHBFtA3CJmVc2DKhSqXiFQuE1gEmzCyI6GATB8w0DqlarOzOZzMqapClAXwG8sKTQlMMhAJvW7HpOWa1Wm/Q8760NyPO8Y+Vy+ZGtpuI4PqWqiwMHAnATwEIakKp6RHQWwMlhANnE6Tg/sJT1RdNP27vWEIAvAJYdwExRbx5GyqaY+bENSERmASwNA2hBVeeJ6Ec3KCLyVdUU9cwwgGzijIv6P1VIRHYBeJnYvummZRG5C+Bo4v0EgFziWQF8c5CtxsxzPV0/HIJCREz33EjYPmXmIy6+Npv2Bc2c9L7vXySiLZYz6mGz2ZzP5XLmO3QYgGn908x8K4qiy0S027Lo+2w2e7VYLJobwx+jDSQiJlUHbDswJwCAffl8/l2j0Tjh+/6bUqn0SkSmAdx38Dcmd5i5fegmfZJAZiGnQUTPVHWWmT8YhziO96vqPQB7nQIALWbO2BRyBvoV6DuAJwBMYFPwviPMqhkzd7zP96VQLwt3sx0D2VT8JxX6DGCrbWfrNP+JmbendlkURTNEdB3AjnVatFuYj0R0PgiCjj8JTr/SAwb8LfwYyKb2yCn0EyoiUzSfZJQlAAAAAElFTkSuQmCC"},378:function(e,t,n){"use strict";n.r(t);n(62);var r=n(60),o=(n(72),n(71)),a=n(9),i=n(10),c=n(12),s=n(11),l=n(0),u=n(226),f=n(230),p=n(74);function d(){return Object(p.a)({url:"/AuthorizationManage/GetSerialNumber",method:"get"})}function m(){return Object(p.a)({url:"/AuthorizationManage/GetAuthState",method:"get"})}function b(e){return console.log(e),Object(p.a)({url:"/AuthorizationManage/UploadAuthFile",data:e.formData,method:"post",processData:!1,contentType:!1})}var y=n(63),h=n(3),g=function(e){Object(c.a)(n,e);var t=Object(s.a)(n);function n(){var e;Object(a.a)(this,n);for(var r=arguments.length,i=new Array(r),c=0;c<r;c++)i[c]=arguments[c];return(e=t.call.apply(t,[this].concat(i))).state={nodeID:"",status:"",time:""},e.getSerialNumber=function(){var t=!(arguments.length>0&&void 0!==arguments[0])||arguments[0];d().then((function(n){console.log(n),0===n.code?(e.setState({nodeID:n.data}),t&&o.b.info("\u5df2\u751f\u6210")):o.b.info("\u751f\u6210\u5931\u8d25\uff1a"+n.msg)}))},e.copySerialNumber=function(){o.b.info("\u5df2\u590d\u5236\u5230\u526a\u5207\u677f")},e.upDateState=function(){var t=!(arguments.length>0&&void 0!==arguments[0])||arguments[0];m().then((function(n){if(console.log("GetAuthState:====",n),0===n.code){t&&o.b.info("\u5237\u65b0\u6210\u529f");var r=n.data.hasExpirationTime?Object(y.a)(n.data.expirationTime,10," ")+"\u5230\u671f":"",a=n.data.hasExpirationTime?"\u5df2\u6fc0\u6d3b":"\u672a\u6fc0\u6d3b";e.setState({status:a,time:r})}else o.b.error("\u66f4\u65b0\u9519\u8bef: "+n.msg)}))},e.exportAuth=function(){document.getElementById("importFile").click()},e.importProps=function(t){t.preventDefault();var n=new FormData;n.append("files",t.target.files[0]),console.log(n),b({formData:n}).then((function(t){console.log(t),0===t.code?e.setState((function(e){return{status:t.data.isAuthorization,time:t.data?Object(y.a)(t.data.expirationTime,10," "):"\u6c38\u4e45\u6fc0\u6d3b"}}),(function(){e.upDateState()})):o.b.error(t.mag)}))},e}return Object(i.a)(n,[{key:"componentDidMount",value:function(){this.getSerialNumber(!1),this.upDateState(!1)}},{key:"render",value:function(){return Object(h.jsxs)("div",{style:{padding:"32px 52px"},children:[Object(h.jsx)("input",{type:"file",className:"upload-file",name:"file",multiple:"multiple",onChange:this.importProps,id:"importFile"}),Object(h.jsxs)("div",{className:"card-form",children:[Object(h.jsxs)("div",{className:"card-title",children:[Object(h.jsx)("img",{className:"card-title-icon",src:f.a,alt:""}),Object(h.jsx)("span",{children:"\u6388\u6743\u4fe1\u606f"})]}),Object(h.jsxs)("div",{className:"form",style:{width:"100%"},children:[Object(h.jsxs)("div",{className:"form-item",children:[Object(h.jsx)("label",{className:"form-item-label",children:"\u8282\u70b9ID:"}),Object(h.jsx)("span",{className:"form-item-val",children:this.state.nodeID}),Object(h.jsx)(r.a,{className:"ant-btn-opt-normal",onClick:this.getSerialNumber,children:"\u751f\u6210\u4ea7\u54c1\u5e8f\u5217\u53f7"}),Object(h.jsx)(u.CopyToClipboard,{onCopy:this.copySerialNumber,text:this.state.nodeID,children:Object(h.jsx)(r.a,{className:"ant-btn-opt-normal",children:"\u590d\u5236\u4ea7\u54c1\u5e8f\u5217\u53f7"})})]}),Object(h.jsxs)("div",{className:"form-item",children:[Object(h.jsx)("label",{className:"form-item-label",children:"\u6388\u6743\u72b6\u6001:"}),Object(h.jsx)("span",{className:"form-item-val",children:this.state.status}),Object(h.jsx)(r.a,{className:"ant-btn-opt-normal",onClick:this.upDateState,children:"\u5237\u65b0\u6388\u6743\u72b6\u6001"})]}),Object(h.jsxs)("div",{className:"form-item",children:[Object(h.jsx)("label",{className:"form-item-label",children:"\u5230\u671f\u65f6\u95f4:"}),Object(h.jsx)("span",{className:"form-item-val",children:this.state.time})]}),Object(h.jsxs)("div",{className:"form-item",children:[Object(h.jsx)(r.a,{type:"primary",onClick:this.exportAuth,children:"\u5bfc\u5165\u6388\u6743\u6587\u4ef6"}),Object(h.jsx)("div",{className:"tip",children:"*\u8bf7\u8bf7\u8054\u7cfb\u5e7f\u5dde\u76db\u539f\u6210\u79d1\u6280\u6709\u9650\u516c\u53f8\uff0c\u83b7\u53d6\u6388\u6743\u6587\u4ef6\uff0c\u6fc0\u6d3b\u8f6f\u4ef6"})]})]})]})]})}}]),n}(l.PureComponent);t.default=g},63:function(e,t,n){"use strict";function r(e){var t;if("object"===typeof e)if(Array.isArray(e))for(var n in t=[],e)t.push(r(e[n]));else if(null===e)t=null;else if(e.constructor===RegExp)t=e;else for(var o in t={},e)t[o]=r(e[o]);else t=e;return t}function o(){var e=new Date,t=e.getFullYear(),n=e.getMonth()+1,r=e.getDate(),o=e.getHours(),a=e.getSeconds(),i=e.getMinutes();return n>=1&&n<=9&&(n="0"+n),r>=0&&r<=9&&(r="0"+r),o<=9&&(o="0"+o),i<=9&&(i="0"+i),a<=9&&(a="0"+a),t+"-"+n+"-"+r+" "+o+":"+i+":"+a}function a(e){return e&&e.length>0?e.split(","):null}function i(e,t,n){var r=86400*n*1e3,o=new Date(+new Date+r);document.cookie="".concat(e,"=").concat(t,";expires=").concat(o.toUTCString())}function c(e){for(var t=e+"=",n=document.cookie.split(";"),r=0;r<n.length;r++){var o=n[r].trim();if(0===o.indexOf(t))return o.substring(t.length,o.length)}return""}function s(e,t){var n=new Blob([e],{type:"application/x-xls;charset=utf-8"}),r=window.URL||window.webkitURL||window.moxURL,o=r.createObjectURL(n),a=document.createElement("a");a.href=o,a.download=t,a.click(),window.URL.revokeObjectURL(r)}function l(e,t){for(var n=0;n<e.length;n++)if(e[n].key===t.key){for(var r in e[n])if(t[r]!==e[n][r])return!1;return!0}}function u(e,t,n,r){e.length>0&&e.some((function(e){return e.id!==t&&e[n]===r}))}function f(e,t,n){var r=e.split("");return r[t]=n,r.join("")}n.d(t,"b",(function(){return r})),n.d(t,"e",(function(){return o})),n.d(t,"i",(function(){return a})),n.d(t,"h",(function(){return i})),n.d(t,"d",(function(){return c})),n.d(t,"c",(function(){return s})),n.d(t,"f",(function(){return l})),n.d(t,"g",(function(){return u})),n.d(t,"a",(function(){return f}))},74:function(e,t,n){"use strict";n(72);var r=n(71),o=n(126),a=n.n(o),i=n(63),c=a.a.create({baseURL:"http://localhost:3000/api1/api",timeout:5e4,async:!0,crossDomain:!0});c.interceptors.request.use((function(e){var t=Object(i.d)("accessToken");return"Login"===e.url.substring(1,6)||(t?e.headers.Authorization=t:""===t&&Object(i.h)("login",-1)),e}),(function(e){return console.log(e),Promise.reject(e)})),c.interceptors.response.use((function(e){var t=e.data;return 4002===t.Code?(Object(i.h)("login","",-1),[]):t}),(function(e){if(e.response){switch(e.response.status){case 401:Object(i.h)("login","",-1);break;case 504:r.b.error("\u670d\u52a1\u5668\u672a\u54cd\u5e94")}return Promise.reject(e.response.data)}return Promise.reject(e)})),t.a=c}}]);
//# sourceMappingURL=15.75159a23.chunk.js.map