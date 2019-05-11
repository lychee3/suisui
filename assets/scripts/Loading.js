var Global = require("Global");

cc.Class({
    extends: cc.Component,

    properties: {
        MapNum: -1
    },

    onLoad () {
        this.counter = 0;

    },

    start () {
        var self = this;
        var i;
        var loadMapsNum = 3;

        cc.loader.load(cc.url.raw("resources/maps/mapchip.tsx"), function (err, result) {
            self.counter++;
        });

        // 読み込む全マップのファイル名リストを作成する
        var mapFiles = [];
        for (var i = 0; i < this.MapNum; i++) {
            mapFiles[i] = "maps/map" + ("0"+i).substr(-2);
        }

        // 全マップの読み込みを開始する
        cc.loader.loadResArray(mapFiles, function (err, map) {
            for (var i = 0; i < map.length; i++) {
                Global.maps[i] = map[i];
            }
            self.counter++;
        });
    },

    update (dt) {
        if (this.counter == 2) {
            cc.director.loadScene("Game");
            this.counter = 0;
        }
    },
});
