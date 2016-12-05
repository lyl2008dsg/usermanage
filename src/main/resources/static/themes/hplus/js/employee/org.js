


jQuery.validator.addMethod("isNumber", function(value, element) {
    if(!isNaN(value)){
        return true;
    }else{
        return false;
    }
}, "请输入数字");

jQuery.validator.addMethod("isMobile", function(value, element) {
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
    if(myreg.test(value)){
        return true;
    }else{
        return false;
    }
}, "请输入正确的手机号码 支持：130-139,150-159,170-179,180-189");


var empFormValidate = $("#empFormId").validate({
    focusInvalid: false, // do not focus the last invalid input
    ignore: "",
    rules: {
        "age"         : {
            required    : true,
            isNumber    : true
        },
        idCardNumber: {
            required    : true,
            // isNumber    : true,
            minlength   : 15,
            maxlength   : 19
        },
        mobile      : {
            required    : true,
            isNumber    : true,
            isMobile    : true
        },
        workAge     : {
            required    : true,
            isNumber    : true
        }
    },
    messages: {
        age         : {
            required    : "请输入年龄"
        },
        idCardNumber: {
            required    : "请输入身份证号码"
        },
        mobile      : {
            required    : "请输入手机号码"
        },
        workAge     : {
            required    : "请输入司龄"
        }
    }
});

function createOrg(node){
    var parentId    = node.id;
    var nodeName    = $('#currentOrgName').val();
    var createOrgDate    = $('#createOrgDate').val();
    if($("#orgFormId").valid()){
        $.ajax({
            type : "GET",
            url         : basePath + "org/create?pid="+ parentId +
            "&orgName=" + nodeName + "&createOrgDate=" + createOrgDate,
            dataType : "jsonp",
            success : function(data) {
                response_status_handler(data.status);
                if(data.status == 200){
                    alert("创建成功!");
                    //var nowOrg = $.fn.zTree.getZTreeObj("nowOrg");
                    //var node   = nowOrg.getSelectedNodes();
                    //nowOrg.removeNode(node[0]);
                }
            },
            error : function(data){
                alert("error")
            }
        });
    }
}

function updateOrg(node){
    var nodeId      = node.id;
    var nodeName    = $('#currentOrgName').val();
    var createOrgDate    = $('#createOrgDate').val();
    if($("#orgFormId").valid()){
        $.ajax({
            type : "GET",
            url         : basePath + "org/update?orgId="+ nodeId +
            "&orgName=" + nodeName + "&createOrgDate=" + createOrgDate,
            dataType : "jsonp",
            success : function(data) {
                response_status_handler(data.status);
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
    var nodeId      = node.id;
    $.ajax({
        type : "GET",
        url         : basePath + "org/updateOrgIsDelete?orgId="+ nodeId + "&isDelete=" + isDelete,
        dataType : "jsonp",
        success : function(data) {
            response_status_handler(data.status);
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
            response_status_handler(data.status);
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

function createEmployee(node){
    var realname    = $('#realname').val();             //姓名
    var empNo       = $('#employeeno').val();           //编码
    var gender         = $('#gender').val();             //性别
    var national = $('#national').val();                //民族
    var birthday    = $('#birthday').val();             //出生日期
    var age         = $('#age').val();                  //年龄
    var idCardNumber = $('#idCardNumber').val();        //身份证号码
    var political = $('#political').val();              //政治面貌
    var degree = $('#degree').val();                    //学历
    var nativePlace = $('#nativePlace').val();          //籍贯
    var domicilePlace = $('#domicilePlace').val();      //户口所在地
    var maritalStatus = $('#maritalStatus').val();      //婚姻状况
    var mobile      = $('#mobile').val();               //移动电话
    var officemail  = $('#officeemail').val();          //工作邮箱
    var emergencyContact = $('#emergencyContact').val();    //紧急联系人
    var emergencyContactPhone = $('#emergencyContactPhone').val();  //紧急联系人电话
    var orgId       = node.id;                 //所属组织
    var postId      = $('#postId').val();       //岗位名称
    var level         = $('#postLevel').val();  //岗位级别
    var leader         = $('#leader').val();     //汇报关系
    var workDate = $('#workDate').val();         //参加工作日期
    var entryTime   = $('#entrytime').val();    //入职日期
    var regular         = $('#regular').val();  //是否转正
    var regularDate         = $('#regularDate').val();  //转正日期
    var workAge         = $('#workAge').val();  //司龄
    var workStatus         = $('#workStatus').val();  //人员状态
    if($("#empFormId").valid()){
        $.ajax({
            type : "GET",
            url         : basePath + "hr/save",
            dataType : "jsonp",
            data : {
                realname    :realname,
                empNo       :empNo,
                mobile      :mobile,
                officemail  :officemail,
                postId      :postId,
                entryTime   :isNull(entryTime)?"":new Date(entryTime).getTime(),
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
                workStatus:workStatus,
                level:level,
                age:age
            },
            success : function(data) {
                response_status_handler(data.status);
                if(data.status == 200){
                    alert("保存成功!");
                    $('#employeeform').hide();
                    /*
                    var nowOrg = $.fn.zTree.getZTreeObj("nowOrg");
                    var nodes   = nowOrg.getSelectedNodes();
                    var node    = nodes[0];
                    node.name   = realname;
                    nowOrg.updateNode(node);
                    NowExpand = node.employee.fullpath + node.id;*/
                    refreshNowTree();
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
    var workStatus         = $('#workStatus').val();
    var uniqueId         = $('#uniqueId').val();
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
                entryTime   :isNull(entryTime) ? "" : new Date(entryTime).getTime(),
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
                workStatus:workStatus,
                uniqueId:uniqueId,
                level:level,
                age:age
            },
            success : function(data) {
                response_status_handler(data.status);
                if(data.status == 200){
                    alert("修改成功!");
                    $('#employeeform').hide();
                    var nowOrg = $.fn.zTree.getZTreeObj("nowOrg");
                    var nodes   = nowOrg.getSelectedNodes();
                    var node    = nodes[0];
                    node.name   = realname;
                    nowOrg.updateNode(node);
                    NowExpand = node.employee.fullpath + node.id;
                    refreshNowTree();
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
function openEmployeeForm() {
    $("#empFormId")[0].reset();
    $('#orgform').hide();
    $('#employeeform').show();

    var nowOrg = $.fn.zTree.getZTreeObj("nowOrg");
    var nodes   = nowOrg.getSelectedNodes();
    var node    = nodes[0];
    $('#emporgname').val( node.name);

}
function create(){
    var nowOrg = $.fn.zTree.getZTreeObj("nowOrg");
    var nodes   = nowOrg.getSelectedNodes();
    var node    = nodes[0];
    if(node.isParent){
        // createOrg(node);
        createEmployee(node);
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

