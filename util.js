function hasClass(cla, element) {
    if(element.className.trim().length === 0) return false;
    var allClass = element.className.trim().split(" ");
    return allClass.indexOf(cla) > -1;
}

function addClass(cla,element){
    if(!hasClass(cla,element)){
        if(element.setAttribute){
            element.setAttribute("class",element.getAttribute("class")+" "+cla);
        }else{
            element.className = element.className+" "+cla;
        }
        
    }
}