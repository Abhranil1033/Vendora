class apiFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    search() {
        const keyword = this.queryStr.keyword
            ? {
                //searches the name only...not price, not description, not rating (as entered in the database). only the NAME.
                name: {
                    //these are mongodb operators
                    $regex: this.queryStr.keyword, //this is basically used to search whether the pattern is present in our database or not
                    $options: "i", //makes our search case insensitive
                },
            }
            : {};

            // console.log(keyword);
        this.query = this.query.find({ ...keyword });
        return this;
    }


    filter(){
        const queryCopy = {...this.queryStr} // queryStr is an object and objects in javascript are passed by reference. So,any change in queryCopy will lead to change in queryStr. So, spread operator is used (...) to pass the actual copy

        //Removing fields for category
        const removeFields = ["keyword","page","limit"];

        removeFields.forEach(key=>delete queryCopy[key]);

        //Filter for price and rating
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g,(key)=> `$${key}`);

        this.query = this.query.find(JSON.parse(queryStr));
        return this;
    }

    pagination(productsInAPage){
        const currPage = Number(this.queryStr.page) || 1;

        const skipProducts = productsInAPage * (currPage - 1); //in page 1,we have to skip 0 products => currPage = 1 .Therefore, currPage-1 gives 0 which results in 0 products being skipped.

        this.query = this.query.limit(productsInAPage).skip(skipProducts);
        return this;
    }

}


module.exports = apiFeatures;