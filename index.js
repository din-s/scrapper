const request = require('request-promise')
const cheerio = require('cheerio')
const fs = require('fs')
const ObjectToCsv = require('objects-to-csv')

const movie = 'https://www.imdb.com/title/tt0109313/?ref_=fn_tt_tt_1';

(async()=>{
    const options={
        uri:movie,
        headers:{
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    "accept-encoding": "gzip, deflate, br",
    "accept-language": "en-US,en;q=0.9"
        },
        gzip:true
    }
    
    const response = await request(options)
    const $ = cheerio.load(response)
    const title = $('#title-overview-widget > div.vital > div.title_block > div > div.titleBar > div.title_wrapper > h1').text().trim()
    const rating = $("#title-overview-widget > div.vital > div.title_block > div > div.ratings_wrapper > div.imdbRating > div.ratingValue > strong > span").text()

    const releaseDate = $('a[href="/title/tt0109313/releaseinfo?ref_=tt_ov_inf"]').text().trim()

    const movieData = [{
        title,
        rating,
        releaseDate
    },
    {
        title:'Heropanti',
        rating:'1.5',
        releaseDate:'nevermind'
    }]

    const csv = new ObjectToCsv(movieData)


    //writing to file using external method
    csv.toDisk('./test.csv')

    //writing to file using internal module

    fs.writeFileSync('smovie.csv',await csv.toString(),'utf-8')
})()


