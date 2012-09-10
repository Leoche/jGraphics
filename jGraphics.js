(function($) {
        $.fn.jGraphics = function(params,callback) {
            var jG = this;
            var ID, textData;
            var data = [];
            var legend = [];
            var coupledData = false;
            var graphics = [];
            var maxData = [];
            var minData = [];
            var rights = 0;
            var mouse = {x:999999,y:9999999};
            var mouseOn = [];
            var mouseDown = [];
            var history = [];
            var graphs = [];
            var savemouseDown = [];
            var firstDraw = true;
            var mouseUped =[];
            var hovers ={"grey":false,"blue":false};
            var dataChecker = /^(?:(?:[0-9A-z\-\/]+:[0-9]+(?:,|))+|(?:[0-9]+(?:,|))+)$/i;
            var colors = {
                "red":["#EF6164","#EB363A"],
                "blue":["#62A8EE","#1585D7"],
                "green":["#8ADE72","#5FB933"],
                "yellow":["#F8F598","#F9EF42"],
                "orange":["#FCD178","#FAA70E"],
                "purple":["#AD70E0","#8731BB"]
            };
            var themes = {
                "light":[["#FEFEFE","#EFEFEF"],"#CCC","#E5E5E5","#C7C7C7","#828282","#666"],
                "dark":[["#666","#333"],"#222","#6F6F6F","#888","#828282","#CCC"]
            }
            var defaults = {
                height:200,
                width:300,
                marginTop:1,
                marginLeft:1,
                marginRight:1,
                marginBottom:1,
                circlesRadius:5,
                strokeWidth:3,
                grid:true,
                theme:"light",
                origin:false,
                color:"red",
                title:false,
                titlePosition:"bottom",
                canSave:true,
                authorLink:true
            }
            jG.init = function(elem){
                params = $.extend(defaults, params);
                ID = Math.round(Math.random()*1000);
                if(jG.parseData(elem,ID)){
                    elem.after('<canvas class="jGraphicsclass" id="jGraphics-'+ID+'" width="'+params.width+'" height="'+params.height+'" ></canvas>');
                    graphs.push("#jGraphics-"+ID);
                    graphics = ID;
                    elem.hide();
                    jG.draw("jGraphics-"+ID,true,data);

                    mouseOn[ID]=false;
                    mouseDown[ID]=false;
                    $('#jGraphics-'+ID).bind("mousemove",function(e){
                        e.stopPropagation();
                       graphics = $(this).attr("id");
                       mouse.x = e.offsetX;
                       mouse.y = e.offsetY;
                       $(this).addClass("h");
                       jG.parseData(elem);
                       jG.draw(graphics,false,data);
                    });
                    $('#jGraphics-'+ID).bind("mouseout",function(e){
                       graphics = $(this).attr("id");
                       mouse = {x:999999,y:9999999};
                       mouseOn[ID]=false;
                       $(this).removeClass("h");
                       jG.draw(graphics,false,data);
                    });
                    $('#jGraphics-'+ID).bind("mousedown",function(e){
                       graphics = $(this).attr("id");
                       mouseDown[graphics] = true;
                       $(this).addClass("d");
                       jG.draw(graphics,false,data);
                    });
                    $('#jGraphics-'+ID).bind("mouseup",function(e){
                       graphics = $(this).attr("id");
                       mouseDown[graphics] = false;
                       $(this).removeClass("d");
                       mouseUped[ID] = true;
                       jG.draw(graphics,false,data);
                    });
                }
            }
            jG.parseData = function(elem,ppp){
                textData = elem.text();
                var tmp =[];
                var tmpdata =[];
                if(textData.match(dataChecker)){
                    data = textData.split(",");
                        for(var i in data){
                            if(data[i].split(":").length==2){
                               coupledData = true;
                               tmp.push(data[i].split(":"));
                               tmpdata.push(tmp[i][1]);
                               if(legend["jGraphics-"+ppp]==undefined)legend["jGraphics-"+ppp]=[];
                               legend["jGraphics-"+ppp].push(tmp[i][0]);
                            }
                            else{
                                coupledData = false;
                                tmpdata.push(data[i]);
                                tmp.push(data[i]);
                            }
                        }
                        data = tmpdata;
                        history["jGraphics-"+ppp] = data;
                        if(coupledData){
                            for(var i in data){
                                if(parseInt(tmp[i][1])<minData["jGraphics-"+ppp]||minData["jGraphics-"+ppp]==undefined){minData["jGraphics-"+ppp]=data[i];}
                                if(parseInt(tmp[i][1])>maxData["jGraphics-"+ppp]||maxData["jGraphics-"+ppp]==undefined){maxData["jGraphics-"+ppp]=data[i];}
                            }
                        }else{
                            for(var i in data){
                                if(parseInt(tmp[i])<minData["jGraphics-"+ppp]||minData["jGraphics-"+ppp]==undefined){minData["jGraphics-"+ppp]=data[i];}
                                if(parseInt(tmp[i])>maxData["jGraphics-"+ppp]||maxData["jGraphics-"+ppp]==undefined){maxData["jGraphics-"+ppp]=data[i];}
                            }
                        }
                    return true;
                }else{
                    jG.html("ERREUR: Vos donn\351es ne sont pas au bon format!");
                }
                return false;
            }
            jG.draw = function(dsd,firstDraw,data){
                data = history[dsd];
                var elem = $("#"+dsd);
                var canvas = $("#"+dsd)[0];
                var w = canvas.width;
                var h = canvas.height;
                if(legend[dsd]!=undefined){
                    h = h-12;
                }
                var ctx = canvas.getContext("2d");
                ctx.fillStyle = themes[params.theme][1];
                ctx.fillRect(0,0,w,h);
                var fond = ctx.createLinearGradient(0,0,0,h);
                fond.addColorStop(0,themes[params.theme][0][0]);
                fond.addColorStop(1,themes[params.theme][0][1]);
                ctx.fillStyle = fond;
                ctx.fillRect(1,1,w-2,h-2);

                var numcol = data.length-1+params.marginRight+params.marginLeft;
                var colwidth = params.width/numcol;
                
                var numrow = maxData[dsd]-minData[dsd]+params.marginTop+params.marginBottom;
                var rowwidth = ((h)/numrow);
                if(params.grid=="verticalonly"||params.grid==true){
                    for(var d=1;d<numcol;d++){
                        ctx.fillStyle = themes[params.theme][2];
                        ctx.fillRect(d*colwidth,1,1,h-2);
                    }
                }
                if(params.grid=="horizontalonly"||params.grid==true){
                    for(var d=minData[dsd];d<(numrow+parseInt(minData[dsd]));d++){
                        var ecart = (maxData[dsd]-minData[dsd])/15;
                        if(ecart<3||data.indexOf(String(d))!=-1){
                        ctx.fillStyle = themes[params.theme][2];
                        var texttoprint = String(d);
                        if(d!=(numrow+parseInt(minData[dsd]))-1){
                            ctx.fillRect(1,h-(d-minData[dsd]+params.marginBottom)*rowwidth,w-2,1);
                        }
                        ctx.fillStyle = themes[params.theme][3];
                        ctx.textAlign   = "right";
                        ctx.fillText(texttoprint,w-2,h-(d-minData[dsd]+params.marginBottom)*rowwidth-3);
                        }
                    }
                }
                for(var d in data){
                        if(params.theme == "light"){
                    ctx.strokeStyle = colors[params.color][0];
                    }else{
                    ctx.strokeStyle = colors[params.color][1];
                    }
                    ctx.lineWidth = params.strokeWidth;
                    if(d == 0){
                        ctx.beginPath();
                        if(params.origin){
                        ctx.moveTo(0,h);
                        ctx.lineTo((parseInt(d)+params.marginLeft)*colwidth,h-(data[d]-minData[dsd]+params.marginBottom)*rowwidth);
                        }else{
                        ctx.moveTo((parseInt(d)+params.marginLeft)*colwidth,h-(data[d]-minData[dsd]+params.marginBottom)*rowwidth);
                        }
                    }else{
                        ctx.lineTo((parseInt(d)+params.marginLeft)*colwidth,h-(data[d]-minData[dsd]+params.marginBottom)*rowwidth);
                    }
                }  
                ctx.stroke();
                for(var d in data){
                        if(params.theme == "light"){
                    ctx.fillStyle = colors[params.color][1];
                }else{
                    ctx.fillStyle = colors[params.color][0];
                }
                    ctx.beginPath();
                    ctx.arc((parseInt(d)+params.marginLeft)*colwidth,h-(data[d]-minData[dsd]+params.marginBottom)*rowwidth,params.circlesRadius,Math.PI*2,false);
                    ctx.fill();
                    if(coupledData&&firstDraw){
                        ctx.fillStyle = themes[params.theme][4];
                        ctx.textAlign = "center";
                        ctx.fillText(legend[dsd][d],(parseInt(d)+params.marginLeft)*colwidth,h+10);
                    }
                }
                if(params.title!=false){
                        ctx.fillStyle = themes[params.theme][5];
                        ctx.textAlign   = "left";
                        var titley = 12;
                        var titlex = 5;
                        if(params.titlePosition == "bottom"){
                            titley = h-6;
                        }
                        if(params.titleAlign == "center"){
                            titlex = (w-ctx.measureText(params.title).width)/2;
                        }else if(params.titleAlign == "right"){
                            titlex = w-ctx.measureText(params.title).width-5;
                        }
                        ctx.fillText(params.title,titlex,titley);
                   }
                var marginLeftButton =5;
                if(elem.hasClass("h")){
                    if(params.canSave){
                        createButton("T\351l\351charger",5,h-25,75,20,"blue",function(){
                           jG.saveImage(canvas.toDataURL());
                        });
                           marginLeftButton+=80;
                    }
                    if(params.authorLink){
                        createButton("jGraphics - Leoche.org",marginLeftButton,h-25,120,20,"grey",function(){
                           window.open("http://www.leoche.org/Portfolio/jGraphics");
                        });
                    }
                }

                function createButton(txt,x,y,w,h,c,callback){
                    var color = {
                        "active":{
                            "grey":["#DBDBDB","#FEFEFE",["#F7F7F7","#E2E2E2"],"#666"],
                            "blue":["#244FFB","#98C0FE",["#29A4FE","#3965FD"],"#E8F7FF"]
                        },
                        "hover":{
                            "grey":["#DBDBDB","#FEFEFE",["#FCFCFC","#F0F0F0"],"#363636"],
                            "blue":["#244FFB","#98C0FE",["#397DFD","#3965FD"],"#FFFFFF"]
                        },
                        "down":{
                            "grey":["#DBDBDB","#FEFEFE",["#F0F0F0","#FCFCFC"],"#363636"],
                            "blue":["#244FFB","#98C0FE",["#3965FD","#397DFD"],"#DDF3FF"]
                        }
                    };
                    if(mouse.x>x&&mouse.x<x+w&&mouse.y>y&&mouse.y<=y+h){
                        if(!mouseDown[dsd]) color = color.hover;
                        else {mouseDown[dsd]=false; color = color.down; callback(); }
                        hovers[c]=true;
                    }else{
                        color = color.active;
                        hovers[c]=false;
                    }
                    ctx.fillStyle = color[c][0];
                    ctx.fillRect(x,y,w,h);
                    ctx.fillStyle = color[c][1];
                    ctx.fillRect(x+1,y+1,w-2,h-2);
                    var grad = ctx.createLinearGradient(x,y,x,y+h);
                    grad.addColorStop(0,color[c][2][0]);
                    grad.addColorStop(1,color[c][2][1]);
                    ctx.fillStyle = grad;
                    ctx.fillRect(x+1,y+2,w-2,h-3);
                    ctx.fillStyle = color[c][3];
                    ctx.textAlign   = "center";
                    ctx.fillText(txt,x+w/2,y+h/1.5);
                }
                if(hovers.grey==true||hovers.blue==true){
                        $("#"+dsd).css({cursor:"pointer"});
                    }else{
                        $("#"+dsd).css({cursor:"auto"});
                    }
            }
            jG.saveImage = function(d){
                d.replace("image/png", "image/octet-stream")
                document.location.href = d;
            }
            return this.each(function(){
                jG.init($(this));
            });
        
        };
})(jQuery);