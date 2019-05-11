var Global = require("Global");

cc.Class({
    extends: cc.Component,

    properties: {
        _playerNode: null
    },

    onLoad () {
        this._playerNode = cc.find("FG/Player");
    },

    start () {

    },

    update (dt) {
        if (this.node.x + 256 < this._playerNode.x) {
            this.node.destroy();
            Global.stars--;
        }
    }

});
