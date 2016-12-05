/**
 * Created by apple on 16/10/23.
 */

function getURL(){
    return encodeURIComponent(window.location.href);
}

function getFont(treeId, node) {

    if(node.org.is_delete == 2){
        return {color:grep};
    }else{
        return {};
    }
}

var setting = {
    async: {
        enable: true,
        url: basePath + "org/orgTree?isSealed=2&appKey="+appKey+"&appSecret="+appSecret,
        autoParam:["id=pid", "name=n", "level=lv", "appKey="+appKey, "appSecret="+appSecret],
        type:"get",
        dataType:'jsonp',
        dataFilter: filter
    },
    view:{
        fontCss: getFont //获取当前节点字体
    },
    data: {
        simpleData: {
            enable: true
        }
    },
    check: {
        enable: true,
        chkboxType: { "Y": "s", "N": "s" }
    },
    data: {
        simpleData: {
            enable: true
        }
    },
    callback: {
        beforeClick: beforeClick,
        //onClick: onClick
        onCheck: onCheck,
        onAsyncSuccess: zTreeOnAsyncSuccess,
        onExpand:zTreeOnExpand
    }
};

function zTreeOnExpand(event, treeId, treeNode) {
    var nowOrg = $.fn.zTree.getZTreeObj("nowOrg");
    nowOrg.selectNode(treeNode);
}

function Future_zTreeOnExpand(event, treeId, treeNode) {
    var futureOrg = $.fn.zTree.getZTreeObj("futureOrg");
    futureOrg.selectNode(treeNode);
}

function nocheck(node, treeId){
    var tree = $.fn.zTree.getZTreeObj( treeId );
    node.nocheck = true;
    tree.updateNode(node);
}

function noAllCheck(nodes ) {
    for( var i=0; i<nodes.length; i++ ){
        var node = nodes[i];
        if(node.isParent){
            if(!isNull(node.org.fullpath) && (node.org.fullpath.indexOf("/01/0101") >= 0 || node.org.fullpath.indexOf("/01/0103") >= 0 ) ){
                nocheck(node, "nowOrg");
            }
            if(!isNull(node.children)) {
                noAllCheck(node.children);
            }
        }else{
            if(!isNull(node.employee.fullpath) && (node.employee.fullpath.indexOf("/01/0101") >= 0 || node.employee.fullpath.indexOf("/01/0103") >= 0 ) ){
                nocheck(node, "nowOrg");
            }
        }
    }
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
    var orgTree  = $.fn.zTree.getZTreeObj(treeId);
    var nodes    = orgTree.getNodes();
    noAllCheck(nodes, orgTree);
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

function future_zTreeOnAsyncSuccess(event, treeId, treeNode, msg) {
    if(!isNull(FutureExpand)){
        expandFuturePath("futureOrg", FutureExpand);
    }
};

//选中节点
function loadCheckNodes(nodes,b) {
    var treeObj = $.fn.zTree.getZTreeObj("nowOrg");
    for (var i=0, l=nodes.length; i < l; i++) {
        //是否存在反选权限
        var status;//findPermissionByNode(nodes[i]);

        //如果当前节点的 父节点 已缓存修改方案，当前节点不与数据库权限保持一致  status = null
        //存在权限的父节点被改变
        //if(status && parentNodesBychanged(nodes[i]) ){
        //    status = null;
        //}

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
    //className = (className === "dark" ? "":"dark");
    //return (treeNode.click != false);
    var node = treeNode;
    if(node.isParent){
        if(!isNull(node.org.fullpath) && (node.org.fullpath.indexOf("/01/0101") >= 0 || node.org.fullpath.indexOf("/01/0103") >= 0 ) ){
            alert("【"+treeNode.name + "】 不允许修改!")
            return false;
        }
    }else{
        if(!isNull(node.employee.fullpath) && (node.employee.fullpath.indexOf("/01/0101") >= 0 || node.employee.fullpath.indexOf("/01/0103") >= 0 ) ){
            alert("【"+treeNode.name + "】 不允许修改!")
            return false;
        }
    }
    return true;
}

var setting_nocheck = {
    async: {
        enable: true,
        url: basePath + "org/orgTree?isSealed=2&appKey="+appKey+"&appSecret="+appSecret,
        autoParam:["id=pid", "name=n", "level=lv", "appKey="+appKey, "appSecret="+appSecret],
        type:"get",
        dataType:'jsonp',
        dataFilter: filter
    },
    view:{
        fontCss: getFont //获取当前节点字体
    },
    data: {
        simpleData: {
            enable: true
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
        onExpand        : Future_zTreeOnExpand,
        onAsyncSuccess  : future_zTreeOnAsyncSuccess
    }
};

function filter(treeId, parentNode, childNodes) {
    if (!childNodes) return null;
    for (var i=0, l=childNodes.length; i<l; i++) {
        childNodes[i].name = childNodes[i].name.replace(/\.n/g, '.');
    }
    return childNodes;
}

//var log, className = "dark";
//function beforeClick(treeId, treeNode, clickFlag) {
//    className = (className === "dark" ? "":"dark");
//    return (treeNode.click != false);
//}

function change(){
    var nowOrg      = $.fn.zTree.getZTreeObj("nowOrg");
    var futureOrg   = $.fn.zTree.getZTreeObj("futureOrg");
    var orgIds      = fetchOrgIds(changedNodes.values(), "org");
    var employeeIds = fetchOrgIds(changedNodes.values(), "employee");
    var orgfullpath = fetchOrgFullPath(changedNodes.values(), "org");
    var target      = futureOrg.getSelectedNodes();
    if (isNull(orgIds) && isNull(employeeIds)){
        alert("请勾选即将变更的组织或者个人");
        return;
    }
    if (isNull(target) || target.length <= 0){
        alert("请选择变更目标组织");
        return;
    }

    var b = validParamsParentInChild(orgfullpath, target[0]);
    if(!b)
        return;
    //当前组织或者人  不可以放置 目标组织或者人 相同父级   this.parent != target
    var b = validParamsParentNotEquertTarget(changedNodes.values(), target[0])
    if(!b){
        return;
    }

    requestChange(orgIds, employeeIds, target[0].id);
}

function validParamsParentInChild(temp, target){
    var fullpath = target.org.fullpath;
    for(var i=0;i<temp.length;i++){
        if(fullpath.indexOf(temp[0]) >=0 ){
            alert("父级别组织不允许被变更为其子组织");
            return false;
        }
    }
    return true;
}

function validParamsParentNotEquertTarget(temp, target){
    var result = "";
    for(var i=0;i<temp.length;i++){
        var node = temp[i];
        var parentNode = node.getParentNode();
        if(parentNode.id == target.id){
            alert("存在无意义变动");
            return false;
        }
    }
    return true;
}

function requestChange(orgIds, employeeIds, target){

    $.ajax({
        type : "GET",
        url         : basePath + "org/changeOrg?orgIds="+ orgIds +"&employeeIds=" + employeeIds +"&target=" + target ,
        dataType : "jsonp",
        success : function(data) {
            response_status_handler(data.status);
            if(data.status == 200){
                alert("完成变更!");
                refreshTree();
            }else{
                alert(data.msg);
                return;
            }
        },
        error : function(data){
            alert("error")
        }
    });

}

function refreshTree(){
    initTree();
}


function refreshNowTree(){
    $("#nowOrg").html("");
    $.fn.zTree.init($("#nowOrg"), setting);
}

function refreshFutureTree(){
    $("#futureOrg").html("");
    $.fn.zTree.init($("#futureOrg"), setting_nocheck);
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

function fetchOrgFullPath(temp, type){
    var result = new Array();
    for(var i=0;i<temp.length;i++){
        var node = temp[i];
        if(type == "org" && node.isParent){
            result.push(node.org.fullpath);
        }
    }
    return result;
}





function initTree(){

    $("#nowOrg").html("");
    $("#futureOrg").html("");
    changedNodes = new Map();
    $.fn.zTree.init($("#nowOrg"), setting);
    $.fn.zTree.init($("#futureOrg"), setting_nocheck);

    //initSelect();
    //location.reload()
    //clearAll();
}


$(document).ready(function(){
    initTree();
    initSelect();
});
