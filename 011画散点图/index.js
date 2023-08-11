const randomNumList=[]
function createRandomNum(min,max){
    return Math.floor(Math.random()*(max-min)+min)
}
function sqrtFloor(num){
    return Math.floor(Math.sqrt(num))
}
for(let i=0;i<30000;i++){
    let list={};
    list.x=createRandomNum(100,200);
   
    list.y=createRandomNum( 100,200);
    randomNumList.push(list)
}
// // 100,300 r50
for(let i=0;i<30000;i++){
    let list={};
    list.x=createRandomNum(50,150);
    list.y=createRandomNum( (600-sqrtFloor(800*list.x-4*list.x*list.x-30000))/2, (600+sqrtFloor(800*list.x-4*list.x*list.x-30000))/2);
    randomNumList.push(list)
}
for(let i=0;i<40000;i++){
    let list={};
    list.x=createRandomNum(0,375);
    list.y=createRandomNum(0,790);
    randomNumList.push(list)
}
const fs =require("fs")
let content="const randomNumList="+JSON.stringify(randomNumList)
fs.writeFile("./data.js",content,(err)=>{
    if(err){
        console.log(err)
    }
    console.log("----程序执行成功----")
});


