var mongoose = require('mongoose'); 

var imageSchema = new mongoose.Schema({ 
	name: String, 
	number: Number, 
	email: String, 
	img: 
	{ 
		data: Buffer, 
		contentType: String 
	} 
}); 

imageSchema.virtual('imagePath').get(function() {
	if (this.img != null) {
	//   return `data:${this.contentType};charset=utf-8;base64,${this.img.toString('base64')}`
	return `data:${this.img.contentType};charset=utf-8;base64, 
		${this.img.data.toString('base64')}`
	}
  })
//Image is a model which has a schema imageSchema 

module.exports = new mongoose.model('Image', imageSchema); 
