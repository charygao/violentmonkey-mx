define('views/Menu', function (require, _exports, module) {
  var MenuBaseView = require('views/Base');
  var app = require('app');

  module.exports = MenuBaseView.extend({
    initialize: function () {
      MenuBaseView.prototype.initialize.call(this);
      this.listenTo(app.scriptsMenu, 'add', this.onMenuAdd);
      this.listenTo(app.menuOptions, 'change', this.checkMenu);
    },
    _render: function () {
      var _this = this;
      _this.$el.html(_this.templateFn());
      var top = _this.$el.children().first();
      _this.addMenuItem({
        name: _.i18n('menuManageScripts'),
        symbol: 'right-hand',
        onClick: function (_e) {
          function startsWith(str1, str2) {
            return str1.slice(0, str2.length) === str2;
          }
          var url = _.mx.rt.getPrivateUrl() + 'options/index.html';
          var confirm = url + '#confirm';
          for (var i = _.mx.br.tabs.length - 1; i --;) {
            var tab = _.mx.br.tabs.getTab(i);
            if (tab && startsWith(tab.url, url) && !startsWith(tab.url, confirm)) {
              tab.activate();
              return;
            }
          }
          _.tabs.create(url);
        },
      }, top);
      _this.menuEnable = _this.addMenuItem({
        name: _.i18n('menuScriptEnabled'),
        data: _.options.get('isApplied'),
        symbol: function (data) {
          return data ? 'check' : 'remove';
        },
        onClick: function (_e, model) {
          var isApplied = !model.get('data');
          _.options.set('isApplied', isApplied);
          model.set({data: isApplied});
          _.mx.rt.icon.setIconImage('icon' + (isApplied ? '' : 'w'));
          _.options.get('autoReload') && _.mx.br.tabs.getCurrentTab().refresh();
        },
      }, top);
      app.scriptsMenu.each(_this.onMenuAdd.bind(_this));
      _this.checkMenu();
    },
    onMenuAdd: function (model) {
      var _this = this;
      var bot = _this.$el.children().last();
      _this.addMenuItem(model, bot);
    },
    checkMenu: function () {
      var _this = this;
      var top = _this.$el.children().first();
      if (app.menuOptions.get('hasCommands')) {
        if (!_this.menuCommands) {
          _this.menuCommands = _this.addMenuItem({
            name: _.i18n('menuCommands'),
            symbol: 'arrow-right',
            onClick: function (_e) {
              app.navigate('commands', {trigger: true});
            },
          }, top, _this.menuEnable.$el);
        }
      } else if (_this.menuCommands) {
        _this.menuCommands.remove();
        _this.menuCommands = null;
      }
      if (app.menuOptions.get('canSearch')) {
        if (!_this.menuSearch) {
          _this.menuSearch = _this.addMenuItem({
            name: _.i18n('menuFindScripts'),
            symbol: 'right-hand',
            onClick: function (_e) {
              var matches = app.currentTab.url.match(/:\/\/(?:www\.)?([^\/]*)/);
              _.tabs.create('https://greasyfork.org/scripts/search?q=' + matches[1]);
            },
          }, top, _this.menuCommands ? _this.menuCommands.$el : _this.menuEnable.$el);
        }
      } else if (_this.menuSearch) {
        _this.menuSearch.remove();
        _this.menuSearch = null;
      }
    },
  });
});
