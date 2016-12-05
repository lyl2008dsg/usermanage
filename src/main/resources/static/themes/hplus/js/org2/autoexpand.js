/**
 * Created by apple on 16/10/27.
 */


var NowExpand       = "";
function expandNowPath(treeId, fullpath){
    if(!isNull(fullpath)){
        NowExpand = fullpath;
    }
    var array = NowExpand.split("/");
    for(var i=0;i<array.length;i++){
        if(!isNull(array[i])){
            autoExpand(array[i], treeId)
            NowExpand = NowExpand.replace("/"+array[i], "");
            break;
        }
    }
}

var FutureExpand    = "";
function expandFuturePath(treeId, fullpath){
    if(!isNull(fullpath)){
        FutureExpand = fullpath;
    }
    var array = FutureExpand.split("/");
    for(var i=0;i<array.length;i++){
        if(!isNull(array[i])){
            autoExpand(array[i], treeId)
            FutureExpand = FutureExpand.replace("/"+array[i], "");
            break;
        }
    }

}

function autoExpand(nodeId, treeId){
    var nowOrg  = $.fn.zTree.getZTreeObj(treeId);
    var nodes   = nowOrg.getNodes();
    var currentNode = "";
    for(var i=0;i<nodes.length;i++){
        var node = nodes[i];
        if(node.id == nodeId){
            currentNode = node;
            break;
        }else{
            currentNode = hasNode(node.children, nodeId);
        }
    }
    nowOrg.expandNode(currentNode, true, null, null, true);
    //nowOrg.selectNode(currentNode);
}

function hasNode(nodes, nodeId){
    for(var i=0;i<nodes.length;i++){
        var node = nodes[i];
        if(node.id == nodeId) {
            return node;
        }else{
            if(!isNull(node.children)){
                return hasNode(node.children, nodeId);
            }else{
                continue;
            }
        }
    }
}
