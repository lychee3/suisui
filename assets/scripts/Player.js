var Global = require("Global");

cc.Class({
    extends: cc.Component,

    properties: {
        FGNode: {
            default: null,
            type: cc.Node
        },

        Speed: 32,

        // 内部変数
        _fg: null,
        _isJumping: false,
        _prevY: 0

    },

    onLoad () {
        this._fg = this.node.parent.getComponent("FG");
        this.setTouchEvent();
    },

    start () {

    },

    update (dt) {
        var diffY;

        this.node.x += this.Speed;

        // ジャンプの場合
        if (this._isJumping) {
            // Y座標を更新する
            diffY = (this.node.y - this._prevY) - 1;
            this._prevY = this.node.y;
            this.node.y += diffY;

            // ジャンプ上昇中の場合
            if (diffY > 0) {

            }
            
            else if (diffY == 0) {
                // アニメーションを変える
            } 
            
            // ジャンプ下降中の場合
            else {
                // 足場がないかチェックする
                if (this._fg.isBlock(this.node.x, this.node.y)) {
                    this._isJumping = false;

                    // Y座標を補正する
                    this.node.y += Global.MAPCHIP_SIZE - this.node.y % Global.MAPCHIP_SIZE;
                }
            }

        }

        else {
            // 足場がなければ下降する
            if (!this._fg.isBlock(this.node.x, this.node.y - 1)) {
                this._isJumping = true;

                // アニメーションを変える

                this.node.y -= 1;
                this._prevY = this.node.y;

            }
            
        }
    },

    onCollisionEnter (other, self) {
        switch (other.tag) {
            case 1:
                // 星との衝突の場合
                other.node.destroy();
                Global.stars--;
                break;

        }
    },


    setTouchEvent () {
        self = this;
        var canvas = cc.find("Canvas");
        canvas.on(cc.Node.EventType.TOUCH_START, function (event) {
            self.jump();
        });
    },

    jump () {
        if (this._isJumping) return;

        this._isJumping = true;
        this._prevY = this.node.y;
        this.node.y = this._prevY + 22;
    }
});
