function getURL(){
    return encodeURIComponent(window.location.href);
}

function getFont(treeId, node) {
    if(node.isParent) {
        if (node.org.is_delete == 2) {
            return {color: grep};
        } else {
            return {};
        }
    }else{
        if (node.post.isDelete == 2) {
            return {color: grep};
        } else {
            return {};
        }
    }
}

var setting = {
    async: {
        enable: true,
        url: basePath + "org/orgTree?isSealed=2&display=post&appKey="+appKey+"&appSecret="+appSecret,
        autoParam:["id=pid", "name=n", "level=lv", "appKey="+appKey, "appSecret="+appSecret],
        type:"get",
        dataType:'jsonp',
        dataFilter: filter
    },
    view:{
        fontCss: getFont //获取当前节点字体
    },
    edit:{
        enable:true,
        showRemoveBtn:false,
        showRenameBtn:false,
        drag:{
            prev:true,
            inner:false,
            next:true
        }
    },
    //check: {
    //    enable: true,
    //    chkboxType: { "Y": "s", "N": "s" }
    //},
    data: {
        simpleData: {
            enable: true
        }
    },
    callback: {
        beforeClick: beforeClick,
        onCheck: onCheck,
        onClick: zTreeOnClick,
        onAsyncSuccess: zTreeOnAsyncSuccess,
        onExpand:zTreeOnExpand,
        beforeDrag:beforeDrag,
        beforeDrop:beforeDrop
    }
};

function beforeDrag(treeId, treeNodes) {
    for (var i=0,l=treeNodes.length; i<l; i++) {
        if (treeNodes[i].drag === false) {
            return false;
        }
    }
    return true;
}
function beforeDrop(treeId, treeNodes, targetNode, moveType) {
    if(isNull(targetNode)){
        return false;
    }else if(treeNodes[0].pid!=targetNode.pid){
        return false;
    }else if(treeNodes[0].isParent || targetNode.isParent){
        return false;
    }else if(treeNodes.length>1){
        return false;
    }else{
        var params = {};
        params.id = treeNodes[0].id;
        params.targetId = targetNode.id;
        params.moveType=moveType;

        if(confirm("确认移动 节点 到-- " + targetNode.name + " 吗？")){

            //ajax修改数据
            $.ajax({
                type:"GET",
                url:basePath+"drag/post",
                dataType:"jsonp",
                data:params,
                success:function(data){
                    response_status_handler(data.status);
                    alert("修改成功！");
                    return true;
                },
                error : function(data){
                    alert(data.msg);
                    return false;
                }
            });
        }else{
            return false;
        }
    }
}


function zTreeOnClick(event, treeId, treeNode) {
    settingPostForm(treeNode);
}

function settingPostForm(node){
    $("#postForm").show();
    //document.getElementById("changepostFormId").reset()
    changepostFormValidate.resetForm();
    if(node.isParent){
        $('#parentId').val( node.id);
        $('#orgName').val(  node.name);
        $('#postName').val("");
        $('#postLevel').val("");
        $('#sDate').val("");
        hiddenOption("add", node.isDelete, node);
    }else{
        hiddenOption("edit", node.isDelete, node);
        $('#postId').val(   node.id);
        $('#orgName').val(  node.post.parentdesc);
        $('#fullpath').val( node.post.fullname);
        $('#postName').val( node.name);
        $('#postCode').val( node.post.code);
        $('#postLevel').val( node.post.level);
        $('#sDate').val( isNull(node.post.sdate) ? "" : new Date(node.post.sdate).format('yyyy-MM-dd'));
    }
}

function hiddenOption(type, isDelete, node){
    if(type == "add"){
        //hidden fullpath change del
        $("#AddPostBtn").css("visibility","visible");
        $("#ChgPostBtn").css("visibility","hidden");
        //隐藏显示封存、解封
        $("#isDelete2PostBtn").hide();
        $("#isDelete1PostBtn").hide();
        $("#DelPostBtn").css("visibility","hidden");
        $("#fullpathdiv").css("visibility","hidden");

        if(!isNull(node.org.fullpath) && (node.org.fullpath.indexOf("/01/0101") >= 0 || node.org.fullpath.indexOf("/01/0103") >= 0 ) ){
            $("#AddPostBtn").css("visibility","hidden");
            $("#ChgPostBtn").css("visibility","hidden");
        }else{
            $("#AddPostBtn").css("visibility","visible");
            $("#ChgPostBtn").css("visibility","visible");
        }

    }else if(type == "edit"){
        //hidden add
        $("#AddPostBtn").css("visibility","hidden");
        if (isDelete == "2") {
            $("#ChgPostBtn").css("visibility","hidden");
        } else {
            $("#ChgPostBtn").css("visibility","visible");
        }
        //判断显示封存或者解封
        postShowSeal(isDelete);
        $("#DelPostBtn").css("visibility","visible");
        $("#fullpathdiv").css("visibility","visible");

        if(!isNull(node.post.fullpath) && (node.post.fullpath.indexOf("/01/0101") >= 0 || node.post.fullpath.indexOf("/01/0103") >= 0 ) ){
            $("#isDelete2PostBtn").css("visibility","hidden");
            $("#ChgPostBtn").css("visibility","hidden");
        }else{
            $("#isDelete2PostBtn").css("visibility","visible");
            $("#ChgPostBtn").css("visibility","visible");
        }

    }

}

function postShowSeal(isDelete) {
    if (!isNull(isDelete)){
        if (isDelete == "1"){
            //显示封存
            $("#isDelete2PostBtn").show();
            $("#isDelete1PostBtn").hide();
            $("#ChgPostBtn").css("visibility","visible");
        }
        if (isDelete == "2"){
            //显示解封
            $("#isDelete2PostBtn").hide();
            $("#isDelete1PostBtn").show();
            $("#ChgPostBtn").css("visibility","hidden");
        }
    } else {
        //显示封存
        $("#isDelete2PostBtn").show();
        $("#isDelete1PostBtn").hide();
        $("#ChgPostBtn").css("visibility","visible");
    }
}

function zTreeOnExpand(event, treeId, treeNode) {
    var nowOrg = $.fn.zTree.getZTreeObj("nowOrg");
    nowOrg.selectNode(treeNode);
    // expandNowPath("nowOrg");
}

var changedNodes = new Map();
function onCheck(event, treeId, treeNode, clickFlag) {
    var treeObj = $.fn.zTree.getZTreeObj("nowOrg");
    if(treeNode.checked){
        changedNodes.put(treeNode.id, treeNode);
    }else{
        changedNodes.remove(treeNode.id);
    }


    if(!isNull(treeNode.children)){
        onCheckNodes(treeNode.children ,treeNode.checked );
    }
}

function onCheckNodes(nodes,b) {
    var treeObj = $.fn.zTree.getZTreeObj("nowOrg");
    for (var i=0, l=nodes.length; i < l; i++) {
        //树得选中方法
        treeObj.setChkDisabled(nodes[i], b, false, false);
        treeObj.checkNode(nodes[i], b, false , false);
        nodes[i].checkedOld = nodes[i].checked;
        if(!isNull(nodes[i].children)){
            onCheckNodes(nodes[i].children,b);
        }
    }
}

var treeNodes = new Map();
function zTreeOnAsyncSuccess(event, treeId, treeNode, msg) {
    if(isNull(treeNode)) {
        var treeObj = $.fn.zTree.getZTreeObj("nowOrg");
        var nodes = treeObj.getNodes();
        loadCheckNodes(nodes,false);
    }else{
        var b = (!isNull(treeNode) && treeNode.checked == true) ? true : false;
        var nodes = treeNode.children;
        loadCheckNodes(nodes,b);
    }
    if(!isNull(NowExpand)){
        expandNowPath("nowOrg", NowExpand);
    }
};

//选中节点
function loadCheckNodes(nodes,b) {
    var treeObj = $.fn.zTree.getZTreeObj("nowOrg");
    for (var i=0, l=nodes.length; i < l; i++) {
        //是否存在反选权限
        var status;//findPermissionByNode(nodes[i]);

        if(null != status){
            treeObj.setChkDisabled(nodes[i], false, false, false);
            treeObj.checkNode(nodes[i], status, false , false);
        }else{
            //树得选中方法
            treeObj.checkNode(nodes[i], b, false , false);
            treeObj.setChkDisabled(nodes[i], b, false, false);
        }
        nodes[i].checkedOld = nodes[i].checked;
        if(!isNull(nodes[i].children)){
            loadCheckNodes(nodes[i].children,b);
        }
    }
}



var log, className = "dark";
function beforeClick(treeId, treeNode, clickFlag) {
    className = (className === "dark" ? "":"dark");
    return (treeNode.click != false);
}

function filter(treeId, parentNode, childNodes) {
    if (!childNodes) return null;
    for (var i=0, l=childNodes.length; i<l; i++) {
        childNodes[i].name = childNodes[i].name.replace(/\.n/g, '.');
    }
    return childNodes;
}

var log, className = "dark";
function beforeClick(treeId, treeNode, clickFlag) {
    className = (className === "dark" ? "":"dark");
    return (treeNode.click != false);
}


function refreshTree(){
    initTree();
}


function refreshNowTree(){
    $("#nowOrg").html("");
    $.fn.zTree.init($("#nowOrg"), setting);
}

function fetchOrgIds(temp, type){
    var result = "";
    for(var i=0;i<temp.length;i++){
        var node = temp[i];
        if(type == "org" && node.isParent){
            result += node.id;
            if(i != temp.length-1){
                result += ","
            }
        }else if (type == "employee" && !node.isParent){
            result += node.id;
            if(i != temp.length-1){
                result += ","
            }
        }else{
        }
    }
    return result;
}



function initChangepostDatetimepicker() {
    $('#sDate').datepicker({
        format: 'yyyy-mm-dd',
        autoclose: true,
        todayHighlight: true,
        language: 'zh-CN',
        todayBtn: 'linked',
        minView: 2,//最小天
        maxView: 4//最大年
    });
}


function initTree(){
    $("#nowOrg").html("");
    changedNodes = new Map();
    $.fn.zTree.init($("#nowOrg"), setting);
}


$(document).ready(function(){
    initTree();
    initSelect();
    //隐藏解封
    $("#isDelete1PostBtn").hide();
    //暂时不提供删除
    $("#DelPostBtn").hide();
    //暂时不显示编码
    $("#postCodeDivId").hide();
    initChangepostDatetimepicker();
});
