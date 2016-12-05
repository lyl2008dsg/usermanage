function getURL(){
    return encodeURIComponent(window.location.href);
}

function beforeClickImport(treeId, treeNode) {
    /*if (treeNode.pid == "1") {
        alert("请选择银谷集团的子公司！")
        return false;
    }
    return true;*/
}

function onClickImport(e, treeId, treeNode) {
    var importName = "";
    if (treeNode.pid == "1") {
        importName = treeNode.name;
    } else {
        if (isNull(treeNode.getParentNode())) {
            importName = treeNode.name;
        } else {
            importName = treeNode.getParentNode().name + "-" + treeNode.name;
        }
    }
    $("#importOrgName").val(importName);
    $("#orgSelectImportNameContentId").hide();
}

function hideMenu() {
    $("#orgSelectImportNameContentId").hide();
    $("body").unbind("mousedown", onBodyDown);
}
function onBodyDown(event) {
    if (!(event.target.id == "importOrgName" || event.target.id == "orgSelectImportNameContentId" || $(event.target).parents("#orgSelectImportNameContentId").length>0)) {
        hideMenu();
    }
}

function showPost() {
    var postObj = $("#importOrgName");
    var postOffset = $("#importOrgName").offset();
    $("#orgSelectImportNameContentId").css({left:postOffset.left + "px", top:postOffset.top + postObj.outerHeight() + "px"});
    $("#orgSelectTreeImportNameId").css({width:postObj.outerWidth() + "px"});
    $("#orgSelectImportNameContentId").show();
    $("body").bind("mousedown", onBodyDown);
}

function filter(treeId, parentNode, childNodes) {
    if (!childNodes) return null;
    for (var i=0, l=childNodes.length; i<l; i++) {
        childNodes[i].name = childNodes[i].name.replace(/\.n/g, '.');
    }
    return childNodes;
}

function initImportTree() {
    var settingPost = {
        async: {
            enable: true,
            url: basePath + "org/orgTreeForImport?importFlag=1&appKey="+appKey+"&appSecret="+appSecret,
            autoParam:["id=pid", "name=n", "level=lv", "appKey="+appKey, "appSecret="+appSecret],
            type:"get",
            dataType:'jsonp',
            dataFilter: filter
        },
        view: {
            dblClickExpand: false
        },
        data: {
            simpleData: {
                enable: true
            }
        },
        callback: {
            beforeClick: beforeClickImport,
            onClick: onClickImport
        }
    };
    $.fn.zTree.init($("#orgSelectTreeImportNameId"), settingPost);
    showPost();
}

function initImportOrgHrPost(){
    $(function () {
        $('#importOrgHrPostSelectId').fileupload({
            dataType: 'jsonp',
            type: "POST",
            autoUpload: true,
            crossDomain: true,
            url: basePath + "upload/importOrgHrPost?uploadName=importOrgHrPostSelectId",
            // formData:{uploadName:"appFileUploadName"},
            add: function (e, data) {
                /*data.context = $('<button/>').text('Upload')
                 .appendTo(document.body)
                 .click(function () {
                 $(this).replaceWith($('<p/>').text('Uploading...'));
                 data.submit();
                 });*/
                //绑定上传按钮点击事件,执行上传操作
                var tempStart = $('#importOrgHrPostId');
                $(tempStart).unbind('click');
                $(tempStart).on('click',function () {
                    data.submit();
                });
            },
            done: function (e, data) {
                // data.context.text('Upload finished.');
                console.log("done");
                console.log(data.data.msg);
                console.log(data.data.status);
            }
        });
    });
}

function initForm() {
    var path = basePath + "upload/importOrgHrPost";
    $('#importOrgPostHrFormId').attr("action", path)
}

//显示文件名称
function importOrgHrPostSelectOnChange(event) {
    var name = event.value;
    var n = name.lastIndexOf("\\\\");
    if (n > 0) {
        $("#importOrgPostHrFileNameId").text(name.substring(n+1));
        return;
    }
    n = name.lastIndexOf("//");
    if (n > 0) {
        $("#importOrgPostHrFileNameId").text(name.substring(n+1));
        return;
    }
    n = name.lastIndexOf("\\");
    if (n > 0) {
        $("#importOrgPostHrFileNameId").text(name.substring(n+1));
        return;
    }
    n = name.lastIndexOf("/");
    if (n > 0) {
        // console.log("5name=" + name + ", n=" + n + ", sub=" + name.substring(n+1));
        $("#importOrgPostHrFileNameId").text(name.substring(n+1));
        return;
    }
    $("#importOrgPostHrFileNameId").text(name);
    return;
}

/*function exportOrgPostHrOnClick() {
    if($("#importOrgPostHrFormId").valid()){
        $("#exportOrgHrPostId").attr("href", basePath + "download/exportOrgPostHr?exportOrgName="
            + $("#importOrgName").val());
        return true;
    }
    return false;
}*/

function infoIframeOnload() {
    $('#importOrgPostHrFrame').load(function(){
        var val = $(this).contents().find('body').text();
        $("#importInfoSpanId").text(val);
    });
}

$(document).ready(function(){
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
    $.extend($.validator.messages, {
        required: "<span style='color: red;'>必填</span>"
    });
    $("#importOrgPostHrFormId").validate();
    // initImportOrgHrPost();
    initForm();
    // infoIframeOnload()
});
