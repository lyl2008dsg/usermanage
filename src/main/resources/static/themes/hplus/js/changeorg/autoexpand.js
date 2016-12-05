/**
 * Created by apple on 16/10/27.
 */


var NowExpand       = "";
function expandNowPath(treeId, fullpath){
    // console.log("expandNowPath fullpath 前：" + fullpath);
    // console.log("expandNowPath NowExpand 前：" + NowExpand);
    if(!isNull(fullpath)){
        NowExpand = fullpath;
    }
    // console.log("expandNowPath NowExpand 后：" + NowExpand);
    var array = NowExpand.split("/");
    NowExpand.lastIndexOf()
    findExpand(treeId, array, '1');

}

var FutureExpand    = "";
function expandFuturePath(treeId, fullpath){
    if(!isNull(fullpath)){
        FutureExpand = fullpath;
    }
    var array = FutureExpand.split("/");
    findExpand(treeId, array, '2');
}

//循环根节点递归查找并展开array中的节点
function findExpand(treeId, array, flag) {
    var orgTree  = $.fn.zTree.getZTreeObj(treeId);
    var nodes   = orgTree.getNodes();
    if (!isNull(array)){
        for(var i=0;i<array.length;i++){
            if(!isNull(array[i])){
                for(var n=0;n<nodes.length;n++){
                    var temp = autoExpand(orgTree, nodes[n], array[i]);
                    if (temp) {
                        if (flag == '1'){
                            var t = "/" + array[i];
                            NowExpand = NowExpand.substr(NowExpand.indexOf(t)+t.length);
                            if (NowExpand == '/'){
                                NowExpand = "";
                            }
                        }
                        if (flag == '2'){
                            var t = "/" + array[i];
                            FutureExpand = FutureExpand.substr(FutureExpand.indexOf(t)+t.length);
                            if (FutureExpand == '/'){
                                FutureExpand = "";
                            }
                        }
                        break;
                    }
                }
            }
        }
    }
}

//递归查找节点并展开
function autoExpand(orgTree, nodes, nodeId){
    if (!isNull(nodes)){
        if (nodes.id == nodeId) {
            orgTree.expandNode(nodes, true, null, null, true);
            orgTree.selectNode(nodes);
            return true;
        } else {
            if(!isNull(nodes.children)){
                var tempNodes = nodes.children;
                for(var i=0;i<tempNodes.length;i++){
                    var temp = autoExpand(orgTree, tempNodes[i], nodeId);
                    if (temp) {
                        return true;
                    }
                }
            }
        }
    }
    return false;
}

