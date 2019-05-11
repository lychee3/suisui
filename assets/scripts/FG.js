var Global = require("Global");

cc.Class({
    extends: cc.Component,

    properties: {
        StarPrefab: {
            default: null,
            type: cc.Prefab
        },

        MapNode: {
            default: null,
            type: cc.Node
        },

        PlayerNode: {
            default: null,
            type: cc.Node
        },

        ObjectNode: {
            default: null,
            type: cc.Node
        },

        // 内部変数
        _childMapNodes: [],
        _lastIndex: 0
    },
    
    start () {
        cc.director.getCollisionManager().enabled = true;
        this.addMap(0, 2);
        this.addMap(1, 2);
    },

    // 新しいマップを作成する
    addMap (index, number) {
        var node = new cc.Node();
        node.anchorX = 0;
        node.anchorY = 0;
        node.x = index * 1920;
        node.y = 0;
        var component = node.addComponent(cc.TiledMap);
        component.tmxAsset = Global.maps[number];
        this.MapNode.addChild(node);

        // TiledMapのオブジェクトノードを非表示にする（addChildしないと非表示できないため）
        component.getObjectGroup("object").enabled = false;
        this.spawnObjects(index, node);
        this._childMapNodes[index] = node;
    },

    // 古いマップを削除する
    removeMap (index) {
        this.MapNode.removeChild(this._childMapNodes[index]);
        this._childMapNodes[index] = null;
    },

    // 表示位置を更新する
    update () {
        var x = 0 - this.PlayerNode.x + 150;
        var y = 0;
        var index = Math.floor(this.PlayerNode.x / 1920);

        this.node.x = x;
        this.node.y = 0;

        if (index != this._lastIndex) {
            this.addMap(index+1, 2);
            if (index >=2 ) this.removeMap(index-2);
        }

        this._lastIndex = index;
    },

    //
    // 
    //
    spawnObjects (index, mapNode) {

        // オブジェクト名とプレハブ名の対応表を作成する
        var nameMap = { star : this.StarPrefab };

        // オブジェクト群を取得する
        var objects = mapNode.getComponent(cc.TiledMap).getObjectGroup("object").getObjects();

        // オブジェクトを生成して配置する
        for (var o of objects) {

            for (var y = 1; y <= o.height / 64; y++) {
                for (var x = 0; x < o.width / 64; x++) {
                    var p = cc.instantiate(nameMap[o.name]);
                    p.x = Global.MAPNODE_WIDTH * index + o.x + x * p.width;
                    p.y = Global.MAPNODE_HEIGHT - o.y - y * p.height;

                    // オブジェクトノードに配置する
                    this.ObjectNode.addChild(p);

                    // デバッグ用
                    Global.stars++;
                }
            }

        }
    },

    isBlock (x, y) {
        var properties = this.getProperties(x, y);

        if (properties == null) return false;

        // プロパティからcategoryを取得する
        var category = properties["category"];

        // "category"が1なら衝突ありと判断する
        if (category == 1) return true;
        return false;
    },

    getProperties (x, y) {
        // X座標に対応する子マップノード番号を取得する
        var num = Math.floor(x / Global.MAPNODE_WIDTH);

        // 座標に対応するマップ座標を取得する
        var mx = Math.floor((x % Global.MAPNODE_WIDTH) / Global.MAPCHIP_SIZE);
        var my = Global.MAP_HEIGHT - Math.floor(y / Global.MAPCHIP_SIZE) - 1;

        // マップ座標のプロパティを取得する
        var map = this._childMapNodes[num].getComponent(cc.TiledMap);
        var layer = map.getLayer("map");
        var gid = layer.getTileGIDAt(cc.p(mx, my));
        var properties = this._childMapNodes[num].getComponent(cc.TiledMap).getPropertiesForGID(gid);

        // プロパティ無しならプロパティ無しで返却する
        if (properties == null || typeof properties == "number") return null;
        
        return properties;
    }


});
