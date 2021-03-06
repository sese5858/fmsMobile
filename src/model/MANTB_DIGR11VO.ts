import { Injectable } from '@angular/core';

@Injectable()
export class MANTB_DIGR11VO {
    public facil_no : string;
    public dign_seq : number;
    public engineer_seq : number;
    public engineer_nm : string;
    public birth_ymd : string;
    public sex : string;
    public rep_yn : string;
    public start_ymd : string;
    public end_ymd : string;
    public parti_days : number;
    public parti_rate : number;
    public tech_grade : string;

    constructor(){
        this.facil_no = "";
        this.dign_seq = 0;
        this.engineer_seq = 0;
        this.engineer_nm = "";
        this.birth_ymd = "";
        this.sex = "";
        this.rep_yn = "";
        this.start_ymd = "";
        this.end_ymd = "";
        this.parti_days = 0;
        this.parti_rate = 0;
        this.tech_grade = "";
    }
}