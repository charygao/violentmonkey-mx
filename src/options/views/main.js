define('views/Main', function (require, _exports, module) {
  var BaseView = require('cache').BaseView;
  var MainTab = require('views/TabInstalled');
  var SettingsTab = require('views/TabSettings');
  var AboutTab = require('views/TabAbout');

  module.exports = BaseView.extend({
    el: '#app',
    templateUrl: '/options/templates/main.html',
    tabs: {
      '': MainTab,
      settings: SettingsTab,
      about: AboutTab,
    },
    initialize: function (tab) {
      var _this = this;
      _this.tab = _this.tabs[tab] || _this.tabs[''];
      BaseView.prototype.initialize.call(_this);
    },
    _render: function () {
      this.$el.html(this.templateFn({tab: this.tab.prototype.name}));
      this.view = new this.tab;
    },
  });
});
