import { Component, ElementRef, Renderer2 } from '@angular/core';
import { NavController, NavParams, ModalController, ToastController } from 'ionic-angular';
import { DIGR01_GROUPVO } from '../../model/DIGR01_GROUPVO';
import { MANTB_DIGR01VO } from '../../model/MANTB_DIGR01VO';
import { MANTB_DIGR13VO } from '../../model/MANTB_DIGR13VO';
import { BASTB_MAST01VO } from '../../model/BASTB_MAST01VO';
import { Digr13SelectModalPage } from '../digr13-select-modal/digr13-select-modal';
import { Digr02ListModalPage } from '../digr02-list-modal/digr02-list-modal';
import { GlobalVars } from '../../services/GlobalVars';
import { UtilService } from '../../services/UtilService';

/**
 * Generated class for the Digr13Write page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-digr13-write',
  templateUrl: 'digr13-write.html',
})
export class Digr13WritePage {
  digr01Group : DIGR01_GROUPVO;
  selectMast01 : BASTB_MAST01VO;
  index : number;
  digr02 : MANTB_DIGR01VO;
  digr13Array : Array<MANTB_DIGR13VO>;
  dign1_checklist : [{}];

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController,public globalVars: GlobalVars
    ,private elementRef : ElementRef, public renderer :Renderer2,public utilService : UtilService,public toastCtrl: ToastController) {
    this.digr01Group = navParams.data.digr01Group;
    this.index = navParams.data.index;
    this.digr02 = this.digr01Group.digr02List[this.index];
    this.selectMast01 = this.digr01Group.selectedMast01List[this.index];
    this.searchList02();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Digr13Write');
  }

  goDigr13SelectModal(digr13: MANTB_DIGR13VO){
    let digr13SelectModal = this.modalCtrl.create(Digr13SelectModalPage, {"digr01Group":this.digr01Group,"digr13":digr13});
    digr13SelectModal.present();
  }

  searchList02(){
    let that = this;
    return new Promise(function (resolve, reject) {
      that.globalVars.db.mantbDigr13.list002({"facil_no":that.digr02.facil_no}, (res) => {
        that.dign1_checklist = res;
        resolve(that.dign1_checklist);
      });
    }).then((res : [{}]) => {
      let facil_no = that.digr02.facil_no;
      let createFlag : boolean = false;
      let tempArray : Array<MANTB_DIGR13VO> = that.digr02.digr13Object;
      if(tempArray.length < 1 ) {
        createFlag = true;
      }

      if(createFlag) {
        let digr13Array = new Array<MANTB_DIGR13VO>();
        res.forEach((dign_check : any ,index) => {
          let digr13 = new MANTB_DIGR13VO();
          digr13.facil_no = facil_no; 
          digr13.check_seq = index; 
          digr13.check_cd = dign_check.check_cd;
          digr13Array.push(digr13);
        });

        that.digr02.digr13Object = digr13Array;
        that.digr13Array = that.digr02.digr13Object;
      } else {
        that.digr13Array = tempArray;
      }
    });
  }

  goDigr02ListModal(){
    let digr02ListModal = this.modalCtrl.create(Digr02ListModalPage, this.digr01Group);
    digr02ListModal.present();

    let that = this;

    digr02ListModal.onWillDismiss((data: { digr01Group : DIGR01_GROUPVO, index:number }) => {
      if(data != null){
        that.index = data.index;
        that.selectMast01 = data.digr01Group.selectedMast01List[that.index];
        that.digr02 = data.digr01Group.digr02List[that.index];
        that.searchList02();
      }
    });
  }

  goSave(){
    this.navCtrl.pop();
  }

  goPrev(){
    let prevIndex = this.index-1;
    let prevSelectMast01 = this.digr01Group.selectedMast01List[prevIndex];
    let prevDigr02 = this.digr01Group.digr02List[prevIndex];

    if(prevSelectMast01 && prevDigr02) {
      this.index = prevIndex;
      this.selectMast01 = prevSelectMast01;
      this.digr02 = prevDigr02;
      this.searchList02();
    } else {
      this.utilService.showToast(this.toastCtrl, "처음 시설물입니다.",null);
    }
  }

  goNext(){
    let nextIndex = this.index+1;
    let nextSelectMast01 = this.digr01Group.selectedMast01List[nextIndex];
    let nextDigr02 = this.digr01Group.digr02List[nextIndex];

    if(nextSelectMast01 && nextDigr02) {
      this.index = nextIndex;
      this.selectMast01 = nextSelectMast01;
      this.digr02 = nextDigr02;
      this.searchList02();
    } else {
      this.utilService.showToast(this.toastCtrl, "마지막 시설물입니다.",null);
    }
  }
}
