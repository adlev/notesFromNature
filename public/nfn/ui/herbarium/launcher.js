// Launcher --------------------------------------

nfn.ui.model.Launcher = Backbone.Model.extend({
  defaults: {
    hidden: true
  }
});

nfn.ui.view.Launcher = nfn.ui.view.Widget.extend({

  events: {

    "click .btn.start": "start",
    "click .skip":      "skip",
    "click .example":   "showExample"

  },

  className: "launcher bar",

  initialize: function() {

    _.bindAll( this, "start", "skip", "toggle", "updateMessage", "toggleButton", "showExample", "closeTooltip", "_showStart", "_hideStart", "_showSkip", "_hideSkip" );

    this.template = new nfn.core.Template({
      template: this.options.template,
      type: 'mustache'
    });

    this.add_related_model(this.model);

    this.model.bind("change:hidden",     this.toggle);
    this.model.bind("change:disabled",   this.toggleButton);
    this.model.bind("change:message",    this.updateMessage);

    this.parent = this.options.parent;

  },

  updateMessage: function() {

    var that = this;

    this.$message.delay(200).fadeOut(this.defaults.speed, function() {
      $(this).html(that.model.get("message"));
      $(this).fadeIn(that.defaults.speed);
    });

  },

  toggleButton: function() {

    if (this.model.get("disabled") == true) {
      this._hideStart(this._showSkip);
    } else {
      this._hideSkip(this._showStart);
    }

  },

  toggle: function() {
    var that = this;

    if (this.model.get("hidden")) {

      this.$el.animate({ bottom: this.bottom() , opacity: 0 }, this.defaults.speed, function() {
        that.setBottom(that.bottom() );
        $(this).hide();
      });

    } else {

      this.$el.css({ opacity: 0 }, 250 );

      this.$el.show();
      this.$el.animate({ bottom: this.bottom() , opacity: 1 }, this.defaults.speed, function() {
      that.setBottom(that.bottom() );
        $(this).show();
      });
    }
  },

  _showStart: function(callback) {

    if (!this.$startButton.hasClass("hidden")) {

      callback && callback();

    } else {

      this.$startButton.fadeIn(this.defaults.speed, function() {
        $(this).removeClass("hidden");
        callback && callback();
      });

    }

  },

  _hideStart: function(callback) {

    if (this.$startButton.hasClass("hidden")) {
      callback && callback();
    } else {
      this.$startButton.fadeOut(this.defaults.speed, function() {
        $(this).addClass("hidden");
        callback && callback();
      });
    }

  },

  _showSkip: function(callback) {

    if (!this.$skipButton.hasClass("hidden")) {
      callback && callback();
    } else {

      this.$skipButton.fadeIn(this.defaults.speed, function() {
        $(this).removeClass("hidden");
        callback && callback();
      });

    }

  },

  _hideSkip: function(callback) {

    if (this.$skipButton.hasClass("hidden")) {
      callback && callback();
    } else {

      this.$skipButton.fadeOut(this.defaults.speed, function() {
        $(this).addClass("hidden");
        callback && callback();
      });
    }

  },

  enable: function() {
    this.model.set({ disabled: false, message: "Specimen label selected" });
  },

  disable: function() {
    this.model.set({ disabled: true, message: "Drag a square around the specimen label" });
  },

  start: function(e) {

    e && e.preventDefault();
    e && e.stopImmediatePropagation();

    if (!this.model.get("disabled")) this.parent.addMagnifier();

  },

  skip: function(e) {

    e && e.preventDefault();
    e && e.stopImmediatePropagation();

    //this.parent.finish();

  },

  showExample: function(e) {

    e && e.preventDefault();
    e && e.stopImmediatePropagation();

    if (!this.tooltip) this.createTooltip(e);

  },

  createTooltip: function(e) {

    var main = "Close";
    var url = this.$el.find(".example").attr("data-src")

    this.tooltip = new nfn.ui.view.Tooltip({

      className: "tooltip with-spinner",

      model: new nfn.ui.model.Tooltip({
        main: main,
        urls: [url],
        template: $("#tooltip-example-template").html()
      })

    });

    this.addView(this.tooltip);

    var that = this;

    this.tooltip.bind("onMainClick", this.closeTooltip);
    this.tooltip.bind("onEscKey", this.closeTooltip);

    this.$el.append(this.tooltip.render());
    this.tooltip.show();

    var
    skipWidth   = $(e.target).width()/2,
    marginRight = parseInt($(e.target).css("margin-left").replace("px", ""), 10),
    x           = Math.abs(this.$el.offset().left - this.$exampleLink.offset().left) - this.tooltip.width() / 2 + skipWidth - marginRight,
    y           = Math.abs(this.$el.offset().top  - this.$exampleLink.offset().top)  - this.tooltip.height() - 40

    this.tooltip.setPosition(x, y);

    GOD.add(this.tooltip, this.closeTooltip);

  },

  closeTooltip: function(callback) {

    this.tooltip.hide();
    this.tooltip.clean();
    delete this.tooltip;

    callback && callback();

  },

  render: function() {

    var $el = this.$el;

    $el.append(this.template.render());

    this.$startButton = $el.find(".btn.start");
    this.$skipButton  = $el.find(".skip");
    this.$message     = $el.find("span");
    this.$exampleLink = $el.find(".example");

    return $el;
  }

});

