/**
 * Created by apple on 16/10/23.
 */

function getURL(){
    return encodeURIComponent(window.location.href);
}

var setting = {
    async: {
        enable: true,
        url: basePath + "org/orgTree?appKey="+appKey+"&appSecret="+appSecret,
        autoParam:["id=pid", "name=n", "level=lv", "appKey="+appKey, "appSecret="+appSecret],
        type:"get",
        dataType:'jsonp',
        dataFilter: filter
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
//                beforeClick: beforeClick,
//                onClick: onClick,
//                onCheck: onCheck,
//                onAsyncSuccess: zTreeOnAsyncSuccess
    }
};

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


//function initTree(){
//    $.fn.zTree.init($("#treeDemo"), setting);
//}

$(document).ready(function(){
    $.fn.zTree.init($("#treeDemo"), setting);
});
