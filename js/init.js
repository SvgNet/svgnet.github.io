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
     draw_Planes(doc.rows);
 });

 function draw_Planes(savedPlanes) {
     for (var i = 0; i < savedPlanes.length; i++) {
         ur_pl.push(new Plane(savedPlanes[i].doc.strike, savedPlanes[i].doc.dip, "blue", 1, savedPlanes[i].id));
         insertdata(ur_pl[ur_pl.length - 1]);
     }
 }
