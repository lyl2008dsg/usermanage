/**
 * Created by apple on 16/11/11.
 */




$(document).ready(function () {


    $.validator.setDefaults({
        highlight: function (e) {
            $(e).closest(".form-group").removeClass("has-success").addClass("has-error")
        }, success: function (e) {
            e.closest(".form-group").removeClass("has-error").addClass("has-success")
        }, errorElement: "span", errorPlacement: function (e, r) {
            e.appendTo(r.is(":radio") || r.is(":checkbox") ? r.parent().parent().parent() : r.parent())
        }, errorClass: "help-block m-b-none", validClass: "help-block m-b-none"
    }), $().ready(function () {
        //$("#stepOneForm").validate();
        var e = "<i class='fa fa-times-circle'></i> ";

        function passwordLevel(password) {
            var Modes = 0;
            for (i = 0; i < password.length; i++) {
                Modes |= CharMode(password.charCodeAt(i));
            }
            return bitTotal(Modes);

            //CharMode函数
            function CharMode(iN) {
                if (iN >= 48 && iN <= 57)//数字
                    return 1;
                if (iN >= 65 && iN <= 90) //大写字母
                    return 2;
                if ((iN >= 97 && iN <= 122) || (iN >= 65 && iN <= 90)) //大小写
                    return 4;
                else
                    return 8; //特殊字符
            }

            //bitTotal函数
            function bitTotal(num) {
                modes = 0;
                for (i = 0; i < 4; i++) {
                    if (num & 1) modes++;
                    num >>>= 1;
                }
                return modes;
            }
        }

        jQuery.validator.addMethod("regexPassword", function(value, element) {
            if(passwordLevel(value) == 1){
                return false;
            }else{
                return true;
            }
        }, "至少包含字母、大小写数字、字符中的两种及以上");

        jQuery.validator.addMethod("noexistUserName", function(value, element) {
            var target = parent.PT_USERNAME;
            var index = target.indexOf("@");
            if(index > 0){
                var username = target.substring(index,email);
                if(!isNull(value) && value.indexOf(username) >= 0){
                    return false;
                }else{
                    return true;
                }
            }else{
                if(!isNull(value) && value.indexOf(target) >= 0){
                    return false;
                }else{
                    return true;
                }
            }

        }, "密码中不允许包含用户名信息");

        jQuery.validator.addMethod("differentFromCurrentPassword", function(value, element) {
            if(oldpassword.value!=value){
                return true;
            }else{
                return false;
            }
        }, "新密码不允许与当前密码相同");

        $("#passwordform").validate({
            focusInvalid: false, // do not focus the last invalid input
            ignore      : "",
            rules       : {
                oldpassword : {
                    required    : true,
                    minlength   : 3,
                    maxlength   : 18
                },
                newpassword: {
                    required    : true,
                    minlength   : 8,
                    maxlength   : 18,
                    regexPassword : true,
                    noexistUserName : true,
                    differentFromCurrentPassword : true
                },
                confirm: {
                    required    : true,
                    equalTo: "#newpassword"
                }
            },
            messages: {
                //vaildcode       : e + "请输入你的验证码"//,
                //regexPassword   :
            }
        });
    });
})

function updatePassword(){
    var oldpassword   = $('#oldpassword').val();
    var newpassword   = $('#newpassword').val();
    var password      = $('#password').val();
    if(!$('#passwordform').valid()){
        return;
    }
    $.ajax({
        type : "GET",
        url         : basePath + "forget/update",
        dataType    : "jsonp",
        data : {
            oldpassword     : oldpassword,
            newpassword     : newpassword
        },
        success : function(data) {
            response_status_handler(data.status);
            if(data.status == 200){
                alert("修改成功!");
                clearCookie();
                window.location.href= basePath + "logout";
            }else{
                alert(data.msg);
            }
        },
        error : function(data){
            alert("error")
            return false;
        }
    });
    return true;
}

function clearCookie(){
    var keys=document.cookie.match(/[^ =;]+(?=\=)/g);
    if (keys) {
        for (var i = keys.length; i--;)
            document.cookie=keys[i]+'=0;expires=' + new Date( 0).toUTCString()
    }
}
