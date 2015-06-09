/*
微信企业号标签管理
*/

var express = require('express'),
    router = express.Router();

var wxent = require('wechat-enterprise');



/*
 微信事件消息处理程序。
    - 返回 function(msg, req, res, next)
        - 接收到正确消息时，返回消息处理结果；
        - 接收到不能处理的消息时，返回“正在建设中”提示
        - 出错时返回错误提示
    - 参数 eventHandlers
    {
        key: function (msg, req, res, next) {
            // 消息处理代码
        }
    }

*/
var handleEvent = function (eventHandlers) {
    return function (msg, req, res, next) {
        try {
            if (eventHandlers[msg.EventKey]) {
                eventHandlers[msg.EventKey](msg, req, res, next);
            } else {
                res.reply('正在建设中：' + msg.EventKey);
            }
        } catch(err){
            res.reply('出现错误，请截图并与管理员联系。\n错误信息：' + err.toString());
        }
    }
};

var handleText = function (textHandlers, sessionName) {
    return function (msg, req, res, next) {
        try {
            if (req.wxsession[sessionName]) {
                textHandlers[req.wxsession[sessionName]](msg, req, res, next);
            } else {
                res.reply('正在建设中~');
            }
        } catch(err){
            res.reply('出现错误，请截图并与管理员联系。\n错误信息：' + err.toString());
        }
    };
};


var wxapi;
var TagsEventHandlers = {
	'list_all_tags': function (msg, req, res, next) {
		wxapi.listTags(function (err, result) {
			var tags = [];
			if(err) res.reply(err);
			else{
				tags = result.taglist;
				var resultList = [];
				resultList.push(['请回复序号以选择需要操作的标签：', function(){}]);
				tags.forEach(function (tag, i) {
					resultList.push(['\n{' + (i + 1) + '}. ' + tag.tagname, function (msg, req, res) {
						res.reply('选中的是：' + tag.tagid);
					}]);
				});
				wxent.List.add('selectTag', resultList);
				res.wait('selectTag');
			}
		});
	}
};

var TextProcessHandlers = {
};


var selectedTags = function (req, res, next) {
	if(req.query.tags){
		req.selectedTags = req.query.tags.split(',');
	}
	next();
};

module.exports = function (app, cfg, db) {
    app.use(express.query());
    app.use('/', router);

    var atProvider = require('access-token-mongo')(db);
    wxapi = require('wx-ent-api')(atProvider, wxcfg);

    router.use('/tags', selectedTags, wxent(cfg.wxqyh, wxent.event(handleEvent(TagsEventHandlers)).text(handleText(TextProcessHandlers, 'text_process'))))
};