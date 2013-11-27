Raphael.fn.drawGrid = function (x, y, w, h, wv, hv, color) {
    color = color || "#000";
    var path = ["M", Math.round(x) + .5, Math.round(y) + .5, "L", Math.round(x + w) + .5, Math.round(y) + .5, Math.round(x + w) + .5, Math.round(y + h) + .5, Math.round(x) + .5, Math.round(y + h) + .5, Math.round(x) + .5, Math.round(y) + .5],
        rowHeight = h / hv,
        columnWidth = w / wv;
    for (var i = 1; i < hv; i++) {
        path = path.concat(["M", Math.round(x) + .5, Math.round(y + i * rowHeight) + .5, "H", Math.round(x + w) + .5]);
    }
    for (i = 1; i < wv; i++) {
        path = path.concat(["M", Math.round(x + i * columnWidth) + .5, Math.round(y) + .5, "V", Math.round(y + h) + .5]);
    }
    return this.path(path.join(",")).attr({stroke: color});
};

$(function () {
    $("#data").css({
        position: "absolute",
        left: "0",
        top: "0"
    });
});

window.onload = function () {
    function getAnchors(p1x, p1y, p2x, p2y, p3x, p3y) {
        var l1 = (p2x - p1x) / 2,
            l2 = (p3x - p2x) / 2,
            a = Math.atan((p2x - p1x) / Math.abs(p2y - p1y)),
            b = Math.atan((p3x - p2x) / Math.abs(p2y - p3y));
        a = p1y < p2y ? Math.PI - a : a;
        b = p3y < p2y ? Math.PI - b : b;
        var alpha = Math.PI / 2 - ((a + b) % (Math.PI * 2)) / 2,
            dx1 = l1 * Math.sin(alpha + a),
            dy1 = l1 * Math.cos(alpha + a),
            dx2 = l2 * Math.sin(alpha + b),
            dy2 = l2 * Math.cos(alpha + b);
        return {
            x1: p2x - dx1,
            y1: p2y + dy1,
            x2: p2x + dx2,
            y2: p2y + dy2
        };
    }

    function getAnchors2(p1x, p1y, p2x, p2y, p3x, p3y) {
        var l1 = (p1x - p2x) / 2,
            l2 = (p2x - p3x) / 2,
            a = Math.atan((p1x - p2x) / Math.abs(p1y - p2y)),
            b = Math.atan((p2x - p3x) / Math.abs(p3y - p2y));
            
        a = p2y < p1y ? Math.PI - a : a;
        b = p2y < p3y ? Math.PI - b : b;
        
        var alpha = Math.PI / 2 - ((a + b) % (Math.PI * 2)) / 2,
            dx1 = l1 * Math.sin(alpha + a),
            dy1 = l1 * Math.cos(alpha + a),
            dx2 = l2 * Math.sin(alpha + b),
            dy2 = l2 * Math.cos(alpha + b);
        return {
            x1: p2x + dx1,
            y1: p2y - dy1,
            x2: p2x - dx2,
            y2: p2y - dy2
        };
    }
    // Grab the data
    var labels = [],
        data = [];
        data2 = [];
    $("#data tfoot th").each(function () {
        labels.push($(this).html());
    });
    
    count = 0;
    $("#data tbody td").each(function () {
    if(count<31)
      {data2.push(Math.max(0,$(this).html()-Math.random()*50));count++;}
     else
     {data.push($(this).html());count++};
   
   });
//   alert(data2.length);
    
    // Draw
    var width = 800,
        height = 250,
        leftgutter = 30,
        bottomgutter = 20,
        topgutter = 20,
        colorhue = .6 || Math.random(),
        color = "hsb(" + [colorhue, .5, 1] + ")",
        r = Raphael("holder", width, height),
        txt = {font: '12px Helvetica, Arial', fill: "#fff"},
        txt1 = {font: '10px Helvetica, Arial', fill: "#fff"},
        txt2 = {font: '12px Helvetica, Arial', fill: "#000"},
        X = (width - leftgutter) / labels.length,
        max = Math.max.apply(Math, data),
        Y = (height - bottomgutter - topgutter) / max;
    //r.drawGrid(leftgutter + X * .5 + .5, topgutter + .5, width - leftgutter - X, height - topgutter - bottomgutter, 10, 10, "#333");
    var path = r.path().attr({stroke: color, "stroke-width": 1, "stroke-linejoin": "round"}),
        bgp = r.path().attr({stroke: "none", opacity: .3, fill: color}),
        label = r.set(),
        is_label_visible = false,
        leave_timer,
        blanket = r.set();
    label.push(r.text(60, 12, "24 hits").attr(txt));
    label.push(r.text(60, 27, "22 September 2008").attr(txt1).attr({fill: color}));
    label.hide();
    var frame = r.popup(100, 100, label, "right").attr({fill: "#000", stroke: "#666", "stroke-width": 2, "fill-opacity": .7}).hide();

    var p, bgpp;
    for (var i = 0, ii = labels.length; i < ii; i++) {
        var y = Math.round(height - bottomgutter - Y * data[i]),
            x = Math.round(leftgutter + X * (i + .5)),
            t = r.text(x, height - 6, labels[i]).attr(txt).toBack();
        if (!i) {
            p = ["M", x, y, "C", x, y];
            bgpp = ["M", leftgutter + X * .5, height - bottomgutter, "L", x, y, "C", x, y];
        }
        if (i && i < ii - 1) {
            var Y0 = Math.round(height - bottomgutter - Y * data[i - 1]),
                X0 = Math.round(leftgutter + X * (i - .5)),
                Y2 = Math.round(height - bottomgutter - Y * data[i + 1]),
                X2 = Math.round(leftgutter + X * (i + 1.5));
            var a = getAnchors(X0, Y0, x, y, X2, Y2);
            p = p.concat([a.x1, a.y1, x, y, a.x2, a.y2]);
            bgpp = bgpp.concat([a.x1, a.y1, x, y, a.x2, a.y2]);
        }
        
        var dot = r.circle(x, y, 4).attr({fill: "#000", stroke: color, "stroke-width": 2});
        blanket.push(r.rect(leftgutter + X * i, 0, X, height - bottomgutter).attr({stroke: "none", fill: "#fff", opacity: 0}));
        var rect = blanket[blanket.length - 1];
        
        (function (x, y, data, lbl, dot) {
            var timer, i = 0;
            rect.hover(function () {
                clearTimeout(leave_timer);
                var side = "right";
                if (x + frame.getBBox().width > width) {
                    side = "left";
                }
               var ppp = r.popup(x, y, label, side, 1);
                frame.show().stop().animate({path: ppp.path}, 200 * is_label_visible);
                label[0].attr({text: data + " hit" + (data == 1 ? "" : "s")}).show().stop().animateWith(frame, {translation: [ppp.dx, ppp.dy]}, 200 * is_label_visible);
                label[1].attr({text: lbl + " September 2008"}).show().stop().animateWith(frame, {translation: [ppp.dx, ppp.dy]}, 200 * is_label_visible);
                dot.attr("r", 6);
                is_label_visible = true;
            }, function () {
                dot.attr("r", 4);
                leave_timer = setTimeout(function () {
                    frame.hide();
                    label[0].hide();
                    label[1].hide();
                    is_label_visible = false;
                }, 1);
            });
        })(x, y, data[i], labels[i], dot);
        
    }
    
    
     p = p.concat([x, y, x, y]);
     p = p.concat(["L", x,height - bottomgutter, "C", x, y]);
     
    for (var i = labels.length; i >= 0; i--) {
   // alert(data2[i]);
        var y = Math.round(height - bottomgutter - Y * data2[i]),
            x = Math.round(leftgutter + X * (i + .5)),
            t = r.text(x, height - 6, labels[i]).attr(txt).toBack();
        if ((i==0)) {
            p = p.concat(["C", x, y, "L", x, y]);
            bgpp =  p.concat(["M", leftgutter + X * .5, height - bottomgutter, "L", x, y, "C", x, y]);
        }
        if (i && i < ii - 1) {
            var Y0 = Math.round(height - bottomgutter - Y * data2[i - 1]),
                X0 = Math.round(leftgutter + X * (i - .5)),
                Y2 = Math.round(height - bottomgutter - Y * data2[i + 1]),
                X2 = Math.round(leftgutter + X * (i + 1.5));
            var a = getAnchors2(X2, Y2, x, y, X0, Y0);
            p = p.concat([a.x1, a.y1, x, y, a.x2, a.y2]);
            bgpp = bgpp.concat([a.x1, a.y1, x, y, a.x2, a.y2]);
        }
        
        var dot = r.circle(x, y, 4).attr({fill: "#000", stroke: color, "stroke-width": 2});
        blanket.push(r.rect(leftgutter + X * i, 0, X, height - bottomgutter).attr({stroke: "none", fill: "#fff", opacity: 0}));
        var rect = blanket[blanket.length - 1];
        
        
        (function (x, y, data, lbl, dot) {
            var timer, i = 0;
            rect.hover(function () {
                clearTimeout(leave_timer);
                var side = "right";
                if (x + frame.getBBox().width > width) {
                    side = "left";
                }
               var ppp = r.popup(x, y, label, side, 1);
                frame.show().stop().animate({path: ppp.path}, 200 * is_label_visible);
                label[0].attr({text: data + " hit" + (data == 1 ? "" : "s")}).show().stop().animateWith(frame, {translation: [ppp.dx, ppp.dy]}, 200 * is_label_visible);
                label[1].attr({text: lbl + " September 2008"}).show().stop().animateWith(frame, {translation: [ppp.dx, ppp.dy]}, 200 * is_label_visible);
                dot.attr("r", 6);
                is_label_visible = true;
            }, function () {
                dot.attr("r", 4);
                leave_timer = setTimeout(function () {
                    frame.hide();
                    label[0].hide();
                    label[1].hide();
                    is_label_visible = false;
                }, 1);
            });
        })(x, y, data2[i], labels[i], dot);
        
    }
    
        var y = Math.round(height - bottomgutter - Y * data[0]);
        var x = Math.round(leftgutter + X * (0 + .5));    
    p = p.concat(['L',x, y]);
    
    
    //alert(p);
    bgpp = bgpp.concat([x, y, x, y, "L", x, height - bottomgutter, "z"]);
    path.attr({path: p});
    bgp.attr({opacity:1});
    bgp.attr({path: bgpp});
bgp.click(function (event) {
        this.animate({path:"M,42,212,C,42,212,56.58154127864968,178.90693259497436,67,172,77.41845872135032,165.09306740502564,79.5,168,92,168,104.5,168,106.19916961436985,178.29222241984883,117,172,127.80083038563015,165.70777758015117,133.4183216333031,114.08871808400757,142,105,150.5816783666969,95.91128191599243,157.87272431184198,102.54065796718027,167,94,175.7621846606317,85.80096835150695,179.03606043337788,47.070403288402034,191,48,203.4624370485647,48.968329907914544,210.99663342191394,110.54503064668913,216,122,221.00336657808606,133.45496935331087,228.50577118340374,167.62020231894422,241,168,253.49422881659626,168.37979768105578,255.06696898441479,134.05960665491182,266,128,276.93303101558524,121.94039334508818,279.00302316511863,131.51034853302625,291,128,302.99697683488137,124.48965146697377,305.02744887853777,117.98774764722916,316,112,326.53364907660375,106.25176225866002,331.73815989512775,109.70298788241857,340,101,348.60608344257525,91.93438762248067,352.5800686286496,36.58744744135072,365,38,377.4199313713504,39.41255255864928,377.50034068226495,202.0922872719254,390,202,402.49965931773505,201.9077127280746,402.5282295422324,20.83960803280808,415,20,427.4717704577676,19.16039196719192,436.6882768782747,97.94668137129736,440,110,443.3117231217253,122.05331862870264,452.5179069815616,201.3311548168279,465,202,477.4820930184384,202.66884518317212,477.5053977819771,137.63269166443368,490,138,501.994818129302,138.35261600214366,502.01756477464437,212.64903472184167,514,212,526.4817033597454,211.32392216474827,526.5276954964647,92.83163716312745,539,92,551.4723045035353,91.16836283687255,559.1649335027082,151.47298252075728,564,163,568.8350664972918,174.5270174792427,576.5058103028273,214.38108242030336,589,214,601.4941896971727,213.61891757969664,608.9284481041428,165.42494469866824,614,154,619.0715518958572,142.57505530133176,626.5205797522268,100.28301305488307,639,101,650.9802434378623,101.68830746731226,658.6279093182907,160.8248121684282,663,172,667.5542611267805,183.6408206578873,675.6225995883341,229.7464131954644,688,228,700.3774004116659,226.2535868045356,701.5044257119656,54.90935553696037,713,50,724.4955742880344,45.09064446303963,726.5395268002665,63.0092531582749,738,68,749.4604731997335,72.9907468417251,754.055156416233,64.26846100266731,763,73,771.944843583767,81.73153899733269,788,184,788,184,L,788,230,C,788,184,770.1987562243436,161.2189974470334,763,151,755.8012437756564,140.7810025529666,745.5857603760388,141.93510138435033,738,132,730.4142396239612,122.06489861564967,725.4186584669594,68.57629993291553,713,70,700.5813415330406,71.42370006708447,697.4966148585365,221.87200478416577,688,230,678.5033851414635,238.12799521583423,672.9019264527683,237.6290138631391,663,230,653.4941506053425,222.67614669138646,650.9718876541688,139.8209177766151,639,139,626.5292836935743,138.14487731602594,620.3915724364672,188.25766311320515,614,199,607.6084275635328,209.74233688679485,601.4815689924545,230.678553967343,589,230,576.5184310075455,229.321446032657,569.390825045135,202.27781030753513,564,191,558.609174954865,179.72218969246487,551.482490972639,115.3386233161157,539,116,526.517509027361,116.66137668388428,526.3242504698535,227.91125627318328,514,230,502.16871954894066,232.00519397774406,501.99949296469384,191.11031133334126,490,191,477.50052816177725,190.88509236110286,477.33289545731947,232.03707870216857,465,230,452.66710454268053,227.96292129783143,443.5555072526748,140.98367089735765,440,129,436.4444927473252,117.01632910264235,427.4432305907877,55.810036780196945,415,57,402.5567694092123,58.189963219803055,402.49962991628325,229.90381291169732,390,230,377.50037008371675,230.09618708830268,377.4355507960396,75.2677051704235,365,74,352.5644492039604,72.7322948295765,344.9685033782571,128.5298659911818,340,140,335.23023675687324,151.01132864846548,327.95928526807035,188.01232805197472,316,189,303.5424111790934,190.02882494585967,302.8637825351476,157.93708825894547,291,154,279.1362174648524,150.06291174105453,275.0251077350741,153.35144923294624,266,162,256.9748922649259,170.64855076705376,252.95188434737713,226.3390628867841,241,230,229.04811565262287,233.6609371132159,222.60862255916584,222.61018887063204,216,212,209.39137744083416,201.38981112936796,203.49556005159513,64.33313510319364,191,64,179.00426235046868,63.68019030093411,172.21585648301095,160.19283380581973,167,171,161.56681616353026,182.25746478560444,150.6468061424999,192.97322075521808,142,202,133.3531938575001,211.02677924478192,129.4546164195207,225.06420385387642,117,224,104.5453835804793,222.93579614612358,102.0535992208722,200.42799722038706,92,193,81.9464007791278,185.57200277961294,78.73907495060168,178.70533827826264,67,183,55.26092504939832,187.29466172173736,C,42,230,L,42,230,M,42.41935483870968,230,L,42,230,C,42,230,42,212,42,212,L,42,230,z",fill:"90-#222-#f00"},1000,">");
});
bgp.dblclick(function (event) {
        this.animate({path:bgpp,fill:"green"},1000,">");
});
    
    frame.toFront();
    label[0].toFront();
    label[1].toFront();
    blanket.toFront();
    bgp.toFront();
    
};