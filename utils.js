window._jsutils = {
    parseHelper: {
        parseJSON: function (json) {
            if (!!json) {
                return eval('(' + json + ')');
            }
            return null;
        }
    },
    stringHelper: {
        // 去掉首尾空格
        trim: function (s) {
            if (s == null) {
                return '';
            }
            if (typeof (s) == 'string') {
                return (s || '').trim();
            }
            return s.toString();
        },
        isNullOrEmpty: function (s) {
            return s == null || s == '';
        },
        isNullOrWhiteSpace: function (s) {
            return this.trim(s) == '';
        }
    },
    regexHelper: {
        // 检测是否日期格式（yyyy-MM-dd）
        checkIsDate: function (s) {
            return /((^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(10|12|0?[13578])([-\/\._])(3[01]|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(11|0?[469])([-\/\._])(30|[12][0-9]|0?[1-9])$)|(^((1[8-9]\d{2})|([2-9]\d{3}))([-\/\._])(0?2)([-\/\._])(2[0-8]|1[0-9]|0?[1-9])$)|(^([2468][048]00)([-\/\._])(0?2)([-\/\._])(29)$)|(^([3579][26]00)([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][0][48])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][0][48])([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][2468][048])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][2468][048])([-\/\._])(0?2)([-\/\._])(29)$)|(^([1][89][13579][26])([-\/\._])(0?2)([-\/\._])(29)$)|(^([2-9][0-9][13579][26])([-\/\._])(0?2)([-\/\._])(29)$))/ig.test(s);
        },
        // 检测是否是GUID
        checkIsGuid: function (s) {
            return /^([0-9a-zA-Z]{8}-[0-9a-zA-Z]{4}-[0-9a-zA-Z]{4}-[0-9a-zA-Z]{4}-[0-9a-zA-Z]{12}|[0-9a-zA-Z]{32})$/.test(s);
        },
        // 检测是否是邮箱
        checkIsEmail: function (s) {
            return /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(s);
        },
        // 检测是否是网址
        checkIsUrl: function (s) {
            return /http(s)?:\/\/([\w-])+(\/[\w- ./?%&=]*)?/.test(s);
        },
        // 检测是否是数字
        checkIsNumeric: function (s) {
            return /\d+/.test(s);
        },
        // 检测是否是手机号码
        checkIsMobile: function (s) {
            return /^\d{8,}$/.test(s);
        },
        // 检测身份证是否正确，true-正确，false-错误
        checkIsIdCard: function (idCard) {
            var Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1];    // 加权因子   
            var ValideCode = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2];            // 身份证验证位值.10代表X   
            /**  
             * 判断身份证号码为18位时最后的验证位是否正确  
             * @param a_idCard 身份证号码数组  
             * @return  
             */
            function isTrueValidateCodeBy18IdCard(a_idCard) {
                var sum = 0;                             // 声明加权求和变量   
                if (a_idCard[17].toLowerCase() == 'x') {
                    a_idCard[17] = 10;                    // 将最后位为x的验证码替换为10方便后续操作   
                }
                for (var i = 0; i < 17; i++) {
                    sum += Wi[i] * a_idCard[i];            // 加权求和   
                }
                valCodePosition = sum % 11;                // 得到验证码所位置   
                if (a_idCard[17] == ValideCode[valCodePosition]) {
                    return true;
                } else {
                    return false;
                }
            }
            /**  
              * 验证18位数身份证号码中的生日是否是有效生日  
              * @param idCard 18位书身份证字符串  
              * @return  
              */
            function isValidityBrithBy18IdCard(idCard18) {
                var year = idCard18.substring(6, 10);
                var month = idCard18.substring(10, 12);
                var day = idCard18.substring(12, 14);
                var temp_date = new Date(year, parseFloat(month) - 1, parseFloat(day));
                // 这里用getFullYear()获取年份，避免千年虫问题   
                if (temp_date.getFullYear() != parseFloat(year)
                      || temp_date.getMonth() != parseFloat(month) - 1
                      || temp_date.getDate() != parseFloat(day)) {
                    return false;
                } else {
                    return true;
                }
            }
            if (idCard.length == 18) {
                var a_idCard = idCard.split("");                // 得到身份证数组   
                if (isValidityBrithBy18IdCard(idCard) && isTrueValidateCodeBy18IdCard(a_idCard)) {   //进行18位身份证的基本验证和第18位的验证
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }
    },
    dateTimeHelper: {
        // 从字符串转换成DateTime类型
        parse: function (s) {
            if ((s || '') == '')
                return null;
            if (typeof (s) == "object")
                return s;
            if (typeof (s) == 'string') {
                if (/\/Date\(.*\)\//gi.test(s)) {
                    return eval(s.replace(/\/Date\((.*?)\)\//gi, "new Date($1)"));
                }
                else if (/(\d{8})/.test(s)) {
                    return eval(s.replace(/(\d{4})(\d{2})(\d{2})/, "new Date($1,parseInt($2)-1,$3)"));
                }
                else if (/(\d{4})\W(\d{2})\W(\d{2})T(\d{2})\W(\d{2})\W(\d{2})/.test(s)) {
                    return eval(s.replace(/(\d{4})\W(\d{2})\W(\d{2})T(\d{2})\W(\d{2})\W(\d{2})[\w\W]*/, "new Date($1,parseInt($2)-1,$3,$4,$5,$6)"));
                }
                try {
                    return new Date(s);
                } catch (e) {
                    return null;
                }
            }
            return null;
        },
        // 格式化日期
        format: function (d, mask) {
            if ((d || '') == '')
                return '';
            d = this.parse(d);
            var zeroize = function (value, length) {
                if (!length) length = 2;
                value = String(value);
                for (var i = 0, zeros = ''; i < (length - value.length) ; i++) {
                    zeros += '0';
                }
                return zeros + value;
            };
            return mask.replace(/"[^"]*"|'[^']*'|(?:d{1,4}|m{1,4}|yy(?:yy)?|([hHMstT])\1?|[lLZ])/gi, function ($0) {
                switch ($0) {
                    case 'd': return d.getDate();
                    case 'dd': return zeroize(d.getDate());
                    case 'ddd': return ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][d.getDay()];
                    case 'dddd': return ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][d.getDay()];
                    case 'M': return d.getMonth() + 1;
                    case 'MM': return zeroize(d.getMonth() + 1);
                    case 'MMM':
                        return ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'][d.getMonth()];
                    case 'MMMM':
                        return ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'][d.getMonth()];
                    case 'yy': return String(d.getFullYear()).substr(2);
                    case 'yyyy': return d.getFullYear();
                    case 'h': return d.getHours() % 12;
                    case 'hh': return d.getHours();//zeroize(d.getHours() % 12 || 12);
                    case 'H': return d.getHours();
                    case 'HH': return zeroize(d.getHours());
                    case 'm': return d.getMinutes();
                    case 'mm': return zeroize(d.getMinutes());
                    case 's': return d.getSeconds();
                    case 'ss': return zeroize(d.getSeconds());
                    case 'l': return zeroize(d.getMilliseconds(), 3);
                    case 'L': var m = d.getMilliseconds();
                        if (m > 99) m = Math.round(m / 10);
                        return zeroize(m);
                    case 'tt':
                    case 'TT':
                        var h = d.getHours();
                        //var timeRanges = [
                        //    { name: '清晨', start: 0, end: 8 },
                        //    { name: '上午', start: 8, end: 11 },
                        //    { name: '中午', start: 11, end: 14 },
                        //    { name: '下午', start: 14, end: 17 },
                        //    { name: '黄昏', start: 17, end: 21 },
                        //    { name: '夜晚', start: 21, end: 24 }
                        //];
                        //for (var i = 0; i < timeRanges.length; i++) {
                        //    var tr = timeRanges[i];
                        //    if (h >= tr.start && h < tr.end)
                        //        return tr.name;
                        //}
                        if (h < 12) {
                            return '上午';
                        }
                        else {
                            return '下午';
                        }
                    case 'Z': return d.toUTCString().match(/[A-Z]+$/);
                        // Return quoted strings with the surrounding quotes removed     
                    default: return $0.substr(1, $0.length - 2);
                }
            });
        }
    },
    numericHelper: {
        formatFileSize: function (fileSize) {
            if (fileSize == null)
                return '';
            if (fileSize >= 1024 * 1024 * 1024) {
                return parseFloat((fileSize / (1024 * 1024 * 1024)).toFixed(2)) + ' GB';
            }
            else if (fileSize >= 1024 * 1024) {
                return parseFloat((fileSize / (1024 * 1024)).toFixed(2)) + ' MB';
            }
            else if (fileSize >= 1024) {
                return parseFloat((fileSize / (1024)).toFixed(2)) + ' KB';
            }
            else {
                return fileSize + ' 字节';
            }
        }
    }
};
// '{0}{1}'.format(1,2): Result: '12'
String.prototype.format = function (args) {
    var result = this;
    if (arguments.length > 0) {
        if (arguments.length == 1 && typeof (args) == "object") {
            for (var key in args) {
                if (args[key] != undefined) {
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
        }
        else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    var reg = new RegExp("({)" + i + "(})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }
    return result;
};
/* 得到日期年月日等加数字后的日期 */
Date.prototype.dateAdd = function (interval, number) {
    var d = new Date(this);
    var k = { 'y': 'FullYear', 'q': 'Month', 'm': 'Month', 'w': 'Date', 'd': 'Date', 'h': 'Hours', 'n': 'Minutes', 's': 'Seconds', 'ms': 'MilliSeconds' };
    var n = { 'q': 3, 'w': 7 };
    eval('d.set' + k[interval] + '(d.get' + k[interval] + '()+' + ((n[interval] || 1) * number) + ')');
    return d;
}
/* 计算两日期相差的日期年月日等 */
Date.prototype.dateDiff = function (interval, objDate2) {
    var d = this, i = {}, t = d.getTime(), t2 = objDate2.getTime();
    i['y'] = objDate2.getFullYear() - d.getFullYear();
    i['q'] = i['y'] * 4 + Math.floor(objDate2.getMonth() / 4) - Math.floor(d.getMonth() / 4);
    i['m'] = i['y'] * 12 + objDate2.getMonth() - d.getMonth();
    i['ms'] = objDate2.getTime() - d.getTime();
    i['w'] = Math.floor((t2 + 345600000) / (604800000)) - Math.floor((t + 345600000) / (604800000));
    i['d'] = Math.floor(t2 / 86400000) - Math.floor(t / 86400000);
    i['h'] = Math.floor(t2 / 3600000) - Math.floor(t / 3600000);
    i['n'] = Math.floor(t2 / 60000) - Math.floor(t / 60000);
    i['s'] = Math.floor(t2 / 1000) - Math.floor(t / 1000);
    return i[interval];
}
//+---------------------------------------------------    
//| 取得当前日期所在月的最大天数    
//+---------------------------------------------------    
Date.prototype.maxDayOfDate = function () {
    var nextMonth = this.addMonth(1);
    var nextMonthFirstDay = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 1);
    var thisMonthLastDay = nextMonthFirstDay.addDay(-1);
    return thisMonthLastDay.getDate();
    //this.addMonth(1).dateDiff('d',this)
    //var myDate = this;
    //var ary = myDate.toArray();
    //var date1 = (new Date(ary[0], ary[1] + 1, 1));
    //var date2 = date1.dateAdd(1, 'm', 1);
    //var result = dateDiff(date1.Format('yyyy-MM-dd'), date2.Format('yyyy-MM-dd'));
    //return result;
}
//在当前时间上添加年数  
Date.prototype.addYear = function (years) {
    return this.dateAdd('y', years);
};
//在当前时间上添加天数  
Date.prototype.addDay = function (days) {
    return this.dateAdd('d', days);
};
//在当前时间上添加月数  
Date.prototype.addMonth = function (months) {
    return this.dateAdd('m', months);
};
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement /*, from*/) {
        var len = this.length >>> 0;
        var from = Number(arguments[1]) || 0;
        from = (from < 0)
             ? Math.ceil(from)
             : Math.floor(from);
        if (from < 0)
            from += len;
        for (; from < len; from++) {
            if (from in this &&
                this[from] === searchElement)
                return from;
        }
        return -1;
    };
}
Array.prototype.contains = function (searchElement) {
    if (typeof (searchElement) == 'function') {
        for (var i = 0; i < this.length; i++) {
            if (searchElement.call(this[i]) == true) {
                return true;
            }
        }
        return false;
    }
    else {
        return this.indexOf(searchElement) >= 0;
    }
};
if (!Array.prototype.map) {
    Array.prototype.map = function (callbackfn, thisArg) {
        var array = [];
        for (var i = 0; i < this.length; i++) {
            array.push(callbackfn.call(thisArg, this[i]));
        }
        return array;
    };
}
String.prototype.startsWith = function (value, ignoreCase) {
    var self = this;
    if (ignoreCase) {
        self = self.toLowerCase();
        value = value.toLowerCase();
    }
    return self.indexOf(value) == 0;
};
String.prototype.endsWith = function (value, ignoreCase) {
    var self = this;
    if (ignoreCase) {
        self = self.toLowerCase();
        value = value.toLowerCase();
    }
    var searchIndex = self.lastIndexOf(value);
    if (searchIndex >= 0) {
        return self.length == searchIndex + value.length;
    }
    return false;
};