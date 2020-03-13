const fs = require('fs');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const periods = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const products = [
    "Product 1",
    "Product 2",
    "Product 3",
    "Product 4",
    "Product 5",
    "Product 6",
    "Product 7",
    "Product 8",
    "Product 9",
    "Product 10",
]
let finalArray = []
function getRandomArbitrary(min = 10000, max = 50000) {
    return Math.random() * (max - min) + min;
}
async function loadJson(path) {
    const rawData = await readFile(path, { encoding: "UTF-8" })
    return JSON.parse(rawData)
}

function parseAsInt(arr) {
    return arr.map((inp) => {
        if (typeof inp == "number") return inp
        return parseInt(inp)
    })
}

var countries = [],cities = [],states = []
async function loadDatas(){
    var parsedCountries = await loadJson('../data/countries.json')
     countries = parsedCountries.map((inp) => (inp.name))
    console.log(countries.length)
    const parsedStates = await loadJson('../data/states.json')
    states = parsedStates.map((inp) => (inp.name))
    console.log(states.length)
    
    const parsedCities = await loadJson('../data/cities.json')
    cities = parsedCities.map((inp) => (inp.name))
    console.log(cities.length)

}

async function readCsv(cols) {
    finalArray = []
    let columns = parseAsInt(cols)

    // const columns = [2, 10, 80, 160, 380]
    const max = Math.max(...columns)


    // let columnRepeater = [0, 0, 0, 0, 0]
    let columnRepeater = Array(columns.length).fill(0)
    let columnIteration = columns.map((column) => (Math.ceil(max / column)))

    for (let i = 0; i < max; i++) {
        columns.forEach((column, index) => {
            // if (i > (columnIteration[index] * columnX[index])) {
            if ((i % columnIteration[index]) === 0 && i != 0) {
                columnRepeater[index] += 1;
                // columnIteration[index] = 0;
                // if (columnIteration[index] == 0) {
                //     columnIteration[index] += 1;
                // }

            }

        })

        // console.log(
        //     i,
        //     {
        //         product: products[columnRepeater[0]],
        //         periods: periods[columnRepeater[1]],
        //         countries: countries[columnRepeater[2]],
        //         states: states[columnRepeater[3]],
        //         // cities: cities[columnRepeater[4]],
        //         value: getRandomArbitrary()
        //     }
        // )
        let data = []
        if (columns.length >= 2) {
            data.push(products[columnRepeater[0]], periods[columnRepeater[1]])
        }
        if (columns.length >= 3) {
            data.push(countries[columnRepeater[2]])
        }
        if (columns.length >= 4) {
            data.push(states[columnRepeater[3]])
        }
        if (columns.length >= 5) {
            data.push(cities[columnRepeater[4]])
        }
        data.push(getRandomArbitrary())




        finalArray.push(data)
        // finalArray.push([
        //     products[columnRepeater[0]],
        //     periods[columnRepeater[1]],
        //     countries[columnRepeater[2]],
        //     states[columnRepeater[3]],
        //     cities[columnRepeater[4]],
        //     getRandomArbitrary()
        // ])
    }
    let headers = []
    if (columns.length >= 2) {
        headers.push("products", "months")
    }
    if (columns.length >= 3) {
        headers.push("country")
    }
    if (columns.length >= 4) {
        headers.push("sub-country")
    }
    if (columns.length >= 5) {
        headers.push("area")
    }
    headers.push("value")
    finalArray.unshift(headers)





    const newcsvData = finalArray.map(row => row.join(",")).join("\n");

    await writeFile('../generatedData/columnRespective.csv', newcsvData)
}
loadDatas()
exports.readCsv1 = readCsv