function MakeIframeFullHeight(iframeElement){
    iframeElement.style.width   = "100%";
    var ifrD = iframeElement.contentDocument || iframeElement.contentWindow.document;
    var margins = ifrD.body.style.margin + ifrD.body.style.padding + ifrD.documentElement.style.margin + ifrD.documentElement.style.padding;
    if(margins=="") { margins=0;  ifrD.body.style.margin="0px"; }
    (function(){
       var interval = setInterval(function(){
        if(ifrD.readyState  == 'complete' ){
            iframeElement.style.height  = (parseInt(window.getComputedStyle( ifrD.documentElement).height) + margins+1) +"px";
            setTimeout( function(){ clearInterval(interval); }, 1000 );
        } 
       },1000)
    })();
}


function scrolltoID(id, speed = 800, offset = 0) {
    $('html, body').animate({
        scrollTop: $('#' + id).offset().top + offset
    }, speed);
}