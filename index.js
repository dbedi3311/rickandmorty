const express = require('express')
const axios = require('axios')
const cors = require('cors')
const PORT = process.env.PORT || 3001

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get("/status", (request, response) => {
    const status = {
       "Status": "Running"
    }
    response.send(status)
})

store = {}
loaded = false

const load = async () => {

    pages = 42
    page = 0
    // console.log("page", page)
    // console.log("pages", pages)

    while(page <= pages){
        baseURL = `https://rickandmortyapi.com/api/character?page=${page}`
        console.log(baseURL)

        const response = await axios.get(baseURL)
        response.data["results"].forEach((value, index) => {
            store[value["name"]] = 
                {
                "name": value["name"], 
                "image": value["image"]
                }
            })
        page++
    }
    loaded = true
}


const main = async () => {
    await load()
    console.log(store)
}

const getImageByName = async (req, res, next) => {
    nameId = req.params.name
    if(!loaded){
        await main()
    }

    if(nameId in store){
        res.send(store[nameId])
    } else {
        res.status(404)
        res.send({"Error": "Element Not Found"})
    }

}

app.get("/image/:name", getImageByName)

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})

