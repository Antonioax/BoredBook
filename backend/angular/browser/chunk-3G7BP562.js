import{$a as W,B as m,C as p,N as u,O as _,Ta as V,Va as L,Wa as E,X as S,Ya as N,Z as C,_a as T,aa as y,ea as r,fa as a,fb as B,ga as c,gb as F,ha as b,hb as D,ja as v,ka as l,kb as j,oa as g,pa as d,ta as f,ua as w,va as h,wa as M,y as x}from"./chunk-ZADXD4YZ.js";function q(n,o){if(n&1){let s=b();r(0,"form",2,0),v("ngSubmit",function(){m(s);let e=g(1),i=l();return p(i.onSignup(e))}),r(2,"div",3)(3,"p",4),d(4,"Become a new"),c(5,"br"),r(6,"span",5),d(7,"BoredBook"),a(),c(8,"br"),d(9,"member"),a(),r(10,"input",6),h("ngModelChange",function(e){m(s);let i=l();return w(i.email,e)||(i.email=e),p(e)}),a(),r(11,"input",7),h("ngModelChange",function(e){m(s);let i=l();return w(i.password,e)||(i.password=e),p(e)}),a(),r(12,"button",8),d(13," Register "),a()()()}if(n&2){let s=g(1),t=l();u(10),f("ngModel",t.email),u(),f("ngModel",t.password),u(),C("disabled",s.invalid)}}function A(n,o){n&1&&(r(0,"div",1),c(1,"span",9),a())}var R=(()=>{let o=class o{constructor(t){this.authService=t,this.isLoading=!1,this.email="",this.password=""}ngOnInit(){this.authListenerSub=this.authService.getAuthStatusListener().subscribe(t=>{t||(this.isLoading=!1)})}ngOnDestroy(){this.authListenerSub.unsubscribe()}onSignup(t){t.invalid||(this.isLoading=!0,this.authService.createUser(this.email,this.password))}};o.\u0275fac=function(e){return new(e||o)(_(j))},o.\u0275cmp=x({type:o,selectors:[["ng-component"]],standalone:!0,features:[M],decls:2,vars:1,consts:[["form","ngForm"],[1,"flex","justify-center","items-center","w-screen","h-[60vh]"],[3,"ngSubmit"],[1,"flex","flex-col","justify-center","items-center","gap-3","my-24"],[1,"mb-3","text-xl","text-center"],[1,"font-semibold"],["type","email","name","email","placeholder","Email","required","","email","",1,"w-[80vw]","sm:w-[70vw]","max-w-[300px]","rounded-lg","shadow-md","resize-none","p-3","py-2","text-center",3,"ngModelChange","ngModel"],["type","password","name","password","placeholder","Password","required","","autocomplete","on",1,"w-[80vw]","sm:w-[70vw]","max-w-[300px]","rounded-lg","shadow-md","resize-none","p-3","py-2","text-center",3,"ngModelChange","ngModel"],["type","submit",1,"py-2","px-5","bg-amber-500","rounded-lg","shadow-lg",3,"disabled"],[1,"loader"]],template:function(e,i){e&1&&S(0,q,14,3,"form")(1,A,2,0,"div",1),e&2&&y(i.isLoading?1:0)},dependencies:[D,W,V,L,E,B,F,T,N],encapsulation:2});let n=o;return n})();export{R as SignupComponent};