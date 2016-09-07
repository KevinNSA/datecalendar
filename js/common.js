
/*
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}*/
//通用事件处理
$(function(){
  formValid();
  addDelSpan();
});

//添加删除内容事件
function addDelSpan(){
  $(".cleatInputSpan").on("click",function(e){
    $(this).siblings("input:text").val("");
    e.stopPropagation();
  });
}

//通用数据加载中
function dataLoading(dom) {
    var html = '<div class="dataLoading"><i class="loadingIcon"></i><span class="loadingText">数据努力加载中...</span></div>';
    if ($('.dataLoading').length == 0) {
      if (dom && $(dom).length != 0) {
          $(dom).before(html);
      } else {
          $('body').before(html);
      }
    } else {
      $('.dataLoading').show();
    }
}

//芒果自定义弹出框
(function ($, window) {
    var obj = {};
    var objcallback;
    obj.alert = function (mes, callback) {
        setdialogon("alert", mes);
        objcallback = callback;
    }
    obj.confirm = function (mes, callback) {
        setdialogon("confirm", mes);
        objcallback = callback;
    }
    function setdialogon(type, mes) {
      $("body").css("overflow","hidden");
        if (type == "alert") {
            var MGDialogAlertPanel = document.getElementById("MGDialogAlertPanel");
            if (MGDialogAlertPanel == null) {
                var mesbox = $('<div id="MGDialogAlertPanel" class="MGDialog-fixpanel">' +
                                       '<div class="MGDialog-messagepanel">' +
                                         ' <div class="MGDialog-content">' +
                                           '<span class="textspan"></span>' +
                                         '</div>' +
                                       '<div class="MGDialog-controlpanel">' +
                                           '<span class="btn-green MGDialog-btnOK MGDialog-Btn">确定</span>' +
                                         ' </div>' +
                                       '</div>' +
                                   ' </div>');
                $("body").append(mesbox);
                $(".MGDialog-btnOK").on("click", function () {
                    hideAlert();
                    objcallback && objcallback();
                });
            } else {
                $("#MGDialogAlertPanel").show();
            }
        }
        if (type == "confirm") {
            var MGDialogConfirmPanel = document.getElementById("MGDialogConfirmPanel");
            if (MGDialogConfirmPanel == null) {
                var mesbox = $('<div id="MGDialogConfirmPanel" class="MGDialog-fixpanel">' +
                                               '<div class="MGDialog-messagepanel">' +
                                                 ' <div class="MGDialog-content">' +
                                                   '<span class="textspan"></span>' +
                                                 '</div>' +
                                               '<div class="MGDialog-controlpanel">' +
                                                   '<div class="MGDialog-btnConfirmOk"><span class="btn-green MGDialog-Btn MG-O">确定</span></div>' +
                                                   '<div class="MGDialog-btnConfirmCancel"><span class="btn-green MGDialog-Btn MG-C">取消</span></div>' +
                                                 ' </div>' +
                                               '</div>' +
                                           ' </div>');
                $("body").append(mesbox);
                $(".MG-O").on("click", function () {
                    hideConfirm();
                    objcallback && objcallback();
                });
                $(".MG-C").on("click", function () {
                    hideConfirm();
                });
            } else {
                $("#MGDialogConfirmPanel").show();
            }
        }
        $(".textspan").text(mes);
    }
    function hideAlert() {
        $("#MGDialogAlertPanel").hide();
        $("body").css("overflow","auto");
    }
    function hideConfirm() {
        $("#MGDialogConfirmPanel").hide();
        $("body").css("overflow","auto");
    }
    window.MGDialog = obj;
})($, window);

//只可以输入数字
$.fn.onlyNum = function () {
      $(this).keypress(function (event) {
         var eventObj = event || e;
         var keyCode = eventObj.keyCode || eventObj.which;
         if ((keyCode >= 48 && keyCode <= 57))
             return true;
         else
             return false;
     }).focus(function () {
     //禁用输入法
         this.style.imeMode = 'disabled';
     }).bind("paste", function () {
        //获取剪切板的内容
         var clipboard = window.clipboardData.getData("Text");
         alert(clipboard);
         if (/^\d+$/.test(clipboard))
             return true;
         else
             return false;
     });
 };

 //后台表单验证
 function formValid(){
   $(".js-validBtn").on("click",function(event){
       var valid = true;
       $(".js-validInput").each(function(){
         //非空验证
         if($(this).val() == ""){
           //添加class
           $(this).addClass('errorArea');
           var formNoDataHolder = $(this).attr("errorMsg");
           if(formNoDataHolder == "" || formNoDataHolder == undefined){
             MGDialog.alert("请填写完整");
           }
           else {
             MGDialog.alert(formNoDataHolder);
           }
           valid = false;
           return false;
         }else{
           //移除class
           $(this).removeClass('errorArea');
         }
         //正则验证
         var formRegAttr = $(this).attr("regAttr");
         if(formRegAttr != undefined){
           if(regValid(formRegAttr,$(this).val(),this) == false){
             //添加class
             $(this).addClass('errorArea');
             valid = false;
             return false;
           }else{
             //移除class
             $(this).removeClass('errorArea');
           }
         }
       });

     if(valid == false){
       event.stopImmediatePropagation();
     }
     return valid;
   });
 }
 function regValid(regStr,value,element) {
   switch (regStr) {
     case 'number':
         if (!(/^\d+(\.\d+)?$/.test(value))) {
           var errorMes = $(element).attr("errorMsg");
           if(errorMes == undefined || errorMes == "")
              MGDialog.alert("某些内容必须为数字且是正数!");
           else
              MGDialog.alert(errorMes);
             return false;
         }else {
           return true;
         }
         break;
     case 'numberInt':
         if (!(/^[0-9]*[1-9][0-9]*$/.test(value))) {
             var errorMes = $(element).attr("errorMsg");
             if(errorMes == undefined || errorMes == "")
                MGDialog.alert("某些内容必须为数字且是正整数!");
             else
                MGDialog.alert(errorMes);
             return false;
         }else {
           return true;
         }
         break;
       case 'phone':
           if (!(/^1[3|4|5|7|8]\d{9}$/.test(value))) {
               var errorMes = $(element).attr("errorMsg");
               if(errorMes == undefined || errorMes == "")
                  MGDialog.alert("手机号码有误，请重填!");
               else
                  MGDialog.alert(errorMes);
               return false;
           }else {
             return true;
           }
           break;
       case 'email':
           if (!(/^(\w)+(\.\w+)*@(\w)+((\.\w{2,4}){1,3})$/.test(value))) {
               var errorMes = $(element).attr("errorMsg");
               if(errorMes == undefined || errorMes == "")
                  MGDialog.alert("邮箱格式有误，请重填!");
               else
                  MGDialog.alert(errorMes);
               return false;
           }else {
             return true;
           }
           break;
       case 'date':
           if (!(/^((?:19|20)\d\d)-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/.test(value))) {
               var errorMes = $(element).attr("errorMsg");
               if(errorMes == undefined || errorMes == "")
                  MGDialog.alert("日期格式有误，请重填!");
               else
                  MGDialog.alert(errorMes);
               return false;
           }else {
             return true;
           }
           break;
       case 'idc':
           if (!(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value))) {
               var errorMes = $(element).attr("errorMsg");
               if(errorMes == undefined || errorMes == "")
                  MGDialog.alert("身份证号码有误，请重填!");
               else
                  MGDialog.alert(errorMes);
               return false;
           }else {
             return true;
           }
           break;
       case 'phoneEmail':
           if (!(/^1[3|4|5|7|8]\d{9}$/.test(value)) && !(/^(\w)+(\.\w+)*@(\w)+((\.\w{2,4}){1,3})$/.test(value))) {
               var errorMes = $(element).attr("errorMsg");
               if(errorMes == undefined || errorMes == "")
                  MGDialog.alert("手机号码或邮箱有误，请重填!");
               else
                  MGDialog. alert(errorMes);
               return false;
           }else {
             return true;
           }
           break;
       default:
          return true;
          break;
   }
 }

//左侧menu菜单状态展示--页面跳转/刷新
(function() {
  var mid = $('#midValueHidden').val();
  $('.side-nav>li').removeClass('active').children('a').addClass('collapsed').siblings('ul').removeClass('in').children().removeClass('active');
  $('[mid='+mid+']').addClass('active').parent().addClass('in').parent().addClass('active').children('a').removeClass('collapsed');
})();

//客户端js判断文件大小
function fileChange(target,id) {
  var isIE = /msie/i.test(navigator.userAgent) && !window.opera;
  var fileSize = 0;
  var filetypes =[".jpg",".png",".rar",".txt",".zip",".doc",".ppt",".xls",".pdf",".docx",".xlsx"];
  var filepath = target.value;
  var filemaxsize = 1024*0.02;//2M
  if(filepath){
    var isnext = false;
    var fileend = filepath.substring(filepath.indexOf("."));
    if(filetypes && filetypes.length>0){
      for(var i =0; i<filetypes.length;i++){
        if(filetypes[i]==fileend){
          isnext = true;
          break;
        }
      }
    }
    if(!isnext){
      MGDialog.alert("不接受此文件类型！");
      target.value ="";
      return false;
    }
  }else{
    return false;
  }
  if (isIE && !target.files) {
    var filePath = target.value;
    var fileSystem = new ActiveXObject("Scripting.FileSystemObject");
    if(!fileSystem.FileExists(filePath)){
      MGDialog.alert("附件不存在，请重新输入！");
      return false;
    }
    var file = fileSystem.GetFile(filePath);
    fileSize = file.Size;
  } else {
    fileSize = target.files[0].size;
  }
  var size = fileSize / 1024;
  if(size>filemaxsize){
    MGDialog.alert("附件大小不能大于"+filemaxsize/1024+"M！");
    target.value ="";
    return false;
  }
  if(size<=0){
    MGDialog.alert("附件大小不能为0M！");
    target.value ="";
    return false;
  }
}
