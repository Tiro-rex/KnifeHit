import GameOverPopup from "./GameOverPopup";
import { LevelManager } from "./LevelManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameManager extends cc.Component {

    @property(cc.Node)
    private gameManager: cc.Node = null;
    @property(cc.Node)
    private Target: cc.Node = null;
    @property(cc.Node)
    private Knife: cc.Node = null;
    @property(cc.Animation)
    private targetAim: cc.Animation = null;
    @property(cc.Label)
    private labelScore: cc.Label = null;
    @property(GameOverPopup)
    private gameOverPopup: GameOverPopup = null;
    @property(cc.Node)
    private Menu: cc.Node = null;
    @property(cc.AudioClip)
    private knifeStab: cc.AudioClip = null;
    @property(cc.AudioClip)
    private knifeOnknifeHit: cc.AudioClip = null;
    @property(cc.Prefab)
    private knifeprefeb: cc.Prefab = null;
    @property(cc.Label)
    private combo: cc.Label = null;
    @property(cc.Node)
    private knifeStatus: cc.Node = null;
    @property(cc.Label)
    private levelindicator: cc.Label = null;
    @property(cc.Animation)
    private levelanime: cc.Animation = null;
    @property(cc.Node)
    private levelindicatorManager: cc.Node = null;



    private defaultKnife = null;
    private canThrow: boolean;
    private rotatSpeed: number = null;
    private knifeArry: any[] = [];
    private gamescore: number = 0;
    private knives: cc.Node[] = [];
    private currentlevel: number = 0




    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.gamescore = 0;
        this.Menu.active = true;
        this.gameOverPopup.node.active = false;
        this.canThrow = true;
        this.Target.zIndex = 1;
        this.rotatSpeed = 2.5;
        this.currentlevel = 1;
        // this.knifeArry = [];
        this.defaultKnife = this.Knife.position;
        this.Target.active = false;
        this.Knife.active = false;
        this.labelScore.node.active = false;
        this.getAllTheKnivesIndicators();
        this.levelindicator.node.active = false;
        this.levelindicatorManager.active = false;

        // this.comboTime = 0;

        // var manager = cc.director.getCollisionManager();
        // manager.enabled = true;
        // manager.enabledDebugDraw = true;
        // manager.enabledDrawBoundingBox = true;
        setInterval(() => {
            this.changeSpeed();
        }, 2500);

    }

    changeSpeed() {
        let dir = Math.random() > 0.5 ? 1 : -1;
        // console.log(dir);
        let speed = 1 + Math.random() * 2;
        this.rotatSpeed = dir * speed;
        // console.log(this.rotatSpeed)
    }

    start() {
        this.labelScore.string = this.gamescore.toString();
        this.levelindicator.string = "Level:" + this.currentlevel.toString();
    }

    touchplaybtn() {
        this.gameManager.active = true
        this.Menu.active = false
        this.Knife.active = true
        this.Target.active = true
        this.labelScore.node.active = true
        this.levelindicator.node.active = true
        // this.levelanime.play('LevelAnime')
        this.node.on('touchstart', this.knifeThrow, this)

    }

    replaybtn() {
        cc.director.loadScene('Main')
    }

    knifeThrow() {
        this.levelindicator.node.active = false
        // console.log("hello")
        if (this.canThrow) {
            // console.log("hi")
            this.canThrow = false;
            var targetpos = (this.Target.y - this.Target.width / 2)
            // var seq = cc.moveTo(0.5, cc.v2(this.Knife.x, targetpos));
            var seq = cc.sequence(cc.moveTo(0.25, cc.v2(this.Knife.x, targetpos)),
                cc.callFunc(() => {
                    let gap = 15;
                    let isHit = false;
                    for (let knife of this.knifeArry) {
                        var knifeHitCondition = Math.abs(knife.angle) < gap || (360 - knife.angle) < gap
                        if (knifeHitCondition) {
                            isHit = true;
                            break;
                        }
                    }
                    if (isHit) {

                        this.KnifeHit()
                    } else {

                        this.knifeCreate();
                        this.upscore(1);
                        this.targetAim.play('targethHit')
                        this.knifeCheck()

                    }
                })
            );
            this.Knife.runAction(seq);
            cc.audioEngine.playEffect(this.knifeStab, false);

            // this.hitCombo()  
        }
    }
    nextlevelbtn() {
        console.log("next LEVEL")

    }
    levelcheck() {
        this.levelindicatorManager.active = true;
    }


    knifeCheck() {
        let level0 = LevelManager[0]
        let len = this.knifeArry.length
        console.log("length", len);
        //  let   knive1=this.knifeStatus.getChildByName('knife1');
        for (let i = -1; i < level0.kniv; i++) {
            if (len == i) {
                this.knives[i].active = false;
            }
        }
        if (len == level0.kniv - 1) {
            this.targetAim.playAdditive("targetdestroy");
            this.node.off('touchstart', this.knifeThrow, this)
            for (let knifes of this.knifeArry) {
                knifes.active = false
            }
            this.schedule(this.levelcheck, 1)

            // this.gameOver();
        }

    }
    KnifeHit() {
        // console.log("cavas size ", cc.view.getCanvasSize())
        // console.log("port ", cc.view.getVisibleSize())
        // console.log("port 33", cc.view.getViewportRect())
        // return;
        this.Knife.runAction(cc.sequence(
            cc.spawn(
                cc.moveTo(0.5, cc.v2(this.Knife.x, -cc.winSize.height)),
                cc.rotateTo(0.06, 60)
            ),
            cc.callFunc(() => {
                console.log("GameOver");
                this.combo.node.active = false
                this.schedule(this.gameOver, 0.5)
            })
        ))
        cc.audioEngine.playEffect(this.knifeOnknifeHit, false);

    }

    gameOver() {
        this.node.off('touchstart', this.knifeThrow, this)
        this.labelScore.node.active = false;
        this.gameOverPopup.node.active = true
        this.gameOverPopup.onShow({ score: this.gamescore });
        this.Target.active = false
        for (let knifes of this.knifeArry) {
            knifes.active = false
        }
        this.combo.node.active = false

        // this.labelScore.node.setPosition(25,0)
    }
    knifeCreate() {

        let KnifeNode = cc.instantiate(this.knifeprefeb);
        KnifeNode.setPosition(this.Knife.position);
        this.node.addChild(KnifeNode);
        this.knifeArry.push(KnifeNode);

        this.Knife.setPosition(this.defaultKnife)
        this.canThrow = true;
    }

    upscore(score: number) {
        this.gamescore = this.gamescore + score;
        this.labelScore.string = this.gamescore.toString();
    }


    update(dt) {
        this.Target.angle = (this.Target.angle + this.rotatSpeed) % 360;
        // console.log(this.Target.angle)
        for (let knife of this.knifeArry) {
            knife.angle = (knife.angle + this.rotatSpeed) % 360;
            let rad = Math.PI * (knife.angle - 90) / 180;
            let radi = this.Target.width / 2;

            knife.x = this.Target.x + radi * Math.cos(rad);
            knife.y = this.Target.y + radi * Math.sin(rad);
        }
        // this.comboTime += dt;
    }

    getAllTheKnivesIndicators() {
        for (let i = -1; i < this.knifeStatus.childrenCount; i++) {
            let knife = this.knifeStatus.children[i];
            this.knives.push(knife);
        }
    }
    // nextlevel(){
    // }

}
