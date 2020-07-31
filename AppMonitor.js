
const $ = new Env("App版本及价格监控");

if (
  $.getdata("getAppID") != undefined &&
  $.getdata("getAppID") != ""
) {
  var appid = $.getdata("getAppID");
//  ID = appid.split("，");
} else {
  $.msg("App版本及价格监控", "", "请在 BoxJs 检查填写是否正确", "http://boxjs.com");
}

if (
  $.getdata("getRegion") != undefined &&
  $.getdata("getRegion") != ""
) {
  var area = $.getdata("getRegion");
  region = area.split("，");
} else {
  region="us"&&
  $.msg("App版本及价格监控", "", "默认区域为US", "请在http://boxjs.com中修改");
}

/*app版本及价格监控(来自t.me/QuanXApp群友分享)
//30 7-22/1 * * * AppMonitor.js
app可单独设置区域，未单独设置区域，则采用reg默认区域
设置区域方式apps=["1443988620:hk","1443988620/us","1443988620-uk","1443988620_jp","1443988620 au"]
以上方式均可 分隔符支持 空格/:|_-
*/
console.log("APP监控运行");
for (var i in accounts) {
let apps=appid;//app跟踪id
let reg=region[i];//默认区域：美国us 中国cn 香港hk
let notifys=[];
format_apps(apps);
function format_apps(x) {
    let apps_f={};
    x.forEach((n)=>{
        if(/^[a-zA-Z0-9:/|\-_\s]{1,}$/.test(n))
        {
            n=n.replace(/[/|\-_\s]/g,":");
            let n_n=n.split(":");
            if(n_n.length===1){
                if(apps_f.hasOwnProperty(reg)){
                    apps_f[reg].push(n_n);
                }
                else
                {
                    apps_f[reg]=[];
                    apps_f[reg].push(n_n[0])
                }
            }
            else if(n_n.length===2){
                if(apps_f.hasOwnProperty(n_n[1])){
                    apps_f[n_n[1]].push(n_n[0]);
                }
                else
                {
                    apps_f[n_n[1]]=[];
                    apps_f[n_n[1]].push(n_n[0])
                }
            }
            else{
                notifys.push(`ID格式错误:【${n}】`)
            }
        }
        else{
            notifys.push(`ID格式错误:【${n}】`)
        }
    });
    if(Object.keys(apps_f).length>0){
        post_data(apps_f);
    }
}}
async function post_data(d) {
    try{
        let app_monitor=$prefs.valueForKey("app_monitor");
        if(app_monitor===""||app_monitor===undefined){
            app_monitor={}
        }
        else{
            app_monitor=JSON.parse(app_monitor)
        }
        let infos={};
        await Promise.all(Object.keys(d).map(async (k)=>{
            let config={
                url:'https://itunes.apple.com/lookup?id=' + d[k] + "&country=" + k,
                method:"post"
            };
            await $task.fetch(config).then((res)=>{
                let results=JSON.parse(res.body).results;
                if(Array.isArray(results)&&results.length>0){
                    results.forEach((x=>{
                        infos[x.trackId]={
                            n:x.trackName,
                            v:x.version,
                            p:x.formattedPrice
                        };
                        if(app_monitor.hasOwnProperty(x.trackId)){
                            if(JSON.stringify(app_monitor[x.trackId])!==JSON.stringify(infos[x.trackId])){
                                if(x.version!==app_monitor[x.trackId].v){
                                    notifys.push(`${flag(k)}🧩${x.trackName}:升级【${x.version}】`)
                                }
                                if(x.formattedPrice!==app_monitor[x.trackId].p){
                                    notifys.push(`${flag(k)}💰${x.trackName}:价格【${x.formattedPrice}】`)
                                }
                            }}
                        else{
                            notifys.push(`${flag(k)}🧩${x.trackName}:版本【${x.version}】`);
                            notifys.push(`${flag(k)}💰${x.trackName}:价格【${x.formattedPrice}】`)
                        }
                    }));
                }
                return Promise.resolve()
            }).catch((e)=>{
                console.log(e);
            });
        }));
        infos=JSON.stringify(infos);
        $prefs.setValueForKey(infos,"app_monitor");
        if(notifys.length>0){
            notify(notifys)
        }
        else{
            console.log("APP监控：版本及价格无变化")
        }
    }catch (e) {
        console.log(e);
    }
}
function notify(notifys){
    notifys=notifys.join("\n");
    console.log(notifys);
    $notify("APP监控","",notifys)
}
function flag(x){
  var flags = new Map([[ "AC" , "🇦🇨" ] , [ "AF" , "🇦🇫" ] , [ "AI" , "🇦🇮" ] , [ "AL" , "🇦🇱" ] , [ "AM" , "🇦🇲" ] , [ "AQ" , "🇦🇶" ] , [ "AR" , "🇦🇷" ] , [ "AS" , "🇦🇸" ] , [ "AT" , "🇦🇹" ] , [ "AU" , "🇦🇺" ] , [ "AW" , "🇦🇼" ] , [ "AX" , "🇦🇽" ] , [ "AZ" , "🇦🇿" ] , [ "BB" , "🇧🇧" ] , [ "BD" , "🇧🇩" ] , [ "BE" , "🇧🇪" ] , [ "BF" , "🇧🇫" ] , [ "BG" , "🇧🇬" ] , [ "BH" , "🇧🇭" ] , [ "BI" , "🇧🇮" ] , [ "BJ" , "🇧🇯" ] , [ "BM" , "🇧🇲" ] , [ "BN" , "🇧🇳" ] , [ "BO" , "🇧🇴" ] , [ "BR" , "🇧🇷" ] , [ "BS" , "🇧🇸" ] , [ "BT" , "🇧🇹" ] , [ "BV" , "🇧🇻" ] , [ "BW" , "🇧🇼" ] , [ "BY" , "🇧🇾" ] , [ "BZ" , "🇧🇿" ] , [ "CA" , "🇨🇦" ] , [ "CF" , "🇨🇫" ] , [ "CH" , "🇨🇭" ] , [ "CK" , "🇨🇰" ] , [ "CL" , "🇨🇱" ] , [ "CM" , "🇨🇲" ] , [ "CN" , "🇨🇳" ] , [ "CO" , "🇨🇴" ] , [ "CP" , "🇨🇵" ] , [ "CR" , "🇨🇷" ] , [ "CU" , "🇨🇺" ] , [ "CV" , "🇨🇻" ] , [ "CW" , "🇨🇼" ] , [ "CX" , "🇨🇽" ] , [ "CY" , "🇨🇾" ] , [ "CZ" , "🇨🇿" ] , [ "DE" , "🇩🇪" ] , [ "DG" , "🇩🇬" ] , [ "DJ" , "🇩🇯" ] , [ "DK" , "🇩🇰" ] , [ "DM" , "🇩🇲" ] , [ "DO" , "🇩🇴" ] , [ "DZ" , "🇩🇿" ] , [ "EA" , "🇪🇦" ] , [ "EC" , "🇪🇨" ] , [ "EE" , "🇪🇪" ] , [ "EG" , "🇪🇬" ] , [ "EH" , "🇪🇭" ] , [ "ER" , "🇪🇷" ] , [ "ES" , "🇪🇸" ] , [ "ET" , "🇪🇹" ] , [ "EU" , "🇪🇺" ] , [ "FI" , "🇫🇮" ] , [ "FJ" , "🇫🇯" ] , [ "FK" , "🇫🇰" ] , [ "FM" , "🇫🇲" ] , [ "FO" , "🇫🇴" ] , [ "FR" , "🇫🇷" ] , [ "GA" , "🇬🇦" ] , [ "GB" , "🇬🇧" ] , [ "HK" , "🇭🇰" ] , [ "ID" , "🇮🇩" ] , [ "IE" , "🇮🇪" ] , [ "IL" , "🇮🇱" ] , [ "IM" , "🇮🇲" ] , [ "IN" , "🇮🇳" ] , [ "IS" , "🇮🇸" ] , [ "IT" , "🇮🇹" ] , [ "JP" , "🇯🇵" ] , [ "KR" , "🇰🇷" ] , [ "MO" , "🇲🇴" ] , [ "MX" , "🇲🇽" ] , [ "MY" , "🇲🇾" ] , [ "NL" , "🇳🇱" ] , [ "PH" , "🇵🇭" ] , [ "RO" , "🇷🇴" ] , [ "RS" , "🇷🇸" ] , [ "RU" , "🇷🇺" ] , [ "RW" , "🇷🇼" ] , [ "SA" , "🇸🇦" ] , [ "SB" , "🇸🇧" ] , [ "SC" , "🇸🇨" ] , [ "SD" , "🇸🇩" ] , [ "SE" , "🇸🇪" ] , [ "SG" , "🇸🇬" ] , [ "TH" , "🇹🇭" ] , [ "TN" , "🇹🇳" ] , [ "TO" , "🇹🇴" ] , [ "TR" , "🇹🇷" ] , [ "TV" , "🇹🇻" ] , [ "TW" , "🇹🇼" ] , [ "UK" , "🇬🇧" ] , [ "UM" , "🇺🇲" ] , [ "US" , "🇺🇸" ] , [ "UY" , "🇺🇾" ] , [ "UZ" , "🇺🇿" ] , [ "VA" , "🇻🇦" ] , [ "VE" , "🇻🇪" ] , [ "VG" , "🇻🇬" ] , [ "VI" , "🇻🇮" ] , [ "VN" , "🇻🇳" ]])
  return flags.get(x.toUpperCase())
}
$done()

//chavyleung
function Env(s) {
  (this.name = s),
    (this.data = null),
    (this.logs = []),
    (this.isSurge = () => "undefined" != typeof $httpClient),
    (this.isQuanX = () => "undefined" != typeof $task),
    (this.isNode = () => "undefined" != typeof module && !!module.exports),
    (this.log = (...s) => {
      (this.logs = [...this.logs, ...s]),
        s ? console.log(s.join("\n")) : console.log(this.logs.join("\n"));
    }),
    (this.msg = (s = this.name, t = "", i = "") => {
      this.isSurge() && $notification.post(s, t, i),
        this.isQuanX() && $notify(s, t, i);
      const e = [
        "",
        "==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="
      ];
      s && e.push(s), t && e.push(t), i && e.push(i), console.log(e.join("\n"));
    }),
    (this.getdata = s => {
      if (this.isSurge()) return $persistentStore.read(s);
      if (this.isQuanX()) return $prefs.valueForKey(s);
      if (this.isNode()) {
        const t = "box.dat";
        return (
          (this.fs = this.fs ? this.fs : require("fs")),
          this.fs.existsSync(t)
            ? ((this.data = JSON.parse(this.fs.readFileSync(t))), this.data[s])
            : null
        );
      }
    }),
    (this.setdata = (s, t) => {
      if (this.isSurge()) return $persistentStore.write(s, t);
      if (this.isQuanX()) return $prefs.setValueForKey(s, t);
      if (this.isNode()) {
        const i = "box.dat";
        return (
          (this.fs = this.fs ? this.fs : require("fs")),
          !!this.fs.existsSync(i) &&
            ((this.data = JSON.parse(this.fs.readFileSync(i))),
            (this.data[t] = s),
            this.fs.writeFileSync(i, JSON.stringify(this.data)),
            !0)
        );
      }
    }),
    (this.wait = (s, t = s) => i =>
      setTimeout(() => i(), Math.floor(Math.random() * (t - s + 1) + s))),
    (this.get = (s, t) => this.send(s, "GET", t)),
    (this.post = (s, t) => this.send(s, "POST", t)),
    (this.send = (s, t, i) => {
      if (this.isSurge()) {
        const e = "POST" == t ? $httpClient.post : $httpClient.get;
        e(s, (s, t, e) => {
          t && ((t.body = e), (t.statusCode = t.status)), i(s, t, e);
        });
      }
      this.isQuanX() &&
        ((s.method = t),
        $task.fetch(s).then(
          s => {
            (s.status = s.statusCode), i(null, s, s.body);
          },
          s => i(s.error, s, s)
        )),
        this.isNode() &&
          ((this.request = this.request ? this.request : require("request")),
          (s.method = t),
          (s.gzip = !0),
          this.request(s, (s, t, e) => {
            t && (t.status = t.statusCode), i(null, t, e);
          }));
    }),
    (this.done = (s = {}) => (this.isNode() ? null : $done(s)));
}


