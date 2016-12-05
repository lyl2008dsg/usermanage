/**
 * 初始化列表
 * @param name
 */
function initTable(name){
    name = $.trim(name);
    var table = $('#role_table_id').DataTable( {
        "dom": '<"toolbar">frtip',
        "processing": true,
        "serverSide": true,
        "searching": false,
        "destroy": true,
        "ordering": false,
        "ajax": {
            url: basePath+"role/view?start=0&limit=10&name=" + name,
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
                    str += "<button class='btn btn-info '   type='button' " +
                        "onclick='updateView(\"" + data + "\", \"" + row.name + "\", \"" + row.orgId + "\", \"" + row.codeitemdesc + "\")'><i class='fa fa-paste'></i> 修改</button>";
                    str += "&nbsp;&nbsp;<button class='btn btn-info '   type='button' onclick='deleteRole(\"" + data + "\")'><i class='fa fa-paste'></i> 删除</button>";
                    if (data == 1) {
                    } else if (data == 0) {
                    }
                    return str;
                },
                "targets": 3
            }
        ],
        "columns": [
            { "data": "id" },
            { "data": "name" },
            { "data": "codeitemdesc" },
            { "data": "id" },
        ]
    } );
}

/**
 * 打开新增页面
 */
function addView() {
    $("#roleModal").modal("show");
    $("#roleAddId").show();
    $("#roleUpdateId").hide();
    $("#roleId").val("");
    $("#roleName").val("");
    $("#roleOrgId").val("");
    $("#roleSelectOrgId").val("");
}

/**
 * 新增
 */
function add(){
    if ($("#roleEditFormId").valid()){
        $.ajax({
            type : "GET",
            url         : basePath + "role/add?name="+ $("#roleName").val() +"&orgId=" + $("#roleOrgId").val(),
            dataType : "jsonp",
            success : function(data) {
                response_status_handler(data.status);
                if(data.status == 200){
                    alert(data.msg);
                    $("#roleModal").modal("hide");
                    initTable($("#role_select_name_id").val());
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

/**
 * 打开修改页面
 */
function updateView(id, name, orgId, roleSelectOrgId) {
    $("#roleModal").modal("show");
    $("#roleUpdateId").show();
    $("#roleAddId").hide();
    $("#roleId").val(id);
    $("#roleName").val(name);
    $("#roleOrgId").val(orgId);
    $("#roleSelectOrgId").val(roleSelectOrgId);
}

/**
 * 修改
 */
function update(){
    if ($("#roleEditFormId").valid()){
        $.ajax({
            type : "GET",
            url         : basePath + "role/update?id=" + $("#roleId").val() + "&name="+ $("#roleName").val() +"&orgId=" + $("#roleOrgId").val(),
            dataType : "jsonp",
            success : function(data) {
                response_status_handler(data.status);
                if(data.status == 200){
                    alert(data.msg);
                    $("#roleModal").modal("hide");
                    initTable($("#role_select_name_id").val());
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

/**
 * 删除
 */
function deleteRole(id){
    $.ajax({
        type : "GET",
        url         : basePath + "role/delete?id="+ id ,
        dataType : "jsonp",
        success : function(data) {
            response_status_handler(data.status);
            if(data.status == 200){
                alert(data.msg);
            }
            if(data.status == 400){
                alert(data.msg);
            }
            initTable($("#role_select_name_id").val());
        },
        error : function(data){
            alert("error")
        }
    });

}


/**
 * 按名称查询
 */
function roleListSelect() {
    initTable($("#role_select_name_id").val());
}


function initOrgTree() {
    var settingPost = {
        async: {
            enable: true,
            url: basePath + "org/orgTree?appKey="+appKey+"&appSecret="+appSecret,
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
            onClick: onClickOrg
        }
    };
    $.fn.zTree.init($("#orgSelectOrgTreeId"), settingPost);
    showOrg();
}

function showOrg() {
    var orgObj = $("#roleSelectOrgId");
    var orgOffset = $("#roleSelectOrgId").offset();
    $("#orgSelectOrgTreeContent").css({left:orgOffset.left + "px", top:orgOffset.top + orgObj.outerHeight() + "px"});
    $("#orgSelectOrgTreeId").css({width:orgObj.outerWidth() + "px"});
    $("#orgSelectOrgTreeContent").show();
    $("body").bind("mousedown", onBodyDown);
}

function onBodyDown(event) {
    if (!(event.target.id == "roleSelectOrgId" || event.target.id == "orgSelectOrgTreeContent" || $(event.target).parents("#orgSelectOrgTreeContent").length>0)) {
        hideMenu();
    }
}

function hideMenu() {
    $("#orgSelectOrgTreeContent").hide();
    $("body").unbind("mousedown", onBodyDown);
}

function filter(treeId, parentNode, childNodes) {
    if (!childNodes) return null;
    for (var i=0, l=childNodes.length; i<l; i++) {
        childNodes[i].name = childNodes[i].name.replace(/\.n/g, '.');
    }
    return childNodes;
}

function onClickOrg(e, treeId, treeNode) {
    $("#roleSelectOrgId").val(treeNode.name);
    $("#roleOrgId").val(treeNode.id);
    $("#orgSelectOrgTreeContent").hide();
}



$(document).ready(function(){
    initTable('');
});


