 function svgNet(radius_primitive) {

     this.gfx = new Svg_obj("svg_wrapper", "fig", {
         x: (radius_primitive),
         y: (radius_primitive)
     });
     this.radius_primitive=radius_primitive;

     this.Draw_primitiveCircle = function () {
         return new Circ_obj({
             x: 0,
             y: 0
         }, this.radius_primitive, "#ccc", "2", "#FFF", 0, "prim_circ");
     };
 }

 Svg_Net = new svgNet(400);
 Svg_Net.Draw_primitiveCircle();

