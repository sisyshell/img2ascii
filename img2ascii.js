class img2ascii{
	constructor(opt) {
		this.characterSet = ['@', '#', '$', '=', '*', '!', ';', ':', '~', '+', '-', ',', '.', ' ', ' '];
		this.canvas = document.createElement('canvas');
		this.ctx = this.canvas.getContext('2d');
		this.img = new Image();
		this.img.generator = this;
		this.img.onload = function() {
			this.generator.getImageInfo();
		};
		this.optionParser(opt);
	}
	
	optionParser(opt){
		this.outputElement = opt.output;
		if(opt.width === undefined && opt.height === undefined){
			this.width = 'auto';
			this.height = 'auto';
		}else if(opt.width === undefined){
			this.width = 'auto';
			this.height = opt.height;
		}else if(opt.height === undefined){
			this.height = 'auto';
			this.width = opt.width;
		}else{
			this.width = opt.width;
			this.height = opt.height;
		}
		this.img.src = opt.imgPath;
	}
	
	imgAutoScale(rate){
		this.width = Math.round(this.img.naturalWidth * rate);
		this.height = Math.round(this.img.naturalHeight * rate);
	}
	
	getImageInfo(){
		if(this.width == 'auto' && this.height == 'auto'){
			this.width = this.img.naturalWidth;
			this.height = this.img.naturalHeight;
		}else{
			if(this.width == 'auto'){
				this.imgAutoScale(this.height / this.img.naturalHeight);
			}
			else if(this.height == 'auto'){
				this.imgAutoScale(this.width / this.img.naturalWidth);
			}
		}
		this.canvas.width = this.width;
		this.canvas.height = this.height;
		this.ctx.drawImage(this.img, 0, 0, this.width, this.height);
		this.imageData = this.ctx.getImageData(0, 0, this.width, this.height).data;
		this.getAscii();
	}
	
	getRGB(i){
		return [this.imageData[i=i*4], this.imageData[i+1], this.imageData[i+2]];
	}
	
	getChar(value){
		return this.characterSet[parseInt(value * (this.characterSet.length - 1), 10)];
	}
	
	getAscii(){
		var text = '';
		for(var i = 0; i < this.width * this.height; i++){
			let rgb = this.getRGB(i);
			let value = Math.max(rgb[0], rgb[1], rgb[2])/255;
			if(i%this.width === 0)
				text += '\n';
			text += this.getChar(value)
		}
		this.outputElement.innerHTML = (text);
		return text;
	}
}