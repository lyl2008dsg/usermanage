var changepostFormValidate = $("#changepostFormId").validate({
    focusInvalid: false, // do not focus the last invalid input
    ignore: "",
    rules: {
        postName: {
            required    : true,
            minlength   : 2,
            maxlength   : 50
        },
        postLevel: {
            required    : true,
            minlength   : 2,
            maxlength   : 50
        }
    },
    messages: {
        postName: {
            required    : "请输入职位名称"
        },
        postLevel: {
            required    : "请输入职级"
        }

    }
});

function create(){
    var pid = $('#parentId').val();
    var postCode = $('#postCode').val();
    var name = $('#postName').val();
    var postLevel = $('#postLevel').val();
    var sDate = $('#sDate').val();
    if($("#changepostFormId").valid()){
        $.ajax({
            type : "GET",
            url         : basePath + "post/create",
            dataType : "jsonp",
            data : {
                pid:pid,
                name:name,
                postCode:postCode,
                postLevel:postLevel,
                sDate:sDate
            },
            success : function(data) {
                response_status_handler(data.status);
                if(data.status == 200){
                    alert("新增成功!");
                    refrushTreeAutoExpand();
                }
                if(data.status == 400){
                    alert(data.msg);
                }
            },
            error : function(data){
                alert("error")
            }
        });
    }
}

function refrushTreeAutoExpand(){
    var nowOrg = $.fn.zTree.getZTreeObj("nowOrg");
    var node   = nowOrg.getSelectedNodes();
    if (node[0].isParent){
        NowExpand = node[0].org.fullpath;
    } else {
        NowExpand = node[0].post.fullpath;
    }
    refreshNowTree();
}

function update(id, name){
    var id = $('#postId').val();
    var postCode = $('#postCode').val();
    var name = $('#postName').val();
    var postLevel = $('#postLevel').val();
    var sDate = $('#sDate').val();
    if($("#changepostFormId").valid()){
        $.ajax({
            type : "GET",
            url         : basePath + "post/update",
            dataType : "jsonp",
            data : {
                id:id,
                name:name,
                postCode:postCode,
                postLevel:postLevel,
                sDate:sDate
            },
            success : function(data) {
                response_status_handler(data.status);
                if(data.status == 200){
                    alert("修改成功!");
                    var nowOrg = $.fn.zTree.getZTreeObj("nowOrg");
                    var nodes   = nowOrg.getSelectedNodes();
                    var node    = nodes[0];
                    node.name   = name;
                    node.post.code   = postCode;
                    node.post.level   = postLevel;
                    node.post.sdate   = isNull(sDate) ? "" : new Date(sDate).format('yyyy-MM-dd');
                    nowOrg.updateNode(node);
                    refrushTreeAutoExpand();
                    //refreshTree();
                }
                if(data.status == 400){
                    alert(data.msg);
                }
            },
            error : function(data){
                alert("error")
            }
        });
    }
}

function updatePostIsDelete(id, isDelete){
    $.ajax({
        type : "GET",
        url         : basePath + "post/updatePostIsDelete?id="+ id +"&isDelete=" + isDelete,
        dataType : "jsonp",
        success : function(data) {
            response_status_handler(data.status);
            if(data.status == 200){
                alert(data.msg);
                var nowOrg = $.fn.zTree.getZTreeObj("nowOrg");
                var nodes   = nowOrg.getSelectedNodes();
                var node    = nodes[0];
                node.isDelete   = isDelete;
                nowOrg.updateNode(node);
                //判断显示封存和解封
                postShowSeal(isDelete);
                refrushTreeAutoExpand();
                //refreshTree();
            }
            if(data.status == 400){
                alert(data.msg);
            }
        },
        error : function(data){
            alert("error")
        }
    });
}

function deletePost(id){
    $.ajax({
        type : "GET",
        url         : basePath + "post/delete?id="+ id,
        dataType : "jsonp",
        success : function(data) {
            response_status_handler(data.status);
            if(data.status == 200){
                alert("删除成功!");
                var nowOrg = $.fn.zTree.getZTreeObj("nowOrg");
                var node   = nowOrg.getSelectedNodes();
                nowOrg.removeNode(node[0]);

                //refreshTree();
            }
        },
        error : function(data){
            alert("error")
        }
    });
}
