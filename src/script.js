const setFiftyFifty = (arr, str) => {
    const theCorrectAnswerIndex = arr.indexOf(str);
    const theArray = [];

    while (theArray.length < 2) {
      let randomNum = Math.floor(Math.random() * 4);
      if (randomNum !== theCorrectAnswerIndex) {
        theArray.push(randomNum);
      }
      if (theArray[0] === theArray[1]) {
        console.log("duplicate");
        theArray.pop();
      }
    }
    const new1 = theArray[0];
    const new2 = theArray[1];

    arr[new1] = "";
    arr[new2] = "";
    return arr;
  }


  export { setFiftyFifty }