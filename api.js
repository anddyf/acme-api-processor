    let companies = 'https://acme-users-api-rev.herokuapp.com/api/companies'
    let products = 'https://acme-users-api-rev.herokuapp.com/api/products'
    let offerings = 'https://acme-users-api-rev.herokuapp.com/api/offerings'

    //-------------------------------------------------------------------------
    // Price Range of product
    
    const findProductInPriceRange = (url , obj) => new Promise((res, rej) => {
      // can change url to /api/products, /api/offerings for the other ones
     
    window.fetch(url)
      .then(response => response.json())
      .then( data => {
        console.log('findProductInPriceRange')
        const html =  data.filter(priceHTML => {
          if(obj.min < priceHTML.suggestedPrice && obj.max > priceHTML.suggestedPrice){
            `${console.log(priceHTML.name)}`
          }
        }).join('')
      })
      .catch(e => rej(e));
    })

    let ProductInPriceRange = () => findProductInPriceRange(products , {min: 1, max: 15})
    ProductInPriceRange()

    //-------------------------------------------------------------------------
    //Key Company Letter and Array of those companies 

    const groupCompaniesByLetter = (company) => new Promise((res, rej) => {
    // can change url to /api/products, /api/offerings for the other ones
    let array = []
    window.fetch(company)
              .then(response => response.json())
              .then( data => {
                console.log('groupCompaniesByLetter')
                let companyLetterValue = ''
                let companyArray = ''
                const html =  data.map( companyName => { 
                  companyLetterValue = companyName.name[0] + ': ' 
                  companyArray = companyName
                  return `${console.log(companyLetterValue, companyArray)}`
                })
              })
              .catch(e => rej(e));

    })

    let groupedCompaniesByLetter = () => groupCompaniesByLetter(companies)
    groupedCompaniesByLetter()

    //------------------------------------------------------------------------------
    // Key State and Array of those companies 
    const groupCompaniesByState = (company) => new Promise((res, rej) => {
    // can change url to /api/products, /api/offerings for the other ones

    window.fetch(company)
      .then(response => response.json())
      .then( data => {
        console.log('groupCompaniesByState')
        let companyLetterValue = ''
        let companyArray = ''
        const html =  data.filter( companyName => { 
          companyLetterValue = companyName.state + ': ' 
          companyArray = companyName
            return `${console.log(companyLetterValue, companyArray)}`
        })
    })
    .catch(e => rej(e));

    })
   
    let groupedCompaniesByState = () => groupCompaniesByState(companies)
    groupedCompaniesByState()

    //-------------------------------------------------------------------------
    //Processed offering
    const processOffering = (offer,product,company) => new Promise( (res, rej) => {
      Promise.all([fetch(offer),fetch(product), fetch(company)])
      .then( response => response.map( responses => responses.json()))
      .then( data => {
        let offers = data[0]
        let offerProducts = data[1]
        let offerCompanies = data[2]
        let obj = {}
          
        console.log('processOffering')

        return offers.then(offering => offering.filter( offerElement => {
          
            if(!obj[offerElement.id]){
              obj[offerElement.id]= offerElement
              obj[offerElement.id]                
          }
          offerProducts.then(productOffer => productOffer.filter( productElement  => {
            if(obj[offerElement.id].productId.includes(productElement.id)){
              obj[offerElement.id].product =  productElement
              obj[offerElement.id]
            }
          }))
          offerCompanies.then(companyOffer => companyOffer.filter( companyElement  => {
            if(obj[offerElement.id].companyId.includes(companyElement.id)){
              obj[offerElement.id].company = companyElement
              console.log({offer: obj[offerElement.id] , company: obj[offerElement.id].company , product: obj[offerElement.id].product} )
            }
          }))
        }))
                
        })
        .catch(e => rej(e))
    })
    
    let processedOffering = () => processOffering(offerings,products,companies)
    processedOffering()

    //-------------------------------------------------------------------------
    //companiesByNumbersOfOffering

    const companiesByNumbersOfOffering = (company,offer,range) => new Promise( (res, rej) => {
      Promise.all([fetch(company),fetch(offer)])
      .then( response => response.map( responses => responses.json()))
      .then( data => {
        console.log('threeOrMoreOfferings')
        let companyRange = data[0]
        let offersRange = data[1]
        let obj = {}
        let countObj = {}

        return offersRange.then( offersData => {
          offersData.filter( offersElement => {
            let count = 1 
            if(!obj[offersElement.companyId]){
              obj[offersElement.companyId] = count
            }
            else if(obj[offersElement.companyId]){
              obj[offersElement.companyId]++
            }
            if(obj[offersElement.companyId] >= range){
              countObj[offersElement.companyId] = offersElement.companyId
            }
            companyRange.then( companyData => {
              companyData.filter( companyElement => {
                if(companyElement.id.includes(countObj[offersElement.companyId])){
                  console.log(companyElement.name)
                }
              }) 
            })
          })
        })

      })
      .catch(e => rej(e))
    })

    let threeOrMoreOfferings = () => companiesByNumbersOfOffering(companies, offerings, 3)
    threeOrMoreOfferings()

    //-------------------------------------------------------------------------
    //ProcessedProduct

    const processProduct = (product,offer) => new Promise( (res, rej) => {
      Promise.all([fetch(product),fetch(offer)])
      .then( response => response.map( responses => responses.json()))
      .then( data => {
        console.log('ProcessedProduct')
        let productRange = data[0]
        let offersRange = data[1]

      
        return offersRange.then( offerData => {
           offerData.reduce((accum, productid) => {
            if(!productid.productId in accum) {
                accum[productid.productId['total']] = productid.price
                accum[productid.productId['counter']] = 1;
            } else {
                accum[productid.productId['total']] += productid.price;
                accum[productid.productId['counter']]++;
            }
            return accum
        }, {})

            Object.entries(productid.productId).map(productData => {
                console.log({ product: products.find(id === productData.productId), averagePrice: (productData.productId.total / productData.productId.count)})
            })
        })
      })
      .catch(e => rej(e))
    })

    let processedProduct = () => processProduct(products, offerings)
    processedProduct()