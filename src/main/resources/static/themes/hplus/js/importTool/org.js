function createOrg(node){
    //判断下级节点是否为空
    var childOrgName    = $('#childOrgName').val();
    if(isNull(childOrgName)){
        $('#childOrgDiv').show();
        $('#currentOrgName').attr("disabled","disabled")
        //$('#childOrgDiv').css("visibility","visible");
        //$("#ChgPostBtn").css("visibility","hidden");
    }else {
        var parentId = node.id;
        //var nodeName = $('#currentOrgName').val();
        var createOrgDate = $('#createOrgDate').val();
        if(!validateDate(createOrgDate)){
            alert("成立日期格式错误！");
            return ;
        }
        if ($("#orgFormId").valid()) {
            $.ajax({
                type: "GET",
                url: basePath + "org/create?pid=" + parentId + "&orgName=" + childOrgName + "&createOrgDate=" + createOrgDate,
                dataType: "jsonp",
                success: function (data) {
                    if (data.status == 200) {
                        alert("创建成功!");
                        $('#orgFormId').hide();
                        var nowOrg = $.fn.zTree.getZTreeObj("nowOrg");
                        var node   = nowOrg.getSelectedNodes();
                        NowExpand = node[0].org.fullpath;
                        refreshNowTree();
                        //nowOrg.removeNode(node[0]);
                    }else{
                        alert(data.msg)
                        return;
                    }
                },
                error: function (data) {
                    alert("error")
                }
            });
        }
    }
}

function updateOrg(node){
    var nodeId      = node.id;
    var nodeName    = $('#currentOrgName').val();
    var createOrgDate    = $('#createOrgDate').val();
    if(!validateDate(createOrgDate)){
        alert("成立日期格式错误！");
        return ;
    }
    if($("#orgFormId").valid()){
        $.ajax({
            type : "GET",
            url         : basePath + "org/update?orgId="+ nodeId +
            "&orgName=" + nodeName + "&createOrgDate=" + createOrgDate,
            dataType : "jsonp",
            success : function(data) {
                if(data.status == 200){
                    alert("修改成功!");
                    var nowOrg = $.fn.zTree.getZTreeObj("nowOrg");
                    var nodes   = nowOrg.getSelectedNodes();
                    var node    = nodes[0];
                    node.name   = nodeName;
                    node.org.sDate   = isNull(createOrgDate) ? "" : new Date(createOrgDate).format('yyyy-MM-dd');
                    nowOrg.updateNode(node);
                }
            },
            error : function(data){
                alert("error")
            }
        });
    }
}

function updateOrgIsDelete(node, isDelete){
    var successMsg = "修改成功";
    switch (isDelete){
        case "1":
            successMsg = "解封成功！";
            break;
        case "2":
            successMsg = "封存成功！";
            break;
    }
    var nodeId      = node.id;
    $.ajax({
        type : "GET",
        url         : basePath + "org/updateOrgIsDelete?orgId="+ nodeId + "&isDelete=" + isDelete,
        dataType : "jsonp",
        success : function(data) {
            if(data.status == 200){
                var nowOrg = $.fn.zTree.getZTreeObj("nowOrg");
                var nodes   = nowOrg.getSelectedNodes();
                var node    = nodes[0];
                node.isDelete   = isDelete;
                nowOrg.updateNode(node);
                //判断显示封存和解封
                showSeal(isDelete);
                alert(data.msg);
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

function deleteOrg(node){
    $.ajax({
        type : "GET",
        url         : basePath + "org/delete?orgId="+ node.id,
        dataType : "jsonp",
        success : function(data) {
            if(data.status == 200){
                alert("删除成功!");
                var nowOrg = $.fn.zTree.getZTreeObj("nowOrg");
                var node   = nowOrg.getSelectedNodes();
                nowOrg.removeNode(node[0]);
            }
        },
        error : function(data){
            alert("error")
        }
    });
}

function createEmployee(pid, name){
}

function updateEmployee(node){
    var realname    = $('#realname').val();
    var empNo       = $('#employeeno').val();
    var mobile      = $('#mobile').val();
    var officemail  = $('#officeemail').val();
    var postId      = $('#postId').val();
    var entryTime   = $('#entrytime').val();
    var orgId       = node.pid;
    var idCardNumber = $('#idCardNumber').val();
    var maritalStatus = $('#maritalStatus').val();
    var national = $('#national').val();
    var political = $('#political').val();
    var degree = $('#degree').val();
    var nativePlace = $('#nativePlace').val();
    var domicilePlace = $('#domicilePlace').val();
    var workDate = $('#workDate').val();
    var emergencyContact = $('#emergencyContact').val();
    var emergencyContactPhone = $('#emergencyContactPhone').val();
    var birthday    = $('#birthday').val();
    var gender         = $('#gender').val();
    var leader         = $('#leader').val();
    var regular         = $('#regular').val();
    var regularDate         = $('#regularDate').val();
    var workAge         = $('#workAge').val();
    var level         = $('#postLevel').val();
    var age         = $('#age').val();
    if($("#empFormId").valid()){
        $.ajax({
            type : "GET",
            url         : basePath + "hr/update",
            dataType : "jsonp",
            data : {
                realname    :realname,
                empNo       :empNo,
                mobile      :mobile,
                officemail  :officemail,
                postId      :postId,
                entryTime   :new Date(entryTime).getTime(),
                orgId       :orgId,
                idCardNumber:idCardNumber,
                maritalStatus:maritalStatus,
                national:national,
                political:political,
                degree:degree,
                nativePlace:nativePlace,
                domicilePlace:domicilePlace,
                workDate:workDate,
                emergencyContact:emergencyContact,
                emergencyContactPhone:emergencyContactPhone,
                birthday:birthday,
                gender:gender,
                leader:leader,
                regular:regular,
                regularDate:regularDate,
                workAge:workAge,
                level:level,
                age:age
            },
            success : function(data) {
                if(data.status == 200){
                    alert("修改成功!");
                    var nowOrg = $.fn.zTree.getZTreeObj("nowOrg");
                    var nodes   = nowOrg.getSelectedNodes();
                    var node    = nodes[0];
                    node.name   = realname;
                    nowOrg.updateNode(node);
                }
                if (data.status == 400) {
                    alert(data.msg);
                }
            },
            error : function(data){
                alert("error")
            }
        });
    }
}

function deleteEmployee(pid, name){
}


function create(){
    var nowOrg = $.fn.zTree.getZTreeObj("nowOrg");
    var nodes   = nowOrg.getSelectedNodes();
    var node    = nodes[0];
    if(node.isParent){
        createOrg(node);
    }else{

    }

}

function update(){
    var nowOrg = $.fn.zTree.getZTreeObj("nowOrg");
    var nodes   = nowOrg.getSelectedNodes();
    var node    = nodes[0];
    if(node.isParent){
        updateOrg(node);
    }else{
        updateEmployee(node);
    }
}

function deleteBtn(){
    var nowOrg = $.fn.zTree.getZTreeObj("nowOrg");
    var nodes   = nowOrg.getSelectedNodes();
    var node    = nodes[0];
    if(node.isParent){
        deleteOrg(node)
    }else{

    }
}

function org2Status(isDelete){
    var nowOrg = $.fn.zTree.getZTreeObj("nowOrg");
    var nodes   = nowOrg.getSelectedNodes();
    var node    = nodes[0];
    if(node.isParent){
        updateOrgIsDelete(node, isDelete);
    }
}
//验证日期格式
function validateDate(str){
    var reg =/\d{4}-\d{2}-\d{2}/ ;
    if (reg.test(str) && str.length==10){
        return true;
    }else{
        return false;
    }
}

function testImpost() {
    var importOrgName = $("#importOrgName").val();
    $.ajax({
        type : "GET",
        url         : basePath + "upload/testImportOrgPostHr?importOrgName=" + importOrgName,
        dataType : "jsonp",
        success : function(data) {
            if(data.status == 200){
                alert(data.msg);
            }
            if(data.status == 400){
                alert(data.msg);
            }
        },
        error : function(data){
            alert("服务器异常，请联系管理员！")
        }
    });
}
