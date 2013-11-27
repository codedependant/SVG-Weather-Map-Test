

    function getAnchors(p1x, p1y, p2x, p2y, p3x, p3y,position) {
        var l1 = (p2x - p1x) / 2,
            l2 = (p3x - p2x) / 2;
            
            
            if(position=="top")
            {
            var a = Math.atan((p2x - p1x) / Math.abs(p2y - p1y)),
            b = Math.atan((p3x - p2x) / Math.abs(p2y - p3y));
            }
            else if(position=="bottom")
            {
              var a = Math.atan((p1x - p2x) / Math.abs(p1y - p2y)),
              b = Math.atan((p2x - p3x) / Math.abs(p3y - p2y));            
            }
            
            
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

    function buildFlow(data,data2)
    {
    // Draw
    
    var labels_length = 31;
    
    var width = 1200,
        height = 500,
        leftgutter = 30,
        bottomgutter = 20,
        topgutter = 20,
        colorhue = .6 || Math.random(),
        color = "hsb(" + [colorhue, .5, 1] + ")",
        X = (width - leftgutter) / data.length,
        max = Math.max.apply(Math, data),
        Y = (height - bottomgutter - topgutter) / max;

    var p, bgpp;
    for (var i = 0, ii = data.length; i < ii; i++) {
        var y = Math.round(height - bottomgutter - Y * data[i]),
            x = Math.round(leftgutter + X * (i + .5));
            //t = r.text(x, height - 6, labels[i]).attr(txt).toBack();
        if (!i) {
            p = ["M", x, y, "C", x, y];
            bgpp = ["M", leftgutter + X * .5, height - bottomgutter, "L", x, y, "C", x, y];
        }
        if (i && i < ii - 1) {
            var Y0 = Math.round(height - bottomgutter - Y * data[i - 1]),
                X0 = Math.round(leftgutter + X * (i - .5)),
                Y2 = Math.round(height - bottomgutter - Y * data[i + 1]),
                X2 = Math.round(leftgutter + X * (i + 1.5));
            var a = getAnchors(X0, Y0, x, y, X2, Y2,"top");
            p = p.concat([a.x1, a.y1, x, y, a.x2, a.y2]);
            bgpp = bgpp.concat([a.x1, a.y1, x, y, a.x2, a.y2]);
        }
        

        
    }
    
    
     p = p.concat([x, y, x, y]);
     p = p.concat(["L", x,height - bottomgutter, "C", x, y]);
     
    for (var i = data.length; i >= 0; i--) {
        var y = Math.round(height - bottomgutter - Y * data2[i]),
            x = Math.round(leftgutter + X * (i + .5));
        if ((i==0)) {
            p = p.concat(["C", x, y, "L", x, y]);
            bgpp =  p.concat(["M", leftgutter + X * .5, height - bottomgutter, "L", x, y, "C", x, y]);
        }
        if (i && i < ii - 1) {
            var Y0 = Math.round(height - bottomgutter - Y * data2[i - 1]),
                X0 = Math.round(leftgutter + X * (i - .5)),
                Y2 = Math.round(height - bottomgutter - Y * data2[i + 1]),
                X2 = Math.round(leftgutter + X * (i + 1.5));
            var a = getAnchors(X2, Y2, x, y, X0, Y0,"bottom");
            p = p.concat([a.x1, a.y1, x, y, a.x2, a.y2]);
            bgpp = bgpp.concat([a.x1, a.y1, x, y, a.x2, a.y2]);
        }
        
    }
    
        var y = Math.round(height - bottomgutter - Y * data[0]);
        var x = Math.round(leftgutter + X * (0 + .5));    
    p = p.concat(['L',x, y]);
    
    
    //alert(p);
    bgpp = bgpp.concat([x, y, x, y, "L", x, height - bottomgutter, "z"]);
    //path.attr({path: p});
    //bgp.attr({opacity:1});
   // bgp.attr({path: bgpp});
    return {path:bgpp,border:p}
    }
    

