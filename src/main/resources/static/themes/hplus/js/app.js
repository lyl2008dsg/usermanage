/**
 * Created by apple on 16/11/11.
 */
+function(Handlebars) { "use strict";
    if ( !Handlebars ) {
        return;
    }
    Handlebars.registerHelper( 'isEmpty', function( value ) {
        return Handlebars.Utils.isEmpty(value);
    });
    Handlebars.registerHelper( 'rownum', function( index, page ) {
        return page.number * page.size + index + 1;
    });
    Handlebars.registerHelper( 'compare', function( value1, value2 ) {
        return value1 > value2;
    });

    Handlebars.registerHelper( 'eq', function( value1, value2 ) {
        return value1 == value2;
    });
    Handlebars.registerHelper( 'neq', function( value1, value2 ) {
        return value1 != value2;
    });
    Handlebars.registerHelper( 'number', function( value ) {
        return value === undefined ? 0: value;
    });
    Handlebars.registerHelper( 'format_currency', function( value ) {
        return value ===  undefined ? '0.00' : parseFloat(value.toString().replace(/[,]/g,"")).toFixed(2).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    });
    Handlebars.registerHelper( 'number_add', function( number1, number2 ) {
        return (number1 + number2);
    });
    Handlebars.registerHelper( 'number_multiply', function( number1, number2 ) {
        return (number1 * number2);
    });
    Handlebars.registerHelper( 'number_divide', function( number1, number2 ) {
        return (number1 / number2);
    });

    Handlebars.registerHelper( 'format_date', function( value ) {
        //	var d = new Date(value);
        return value == null || value ===  undefined ? '': value.substr(0,10);
    });
    Handlebars.registerHelper( 'to_fixed', function( value ) {
        return value ===  undefined ? 0: value.toFixed(2);
    });
    Handlebars.registerHelper( 'unit_option', function( value ) {
        var units = {};
        units[1] = '天';
        units[2] = '周';
        units[3] = '期';
        units[4] = '年';
        return units[value];
    });

    Handlebars.registerHelper ("text_helper", function (title ,size) {
        if(title.length > size){
            title = title.substr(0,size) +"..."
        }
        return title;
    });

    Handlebars.registerHelper( 'creditType_option', function( creditType ) {
        var creditTypes = {};
        creditTypes['M1'] = '其它';
        creditTypes['B1'] = '身份证';
        creditTypes['C1'] = '信用报告';
        creditTypes['D8'] = '收入证明';
        creditTypes['F1'] = '房屋租赁合同';
        creditTypes['F7'] = '居住地址证明';
        creditTypes['J3'] = '学历证明';
        creditTypes['H1'] = '房产证明';
        creditTypes['I1'] = '购车证明';
        creditTypes['E8'] = '工作证明';
        creditTypes['B3'] = '结婚证明';
        creditTypes['QY1']='组织机构代码证复印件';
        creditTypes['QY2']='银行开户许可证复印件';
        creditTypes['QY3']='营业执照副本复印件';
        creditTypes['QY4']='税务登记证复印件';
        creditTypes['QY5']='法人身份证正反面复印件';
        return creditTypes[creditType];
    });


}(window.Handlebars);

+function($, app) { "use strict";
//翻页
    $.fn.extend({
        appPagination:function(){
            var elem = this;
            elem.find('.pagination [data-page-number]').each(function() {
                $(this).click(function(){
                    var pageNumber = $(this).data('pageNumber')
                    elem.find('[name="currentPage"]').val(pageNumber);
                    elem.submit();
                    return false;
                });
            });
        }
    });
}(window.jQuery, window.app);

+function($, app) { "use strict";
    app.buildPage = function( data ) {
        var page = {}, start, end;
        page.size = data.pageSize;
        page.content = data.voList;
        page.pages = [];
        if ( data.currentPage ) {
            page.number = data.currentPage - 1;
            page.totalPages = data.pageCount;
            page.firstPage = (data.currentPage == 1);
            page.lastPage = (data.currentPage == data.pageCount);

            start = Math.max(0, page.number - app.displayPages / 2);
            end = Math.min(Math.max(page.number + app.displayPages / 2 - 1, app.displayPages - 1), page.totalPages - 1);
            page.visible = (end-start > 0);
            for( var i = start; i <= end; i++ ) {
                page.pages.push(i);
            }
        } else {
            page.number = 0;
            page.totalPages = 0;
            page.firstPage = true;
            page.lastPage = true;
        }

        return page;
    };

}(window.jQuery, window.app);



+function($, app) { "use strict";
    app = app || {};
    app.sendMsg  = function (obj){//60秒倒计时
        obj.addClass("disabled").addClass("active");
        jump(60,obj);
    }
    var jump = function(count , obj) {
        window.setTimeout(function(){
            count--;
            if(count > 0) {
                obj.html(count + "秒后可重新获取");
                jump(count,obj);
            } else {
                obj.removeClass("disabled ").removeClass("active");
                obj.html('获取验证码');
                if(app.callback && $.isFunction(app.callback)){
                    app.callback();
                }
            }
        }, 1000);
    }
}(window.jQuery, window.app);

+function($, app) { "use strict";
    app = app || {};
    app.initOptions  = function (){//JQuery validation 兼容  Bootstrap输入框图标样式
        app.options = {
            highlight: function(element) {
                $(element).closest('.form-group').addClass('has-error');
            },
            unhighlight: function(element) {
                $(element).closest('.form-group').removeClass('has-error');
            },
            errorElement: 'span',
            errorClass: 'help-block',
            errorPlacement: function(error, element) {
                if(element.parent('.input-group').length) {
                    error.insertAfter(element.parent());
                } else {
                    error.insertAfter(element);
                }
            }
        };
    }
}(window.jQuery, window.app);

+function($, app) { "use strict";
    app = app || {};
    app.codeRefresh  = function (obj){//刷新验证码
        obj = $(obj);
        var url = obj.attr("src");
        if(url.indexOf("?")>=0){
            url = url.substring(0,url.indexOf("?"));
        }
        var d = new Date();
        obj.attr("src",url+'?a=' + d.getTime()) ;
    }
}(window.jQuery, window.app);

+function($, app) { "use strict";
    app = app || {};
    app.openL = function(title,content) {//bootstrap样式弹窗
        $('#alert-modal-title').html(title);
        $('#alert-modal-body').html(content);
        return $('#alert-modal').modal('show');
    }
}(window.jQuery, window.app);

+function($, app) { "use strict";
    app = app || {};
    app.openServiceItems = function(url) {//打开使用和隐私条款
        $("."+url).click(function(){
            window.open(app.base+"/common/"+url, 'regconfirm', 'height=584,width=718,scrollbars=yes,toolbar=no,menubar=no,resizable=false,location=no,status=no');
            return true;
        });
    }
}(window.jQuery, window.app);

+function($,app){"use strict";
    app.initPccSelect = function(settings,id){//省市县 联动
        var d = { proselect:"",cityselect:"",cuntryselect:""} ,
            obj = $('#'+id);
        $.extend(d,settings);
        obj.find(".pro").remoteChained(" ", app.base+"/common/pccSelect?proselect="+d.proselect);
        obj.find(".city").remoteChained("#"+id+" .pro",app.base+"/common/pccSelect?cityselect="+d.cityselect);
        obj.find(".country").remoteChained("#"+id+" .city",app.base+"/common/pccSelect?cuntryselect="+d.cuntryselect);
    }
}(window.jQuery, window.app);
/*
 *
 * 给异步请求加时间戳
 *
 * */
+function($,app) {
    "use strict";
    app.version = '?' + new Date().getTime();
}(window.jQuery, window.app);
