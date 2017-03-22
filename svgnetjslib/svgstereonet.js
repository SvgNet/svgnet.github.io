class point{
    constructor (cord_x, cord_y, cord_type) {
    
    if (cord_type) {
      if(cord_type in ["cart,svg"])
      this.cordType=cord_type
    } else {
         this.cordType= "cart"
    }
    this.x = cord_x
    this.y = cord_y;
    
}
  
}