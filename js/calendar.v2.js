;(function($) {
    var DateCalendar = function(ele, opt) {
        this.$element = ele;
        this.defaults = {
            dateList: [], //现有日期数据
            showInfoPanel: false, //日期信息显示dom节点
            infoPanelID:'dateinfo',
            isLock: false, //锁定开关,如果为true,则需传入lockdatelist
            lockDateList: [], //锁定日期数据,如果传入日期,则该日期被锁定无法修改
        };
        this.options = $.extend({}, this.defaluts, opt); //使用jQuery.extend 覆盖插件默认参数
        this.today = 0;
        this.year = 0;
        this.month = 0;
        this.start = 0;
        this.no_current_month = false; //是否当前月
        this.ts = 30;
    };

    DateCalendar.prototype = {
        //创建日历的dom
        createCalendar: function() {
            var html =
                '<div id="dateCalendar" class="dateCalendar">' +
                '<div class="Rline">' + '</div>' +
                '<div class="weekRow"><div class="fl cHead">日</div>' +
                '<div class="fl cHead">一</div>' +
                '<div class="fl cHead">二</div>' +
                '<div class="fl cHead">三</div>' +
                '<div class="fl cHead">四</div>' +
                '<div class="fl cHead">五</div>' +
                '<div class="fl cHead">六</div></div>' +
                '  <div class="YM fl"><i class="calendar_left forbid"></i><i class="calendar_right"></i></div>' +
                '  <div class="dates_wrap"></div>' +
                '</div>';
            this.$element.append(html);
            if(this.options.showInfoPanel)
            this.createInfoPanel();
            this.setDefault();
        },
        createInfoPanel:function(){
          this.$element.css({"overflow": "auto","zoom": "1"});
          this.$element.find("#dateCalendar").css({"float":"left","width":"49%","border":"1px solid #e6e6e6"});
          var html=
          '<div class="CalInfoPanel" style="float:left;width:49%;border:1px solid #e6e6e6;padding:0 10px">'+
          '<p class="title">'+'已选日期'+
          '</p>'+
          '<ul id="'+this.options.infoPanelID+'" class="list-group clearfix">'+
          '</ul>';
          this.$element.append(html);
        },
        setDefault: function() {
            var date = new Date();
            this.date = date;
            this.today = date.getDate();
            this.year = date.getFullYear();
            this.month = date.getMonth() + 1; //月份,js的月份需要+1
            this.start = new Date(this.year + "-" + this.month + "-" + "01").getDay();
            this.no_current_month = false; //是否当前月
            this.ts = this.maxday(this.month);

            this.list(this.today, this.month, this.year, this.ts, this.no_current_month);
            this.bindClick();

        },
        //绑定所有内容的点击事件
        bindClick: function() {
            // console.log(this);
            var _this = this;
            var _dom = this.$element;
            //绑定向后一月
            _dom.on("click", ".calendar_right", function() {
                ts = _this.maxday(_this.afterMonth());
                _this.pub(ts);
                $(this).addClass("active");
                $(".calendar_left", _dom).addClass("active").removeClass('forbid');
            });
            //绑定向前一月
            _dom.on("click", ".calendar_left:not('.forbid')", function() {
                var LDate = null,
                    LMonth =0,
                    LYear = 0;
                LDate = new Date();
                LMonth = LDate.getMonth();
                LYear = LDate.getFullYear();
                if (LMonth + 1 == _this.month && LYear == _this.year) {
                    return false;
                }
                ts = _this.maxday(_this.prevMonth());
                _this.pub(ts);
                $(this).addClass("active");
                if (LMonth + 1 == _this.month && LYear == _this.year) {
                    $(this).addClass('forbid');
                }
            });
            //绑定点击日期
            _dom.on("click", ".day", function() {
                _this.days(this);
            });

            $("body").on("click", ".dateinfo-del", function() {
                _this.removeDateItem(this);
            });
        },
        // //查找数字中是否有小数点
        // xsd: function(num) {
        //     return num.toString().indexOf('.') != -1 ? false : true;
        // },
        //判断是否闰年
        run: function(y) {
            if ((y % 4 === 0 && y % 100 !== 0) || y % 400 === 0) {
                return true;
            } else {
                return false;
            }
        },
        //获取当前月份有多少天
        maxday: function(num) {
            // var num = new Date().getMonth()+1;
            var max = 0;
            if (num == 1 || num == 3 || num == 5 || num == 7 || num == 8 || num == 10 || num == 12) {
                max = 31;
            } else if (num == 4 || num == 6 || num == 9 || num == 11) {
                max = 30;
            } else {
                if (this.run(this.year)) {
                    max = 29;
                } else {
                    max = 28;
                }
            }
            return max;
        },
        afterMonth: function() { //下个月
            if (this.month >= 12) {
                this.year++;
                this.month = 1;
            } else {
                this.month++;
            }
            return this.month;
        },
        prevMonth: function() { //上个月
            if (this.month <= 1) {
                this.year--;
                this.month = 12;
            } else {
                this.month--;
            }
            return this.month;
        },
        //渲染日历
        list: function(today, month, year, ts, no_current_month) {
            var ny = month < 10 ? "0" + month : month;
            var datelist = this.options.dateList;
            var lockdatelist = this.options.lockDateList;
            var islock = this.options.isLock;
            var _dom = this.$element;
            start = new Date(year + "-" + ny + "-" + "01").getDay();
            html = '';
            var perch = '';
            for (var i = 0; i < start; i++) {
                perch += '<div class="fl"></div>';
            }
            //ts=MAX(month); //天数
            for (var i = 0; i < ts; i++) {
                today = no_current_month ? i : today;
                var Html = '<div class="fl day"><em>';
                var istodaylock=false;
                //遍历当前datelist,如果存在该日期则标注
                for (var j = 0; j < datelist.length; j++) {
                    var _date = datelist[j];
                    //console.log(_date);
                    var _dateAll = new Date(_date);
                    var _dateYear = _dateAll.getFullYear();
                    var _dateMonth = _dateAll.getMonth() + 1;
                    var _dateDate = _dateAll.getDate();
                    if (_dateYear == year && _dateMonth == month && parseInt(_dateDate) == (i + 1)) {
                        Html = '<div class="fl day active"><em>';
                    }
                }
                //如果有锁定日期,锁定日期去除.day 增加.lock
                if (islock) {
                    for (var j = 0; j < lockdatelist.length; j++) {
                        var _date = lockdatelist[j];
                        //console.log(_date);
                        var _dateAll = new Date(_date);
                        var _dateYear = _dateAll.getFullYear();
                        var _dateMonth = _dateAll.getMonth() + 1;
                        var _dateDate = _dateAll.getDate();
                        if (_dateYear == year && _dateMonth == month && parseInt(_dateDate) == (i + 1)) {
                            Html = '<div class="fl lock"><em>';
                            istodaylock=true;
                        }
                    }
                }

                var begin = '';
                if (islock)
                //当前月的小于当前日期,如果包含锁定天数,则应该标红,暂时还未想出合适办法
                    begin = (i < today && !istodaylock) ? '<div class="fl grey"><em>' : Html;
                else
                    begin = i < today ? '<div class="fl grey"><em>' : Html;
                var nd = (i + 1) < 10 ? "0" + (i + 1) : (i + 1);
                html += begin + (i + 1) + '<i tag="' + year + '-' + ny + '-' + nd + '" data-year=' + (year) + ' data-month=' + ny + ' data-riqi=' + nd + '></i></em></div>';
            }

            var noweek = ts + start;
            var blank = '<div class="blank"></div>';

            if (noweek <= 35 && noweek > 0) {
                var last5 = 35 - noweek;
                for (i = 0; i < last5; i++) {
                    html += '<div class="fl"><em><i data-year=' + (month >= 12 ? year + 1 : year) + ' data-month=' + (month >= 12 ? 1 : month + 1) + '></i></em></div>';
                }
            } else if (noweek <= 42 && noweek > 35) {
                var last2 = 42 - noweek;
                for (i = 0; i < last2; i++) {
                    html += '<div class="fl"><em><i data-year=' + (month >= 12 ? year + 1 : year) + ' data-month=' + (month >= 12 ? 1 : month + 1) + '></i></em></div>';
                }
            }
            $(".NY", _dom).html('');
            $(".calendar_left", _dom).after('<span class="NY">' + year + '年' + month + '月</span>');
            $(".dates_wrap", _dom).html('').append(perch + html);
            no_current_month = true;
            this.buildDateInfo(datelist);
            //alert(html);
            //console.log(year,month)
        },
        relist: function() {
            this.list(this.today, this.month, this.year, this.ts, this.no_current_month);
        },
        //月份变化后重新排版
        pub: function(ts) {
            var date = this.date;

            if (this.year == date.getFullYear() && this.month == date.getMonth() + 1) {
                this.today = date.getDate();
                this.no_current_month = false;
            } else {
                this.no_current_month = true;
            }
            this.list(this.today, this.month, this.year, ts, this.no_current_month);
            //$(".day", _dom).click(days);
        },
        //点击日期事件
        days: function(element) {
            var $this = $(element);
            var datelist = this.options.dateList;
            // console.log($this);
            if ($this.hasClass('active')) {
                $this.removeClass("active");
            } else {
                $this.addClass("active");
            }
            var selectyear, selectmonth, selectday, selectdate;
            var $selectitem = $this.find("i");
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

            this.buildDateInfo(datelist);
            //输出点击日期后的datelist
            //console.log(datelist);
        },
        //绑定日期信息框
        buildDateInfo: function(datelist) {
            var dateInfoPanel = this.options.infoPanelID;
            if (dateInfoPanel !== null && dateInfoPanel.length > 0) {
                var $dateInfoPanel = $("#"+dateInfoPanel);
                var html = '';
                for (var i = 0; i < datelist.length; i++) {
                    html += '<li class="list-group-item" >' + datelist[i] + '<span class="dateinfo-del badge badge-drange" data-date="' + datelist[i] + '"><span class="glyphicon glyphicon-remove"></span></span></li>';
                }
                $dateInfoPanel.html(html);
            }
        },
        //日期信息框移除某日期
        removeDateItem: function(element) {
            var $this = $(element);
            var datelist = this.options.dateList;
            var date = $this.data("date");
            var _dom = this.$element;

            if ($.inArray(date, datelist) >= 0) {
                if ($(_dom).find("i[tag='" + date + "']").length > 0) {
                    // console.log($(_dom).find("i[tag='"+date+"']").closest(".day").html());
                    $(_dom).find("i[tag='" + date + "']").closest(".day").removeClass("active");
                }
                $this.parent().remove();
                datelist.splice($.inArray(date, datelist), 1);
            }
            // console.log(datelist);
        },
        printDateList: function() {
            return {
                dateList: this.options.dateList,
                lockDateList: this.options.lockDateList
            };
        },
        addDay: function(datelist) {
            var olddatelist = this.options.dateList; //原有的或者已经选择的日期
            var newdatelist = datelist; //最新输入的日期;
            var lockdatelist = this.options.isLock ? this.options.lockDateList : [];
            //将2种日期合并到options.datelist;
            var values = $.map(newdatelist, function(value) {
                var result = value;
                if ($.inArray(value, olddatelist) >= 0 || $.inArray(value, lockdatelist) >= 0)
                    return null;
                else
                    return result;
            });
            if (values.length > 0) {
                for (var key in values) {
                    olddatelist.push(values[key]);
                    // console.log(values[key]);
                }
                olddatelist.sort();
                //console.log(olddatelist);
                this.options.dateList = olddatelist;
                this.relist();
            }
        }
    };

    $.fn.DateCalendar = function(options) {
        var datecalender = new DateCalendar(this, options);

        datecalender.createCalendar();

        return datecalender;
    };
})(jQuery);
