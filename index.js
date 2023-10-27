import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import ejs from 'ejs';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    try {
        const dataBuffer = fs.readFileSync('form-data.json');
        const data = JSON.parse(dataBuffer.toString());
        res.render('index.ejs', { data });
    } catch (error) {
        console.log(error);
    }
});

app.post('/submit', (req, res) => {
    const formData = {
        name: req.body.name,
        title: req.body.title,
        date: req.body.date,
        description: req.body.description
    };

    saveFormData(formData);

    res.redirect('/');
});

app.post('/edit/:id', (req, res) => {

    const itemId = req.body.id;

    const dataBuffer = fs.readFileSync('form-data.json');
    const allData = JSON.parse(dataBuffer.toString());
    
    const itemToEdit = allData.find(item => item.id === itemId);

    if (itemToEdit) {
        res.render('edit.ejs', { itemToEdit });
    } else {
        res.send('Item not found');
    }

});

app.post('/update/:id', (req, res ) => {
    const itemId = req.params.id;

    const dataBuffer = fs.readFileSync("form-data.json");
    const allData = JSON.parse(dataBuffer.toString());

    const itemToUpdate = allData.find(item => item.id === itemId);

    if (itemToUpdate) {
        itemToUpdate.name = req.body.name;
        itemToUpdate.title = req.body.title;
        itemToUpdate.date = req.body.date;
        itemToUpdate.description = req.body.description;

        fs.writeFileSync('form-data.json', JSON.stringify(allData));
        res.redirect('/');

    }else {
        res.send('Item not found');
    }
});

app.post('/delete', (req, res) => {
    const itemId = req.body.id;
    
    const dataBuffer = fs.readFileSync('form-data.json');
    let data = JSON.parse(dataBuffer.toString());

    data = data.filter(item => item.id !== itemId);
    
    fs.writeFileSync('form-data.json', JSON.stringify(data));
    
    res.redirect('/');
});



app.get('/add-task', (req, res) => {
    res.render('add-task.ejs');
});

app.get('/about', (req, res) => {
    res.render('about.ejs');
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});




















function saveFormData(data) {

    const filePath = 'form-data.json';

    let existingData = [];

    try {
        const dataBuffer = fs.readFileSync(filePath);
        existingData = JSON.parse(dataBuffer.toString());
    } catch (error) {
        console.log('No existing data found.');
    }

    data.id = generateUniqueId();

    existingData.push(data);

    fs.writeFileSync(filePath, JSON.stringify(existingData));
}

function generateUniqueId() {
    return uuidv4(); 
}

