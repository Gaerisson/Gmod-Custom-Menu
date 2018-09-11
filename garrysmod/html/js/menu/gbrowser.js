$( document ).ready(function() {

  window.historylst=[];
  window.historyidx=0;
  window.favlist=[];

  $(".gbrowser-window").width($(window).width()-220);
  $(".gbrowser-window").height($(window).height()-27);

  $(".gbrowser-iframe-box").height($(window).height()-70);

  $(".gbrowser-bottombar").width($(window).width()-230);

  var favlsturl=JSON.parse(localStorage.getItem("favlist"));
  favlsturl.forEach(function(furl) {
    var flstnode = document.createElement("a");
    var flstfavnode = document.createElement("div");
    var flstfavicnode = document.createElement("i");
    var flsttextnode = document.createTextNode("> "+furl);
    flstfavnode.className = "gbrowser-favic gbrowser-ficonrem";
    flstfavicnode.className = "fas fa-star";
    flstfavicnode.style.color = 'rgb(255, 238, 0)';
    flstfavicnode.setAttribute("onclick","gbrowser('remfav','"+furl+"')");
    flstfavnode.appendChild(flstfavicnode);
    flstnode.appendChild(flstfavnode);
    flstnode.appendChild(flsttextnode);
    $("#favlst")[0].appendChild(flstnode);
    flstnode.style.cursor="pointer"
    flstnode.setAttribute("onclick","gbrowser('set','"+furl+"')");
  });

  $("#gbrowser-inp").keyup(function(event) {
    if (event.keyCode === 13) {
        $("#gbrowser-search").click();
    }
  });

  gbrowser('set','homepage');

});

function gbrowser(type,url){
  var iframe = $(".gbrowser-iframe-box")[0];
  var inp = $("#gbrowser-inp")[0].value;
  var cnthist = window.historylst.length;
  var histtext = $("#histtext")[0];

  if(url=="inpurl"){
    if(inp!=="http://"){
      url = inp;
    }else{
      url = 0;
    }
  }

  if(url=="homepage"){
    url="http://bing.fr";
  }

  if(type=="set"){
    if(url!==0){
      iframe.src=url;
      if(window.historylst.includes(url)==false){
        window.historylst.push(url);
        var node = document.createElement("a");
        var favnode = document.createElement("div");
        var favicnode = document.createElement("i");
        var textnode = document.createTextNode("- "+url);
        favnode.className = "gbrowser-favic";
        favicnode.className = "fas fa-star";
        favicnode.setAttribute("onclick","this.style.color = 'rgb(255, 238, 0)'");
        favicnode.setAttribute("onclick","gbrowser('addfav','"+url+"')");
        favnode.appendChild(favicnode);
        node.appendChild(favnode);
        node.appendChild(textnode);
        histtext.appendChild(node);
        node.style.cursor="pointer"
        node.setAttribute("onclick","gbrowser('set','"+url+"')");
      }
      $("#gbrowser-inp")[0].value=url;
      window.historyidx=1;
    }
  }

  else if(type=="next"){
    if(window.historyidx>1){
      window.historyidx--;
    }
    iframe.src=window.historylst[cnthist-window.historyidx];
    if(iframe.src){
      $("#gbrowser-inp")[0].value=iframe.src;
    }
  }

  else if(type=="addfav"){
    if(localStorage.getItem("favlist")!==null){
      window.favlist=JSON.parse(localStorage.getItem("favlist"));
    }
    if(window.favlist.includes(url)==false){
      window.favlist.push(url);
      localStorage.setItem("favlist", JSON.stringify(window.favlist));
      location.reload();
    }
  }

  else if(type=="remfav"){
    if(localStorage.getItem("favlist")!==null){
      window.favlist=JSON.parse(localStorage.getItem("favlist"));
    }
    if(window.favlist.includes(url)==true){
      var i = window.favlist.indexOf(url);
      if(i != -1) {
      	window.favlist.splice(i, 1);
      }
      localStorage.setItem("favlist", JSON.stringify(window.favlist));
      location.reload();
    }
  }

  else if(type=="prev"){
    if(window.historyidx<cnthist){
      window.historyidx++;
    }
    iframe.src=window.historylst[cnthist-window.historyidx];
    if(iframe.src){
      $("#gbrowser-inp")[0].value=iframe.src;
    }
  }

}
