var search_now = "";
var search_future = "";


function initSelect(){
    search_now = $("#search_now").select2({
        id: function(bond){ return bond.employeeid; },
        minimumInputLength : 1,
        ajax : {
            url : basePath + "org/likeOrg",
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
                        var olds = data.data[i];
                        var news = {
                            employeeid	 	: olds.b0110_0,
                            employeename 	: olds.codeitemdesc,
                            orgname 		: olds.codeitemdesc,
                            fullpath	 	: olds.fullpath,
                            username		: olds.parentdesc,
                            jobname 		: olds.fullname,
                            disabled        : false
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
            alert("select2");
        }
    }).on("change", function (evt) {
            if (!evt) {
                var args = "{}";
            } else {
                if(!isNull(evt.added)) {
                    var orgId = evt.val;
                    var orgIds = evt.added.fullpath;
                    NowExpand = orgIds;
                    refreshNowTree();
                }
            }
    }).on("select", function (evt) {
        alert("select");
        if (!evt) {
            var args = "{}";
        } else {
            if(!isNull(evt.added)) {
                var orgId = evt.val;
                var orgIds = evt.added.fullpath;
                NowExpand = orgIds;
                refreshNowTree();
            }
        }
    }).on("select2:selecting", function(e) {
        alert("selecting");
    });


    search_future = $("#search_future").select2({
        id: function(bond){ return bond.employeeid; },
        minimumInputLength : 1,
        ajax : {
            url : basePath + "org/likeOrg",
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
                        var olds = data.data[i];
                        var news = {
                            employeeid	 	: olds.b0110_0,
                            employeename 	: olds.codeitemdesc,
                            orgname 		: olds.codeitemdesc,
                            fullpath	 	: olds.fullpath,
                            username		: olds.parentdesc,
                            jobname 		: olds.fullname,
                            disabled        : false
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
        placeholder : "请在此输入账号或姓名进行查询"
    });

    $("#search_future").on("change", function (evt) {
        if (!evt) {
            var args = "{}";
        } else {
            if(!isNull(evt.added)){
                var orgId   = evt.val;
                var orgIds  = evt.added.fullpath;
                FutureExpand = orgIds;
                refreshFutureTree();
            }
        }
    });

}

function clearAll(){
    clearNow();
    clearFuture();
}

function clearNow(){
    if(!isNull(search_now)){
        search_now.val(null).trigger("change");
    }
}

function clearFuture(){
    if(!isNull(search_future)) {
        search_future.val(null).trigger("change");
    }
}




function repoFormatResult(repo) {
    var markup = '<div class="row-fluid">' +
        '<div class="span2"></div>' +	//<img src="" />
        '<div class="span10">' +
        '<div class="row-fluid">' +
        '<div class="span6">' + repo.employeename + '('+ repo.username +')</div>' +
        //'<div class="span3"><i class="fa fa-code-fork"></i> ' + (isNull(repo.orgname) ?  "" : (repo.orgname +"-"))  +repo.unitname + '</div>' +
        '<div class="span3"><i class="fa fa-star"></i> ' + repo.jobname + '</div>' +
        '</div>';

    if (repo.description) {
        markup += '<div>' + repo.description + '</div>';
    }

    markup += '</div></div>';

    return markup;
}


function repoFormatSelection(repo) {
    if(isNull(repo) || isNull(repo.orgname)) return "请选择";
    return repo.orgname;
}
//$(".user-p li")排序
function liSort(){
    $(".user-p li").each(function(){
        $(this).find(".user-num").html($(this).index()+1);
    });
    /*$(".user-p li:eq(0)").css({"color":"red"}).siblings("li").css({"color":"#2e2e2e"});*/
}
/*截取字符长度开始*/
function limit(){
    var self = $(".user-p li em");
    self.each(function(){
        var objString = $(this).text();
        var objLength = $(this).text().length;
        $(this).attr("title",objString);
        var num = 21;
        if(objLength > num){
            objString = $(this).text(objString.substring(0,num) + "...");
        }
    });
}
/*截取字符长度结束*/
function addRole(){
    var username = $("#search-box").select2('data').username;
    addAlert('是否确定添加这些管理员', 2, function(data){
        goAddRole(data);
    }, username);
}

function goAddRole(username){
    $.ajax({
        type : "post",
        url : basePath + "appmanagerole/save",
        dataType : "json",
        data : {
            modulecode 	: moduleCode,
            username: username,
        },
        success : function(data) {
            response_status_handler(data.status);
            if (data.status == 0) {
                showTable();
            } else if(data.status == 2){
                addAlert('登录信息超时，请重新登录。',1, function(data){ skipFn(data); }, basePath);
            } else {
                addAlert(data.statustext, 1, function(data){});
//				fail(data.statustext);
            }
        }
    });
}
