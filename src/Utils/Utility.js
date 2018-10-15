 export const sliceTime = (time) => {
    let temp = new Date(time).toString();
    return temp.slice(0,temp.length - 34);
 }