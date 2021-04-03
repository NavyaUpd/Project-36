var dog, sadDog, happyDog, database;
var foodS, foodStock;
var addFood;
var foodObj;
var feedTheDog;
//create feed and lastFed variable here
var feed, lastFed, lastFed24, lastFedRef;

function preload(){
  sadDog=loadImage("Dog.png");
  happyDog=loadImage("happy dog.png");
}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value", readStock);
  
  dog = createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale = 0.15;

  //create feed the dog button here
  feedTheDog = createButton("Feed Dog");
  feedTheDog.position(700,95);
  feedTheDog.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

}

function draw() {
  background(46,139,87);
  foodObj.display();

  //write code to read fedtime value from the database 
  lastFedRef = database.ref('feedTime');
  lastFedRef.on("value", readLastFed);
 
  //write code to display text lastFed time here
  textSize(20);
  fill("white");
  if(lastFed24 < 12){
    lastFed = lastFed24 + " AM";
  }else if(lastFed24 > 12){
    lastFed = lastFed24 - 12 + " PM";
  }else if(lastFed24 === 12){
    lastFed = lastFed24 + " PM";
  }
  if(lastFed !== undefined){
    text("Last Fed: " + lastFed, 100, 100);
  }
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}


function feedDog(){
  if(foodS > 0){
    dog.addImage(happyDog);

    //write code here to update food stock and last fed time
    foodS -= 1;
    database.ref('/').update({
      Food:foodS
    })
    var d = new Date(); 
    lastFed24 = d.getHours();
    console.log(lastFed24);
    database.ref('/').update({
    feedTime:lastFed24
  })
    
  }
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function readLastFed(data){
  lastFed24 = data.val();
  foodObj.getFedTime(lastFed);
}
