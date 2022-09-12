var express = require('express')
var app = express()
var bodyParser = require('body-parser');
var mongoose = require('mongoose')
const methodOverride = require('method-override')
var fs = require('fs');
var path = require('path');
require('dotenv/config');

// Connecting to the database 
mongoose.connect('mongodb://localhost:27017',
    { useNewUrlParser: true, useUnifiedTopology: true }, err => {
        console.log('connected')
    });


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


// Set EJS as templating engine 
app.set("view engine", "ejs");

var imgModel = require('./model');



var multer = require('multer');

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

var upload = multer({ storage: storage });

//get Home page
app.get('/', (req, res) => {
    res.render("app")
});
// Retriving the image 
app.get('/getData', (req, res) => {
    imgModel.find({}, (err, items) => {
        if (err) {
            console.log(err);
        }
        else {
            res.render('getData', { items: items });
        }
    });
});


// Uploading the image 
app.post('/', upload.single('image'), (req, res, next) => {

    var obj = {
        name: req.body.name,
        number: req.body.number,
        email: req.body.email,
        img: {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            contentType: 'image'
        }
    }
    imgModel.create(obj, (err, item) => {
        if (err) {
            console.log(err);
            // renderNewPage(res, image, true)
        }
        else {
            // item.save(); 

            res.redirect('/');

        }
    });
});


// Show Book Route
app.get('/getData/:id', async (req, res) => {
    try {
        const image = await imgModel.findById(req.params.id)
            .populate()
            .exec()
        res.render('show', { image: image })
    } catch {
        res.redirect('/')
    }
})

// Edit Book Route
app.get('/:id/edit', async (req, res) => {
    try {
        const image = await imgModel.findById(req.params.id)
        renderEditPage(res, image)
    } catch {
        res.redirect('/')
    }
})

// Update images
app.post('/:id', async (req, res) => {
    let obj

    try {
        obj = await imgModel.findById(req.params.id)
        obj.name = req.body.name
        obj.number = req.body.number
        obj.emaIL = req.body.emaIL
        if (req.body.img != null && req.body.img !== '') {
            saveImage(image, req.body.image)
        }

        await obj.save()
        res.redirect(`/getData/${image.id}`)
    } catch {
        if (obj != null) {
            renderEditPage(res, image, true)
        } else {
            redirect('/')
        }
    }
})

// Delete Book Page
app.post('/getData/:id', async (req, res) => {
    let image
    try {
      image = await imgModel.findById(req.params.id)
      await image.remove()
      res.redirect('/getData')
    } catch {
      if (image != null) {
        res.render('show', {
          image: image,
          errorMessage: 'Could not remove book'
        })
      } else {
        res.redirect('/')
      }
    }
  })



function saveImage(image, imageEncoded) {
    if (imageEncoded == null) return
    const pic = JSON.parse(imageEncoded)
    if (pic != null && imageMimeTypes.includes(img.contentType)) {
        pic.img.data = new Buffer.from(image.data, 'base64')
        pic.img.contentType = image.type
    }
}

// async function renderNewPage(res, image, hasError = false) {
//     renderFormPage(res, image, 'edit', hasError)
//   }

async function renderEditPage(res, image, hasError = false) {
    renderFormPage(res, image, 'edit', hasError)
  }

async function renderFormPage(res, image, form, hasError = false) {
    try {

        const params = {

            image: image
        }
        if (hasError) {
            if (form === 'edit') {
                params.errorMessage = 'Error Updating Book'
            } else {
                params.errorMessage = 'Error Creating Book'
            }
        }
        res.render(`${form}`, params)
    } catch {
        res.redirect('/getData')
    }
}

app.listen('5000' || process.env.PORT, err => {
    if (err)
        throw err
    console.log('Server started')
}) 
