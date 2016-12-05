/**
 * app1.html的js代码
 *
 * @Author liuxueliang
 * @Date 2016/11/11
 */
var sysapp1_limit = 9;

//初始化展示块
function initBlock(){
    $(".row").html("");
    queryBlock();
}

function nextBlock(){
    queryBlock();
}

function changeShow(){
    window.location.href="app.html";
}

function openSonSystem(arg5){
    alert(arg5);
}

function queryBlock(){
    var start = isNull($("#start").val()) ? 0 : $("#start").val();
    $.ajax({
        type:"GET",
        url:basePath+"app/view?start="+start+"&limit="+sysapp1_limit+"&realname=",
        dataType:"jsonp",
        success:function(data){
                response_status_handler(data.status);
                var recordsTotal = data.recordsTotal;
                //展示块赋值
                $(data.data).each(function(i,item){
                    var arg1 = item.name;
                    var arg2 = item.name;
                    var arg3 = item.manager;
                    var arg4 = item.contact;
                    var arg5 = item.app_url;
                    var block = create_block(arg1,arg2,arg3,arg4,arg5);
                    $(".row").append(block);
                });
                var nextStart = parseInt(start)+$(data.data).length;
                $("#start").val(nextStart);
        },
        error : function(data){
            alert(data.msg);
        }
    });
}

//创建一个展示块
function create_block(arg1,arg2,arg3,arg4,arg5){
    var a = $("<a/>").attr("href","app1.html")
        .append($("<div/>").addClass("col-sm-4")
            .append($("<div/>").addClass("text-center")
                .append($("<img/>").addClass("img-circle m-t-xs img-responsive").attr("alt","image").attr("src","img\\a3.jpg"))
                .append($("<div/>").addClass("m-t-xs font-bold").text(arg1))));

    var div1 = $("<div/>").addClass("col-sm-8")
        .append(
            $("<a/>").click(function(){
                if(arg5!=undefined && arg5!=null && arg5!=""){
                    window.open(arg5);
                }
            }).append($("<h3/>").append($("<strong/>").addClass("font").text(arg2)))
                .append($("<p/>").text("负责人："+(arg3==undefined?"":arg3)))
                .append($("<p/>").text("联系方式："+(arg4==undefined?"":arg4)))
        );

    var div2 = $("<div/>").addClass("clearfix");

    return $("<div/>").addClass("col-sm-4 animated").hover(function(){
        var animation = $(this).data('animation');
        $(this).addClass(animation);
    },function(){
        var animation = $(this).data('animation');
        $(this).removeClass(animation);
    }).attr("id","test").attr("data-animation","pulse")
        .append($("<div/>").addClass("contact-box").append(a).append(div1).append(div2));
}

//页面初始化
function app1Init(){
    //初始化block
    initBlock();
    //初始化其他
    //...
}

app1Init();