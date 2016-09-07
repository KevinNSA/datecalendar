(function($) {
    $.fn.extend({
        "calendarPrice": function(options) {
            var opts = $.extend({}, defaluts, options); //使用jQuery.extend 覆盖插件默认参数

            var _dom = $(this); //$(opts.el);
            var priceData = opts.priceData;
            var _multiselect = opts.multiselect == true ? true : false;
            var datelist = opts.datelist;
            console.log(datelist);
            //
            var date = new Date();
            var today = date.getDate();
            var year = date.getFullYear();
            var yue = date.getMonth() + 1; //月份

            var start = new Date(year + "-" + yue + "-" + "01").getDay();
            var xsd = function(num) {
                return num.toString().indexOf('.') != -1 ? false : true;
            }
            var no_current_month = false;
            var html = '';
            var run = function(y) {
                if ((y % 4 == 0 && y % 100 != 0) || y % 400 == 0) {
                    return true;
                } else {
                    return false;
                }
            }
            var MAX = function(num) {
                // var num = new Date().getMonth()+1;
                var max = 0;
                if (num == 1 || num == 3 || num == 5 || num == 7 || num == 8 || num == 10 || num == 12) {
                    max = 31;
                } else if (num == 4 || num == 6 || num == 9 || num == 11) {
                    max = 30
                } else {
                    if (run(year)) {
                        max = 29;
                    } else {
                        max = 28;
                    }
                }
                return max;
            }
            var ts = MAX(yue); //天数
            var after = function() { //下个月
                if (yue >= 12) {
                    year++;
                    yue = 1;
                } else {
                    yue++;
                }
                return yue;
            }
            var prevM = function() { //下个月
                if (yue <= 1) {
                    year--;
                    yue = 12;
                } else {
                    yue--;
                }
                return yue;
            }
            var calendar = function() {
                htmlweek = '<div class="weekRow"><div class="fl cHead">日</div>\
                <div class="fl cHead">一</div>\
                <div class="fl cHead">二</div>\
                <div class="fl cHead">三</div>\
                <div class="fl cHead">四</div>\
                <div class="fl cHead">五</div>\
                <div class="fl cHead">六</div></div>';
                $(".autoCalendar .YM.fl", _dom).before('<div class="Rline">' + '</div>' + htmlweek);
            }
            calendar();

            var notData = false;
            if (!priceData[0]) {
                notData = true;
            }
            var latest = function(priceData) {
                if (notData) {
                    return {
                        DYear: year,
                        DMonth: yue
                    };
                }
                var date = priceData[0].Date;
                var DAll = new Date(date);
                var DYear = DAll.getFullYear();
                var DMonth = DAll.getMonth() + 1;
                return {
                    DYear: DYear,
                    DMonth: DMonth
                };
            }
            var lastestDate = latest(priceData);
            year = lastestDate.DYear;
            yue = lastestDate.DMonth;
            if (yue != date.getMonth() + 1) {
                no_current_month = true;
            }

            var list = function(priceData) {
                var ny = yue < 10 ? "0" + yue : yue;
                start = new Date(year + "-" + ny + "-" + "01").getDay();
                html = '';
                var perch = '';
                for (var i = 0; i < start; i++) {
                    perch += '<div class="fl"></div>';
                }

                for (var i = 0; i < ts; i++) {
                    today = no_current_month ? i : today;
                    var priceHtml = '';
                    //如果多选开关打开,则支持多选
                    if (_multiselect)
                        priceHtml = '<div class="fl day"><em>';
                    else
                        priceHtml = '<div class="fl grey"><em>';

                    //遍历priceData数组,如果有该日期,则添加价格标示
                    if (!_multiselect) {
                        for (var j = 0; j < priceData.length; j++) {
                            var date = priceData[j].Date;
                            var dateAll = new Date(date);
                            var dateYear = dateAll.getFullYear();
                            var dateMonth = dateAll.getMonth() + 1;
                            var dateDate = dateAll.getDate();
                            var totalPrice = parseInt(priceData[j].Price); // + parseInt(priceData[j].SingleSupplySellPrice);
                            if (dateYear == year && dateMonth == yue && parseInt(dateDate) == (i + 1)) {
                                priceHtml = '<div class="fl day"><em><span>￥' + totalPrice + '</span>';
                            }
                        }
                    } else {
                        //遍历datalist数组,如果有该日期,则标绿该日期
                        for (var k = 0; k < datelist.length; k++) {
                            var _date = datelist[k];
                            //console.log(_date);
                            var _dateAll = new Date(_date);
                            var _dateYear = _dateAll.getFullYear();
                            var _dateMonth = _dateAll.getMonth() + 1;
                            var _dateDate = _dateAll.getDate();
                            if (_dateYear == year && _dateMonth == yue && parseInt(_dateDate) == (i + 1)) {
                                priceHtml = '<div class="fl day active"><em>';
                            }
                        }
                    }
                    var begin = i < today ? '<div class="fl grey"><em>' : priceHtml;
                    var nd = (i + 1) < 10 ? "0" + (i + 1) : (i + 1);
                    html += begin + (i + 1) + '<i tag="'+year+'-'+ ny +'-' + nd +'" data-year=' + (year) + ' data-month=' + ny + ' data-riqi=' + nd + '></i></em></div>';
                }

                var noweek = ts + start;
                var blank = '<div class="blank"></div>';
                //html = getDatePrice(rile,{:I('get.goods_id')},ts,year,yue);
                if (noweek <= 35 && noweek > 0) {
                    var last5 = 35 - noweek;
                    for (i = 0; i < last5; i++) {
                        html += '<div class="fl"><em><i data-year=' + (yue >= 12 ? year + 1 : year) + ' data-month=' + (yue >= 12 ? 1 : yue + 1) + '></i></em></div>';
                    }
                } else if (noweek <= 42 && noweek > 35) {
                    var last2 = 42 - noweek;
                    for (i = 0; i < last2; i++) {
                        html += '<div class="fl"><em><i data-year=' + (yue >= 12 ? year + 1 : year) + ' data-month=' + (yue >= 12 ? 1 : yue + 1) + '></i></em></div>';
                    }
                }
                $(".NY", _dom).html('');
                $(".calendar_left", _dom).after('<span class="NY">' + year + '年' + yue + '月</span>');
                $(".dates_wrap", _dom).html('').append(perch + html);
                no_current_month = true;
                buildDateInfo(datelist);
                //alert(html);
                //console.log(year,yue)
            }
            list(priceData);

            function pub(priceData) {
                if (year == date.getFullYear() && yue == date.getMonth() + 1) {
                    today = date.getDate();
                    no_current_month = false;
                }
                list(priceData);
                $(".day", _dom).click(days);
            }
            $(".calendar_right", _dom).click(function() {
                //$("#flag").text("");
                //$("#rilegoule").html("");
                ts = MAX(after());
                pub(priceData);
                $(this).addClass("active");
                $(".calendar_left", _dom).addClass("active").removeClass('forbid');
            })
            $(".calendar_left", _dom).click(function() {
                //$("#flag").text("");
                //$("#rilegoule").html("");
                var LDate = null,
                    LMonth = '',
                    LYear = '';
                if (notData) {
                    LDate = new Date();
                } else {
                    LDate = new Date(priceData[0].Date);
                }
                LMonth = LDate.getMonth();
                LYear = LDate.getFullYear();
                if (LMonth + 1 == yue && LYear == year) {
                    return false;
                }
                ts = MAX(prevM());
                pub(priceData);
                $(this).addClass("active");
                if (LMonth + 1 == yue && LYear == year) {
                    $(this).addClass('forbid');
                }
            })
            $(".day", _dom).click(days);

            function days() {

                if (!_multiselect) {
                    $(".day", _dom).removeClass("active");
                    $(this).addClass("active");
                } else {
                    //如果多选模式,则根据class当前状态处理
                    if ($(this).hasClass('active')) {
                        $(this).removeClass("active");
                    } else {
                        $(this).addClass("active");
                    }
                    var selectyear, selectmonth, selectday, selectdate;
                    var $selectitem = $(this).find("i");
                    selectyear = $selectitem.data("year");
                    selectmonth = $selectitem.data("month");
                    selectday = $selectitem.data("riqi");
                    selectdate = selectyear + '-' + selectmonth + '-' + selectday;
                    //更新数组
                    if ($.inArray(selectdate, datelist) >= 0) {
                        datelist.splice($.inArray(selectdate, datelist), 1);
                    } else {
                        datelist.push(selectdate);
                        datelist.sort();
                    }

                    buildDateInfo(datelist);
                    console.log(datelist);
                }



                /*var _yue = $(this).find("i").attr("data-month");
                    _yue = Number(_yue) < 10 ? '0'+_yue : _yue;

                var _ri  = $(this).find("em").text();
                    _ri  = Number(_ri) < 10 ? '0'+_ri : _ri;
                var chinese = "日一二三四五六"
                var pickWeek = new Date($(this).find("i").attr("data-year")+"-"+_yue+'-'+_ri).getDay();
                var pickDay = $(this).find("i").attr("data-year")+"-"+$(this).find("i").attr("data-month")+'-'+$(this).find("em").text();
                $("#travel_date").html('').append("<input name='travel_days' id='travel_days' value='"+pickDay+"' style='display:none'>"+pickDay+"星期"+ chinese.charAt(pickWeek)+'<i>'+'</i>');
                var dates = "<input name='travel_days' id='travel_days' value='"+pickDay+"' style='display:none' />"+pickDay+"星期"+ chinese.charAt(pickWeek)+'<i>'+'</i>';
                document.cookie="date="+encodeURIComponent(dates);

                //console.log(pickDay);
                //console.log(pickWeek);
                $(".auto_wrap").removeClass("show");
                $(".mB").removeClass("mT");
                $(".vs_book").removeClass("fixed");
                $(".book_top").show();
                $(".space").show();*/
            }



            //信息框显示
            function buildDateInfo(datelist) {
                if (opts.dateInfoPanel !== null && opts.dateInfoPanel.length > 0) {
                    var $dateInfoPanel = $(opts.dateInfoPanel);
                    var html = '';
                    for (var i = 0; i < datelist.length; i++) {
                        html += '<li class="list-group-item" >' + datelist[i] + '<span class="dateinfo-del badge badge-drange" data-date="' + datelist[i] + '"><span class="glyphicon glyphicon-remove"></span></span></li>';
                    }
                    $dateInfoPanel.html(html);
                }
            }
            //绑定信息框Click删除日期
            function removeDateItem() {
                var date = $(this).data("date");

                if ($.inArray(date, datelist) >= 0) {
                    if($(_dom).find("i[tag='"+date+"']").length>0){
                      // console.log($(_dom).find("i[tag='"+date+"']").closest(".day").html());
                      $(_dom).find("i[tag='"+date+"']").closest(".day").removeClass("active");
                    }
                    $(this).parent().remove();
                    datelist.splice($.inArray(date, datelist), 1);
                }
                console.log(datelist);
            }



            $("body").on("click", ".dateinfo-del", removeDateItem);
            return{
              data:datelist,
            } ;

        }
    });
    //默认参数
    var defaluts = {
        priceData: [],
        multiselect: false,
        datelist: [],
        dateInfoPanel: null
    };
})(jQuery);
//价格日历控件
// function calendarPrice(el, data, multiselect) {
//
// }
