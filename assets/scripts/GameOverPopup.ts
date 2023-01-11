import { LevelManager } from "./LevelManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameOverPopup extends cc.Component {

    @property(cc.Label)
    private scoreLabel: cc.Label = null;


    onShow(data) {
        this.scoreLabel.string = "Your Score:" + data.score;
    }



}