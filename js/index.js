//-------------------------game class------------------------------
function Game(config) {
	var ga=this;
	ga.$dom=config.$dom;
	ga.initGame(ga);
	
}

Game.prototype={
	initGame:function (ga) {
		var ga=this;
		var play = new Player();
		ga.$dom.append(play.$dom);
		play.$dom.css({'bottom':0,'left':'50%'});
		ga.$dom.mousemove(function (ev) {
			play.movePlayer(ev,play,ga);
		})
	}
}
//-------------------------player class-----------------------------
function Player() {
	var play = this;
	play.$dom = $('<div class="play"></div>');

	return play
}
Player.prototype={
	movePlayer:function (ev,play,ga) {
		var x=ev.pageX,
		y=ev.pageY, 
		box=ga.$dom, 
		//游戏盒子的宽高
		gw=parseInt(box.css('width')),
		gh=parseInt(box.css('height'));
		bl=box.offset().left;
		bt=box.offset().top;
		//玩家飞机的宽高
		pw=parseInt(play.$dom.css('width')),
		ph=parseInt(play.$dom.css('height'));

		//飞机坐标
		var osX=x-bl - pw/2;
		var osY=y-bt - ph/2;
		console.log(osX,osY,'1');

		// if(osX < bl - pw/2){
		// 	osX = bl - pw/2;
		// }else if(osX > (bl+gw)){
		// 	osX = bl+gw;
		// }
		// if(osY < bt){
		// 	osY = bt;
		// }else if(osY > bt+gh){
		// 	osY = bt+gh;
		// }
		if(osX > -(pw/2) && osX < (gw - pw/2)  ){
			var left = osX;
			play.$dom.css({left:left});
		}
		if(osY > -(ph/2) && osY < (gh - ph/2)){
			var top = osY
			play.$dom.css({top:top});
		}
	}
}


var $box=$('#play-box');
var game=new Game({'$dom':$box});