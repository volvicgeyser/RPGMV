/*:
 * @plugindesc 敵LV設定プラグイン
 * @author volvicgeyser
 *
 * @param default_lv
 * @type number
 * @desc 敵のレベルが設定されていない時はこの値となります。
 * @default 1
 * @help
 * 敵にレベルを設定します。
 * 敵キャラのメモ欄に<lv:値>を記述します。
 * 例 レベル52に設定する <lv:52>
 * 計算式でb.lvが使用可能となります。
 */
(function() {
    var parameters = PluginManager.parameters('lv');
    var default_lv = Number(parameters['default_lv'] || 0);
    Game_Enemy.prototype.__defineGetter__("lv", function() { return $dataEnemies[this._enemyId].meta.lv || default_lv; });
})();