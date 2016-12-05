/**
 * Created by apple on 16/11/2.
 */

var InterValObj; //timer变量，控制时间
var count = 60; //间隔函数，1秒执行
var curCount;//当前剩余秒数
var nextStep = false;
function sendEmail(flag){
    curCount = count;
    //设置button效果，开始计时
    $("#resetPasswordSendCode").attr("disabled", "true");
    $("#resetPasswordSendCode").text("（" + curCount + "）重新发送验证码");
    InterValObj = window.setInterval(SetRemainTime, 1000); //启动计时器，1秒执行一次
    if(!$("#stepOneForm").valid()){
        return;
    }
    var email = $('#emailinput').val();
    $.ajax({
        type : "GET",
        url         : basePath + "forget/send",
        dataType    : "jsonp",
        data : {
            target  : email,
            type    : "email"
        },
        success : function(data) {
            response_status_handler(data.status);
            if(data.status == 200){
                alert("发送成功!");
                if (isNull(flag)){
                    nextStep = true;
                }
                //$("#wizard").steps('next');
                return true;
            }else{
                return false;
            }
        },
        error : function(data){
            return false;
        }
    });
    return true;
}

//timer处理函数
function SetRemainTime() {
    if (curCount == 0) {
        window.clearInterval(InterValObj);//停止计时器
        $("#resetPasswordSendCode").removeAttr("disabled");//启用按钮
        $("#resetPasswordSendCode").text("重新发送验证码");
    }
    else {
        curCount--;
        $("#resetPasswordSendCode").text("（" + curCount + "）重新发送验证码");
    }
}

function verificationCode(){
    if ($("#stepTwoForm").valid()){
        var email = $('#emailinput').val();
        var code = $('#vaildcode').val();
        $.ajax({
            type : "GET",
            url         : basePath + "forget/verification",
            dataType    : "jsonp",
            data : {
                target  : email,
                type    : "email",
                code    : code
            },
            success : function(data) {
                response_status_handler(data.status);
                if(data.status == 200){
                    alert(data.msg);
                    nextStep = true;
                    return true;
                }
                if(data.status == 400 || data.status == 500){
                    alert(data.msg);
                    return false;
                }
            },
            error : function(data){
                alert("error")
                return false;
            }
        });
    }
    return false;
}

function resetPassword(){
    var email   = $('#emailinput').val();
    var code    = $('#vaildcode').val();
    var password= $('#password').val();
    $.ajax({
        type : "GET",
        url         : basePath + "forget/reset",
        dataType    : "jsonp",
        data : {
            target  : email,
            type    : "email",
            code    : code,
            password: password
        },
        success : function(data) {
            response_status_handler(data.status);
            if(data.status == 200){
                //alert("验证成功!");
                nextStep = true;
                return true;
            }else{
                return false;
            }
        },
        error : function(data){
            alert("error")
            return false;
        }
    });
    return true;
}



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
        $("#stepOneForm").validate({
            focusInvalid: false, // do not focus the last invalid input
            ignore: "",
            rules: {
                email: {
                    required    : true,
                    minlength   : 5,
                    maxlength   : 32,
                    email       : true,
                    remote      : {
                        type: "get",
                        url: basePath + "forget/exist",
                        dataType: "jsonp",
                        data: {
                            target: function () {
                                return $('#emailinput').val();
                            },
                            type: "email",
                            code: function () {
                                return $('#vaildcode').val();
                            }
                        }
                    }
                }
            },
            messages: {
                email: {
                    required    : e + "请输入你的邮箱",
                    remote      : "邮箱不存在"
                }

            }
        }), $("#email").focus(function () {
            var e = $("#emailinput").val(), r = $("#emailinput").val();
            e && r && !this.value && (this.value = e + "." + r)
        })

        //$("#stepTwoForm").validate();
        var e = "<i class='fa fa-times-circle'></i> ";
        $("#stepTwoForm").validate({
            focusInvalid: false, // do not focus the last invalid input
            ignore      : "",
            rules       : {
                vaildcode: {
                    required    : true,
                    number      : true,
                    minlength   : 4,
                    maxlength   : 6
                    /*remote  : {                                          //验证用户名是否存在
                        type: "get",
                        url : basePath + "forget/verification",
                        dataType: "jsonp",
                        data : {
                            target  : function() {
                                return $('#emailinput').val();
                            },
                            type    : "email",
                            code    : function() {
                                return $('#vaildcode').val();
                            }
                        }
                        //,
                        //complete: function(data){
                        //    return false;
                        //    if(data.responseJSON.status == 200){
                        //        return true;
                        //    }else{
                        //        return false;
                        //    }
                        //},
                        //success : function(data) {
                        //    return false;
                        //    if(data.status == 200){
                        //        return true;
                        //    }else{
                        //        return false;
                        //    }
                        //}
                    }*/
                }
            },
            messages: {
                vaildcode: {
                    required    : e + "请输入你的验证码",
                    remote      : "验证码不正确",
                    number      : "请输入正确的验证码"
                }
            }
        }), $("#email").focus(function () {
            var e = $("#emailinput").val(), r = $("#emailinput").val();
            e && r && !this.value && (this.value = e + "." + r)
        })



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
            var email = $('#emailinput').val();
            var index = email.indexOf("@");
            var username = email.substring(index,email);
            if(!isNull(value) && value.indexOf(username) >= 0){
                return false;
            }else{
                return true;
            }
        }, "密码中不允许包含用户名信息");


        $("#stepThreeForm").validate({
            focusInvalid: false, // do not focus the last invalid input
            ignore      : "",
            rules       : {
                password: {
                    required    : !0,
                    minlength   : 8,
                    maxlength   : 18,
                    regexPassword : true,
                    noexistUserName : true,
                    remote  : {                                          //验证用户名是否存在
                        type: "get",
                        url : basePath + "forget/verification",
                        dataType: "jsonp",
                        data : {
                            target  : function() {
                                return $('#emailinput').val();
                            },
                            type    : "email",
                            code    : function() {
                                return $('#vaildcode').val();
                            }
                        },
                        success : function(data) {
                            if(data.status == 200){
                                return true;
                            }else{
                                return false;
                            }
                        }
                    }
                },
                confirm: {
                    equalTo: "#password"
                }
            },
            messages: {
                vaildcode       : e + "请输入你的验证码"//,
                //regexPassword   :
            }
        });
    });

    $("#wizard").steps({
        headerTag: "h2",
        bodyTag: "section",
        transitionEffect: "slideLeft",
        labels: {
            cancel: "取消",
            finish: "完成",
            next: "下一步",
            previous: "上一步"

        },
        onStepChanging: function (event, currentIndex, newIndex)
        {
            // Allways allow previous action even if the current form is not valid!
            if (currentIndex > newIndex)
            {
                return true;
            }
            if(!$("#stepOneForm").valid()){
                return false;
            }

            if(!nextStep){
                switch(currentIndex){
                    case 0:
                        alert("请发送邮件。")
                        return;
                        break;
                    case 1:

                        return verificationCode();
                        break;
                    case 2:
                        if( !$("#stepThreeForm").valid()){
                            return false;
                        }else{
                            resetPassword();
                            return true;
                        }
                        break;
                }
            }else{
                return nextStep;
            }


            //if(currentIndex == 0){
            //    return sendEmail();
            //}else if(currentIndex == 1){
            //    return verificationCode();
            //}else if(currentIndex == 2){
            //    return resetPassword();
            //}

        },
        onStepChanged: function (event, currentIndex, priorIndex)
        {
            // Used to skip the "Warning" step if the user is old enough.
            //if (currentIndex === 2 && Number($("#age-2").val()) >= 18)
            //{
            //    form.steps("next");
            //}
            //// Used to skip the "Warning" step if the user is old enough and wants to the previous step.
            //if (currentIndex === 2 && priorIndex === 3)
            //{
            //    form.steps("previous");
            //}
            nextStep = false;
        },
        onFinishing: function (event, currentIndex)
        {
            return true;
        },
        onFinished: function (event, currentIndex)
        {
            window.location.href = "login";
        }
    });

    $('#email').click(function () {
        $('#emails').show();
        $('#phones').hide();
    })
    $('#phone').click(function () {
        $('#phones').show();
        $('#emails').hide();
    })
})
