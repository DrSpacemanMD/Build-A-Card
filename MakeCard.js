BuiltCards = [];
PageNumber = 1;
DebugCardCount =0;
CardType=""

var padding = 40;


function MakeNewCard() {
  
  const Standard = document.getElementById('Standard');
  const Small = document.getElementById('Small');
  if (CardType == "")
  {
      if (Standard.checked){CardType="Standard";}
      if (Small.checked){CardType="Small";}
  }
  
  if (Standard.checked && CardType=="Small"){ alert("You can't mix card types"); return; }
  if (Small.checked && CardType=="Standard"){ alert("You can't mix card types"); return; }




  var CardTitle = document.getElementById("TitleForm").value;
  var CardDesc = document.getElementById("DescriptionForm").value;

  if (CardTitle==""){ alert("Missing Card title"); return; }
  if (CardDesc==""){ alert("Missing Card Description"); return;}

  var c = document.createElement('canvas');
  var ctx = c.getContext("2d");
  c.height = 1000; //280;
  c.width = 710;//200;

  ctx.rect(0, 0,c.width,c.height);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.lineWidth = 20;
  ctx.strokeStyle = "black";
  ctx.stroke();

  ctx.rect(padding, padding, c.width-padding*2,c.height*0.25);
  ctx.lineWidth = 4;
  ctx.strokeStyle = "black";
  //ctx.stroke();

  ctx.rect(padding, c.height*0.5, c.width-padding*2,c.height*0.5-padding*2);
  ctx.lineWidth = 4;
  ctx.strokeStyle = "black";
  //ctx.stroke();

  ctx.font = "60px Georgia";
  ctx.fillStyle = "black";
  ctx.textAlign = "center";


  var finalY  = FormatTextCorrectly(CardTitle,128,ctx,c)
  if (finalY>(c.height*0.3 - padding)){alert("Card Title is to long"); return;} 

  ctx.font = "40px Georgia";
  ctx.fillStyle = "black";
  ctx.textAlign = "center";

  var finalY2 = FormatTextCorrectly(CardDesc,c.height*0.5+48,ctx,c)
  if (finalY2>(c.height*0.5+ c.height*0.5-padding*2)){alert("Card Description is to long"); return;} 
 
  var dataURL = c.toDataURL();
  BuiltCards.push(c);
  
  UpdateCardBook();

  document.getElementById("TitleForm").value ="";
  document.getElementById("DescriptionForm").value="";

}

function UpdateCardBook()
{
    Cards = []
    Cards.push(document.getElementById("Card1"));
    Cards.push(document.getElementById("Card2"));
    Cards.push(document.getElementById("Card3"));


    Indexs = []
    for (i = 3; i >=1; i--) {
      if (BuiltCards.length > PageNumber*3 -i && PageNumber*3 -i>=0 ){
        Indexs.push(PageNumber*3 -i);
        }
    }

    for (i = 0; i <3; i++) {
      Cards[i].src = "PlaceHolder.png";
    }


    for (i = 0; i <Indexs.length; i++) {
      Cards[i].src = BuiltCards[Indexs[i]].toDataURL()
    }

    MaxPage = Math.ceil(BuiltCards.length/3.0)
    document.getElementById("PageNumber").innerHTML  = "Page" + PageNumber + "/" + MaxPage
}

function NextPage()
{
  if (BuiltCards.length <=3){return;}
  PageNumber++;
  MaxPage = Math.ceil(BuiltCards.length/3.0)
  if (PageNumber>MaxPage){PageNumber=MaxPage;}
  UpdateCardBook();
}

function PrevPage()
{
  if (BuiltCards.length <=3){return;}
  PageNumber--;
  if (PageNumber<1){PageNumber=1;}
  UpdateCardBook();
}

function FormatTextCorrectly(InputString,ypos, ctx,c){

  var words = [];
  var SplitByLines = InputString.split(/^/m);
  for (var i = 0; i < SplitByLines.length; i++){
    var SplitUpWords = SplitByLines[i].split(" ");
    for (var j = 0; j < SplitUpWords.length; j++){
      words.push(SplitUpWords[j]);
    }
  }

  var test = InputString.split(/(\s+)/).filter( function(e) { return e.trim().length > 0; } );
  var RectSize = c.width-padding*4;

  AlteredCardTitle =""
  for (var WordIdx = 0; WordIdx < words.length; WordIdx++){
    var currentWord = words[WordIdx];
  
    if (ctx.measureText(currentWord).width<RectSize && ctx.measureText(AlteredCardTitle+ " " +currentWord).width>RectSize)
    {
        ctx.fillText(AlteredCardTitle,c.width/2,ypos);
        ypos+=ctx.measureText('M').width;
        AlteredCardTitle="";
    }

    for (var idx = 0; idx < currentWord.length; idx++){
      AlteredCardTitle+=currentWord[idx];
      var wordsize = ctx.measureText(AlteredCardTitle);
      if (wordsize.width >= RectSize || currentWord[idx]=="\n"){
        ctx.fillText(AlteredCardTitle,c.width/2,ypos);
        ypos+=ctx.measureText('M').width;
        AlteredCardTitle="";
      }
    }
  AlteredCardTitle+=" ";
  }

  ctx.fillText(AlteredCardTitle,c.width/2,ypos);
  return ypos;
}

function MakePDF(){
  if (BuiltCards.length==0){alert("Add cards to the card book first!");return;}
  
  var CardWidth  = 61; //63;
  var CardHeight = 86; //88;

  const Standard = document.getElementById('Standard');
  const Small = document.getElementById('Small');
  if (CardType == "Standard"){CardWidth=61; CardHeight=86;}
  if (CardType == "Small"){CardWidth=41; CardHeight=63;}




  var doc = new jsPDF("p", "mm", "a4"); //210mm x 297mm
  var maxImagesHor = Math.floor(210/CardWidth);
  var maxImagesVert = Math.floor(297/CardHeight);
  var x =0;
  var y =0;
  
  var HorCounter=0;
  var VertCounter=0;
  
  
  for (var i = 0; i < BuiltCards.length; i++){
    doc.addImage(BuiltCards[i].toDataURL(), x, y, CardWidth, CardHeight);
    x+=CardWidth;
    HorCounter++;
    if (HorCounter>=maxImagesHor){ x=0;y+=CardHeight;VertCounter++;HorCounter=0}
    if (VertCounter>=maxImagesVert)
    {x=0;
    y=0;
    HorCounter=0;
    VertCounter=0;
    doc.addPage();
    }

  }
  

  for (var i =1; i <= doc.internal.getNumberOfPages(); i++){
    doc.setPage(i);
    doc.text("cards generated using Build-A-Card" , doc.internal.pageSize.getWidth()/2, 295, { align: "center" })
    doc.text('page ' + i + "/" +  doc.internal.getNumberOfPages()  , doc.internal.pageSize.getWidth()/2, 285, { align: "center" })
  }

  
  doc.save('CardBook.pdf');
}

//63mm by 88mm