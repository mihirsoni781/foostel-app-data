/* CSS

<style>
    .dropdowncontainer{
        position: absolute;
        z-index: 1;
    }
    .dropdown{
        cursor: pointer;
        width: 100px;
        background:transparent;
        outline: none;
        border-style: none;
    }
    .dropdownlist{
        background-color: rgb(31, 31, 31);
        color: rgba(255, 255, 255, .5);
        padding: 10px;
        width: fit-content;
        border-radius: 5px;
    }
    .dropdownoption{
        text-align: center;
        cursor: pointer;
        margin-bottom: 5px;
    }
    .dropdownoption:hover, .dropdownoption:focus{
        color: rgba(255, 255, 255, 1);
    }
    .dropdownoption-selected{
        color: white;
    }
    .blocker{
        position: fixed;
        top:0;
        left:0;
        right:0;
        bottom:0;
        background-color: rgba(0,0,0,.1);
    }
</style>

*/




/* Template for DropDownList

<div class="dropdowncontainer">
    <button class="dropdown" (click)="dd1.display=1-dd1.display" >
        click {{dd1.selected}}
    </button>
    <div class="dropdownlist" *ngIf="dd1.display">
        <div [class.dropdownoption-selected]="dd1.isSelected(i)" class="dropdownoption" *ngFor="let i of dd1.options" (click)="dd1.select(i)">
            {{i}}
        </div>
    </div>
</div>
<div *ngIf="dd1.display" class="blocker" (click)="dd1.display=0">

</div>

*/

export class DropDownList {
    constructor(options){
        this.options = options;
    }
    options=[];
    selected=null;
    display=0;
    select(i){
        this.selected=i;
        this.display=0;
    }
    isSelected(i){
        if(i==this.selected)
        {
            return 1;
        }
        return 0;
    }
}



