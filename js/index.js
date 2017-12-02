
var boxH = 568;
var boxW = 300;
//-------------------------game class------------------------------
function Game(config) {
	var ga=this;
	ga.$dom=config.$dom;
	ga.initGame(ga);
	
}
Game.prototype={
	initGame:function (ga) {
		var ga=this;

		var play = new Player({x:150,y:488},ga);
		ga.$dom.append(play.$dom);
		//用document不用play.$dom，是为了保证鼠标在页面随意移动时dom可以获取event，滑动流畅
		$(document).mousemove(function (ev) {
			play.movePlayer(ev,play,ga);
		})
		var index = 0;
		setInterval(function () {
			index++
			var cate = 'small';
			if(index%5==0){
				cate = 'middle';
			}else if(index%8==0){
				cate = 'big';
			}
			var enemy = new Enemy({cate:cate});
			ga.$dom.append(enemy.$dom);
			enemy.enemyMove(enemy, play);
		},2000)
	}
}

//-------------------------player class-----------------------------
function Player(config, ga) {

	this.initPlane(config, ga);
}
Player.prototype={
	initPlane:function (config, ga) {
		var play = this;
		play.x = config.x;
		play.y = config.y;
		play.w = 66;
		play.h = 80;
		play.blood = 3;
		play.bullet = [];
		play.$dom = $('<div class="play"></div>');
		play.$dom.css({left:play.x, top:play.y});
		this.shoot(play, ga);
		return play;
	},
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

		//飞机相对于盒子的坐标
		var osX=x-bl - pw/2;
		var osY=y-bt - ph/2;

		if(osX > -(pw/2) && osX < (gw - pw/2)  ){
			play.x = osX;
		}
		if(osY > -(ph/2) && osY < (gh - ph/2)){
			play.y = osY
		}
		play.$dom.css({left:play.x,top:play.y});
	},
	shoot:function (play, ga) {
		var index = 0;
		setInterval(function () {
			index++;
			var initX=play.x+play.w/2;
			var initY=play.y;
			var bullet = new Bullet({x:initX,y:initY,id:index});
			ga.$dom.append(bullet.$dom);
			bullet.bulletMove(bullet);
		},100)
	}
}

//-------------------------bullet class-----------------------------

function Bullet(config) {
	this.initBullet(config);
}
Bullet.prototype={
	initBullet:function (config) {
		var bullet = this;
		bullet.id = config.id;
		//子弹出生时的位置
		bullet.x = config.x;
		bullet.y = config.y;
		//子弹的自身属性，宽高。
		bullet.w = 6;
		bullet.h = 14;
		//速度
		bullet.speed = 48;
		bullet.$dom = $('<span class="bullet"></span>');
		bullet.$dom.css({left:bullet.x-3, top:bullet.y-7});
		return bullet;
	},
	bulletMove:function (bullet) {
		bullet.timer=setInterval(function () {
			bullet.y-=bullet.speed;
			bullet.$dom.css({top:bullet.y});
			if(bullet.y<-bullet.h){
				clearInterval(bullet.timer);
				bullet.destroyBullet(bullet);
			}
		},100)
	},
	destroyBullet:function (bullet) {
		bullet.$dom.remove();
	}
}

//-------------------------enemy class-----------------------------

function Enemy(config) {
	this.iniEnemy(config);
}
Enemy.prototype = {
	iniEnemy:function (config) {
		var enemy = this;
		enemy.cate = enemy.getEnemeyCate(config.cate);
		enemy.x = enemy.randomStart(enemy);
		enemy.y = -enemy.cate.height;
		enemy.$dom = $('<span class="enemy '+config.cate+'"></span>');
		enemy.$dom.css({left:enemy.x, top:enemy.y});
		return enemy;
	},
	getEnemeyCate:function (size) {
		var enemies = [
			{
				'size':'small',
				'width':34,
				'height':24,
				'speed':12,
				'blood':1
			},
			{
				'size':'middle',
				'width':45,
				'height':64,
				'speed':8,
				'blood':3
			},
			{
				'size':'big',
				'width':109,
				'height':168,
				'speed':4,
				'blood':8
			}
		];
		var obj={};
		enemies.reduce(function (pre, cur, index, array) {
			if (cur['size']==size) {
				obj = cur;
				return false;
			}
		},{});
		return obj;
	},
	enemyMove:function (enemy,play) {
		var that = this;
		enemy.timer=setInterval(function () {
			enemy.y+=enemy.cate.speed;
			enemy.$dom.css({top:enemy.y});
			that.checkCrash(enemy, play);
			if(enemy.y > boxH){
				clearInterval(enemy.timer);
				enemy.destroyenemy(enemy);
			}
		},100)
	},
	randomStart:function (enemy) {
		var x = Math.round((Math.random()*(boxW-enemy.cate.width)));
		return x;
	},
	checkCrash:function (enemy, play) {
		//子弹的相关参数
		var bw = 6;
		var bh = 14;
		var bullets = $(".bullet");
		for(var i = 0; i < bullets.length; i++){
			var left = parseInt(bullets.eq(i).css('left'));
			var top = parseInt(bullets.eq(i).css('top'));
			if(top <= enemy.y+enemy.cate.height && (left>enemy.x && left<enemy.x+enemy.cate.width)){
				bullets.eq(i).remove();
				enemy.cate.blood--;
				if(enemy.cate.blood==0){
					enemy.$dom.addClass('destroy')
					clearInterval(enemy.timer);
					setTimeout(function () {
						enemy.destroyenemy(enemy);
					},2000)
				}
			}
		}
		var pl=play.x, pt=play.y, pw=play.w, ph=play.h;

		if((pt < enemy.y+enemy.cate.height && pt + ph >= enemy.y) && (pl+pw>enemy.x && pl<enemy.x+enemy.cate.width)){
				enemy.$dom.addClass('destroy')
				clearInterval(enemy.timer);
				setTimeout(function () {
					enemy.destroyenemy(enemy);
				},2000)
				play.blood--;
				if(play.blood==0){
					play.$dom.addClass('destroy')
					setTimeout(function () {
						play.$dom.remove();
						var con = confirm("是否继续？")
						if(con){
							window.location.reload();
						}else{
							window.close();
						}
					},2000)

				}
			}

	},
	destroyenemy:function (enemy) {
		enemy.$dom.remove();
	}
}
var $box=$('#play-box');
var game=new Game({'$dom':$box});



















