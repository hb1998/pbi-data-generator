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

function getRandomArbitrary(min=10000, max=50000) {
    return Math.random() * (max - min) + min;
}

async function readCsv(neededRows) {
    console.log(neededRows)
    neededRows = parseInt(neededRows)
    // const data = await readFile('world-cities_csv.csv', { encoding: "UTF-8" });
    // const transformedData = data.split('\r\n').map(row => row.split(","))
    // console.log(transformedData.length)

    // const newData = transformedData.reduce((acc, row) => {
    //     products.forEach(p => {
    //         periods.forEach(per => {
    //             const [name, country, subcountry] = row;
    //             const newRow = [country, subcountry, name];
    //             newRow.push(p);
    //             newRow.push(per);
    //             newRow.push(getRandomArbitrary(10000, 50000));

    //             acc.push(newRow);
    //         });
    //     });
    //     return acc;
    // }, [["Country", "Sub-Country", "Area", "Product", "Period", "Sales"]]);



    const data = await readFile('../data/world-cities-products.csv', { encoding: "UTF-8" });
    console.log
    const transformedData = data.split('\r\n').map(row => row.split(","))


    const frequency = (neededRows) / transformedData.length;
    let repeater = 1;
    let length;
    let repeatTimes = 1;
    let finalArray = []


    if (frequency < 1) {

        
        console.log('delete ' + (1 / frequency) + ' rows for each row ')
        repeater = parseInt(1 / frequency)
        length = transformedData.length;

        let monthsRepeater = Math.floor((transformedData.length / repeater) / 12)
        let productsRepeater = Math.floor((transformedData.length / repeater) / 10)
        console.log("monthsRepeater",monthsRepeater)
        console.log("productsRepeater",productsRepeater)

        let monthIteration  = 0,productIteration = 0

        for (let i = 0; i < length; i += repeater) {
            let product = products[productIteration]
            let month = periods[monthIteration]
            if(i >= monthsRepeater){
                monthIteration += 1
            }
            if(i >= productsRepeater){
                productIteration += 1;

            }

            finalArray.push([product,month,...transformedData[i],getRandomArbitrary()])
        }
    } 
    
    
    
    
    else {
        console.log('repeat ' + frequency + ' times')
        length = (neededRows) * parseInt(frequency)
        repeatTimes = parseInt(frequency)
        products.length = repeatTimes;
        
        let monthsRepeater = (repeatTimes * transformedData.length) / 12
        let monthIteration  = 0
        let count  = 1
        console.log(monthsRepeater)
        products.forEach((product) => {
            let month = periods[monthIteration]
            transformedData.forEach((transformedData) => {
                finalArray.push([product,month, ...transformedData,getRandomArbitrary(10000, 50000)])
                count +=1
                if(count >= monthsRepeater){
                    count = 1;
                    monthIteration +=1
                }
            })

        })
    }
    finalArray.unshift(['product', 'months', 'country', 'sub country', 'area', 'value'])
    console.log(finalArray.length)






    // console.log(newData.length);
    // console.log(newData[1])
    const newcsvData = finalArray.map(row => row.join(",")).join("\n");

    await writeFile('../generatedData/rowRespective.csv', newcsvData)
}
exports.readCsv = readCsv
// readCsv();