var Global = require("Global");

cc.Class({
    extends: cc.Component,

    properties: {
        StarsLabel: {
            default: null,
            type: cc.Label
        }
    },

    start () {

    },

    update (dt) {
        this.StarsLabel.string = 'Stars: ' + Global.stars;
    },
});
