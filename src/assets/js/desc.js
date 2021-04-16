// 

function checkdesc(){
    let desc=document.querySelector(".desc")
    let descstyle;
    let descbut=document.querySelector(".descbut")
    // 获取desc最终样式
    if(desc.currentStyle!=null){
        descstyle=desc.currentStyle
    }
    else{
        descstyle=window.getComputedStyle(desc,null)
    }
    
    if(descstyle.webkitLineClamp==3){
        desc.style.webkitLineClamp="unset"
        descbut.innerHTML="折叠"
    }else{
        desc.style.webkitLineClamp="3"
        descbut.innerHTML="展开"
    }
}
export { 
    checkdesc
}
