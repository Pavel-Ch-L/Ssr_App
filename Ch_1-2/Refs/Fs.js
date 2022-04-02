const fs = require('fs');
const path = require('path');

//Создание папки
/*
fs.mkdir(path.join(__dirname, 'notes'), err => {
  if(err) throw err;
  console.log("Папка создана ...");
})
*/

//Запись в файл
/*
fs.writeFile(path.join(__dirname, 'notes', 'MyNotes.txt'), 'Hello World !!!', err => {
  if(err) throw err;
  console.log('Файл создан ...');

//Добавление в файл  
  fs.appendFile(path.join(__dirname, 'notes', 'MyNotes.txt'), '\nAdd note', err => {
  if(err) throw err;
  console.log('Строка добавлена ...');
  })
})

//Файл читается ассинхронно
fs.readFile(path.join(__dirname, 'notes', 'MyNotes.txt'), 'utf-8', (err, data) => {
  if(err) throw err;
  console.log('Вывод через буфер => ', Buffer.from(data).toString());//Или 'utf-8' или Buffer.from()
  console.log(data);
})
*/

//Переименование файла
/*
fs.rename(path.join(__dirname, 'notes', 'MyNotes.txt'),
 path.join(__dirname, 'notes', 'Notes.txt'),
 err => { if(err) throw err; console.log('Файл переименован...') }
 )
 */