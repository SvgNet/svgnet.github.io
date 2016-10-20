 function svgNet(radius_primitive) {
     this.gfx = new Svg_obj("svg_wrapper", "fig", {
         x: (radius_primitive),
         y: (radius_primitive)
     });
     this.radius_primitive = radius_primitive;
     this.Draw_primitiveCircle = function () {
         return new Circ_obj({
             x: 0,
             y: 0
         }, this.radius_primitive, "#ccc", "2", "#FFF", 0, "prim_circ");
     };
 }
 Svg_Net = new svgNet(400);
 Svg_Net.Draw_primitiveCircle();
 var SvgNet_db = new PouchDB('userData');
 var remoteCouch = false;
 SvgNet_db.allDocs({
     include_docs: true,
     descending: true
 }, function (err, doc) {
     draw_offlineData(doc.rows);
 });

 function draw_offlineData(savedData) {
     for (var i = 0; i < savedData.length; i++) {
         console.log(savedData[i].doc)
         if (savedData[i].doc.orientType == "Plane") {
             
             ur_pl.push(new Plane(savedData[i].doc.strike, savedData[i].doc.dip, "blue", 1, savedData[i].id));
             insertdata(ur_pl[ur_pl.length - 1]);
         } else if (savedData[i].doc.orientType == "Line") {
             ur_ln.push(new Line(savedData[i].doc.trend, savedData[i].doc.plunge, "red", savedData[i].id));
             insertdata(ur_ln[ur_ln.length - 1]);
         } else if (savedData[i].doc.orientType == "PoletoPlane") {
             ur_popl.push(new PoletoPlane());
             ur_popl[ur_popl.length - 1].trend = savedData[i].doc.trend;
             ur_popl[ur_popl.length - 1].plunge = savedData[i].doc.plunge;
             ur_popl[ur_popl.length - 1].id = savedData[i].id;
             ur_popl[ur_popl.length - 1].draw();
             insertdata(ur_popl[ur_popl.length - 1]);
         } else if (savedData[i].doc.orientType == "LineonPlane") {
             ur_lnpl.push(new LineonPlane());
             ur_lnpl[ur_lnpl.length - 1].trend = savedData[i].doc.trend;
             ur_lnpl[ur_lnpl.length - 1].plunge = savedData[i].doc.plunge;
             ur_lnpl[ur_lnpl.length - 1].id = savedData[i].id;
             ur_lnpl[ur_lnpl.length - 1].draw();
             insertdata(ur_lnpl[ur_lnpl.length - 1]);

         }

     }
 }
