/**
 * 初始化列表
 * @param fullname
 */
function initTable(fullname){
    fullname = $.trim(fullname);
    var table = $('#black_list_table_id').DataTable( {
        "dom": '<"toolbar">frtip',
        "processing": true,
        "serverSide": true,
        "searching": false,
        "destroy": true,
        "ordering": false,
        "ajax": {
            url: basePath+"blackList/view?start=0&limit=10&fullname=" + fullname,
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
                    if (isNull(data)) {
                        return str;
                    } else {
                        return data
                    }
                },
                "targets": 3
            },
            {
                "render": function ( data, type, row ) {
                    var str = "";
                    if (data == 1) {
                        str += "<button class='btn btn-info '   type='button' onclick='blackListOpt(\"" + row.employee_no + "\", 0)'><i class='fa fa-paste'></i> 反白</button>";
                    } else if (data == 0) {
                        str += "<button class='btn btn-info '   type='button' onclick='blackListOpt(\"" + row.employee_no + "\", 1)'><i class='fa fa-paste'></i> 拉黑</button>";
                    }
                    return str;
                },
                "targets": 4
            }
        ],
        "columns": [
            { "data": "employee_no" },
            { "data": "fullname" },
            { "data": "email" },
            { "data": "mobile" },
            { "data": "available" }
        ]
    } );
}

/**
 * 列表操作按钮,拉黑或者反白
 * @param employee_no
 * @param available
 */
function blackListOpt(employee_no, available){
    $.ajax({
        type : "GET",
        url         : basePath + "blackList/opt?employeeNo="+ employee_no +"&available=" + available ,
        dataType : "jsonp",
        success : function(data) {
            response_status_handler(data.status);
            if(data.status == 200){
                // alert(data.msg);
                initTable($("#bkt_select_employee_fullname_id").val());
            }
        },
        error : function(data){
            alert("error")
        }
    });

}

/**
 * 选择员工后,拉黑
 */
function blackListAdd(){
    var employeeNo = $("#bkt_search_employee_no_id").val();
    $.ajax({
        type : "GET",
        url         : basePath + "blackList/add?employeeNo="+ employeeNo ,
        dataType : "jsonp",
        success : function(data) {
            response_status_handler(data.status);
            if(data.status == 200){
                // alert(data.msg);
                initTable($("#bkt_select_employee_fullname_id").val());
            }
        },
        error : function(data){
            alert("error")
        }
    });

}

/**
 * 按姓名查询
 */
function blackListSelect() {
    initTable($("#bkt_select_employee_fullname_id").val());
}

/**
 * 初始化下拉框
 * @type {string}
 */
var bktChooseEmp = "";
function initSelect(){
    bktChooseEmp = $("#bkt_search_employee_id").select2({
        id: function(bond){return bond.employeeNo;},
        minimumInputLength : 1,
        ajax : {
            url : basePath + "hr/likeEmp",
            dataType : 'jsonp',
            quietMillis : 250,
            data : function(term, page) {
                return {
                    name : term, // search term
                    start:0,
                    limit:10
                };
            },
            results : function(data, page) { // parse the results into the format expected by Select2.
                // since we are using custom formatting functions we do not need to alter the remote JSON data
                response_status_handler(data.status);
                var result = new Array();
                if(!isNull(data.data)){
                    for(var i=0;i<data.data.length;i++){
                        var emp = data.data[i];
                        var news = {
                            employeeNo	 	: emp.username,
                            employeename 	: emp.A0101,
                            dep 	        : emp.fullname
                        }
                        result.push(news);
                    }
                }

                return {
                    results : result
                };
            }
        },
        formatResult : repoFormatResult, // omitted for brevity, see the source of this page
        formatSelection : repoFormatSelection, // omitted for brevity, see the source of this page
        dropdownCssClass : "bigdrop", // apply css that makes the dropdown taller
        escapeMarkup : function(m) {
            return m;
        }, // we do not want to escape markup since we are displaying html in results
        allowClear: true,
        placeholder : "请在此输入账号或姓名进行查询",
        onSelect:function (data, options) {
            console.log("select2");
        }
    }).on("change", function (evt) {
        if (!evt) {
        } else {
            if(!isNull(evt.added)) {
                //选中执行
                $("#bkt_search_employee_no_id").val(evt.added.employeeNo);
            } else {
                //删除选项执行
                $("#bkt_search_employee_no_id").val('');
            }
        }
    }).on("select", function (evt) {

        if (!evt) {
            var args = "{}";
        } else {
            if(!isNull(evt.added)) {

            }
        }
    }).on("select2:selecting", function(e) {

    });
}

/**
 * 生成下拉项
 * @param repo
 * @returns {string}
 */
function repoFormatResult(repo) {
    var markup = '<div class="row-fluid">' +
        '<div class="span2"></div>' +	//<img src="" />
        '<div class="span10">' +
        '<div class="row-fluid">' +
        '<div class="span6">' + repo.dep + '</div>' +
        //'<div class="span3"><i class="fa fa-code-fork"></i> ' + (isNull(repo.orgname) ?  "" : (repo.orgname +"-"))  +repo.unitname + '</div>' +
        '<div class="span3"><i class="fa fa-star"></i> ' + repo.employeename + '</div>' +
        '</div>';

    markup += '</div></div>';

    return markup;
}

/**
 * 选择回调
 * @param repo
 * @returns {*}
 */
function repoFormatSelection(repo) {
    if(isNull(repo) || isNull(repo.employeename)) return "请选择";
    return repo.employeename;
}

$(document).ready(function(){
    initTable('');
    initSelect();
});


