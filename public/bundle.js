(()=>{"use strict";var e=function(e,t){var n;return function(){for(var i=arguments.length,r=new Array(i),o=0;o<i;o++)r[o]=arguments[o];var a=function(){n=null,e.apply(void 0,r)};clearTimeout(n),n=window.setTimeout(a,t)}};function t(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);t&&(i=i.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,i)}return n}function n(e){for(var n=1;n<arguments.length;n++){var i=null!=arguments[n]?arguments[n]:{};n%2?t(Object(i),!0).forEach((function(t){o(e,t,i[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(i)):t(Object(i)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(i,t))}))}return e}function i(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,i=new Array(t);n<t;n++)i[n]=e[n];return i}function r(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}(new(function(){function t(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),o(this,"user",void 0),o(this,"page",void 0),o(this,"eventStore",void 0),o(this,"syncTimeout",void 0),o(this,"syncTimerId",void 0),o(this,"focusObserverId",void 0),o(this,"scrollEventDebounce",void 0),o(this,"mouseMoveDebounce",void 0),o(this,"resizeDebounce",void 0),o(this,"initialScrollEventListenerDelayForAttachment",void 0),o(this,"shouldPreventServerConnectOnUserSleep",void 0),this.user={OSName:"",browser:{name:"",version:""},device:"unknown",isCookieEnable:!1},this.initialScrollEventListenerDelayForAttachment=100,this.syncTimeout=3e3,this.scrollEventDebounce=9,this.mouseMoveDebounce=8,this.resizeDebounce=100,this.shouldPreventServerConnectOnUserSleep=!0,this.eventStore={events:[]},this.page={path:"",pageHeight:0}}var a,s;return a=t,(s=[{key:"getBrowserDetails",value:function(){var e,t=navigator.appName,n=navigator.userAgent,r=n.match(/(opera|chrome|safari|firefox|msie|trident)\/?\s*(\.?\d+(\.\d+)*)/i);r&&null!=(e=n.match(/version\/([\.\d]+)/i))&&(r[2]=e[1]);var o,a,s=(o=r=r?[r[1],r[2]]:[t,navigator.appVersion,"-?"],a=2,function(e){if(Array.isArray(e))return e}(o)||function(e,t){var n=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){var i,r,o=[],a=!0,s=!1;try{for(n=n.call(e);!(a=(i=n.next()).done)&&(o.push(i.value),!t||o.length!==t);a=!0);}catch(e){s=!0,r=e}finally{try{a||null==n.return||n.return()}finally{if(s)throw r}}return o}}(o,a)||function(e,t){if(e){if("string"==typeof e)return i(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?i(e,t):void 0}}(o,a)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}());return{name:s[0],version:s[1]}}},{key:"getUserViewport",value:function(){return{height:window.innerHeight,width:window.innerWidth}}},{key:"getUserLocation",value:function(){var e;return null!==(e=navigator)&&void 0!==e&&e.geolocation?new Promise((function(e,t){navigator.geolocation.getCurrentPosition((function(t){e({location:{latitude:t.coords.latitude,longitude:t.coords.longitude},timestamp:t.timestamp})}),(function(e){return t({code:e.code,message:e.message})}))})):null}},{key:"getUserOSName",value:function(){var e=window.navigator.userAgent,t=window.navigator.platform,n="";return-1!==["Macintosh","MacIntel","MacPPC","Mac68K"].indexOf(t)?n="Mac OS":-1!==["iPhone","iPad","iPod"].indexOf(t)?n="iOS":-1!==["Win32","Win64","Windows","WinCE"].indexOf(t)?n="Windows":/Android/.test(e)?n="Android":!n&&/Linux/.test(t)&&(n="Linux"),n}},{key:"checkCookieStatus",value:function(){var e=!!navigator.cookieEnabled;return void 0!==navigator.cookieEnabled||e||(document.cookie="testcookie",e=-1!=document.cookie.indexOf("testcookie")),e}},{key:"getUserDevice",value:function(){return/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)?"phone":"desktop"}},{key:"getPageInitialData",value:function(){var e,t,n=location.href;return{pageHeight:null===(e=document)||void 0===e||null===(t=e.documentElement)||void 0===t?void 0:t.clientHeight,path:n}}},{key:"initializer",value:function(){this.sendInitialData(),this.attachEventsListener(),this.mountSync()}},{key:"sendInitialData",value:function(){var e=this.getPageInitialData(),t={OSName:this.getUserOSName(),device:this.getUserDevice(),isCookieEnable:this.checkCookieStatus(),browser:this.getBrowserDetails(),page:e};this.user=t,this.page=e}},{key:"mountSync",value:function(){var e=this;console.log("MOUNT");var t=window.setInterval((function(){var t;e.checkIsUserSleep()&&(e.syncToServer((t=e.eventStore,JSON.parse(JSON.stringify(t)))),e.clearEventStore())}),this.syncTimeout);this.syncTimerId=t}},{key:"unMountSync",value:function(){window.clearInterval(this.syncTimerId),this.destroyedEventsListener(),this.clearEventStore()}},{key:"checkIsUserSleep",value:function(){return!(this.shouldPreventServerConnectOnUserSleep&&!this.eventStore.events.length)}},{key:"syncToServer",value:function(e){console.log(e,"events")}},{key:"eventDispatcher",value:function(e){var t=n(n({},e),{},{timestamp:Date.now()});this.eventStore.events.push(t)}},{key:"clearEventStore",value:function(){this.eventStore.events=[]}},{key:"scrollHandler",value:function(e){var t=window.pageYOffset||(document.documentElement||document.body.parentNode||document.body).scrollTop;this.eventDispatcher({event:"scroll",data:t})}},{key:"clickHandler",value:function(e){var t,n=e.target,i=(t=[],function e(n){if(null!=n&&n.parentElement){var i=(o=n.tagName.toLowerCase(),"".concat(o).concat((r=n).id?"#".concat(r.id):r.className?".".concat(r.className):""));t.push(i),e(n.parentElement)}var r,o;return t}(n).reverse().join(" ")),r=function(e){return{x:e.clientX,y:e.clientY}}(e);this.eventDispatcher({event:"click",data:{path:i,position:r}})}},{key:"typeHandler",value:function(e){this.eventDispatcher({event:"type",data:e.key})}},{key:"mouseMoveHandler",value:function(e){this.eventDispatcher({event:"mousemove",data:{position:{x:e.clientX,y:e.clientY}}})}},{key:"focusHandler",value:function(e){this.eventDispatcher({event:"focus",data:e})}},{key:"resizeHandler",value:function(){this.eventDispatcher({event:"resize",data:{viewport:this.getUserViewport()}})}},{key:"userScrollEvent",value:function(){var t,n,i,r=this;t=function(){document.addEventListener("scroll",e(r.scrollHandler.bind(r),r.scrollEventDebounce))},n=this.initialScrollEventListenerDelayForAttachment,i=window.setTimeout((function(){t(),window.clearTimeout(i)}),n)}},{key:"userClickEvent",value:function(){document.addEventListener("click",this.clickHandler.bind(this))}},{key:"userTypeEvent",value:function(){document.addEventListener("keydown",this.typeHandler.bind(this))}},{key:"userMouseMoveEvent",value:function(){document.addEventListener("mousemove",e(this.mouseMoveHandler.bind(this),this.mouseMoveDebounce))}},{key:"userResizeEvent",value:function(){window.addEventListener("resize",e(this.resizeHandler.bind(this),this.resizeDebounce))}},{key:"userFocusEvent",value:function(){var e=this,t=!0,n=setInterval((function(){var n=document.hasFocus();n!==t&&(e.focusHandler(n),t=n)}),1e3);this.focusObserverId=n}},{key:"attachEventsListener",value:function(){this.userScrollEvent(),this.userClickEvent(),this.userMouseMoveEvent(),this.userTypeEvent(),this.userResizeEvent(),this.userFocusEvent()}},{key:"destroyedEventsListener",value:function(){document.removeEventListener("scroll",this.scrollHandler),document.removeEventListener("click",this.clickHandler),document.removeEventListener("keydown",this.typeHandler),document.removeEventListener("mousemove",this.mouseMoveHandler),clearInterval(this.focusObserverId)}}])&&r(a.prototype,s),Object.defineProperty(a,"prototype",{writable:!1}),t}())).initializer()})();
//# sourceMappingURL=bundle.js.map