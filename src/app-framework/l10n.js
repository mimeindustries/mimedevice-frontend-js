/*! @source http://purl.eligrey.com/github/l10n.js/blob/master/l10n.js*/
(function(){"use strict";var q="undefined",a="string",m=self.navigator,o=String,l=Object.prototype.hasOwnProperty,z={},B={},t=!1,k=!0,s=/^\s*application\/(?:vnd\.oftn\.|x-)?l10n\+json\s*(?:$|;)/i,p,A="locale",j="defaultLocale",r="toLocaleString",e="toLowerCase",x=Array.prototype.indexOf||function(E){var C=this.length,D=0;for(;D<C;D++){if(D in this&&this[D]===E){return D}}return -1},b=function(C){var i=new p();i.open("GET",C,t);i.send(null);if(i.status!==200){setTimeout(function(){var D=new Error("Unable to load localization data: "+C);D.name="Localization Error";throw D},0);return{}}else{return JSON.parse(i.responseText)}},n=o[r]=function(D){if(arguments.length>0&&typeof D!=="number"){if(typeof D===a){n(b(D))}else{if(D===t){B={}}else{var i,E,C;for(i in D){if(l.call(D,i)){E=D[i];i=i[e]();if(!(i in B)||E===t){B[i]={}}if(E===t){continue}if(typeof E===a){if(o[A][e]().indexOf(i)===0){E=b(E)}else{if(!(i in z)){z[i]=[]}z[i].push(E);continue}}for(C in E){if(l.call(E,C)){B[i][C]=E[C]}}}}}}}return Function.prototype[r].apply(o,arguments)},h=function(E){var D=z[E],F=0,C=D.length,G;for(;F<C;F++){G={};G[E]=b(D[F]);n(G)}delete z[E]},u,w=o.prototype[r]=function(){var E=u,G=o[E?j:A],H=G[e]().split("-"),F=H.length,D=this.valueOf(),C;u=t;do{C=H.slice(0,F).join("-");if(C in z){h(C)}if(C in B&&D in B[C]){return B[C][D]}}while(F-->1);if(!E&&o[j]){u=k;return w.call(D)}return D};if(typeof XMLHttpRequest===q&&typeof ActiveXObject!==q){var f=ActiveXObject;p=function(){try{return new f("Msxml2.XMLHTTP.6.0")}catch(C){}try{return new f("Msxml2.XMLHTTP.3.0")}catch(i){}try{return new f("Msxml2.XMLHTTP")}catch(D){}throw new Error("XMLHttpRequest not supported by this browser.")}}else{p=XMLHttpRequest}o[j]=o[j]||"";o[A]=m&&(m.language||m.userLanguage)||"";if(typeof document!==q){var y=document.getElementsByTagName("link"),v=y.length,g;while(v--){var d=y[v],c=(d.getAttribute("rel")||"")[e]().split(/\s+/);if(s.test(d.type)){if(x.call(c,"localizations")!==-1){n(d.getAttribute("href"))}else{if(x.call(c,"localization")!==-1){g={};g[(d.getAttribute("hreflang")||"")[e]()]=d.getAttribute("href");n(g)}}}}}}());

var trans = {};

function getQueryParams(qs) {
    qs = qs.split('+').join(' ');
    var params = {},
        tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;
    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }
    return params;
}

var updateL10nStrings = function(){
  [].forEach.call(document.querySelectorAll("[data-l10n]"), function(s) {
    var trans = l(s.getAttribute('data-l10n'));
    if (trans !== s.getAttribute('data-l10n') && s.children.length === 0){
      s.innerHTML = trans;
    }
  });
}

var updateL10nNames = function(){
  [].forEach.call(document.querySelectorAll("[data-l10n]"), function(s) {
    var trans = l(s.getAttribute('data-l10n'));
    if (trans !== s.getAttribute('data-l10n')){
      s.setAttribute('name', trans);
    }
  });
}

var initL10n = function(){
  String.defaultLocale = 'en';
  String.locale = 'en';
  String.toLocaleString(trans);
  var params = getQueryParams(document.location.search);
  if (params.lang) {
    String.locale = params.lang;
  }
}

window.l = function(string){
  var str = string.toLocaleString();
  if(str === string){
    str = string.toLocaleString(['en']);
    console.log("Error translating: " + string);
  }
  return str
};

function addMirobotSnapTrans(lang){
  for(var item in trans[lang]){
    if(trans[lang].hasOwnProperty(item)){
      SnapTranslator.dict[lang][item] = trans[lang][item];
    }
  }
}

function l10nMenu(el_id, languages){
  var el = document.getElementById(el_id)
  if(!el) return;
  if(window.l10n) el.classList.remove('hidden');
  el.innerHTML += '<div class="wrapper"><ul class="subMenu"></ul></div>';
  var menu = el.querySelector('ul.subMenu');

  var langCb = function(lang){
    return function(){
      var loc = document.location;
      var newLoc = loc.pathname + '?lang=' + lang + loc.hash;
      window.location = newLoc;
    }
  }

  languages.map(function(locale){
    if(trans.hasOwnProperty(locale)){
      var li = document.createElement('li');
      li.addEventListener('click', langCb(locale));
      li.innerHTML = '<span class="flag-icon flag-icon-' + trans[locale].flag + '"></span> ' + trans[locale].langName;
      menu.appendChild(li);
    }
  });
  var li = document.createElement('li');
  li.innerHTML = '<a href="mailto:info@mime.co.uk?subject=Mirobot%20Apps%20Translation&body=Hi,%20I\'d%20like%20to%20help%20by%20translating%20Mirobot%20Apps%20into...">Add your language...</a>';
  menu.appendChild(li);
  new MainMenu(el);
}

document.addEventListener('DOMContentLoaded', updateL10nStrings);