import { Component, ElementRef, Renderer2 } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { UtilService } from '../../services/UtilService';

import { GlobalVars } from '../../services/GlobalVars';

import { DIGR01_GROUPVO } from '../../model/DIGR01_GROUPVO';
import { BASTB_MAST01VO } from '../../model/BASTB_MAST01VO';
import { MANTB_DIGR01VO } from '../../model/MANTB_DIGR01VO';
/**
 * Generated class for the FacilPartSearchModal page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-facil-part-search-modal',
  templateUrl: 'facil-part-search-modal.html',
})
export class FacilPartSearchModalPage {
  selectOptions : any = {};
  selectIndex : number;
  digr01Group : DIGR01_GROUPVO;
  selectMast01 : BASTB_MAST01VO;
  digr02 : MANTB_DIGR01VO;

  facil_partList : Array<any>;
  facil_gbn : any;
  struct_kind: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,public viewCtrl: ViewController,public globalVars:GlobalVars,
    private elementRef : ElementRef, public utilService : UtilService,public renderer :Renderer2) {
    this.selectOptions["multiple"] = false;

    this.digr01Group = navParams.data.digr01Group;
    this.selectIndex = navParams.data.index;
    this.digr02 = this.digr01Group.digr02List[this.selectIndex];
    let facil_gbn = this.digr01Group.selectedMast01List[this.selectIndex].facil_gbn;

    switch(facil_gbn) {
      case "CS": {
        facil_gbn = "BR";
        break;
      }
      case "EB": {
        facil_gbn = "ED";
        break;
      }
      case "UR": {
        facil_gbn = "TU";
        break;
      }
      default : {
        break;
      }
    }

    let entity_type = "BJ"
    
    if("TU,WS,UC".indexOf(facil_gbn) >= 0) entity_type = "SP";


    let struct_kind = "";
    /**
     * TODO 이 로직 재파악 필요
     * String struct_kind = "";
      if(facil_form_cd.equals("DA")) {
        if(obox.get("dam_form_nm").indexOf("필댐") >= 0) { struct_kind = "P"; }
        else if(obox.get("dam_form_nm").indexOf("콘크리트댐") >= 0) { struct_kind = "C"; }
        else if(obox.get("dam_form_nm").indexOf("복합댐") >= 0) { struct_kind = "M"; }
      }
     */

    this.facil_gbn = facil_gbn;
    this.struct_kind = struct_kind;

    globalVars.db.bastbMeta01.list002({"entity_type":entity_type,"entity_id" :facil_gbn}, (res) => {
      if(struct_kind != "") {
        res.forEach((bastbMeta01,index)=> {
          if(bastbMeta01.struct_kind == "" && bastbMeta01.struct_kind.indexOf(struct_kind) < 0 ) {
            res.pop(bastbMeta01);
          }
        });
      } else {
        res.forEach((bastbMeta01,index)=> {
          if(bastbMeta01.part_nm == "조사망번호") {
            res.pop(bastbMeta01);
          }   
        });
      }
      
      this.facil_partList = [];
      this.makeFacilPartList(res,this.facil_partList);
    });
  }

  makeFacilPartList(facil_partList : Array<any>,returnList :Array<any>) {
    facil_partList.forEach((bastbMeta01,index) => {
      let parentBastbMeta01 = this.findParentFacilPartList(returnList,bastbMeta01);
      bastbMeta01.children = [];
      
      if(bastbMeta01.upper_cd == null) {
        returnList.push(bastbMeta01);
      } else {
        if(!parentBastbMeta01) {
          returnList.forEach((childBastbMeta01, cindex) => {
            if(childBastbMeta01.children){
              this.makeFacilPartList(childBastbMeta01.children,returnList);
            }
          });
        } else {
          bastbMeta01.parentNode = parentBastbMeta01;
          if(parentBastbMeta01.children) {
            parentBastbMeta01.children.push(bastbMeta01);
          } else {
            parentBastbMeta01.children.push(bastbMeta01);
          }
        }
      }
    });
  }

  findParentFacilPartList(facil_partList : Array<any>, srcBastbMeta01) {
    let src_upper_cd = srcBastbMeta01.upper_cd;
    let flag = false;
    let parentBastbMeta01;

    facil_partList.forEach((trgBastbMeta01,index) => {
      if(trgBastbMeta01.part_cd == src_upper_cd) {
        flag = true;
        parentBastbMeta01 = trgBastbMeta01;
      }
    });

    if(flag) {
      return parentBastbMeta01;
    } else {
      return null;
    }
  }

  nodeClick(facil_part : any){

    this.toggleSection(facil_part);
    this.selectedNode(facil_part);
  }

  toggleSection(facil_part : any) {
    if(facil_part.children.length > 0) {
      facil_part.open = !facil_part.open;
    }
  }

  selectedNode(facil_part : any) {
    this.initSelected(this.facil_partList);
    if(facil_part.children.length > 0) {
    } else {
      facil_part.selected = true;
    }
  }

  initSelected(facil_partList : Array<any>) {
    facil_partList.forEach((bastbMeta01,index) => {
      bastbMeta01.selected = false;
      if(bastbMeta01.children.length > 0) {
        this.initSelected(bastbMeta01.children);
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FacilPartSearchModal');
  }

  ionViewDidEnter() {
    this.selectOptions["AllItems"] = this.elementRef.nativeElement.querySelectorAll('.facilPart ion-item');
  }

  goSave(){

  }

  dismiss(){
    this.viewCtrl.dismiss(null);
  }
}
