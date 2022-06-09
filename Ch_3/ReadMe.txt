//Разбор req.body (у каждого <input> д.б. атрибут name)
app.use(EXPRESS.urlencoded({extended: true}))