import GameManager from './GameManager'
const { ccclass, property } = cc._decorator;


@ccclass
export default class DetectCollide extends cc.Component {

    @property(cc.Label)
    combo: cc.Label = null;
    @property(GameManager)
    Knife: GameManager = null;

    public comboTimer: number = 0;
    // newcomboTimer = 7;
    public count: number = 0;
    public combomulti: number = 0



    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        // console.log("self", self.node.name)
        // console.log("other", other.node.name)
        if (other.tag == 0) {
            // this.onComboSucces()
            // this.onComboSucces()
        }
    }
    // setHitCounter(hitcount: number) {
    //     this.hitCounter.string = hitcount.toString();

    // // }
    onComboFail() {
        this.count--;
        this.comboTimer = 5 ;
        // console.log("comboOver")
        this.combo.node.active = false
        this.unschedule(this.onComboFail)

    }
    onComboSucces() {
        this.count++;
        this.comboTimer = 5;
        // console.log("comboHit", this.count);
        if (this.count == 1) {
        } else if (this.count == 2) {
            this.combo.node.active = true;
        }    else if(this.count > 2){
            // this.combomultiply()
            // this.Knife.upscore(2)    
        }
        this.unschedule(this.onComboSucces)
        this.schedule(this.onComboFail, this.comboTimer)
        }
     combomultiply() {
        this.combomulti += 1;
        this.combo.string = 'x:'+this.combomulti.toString();
    }


    onLoad() {
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        this.combo.node.active = false;
        // this.comboTimer = 0
        this.count = 0;
        this.combomulti  = 0;
        // setInterval(()=>{
        //     this.count++;
        //     this.setHitCounter(this.count)
        // },5)
        // manager.enabledDebugDraw = true;
        // manager.enabledDrawBoundingBox = true;
    }


    update(dt: number) {
        // this.comboTimer +=dt;
        // this.comboTimer -= dt;
        // console.log(this.comboTimer)
        // if (this.comboTimer < 1) {
        //     this.comboTimer = this.newcomboTimer;
        //     // this.count++;
        //     // this.setHitCounter(this.count);
        //     console.log("timer", +this.comboTimer)
        // } else {
        //     // console.log("comboover");
        // }

    }
}
