/*:
 * @plugindesc n週目/難易度設定プラグイン
 * @author volvicgeyser
 *
 * @param ng
 * @type number
 * @desc ng+1週目
 * @default 0

* @param n
 * @type number
 * @desc 元のn%強くします。周回する毎に+n%されます。100より小さな値に設定すると弱体化します。ステータスはデータベースの上限を超えません。
 * @default 150
 *
 *@param change_enemy_name
 * @type boolean
 * @desc 敵の名前の最後尾に(+n)表記を追加します
 * @default true

 *@param disable_defmdf
 * @type boolean
 * @desc 防御関係の上昇を無効にします。防御関係が上昇すると敵が倒しずらくなるための対策です。
 * @default true

 * @help
 * 周回する毎にHP,ATK,DEF,MAG,MDF,EXP,GOLDが強化されます。
 * プラグインコマンドSETNG 値でゲーム中に周回を変更することができます。
 * ng = 0(元のステータス), n = 200の時　HP=100
 * ng = 1(2週目),          n = 200の時　HP=200
 * ng = 2(3週目),          n = 200の時  HP=300
 */
(function() {
    var parameters = PluginManager.parameters('ngplus');
    var ng = Number(parameters['ng'] || 0);
    var n = Number(parameters['n'] || 150);
    var change_enemy_name = Boolean(parameters['change_enemy_name']  === 'true' || false);
    var disable_defmdf = Boolean(parameters['disable_defmdf']  === 'true' || false);

    var original_params = new Array() ;
    function setup(){
        for(var i = 1; i < $dataEnemies.length; i++){
            var original_param = original_params[i] || {};
            if ( !("hp" in original_param) ){
                original_param.name = $dataEnemies[i].name
                original_param.hp = $dataEnemies[i].params[0] ;
                original_param.atk = $dataEnemies[i].params[2] ;
                original_param.def = $dataEnemies[i].params[3] ;
                original_param.mag = $dataEnemies[i].params[4] ;
                original_param.mdf = $dataEnemies[i].params[5] ;
                original_param.exp = $dataEnemies[i].exp ;
                original_param.gold = $dataEnemies[i].gold ;
                original_params[i] = original_param;
            }
            var ng_param = {};
            ng_param.name = original_param.name + ((ng < 1) || !change_enemy_name ? "" : ("(+" + ng + ")")) ;
            ng_param.hp = Math.floor(original_param.hp + original_param.hp * ng * (n-100) / 100);
            ng_param.atk = Math.floor(original_param.atk + original_param.atk * ng * (n-100) /100);
            if (disable_defmdf){
              ng_param.def = original_param.def;
            }else{
              ng_param.def = Math.floor(original_param.def + original_param.def * ng * (n-100)/100);
            }
            ng_param.mag = Math.floor(original_param.mag + original_param.mag * ng * (n-100)/100);
            if (disable_defmdf){
              ng_param.mdf = original_param.mdf;
            }else{
              ng_param.mdf = Math.floor(original_param.mdf + original_param.mdf * ng * (n-100)/100);
            }
            ng_param.exp = Math.floor(original_param.exp + original_param.exp * ng * (n-100)/100);
            ng_param.gold = Math.floor(original_param.gold + original_param.gold * ng * (n-100)/100);
            $dataEnemies[i].name = ng_param.name ;
            $dataEnemies[i].params[0] = ng_param.hp ;
            $dataEnemies[i].params[2] = ng_param.atk ;
            $dataEnemies[i].params[3] = ng_param.def ;
            $dataEnemies[i].params[4] = ng_param.mag ;
            $dataEnemies[i].params[5] = ng_param.mdf ;
            $dataEnemies[i].exp= ng_param.exp ;
            $dataEnemies[i].gold= ng_param.gold ;
        }
    }
    var _start = Scene_Boot.prototype.start ;
    Scene_Boot.prototype.start = function(){
        _start.call(this);
        if(!DataManager.isBattleTest()){
            setup();
       }
    }

    //バトルテストではこちらが呼び出される
    var _setupBattleTest = Game_Party.prototype.setupBattleTest
    Game_Party.prototype.setupBattleTest = function(){
        _setupBattleTest.call(this)
        setup();
    }

    var _pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function (command, args) {
        _pluginCommand.call(this, command, args);
        if ((command || '').toUpperCase() === 'SETNG') {
            ng = Number(args[0]) || 0 ;
            setup();
        }
    };

})();
