//$().ready(function () {


function initTable(){
    var table = $('#example').DataTable( {
        "dom": '<"toolbar">frtip',
        "processing": true,
        "serverSide": true,
        "searching": false,
        "destroy": true,
        "ordering": false,
        "ajax": {
            url: basePath+"app/view?start=0&limit=10&realname=",
            "dataSrc": "data",
            dataType: "jsonp"
        },
        "fnRowCallback" : function(nRow, aData, iDisplayIndex){
            response_status_handler(aData.status);
        },
        "columnDefs": [
            {
                "render": function ( data, type, row ) {
                    var str = "";
                    if (isNull(data)) {
                        return str;
                    } else {
                        return data
                    }
                },
                "targets": 0
            },
            {
                "render": function ( data, type, row ) {
                    var str = "";
                    if (isNull(data)) {
                        return str;
                    } else {
                        return data
                    }
                },
                "targets": 1
            },
            {
                "render": function ( data, type, row ) {
                    var str = "";
                    if (isNull(data)) {
                        return str;
                    } else {
                        return data
                    }
                },
                "targets": 2
            },
            {
                "render": function ( data, type, row ) {
                    var str = "";
                    str += "<button class='btn btn-info '   type='button' onclick='appUpdateOpen(\"" + data + "\")'><i class='fa fa-paste'></i> 编辑</button>&nbsp;";
                    str += "<button class='btn btn-info '   type='button' onclick='updateAppSecret(\"" + data + "\")'><i class='fa fa-paste'></i> 变更密钥</button>&nbsp;";
                    if (row.available) {
                        str += "<button class='btn btn-info '   type='button' onclick='appLock(\"" + data + "\", \"false\")'><i class='fa fa-paste'></i> 解锁</button>";
                    } else {
                        str += "<button class='btn btn-info '   type='button' onclick='appLock(\"" + data + "\", \"true\")'><i class='fa fa-paste'></i> 锁定</button>";
                    }
                    return str; // data +' ('+ row[3]+')';
                },
                "targets": 5
            },
            {
                "render": function ( data, type, row ) {
                    var str = "";
                    if (isNull(data)) {
                        return str;
                    } else {
                        return data
                    }
                },
                "visible": false,
                "targets": [ 3 ]
            },
            {
                "render": function ( data, type, row ) {
                    var str = "";
                    if (isNull(data)) {
                        return str;
                    } else {
                        return data
                    }
                },
                "targets": [ 4 ],
                "visible": false,
                "searchable": false
            }
        ],
        "columns": [
            { "data": "name" },
            { "data": "app_key" },
            { "data": "app_secret" },
            { "data": "app_secret" },
            { "data": "id" },
            { "data": "id" }
        ]
    } );
    $("div.toolbar").html("<button type='button' class='btn btn-primary' onclick='appAddOpen()'>添加</button>");

    /*$('#example tbody').on( 'click', 'button', function () {
        var data = table.row( $(this).parents('tr') ).data();
        alert( data[0] +"'s salary is: "+ data[ 1 ] );
    } );*/
}

//打开编辑框
function appAddOpen(appId) {
    $("#appModal").modal("show");
    $("#appModalTitleId").text("申请应用");
    $("#appUpdateId").hide();
    $("#appAddId").show();

    //清空
    $("#appName").val('');
    $("#appUrl").val('');
    $("#appIcon").val('');
    $("#appManager").val('');
    $("#appContact").val('');
    $("#appId").val('');
}

//保存申请
function appAdd() {
    if($("#appEditFormId").valid()){
        $.ajax({
            type : "GET",
            url : basePath + "app/create",
            data: {"name":$("#appName").val(), "appUrl":$("#appUrl").val(), "appIcon":$("#appIcon").val(), "manager":$("#appManager").val(), "contact":$("#appContact").val()},
            dataType : "jsonp",
            success : function(data) {
                response_status_handler(data.status);
                if (data.status == 200) {
                    $("#appModal").modal("hide");
                    initTable();
                }
                if (data.status == 400) {
                    $("#appErrorMsgId").text(data.msg);
                }
            },
            error : function(data){
                $("#appErrorMsgId").text(data.msg);
            }
        });
    }
}

//打开编辑框
function appUpdateOpen(appId) {
    $("#appModal").modal("show");
    $("#appId").val(appId);
    $("#appModalTitleId").text("修改应用");
    $("#appAddId").hide();
    $("#appUpdateId").show();
    $.ajax({
        type : "GET",
        url : basePath + "app/getAppById",
        data: {"id":appId},
        dataType : "jsonp",
        success : function(data) {
            response_status_handler(data.status);
            if (data.status == 400) {
                alert(data.msg);
            }
            if (data.status == 200) {
                //回显值
                $("#appName").val(data.data.name);
                $("#appUrl").val(data.data.appUrl);
                $("#appIcon").val(data.data.appIcon);
                $("#appManager").val(data.data.manager);
                $("#appContact").val(data.data.contact);
            }
        },
        error : function(data){
            alert(data.msg);
        }
    });
}

//修改申请
function appUpdate() {
    if($("#appEditFormId").valid()){
        $.ajax({
            type : "GET",
            url : basePath + "app/update",
            data: {"id":$("#appId").val(), "name":$("#appName").val(), "appUrl":$("#appUrl").val(), "appIcon":$("#appIcon").val(), "manager":$("#appManager").val(), "contact":$("#appContact").val()},
            dataType : "jsonp",
            success : function(data) {
                response_status_handler(data.status);
                if (data.status == 200) {
                    $("#appModal").modal("hide");
                    initTable();
                }
                if (data.status == 400) {
                    $("#appErrorMsgId").text(data.msg);
                }
            },
            error : function(data){
                $("#appErrorMsgId").text(data.msg);
            }
        });
    }
}

//锁定或者解锁
function appLock(appId, available) {
    $.ajax({
        type : "GET",
        url : basePath + "app/lock",
        data: {"id":appId, "available":available},
        dataType : "jsonp",
        success : function(data) {
            response_status_handler(data.status);
            if (data.status == 200) {
                initTable();
            }
            if (data.status == 400) {
                alert(data.msg);
            }
        },
        error : function(data){
            alert(data.msg);
        }
    });
}

//锁定或者解锁
function updateAppSecret(appId) {
    $.ajax({
        type : "GET",
        url : basePath + "app/updateAppSecret",
        data: {"id":appId},
        dataType : "jsonp",
        success : function(data) {
            response_status_handler(data.status);
            if (data.status == 200) {
                initTable();
            }
            if (data.status == 400) {
                alert(data.msg);
            }
        },
        error : function(data){
            alert(data.msg);
        }
    });
}

/*$("#appModal").on("shown.bs.modal",function(){

});*/

function fileUploadInit() {
    var fileUploadId = "appFileUploadPluginId";
    $(function () {
        $('#' + fileUploadId).find("input[type='file']").fileupload({
            dataType: 'jsonp',
            // autoUpload: true,
            url: basePath + "upload/appIconUpload?uploadName=appFileUploadName",
            // formData:{uploadName:"appFileUploadName"},
            add: function (e, data) {
                /*data.context = $('<button/>').text('Upload')
                    .appendTo(document.body)
                    .click(function () {
                        $(this).replaceWith($('<p/>').text('Uploading...'));
                        data.submit();
                    });*/
                //绑定上传按钮点击事件,执行上传操作
                var tempStart = $('#' + fileUploadId).find(".start");
                $(tempStart).unbind('click');
                $(tempStart).on('click',function () {
                    data.submit();
                });
            },
            done: function (e, data) {
                // data.context.text('Upload finished.');
                console.log("done");
                console.log(data.data.fileList);
            }
        });
    });

}

function changeShow(){
    window.location.href="app1.html";
}

//页面初始化
function appInit() {
    //初始化表格
    initTable();
    //初始化验证框架
    $.validator.setDefaults({
        highlight: function (e) {
            $(e).closest(".form-group").removeClass("has-success").addClass("has-error")
        }, success: function (e) {
            e.closest(".form-group").removeClass("has-error").addClass("has-success")
        }, errorElement: "span", errorPlacement: function (e, r) {
            e.appendTo(r.is(":radio") || r.is(":checkbox") ? r.parent().parent().parent() : r.parent())
        }, errorClass: "help-block m-b-none", validClass: "help-block m-b-none"
    })
    $("#appEditFormId").validate();
    //初始化上传控件
    fileUploadInit();
}
appInit();