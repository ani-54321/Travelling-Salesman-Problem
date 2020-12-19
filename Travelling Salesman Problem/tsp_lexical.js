// Here we will store the random points generated by the function
// Conditional flags for different algos
var draw_points = false;
var show = false;
var firstShow = false;
var finished = false;

var cities = [];
var totalCities = 0;
// var counter = 0;

const popSize = 500;
const fitness = [];
var choice;
var geneticRecorDistance = Infinity;

let population = [];
// var oldBestEver = [];
let currentBest;

// Here we store the lexicographic order (Permutations or genetic)
var order = [];

var totalPermutations;
var count = 0;

// Keep track of the best permutation in which distance is minimal
var recordDistance;
// Stores best permutation array
var bestEver;

// let statusP;


function pointGenerator() {
    totalCities = document.getElementById("num").value;
    choice = document.getElementById("algo").value;
    draw_points = true;
    population = [];
    // oldBestEver = [];
    finished = false;
    geneticRecorDistance = Infinity;
    // console.log(totalCities);
    show = false;
    setup();
    loop();
}

function solve() {
    show = true;
    finished = false;
    totalCities = document.getElementById("num").value;
    choice = document.getElementById("algo").value;
    geneticRecorDistance = Infinity;
    firstShow = true;
    // oldBestEver = [];
    cumulative_sum = 0;
    stoppingDecimal = 0;
    // console.log(cities);
    setup();
    loop();
}


function setup() {
    if (choice === "permutation" &&  !finished) {
        var head = document.getElementById("head");
        head.innerText = "Permutation Approach";
        head.style.display = "block";
        
        // Creating a canvas on which visualization will take place
        // console.log("working");

        if (draw_points && !firstShow) {
            createCanvas(window.innerWidth, window.innerHeight);
    
            // console.log("setup : ", totalCities);
    
            cities = [];
            order = [];
    
            // Generating random city points
            for (var i = 0; i < totalCities; i++) {
                var v = createVector(random(window.innerWidth-100), random(window.innerHeight / 10, window.innerHeight/2));
                cities[i] = v;
                order[i] = i;
            }
    
            // console.log(cities);
    
            // console.log("setup2 : ", totalCities);
    
        }
        
        if (show) {
            // calculating distance between cities in the lexical order generated and storing if it is best
            var d = calcDistance(cities, order);
            recordDistance = d;
            bestEver = order.slice();

            totalPermutations = factorial(totalCities);

            // console.log("Total Premutations : ", totalPermutations);
            // console.log("Best Distance Ever : ", recordDistance);
            // console.log(cities);
        }
    }
    if(choice==="genetic"  &&  !finished) {
        //order = [];

        var head = document.getElementById("head");
        head.innerText = "Genetic Approach";
        head.style.display = "block";

        if (draw_points && !firstShow) {
            createCanvas(window.innerWidth, window.innerHeight);
    
            // console.log("setup : ", totalCities);
    
            cities = [];
            order = [];
    
            // Generating random city points
            for (var i = 0; i < totalCities; i++) {
                var v = createVector(random(window.innerWidth-100), random(window.innerHeight / 10, window.innerHeight / 2));
                cities[i] = v;
                order[i] = i;
            }
    
            //console.log(cities);
    
            // console.log("setup2 : ", totalCities);

            for (let i = 0; i < popSize; i++) {
                population[i] = shuffle(order);
            }
            //statusP = createP('').style('font-size', '32pt');
    
        }
        
    }
}


function draw() {
    if (choice === "permutation" &&  !finished) {
        background(255);
        //frameRate(5);
        fill(0);

        if (draw_points) {
            for (var i = 0; i < cities.length; i++) {
                ellipse(cities[i].x, cities[i].y, 10, 10);
            }
        }

        if (show) {
            stroke(0, 128, 128);
            strokeWeight(4);
            noFill();
            beginShape();

            var first = cities[bestEver[0]];

            for (var i = 0; i < order.length; i++) {
                var n = bestEver[i];
                vertex(cities[n].x, cities[n].y);
            }

            var last = cities[bestEver[i-1]];

            vertex(first.x, first.y);
            vertex(last.x, last.y);

            endShape();

            translate(0, height / 2);
            stroke(0);
            strokeWeight(2);
            noFill();
            beginShape();

            first = cities[order[0]];

            for (var i = 0; i < order.length; i++) {
                var n = order[i];
                vertex(cities[n].x, cities[n].y);
                ellipse(cities[n].x, cities[n].y, 5, 5);
            }

            last = cities[order[i-1]];

            vertex(first.x, first.y);
            vertex(last.x, last.y);

            endShape();

            var d = calcDistance(cities, order);
            if (d < recordDistance) {
                recordDistance = d;
                console.log("Best Distance Ever : ", recordDistance);
                bestEver = order.slice();
            }

            // console.log(order.length);
            firstShow = false;


            // textSize(32);
            // fill(0);
            // var percent = 100 * (count / totalPermutations);
            // text(nf(percent, 2, 2) + "% completed", 15, height / 2 - 50);

            // Generates next lexical order
            nextOrder();
        }
    }
    else if(choice==="genetic" && !finished){
        // GA
        // counter++;
        if(population.length == 0)
        {
            for (let i = 0; i < popSize; i++) {
                population[i] = shuffle(order);
            }
        }

        background(255);
        fill(0);
        if (draw_points) {
            for (var i = 0; i < cities.length; i++) {
                ellipse(cities[i].x, cities[i].y, 10, 10);
            }
        }
        if(show && draw_points) {
            
            calculateFitness();
            normalizeFitness();
            // console.log(" ft1 :", ft1,"fitness:", fitness);
            nextGeneration();

            console.log("pop : ", population.length, "cities: ", cities.length, "best: ", bestEver.length, "current : ", currentBest.length);

            stroke(0, 128, 128);
            strokeWeight(4);
            noFill();
            beginShape();

            // console.log("best : ", bestEver.length, "pop : ", population[0]);
            var first = cities[bestEver[0]];

            for (let i = 0; i < bestEver.length; i++) {
                const n = bestEver[i];
                vertex(cities[n].x, cities[n].y);
            }
            var last = cities[bestEver[i-1]];

            vertex(first.x, first.y);
            vertex(last.x, last.y);

            endShape();

            // console.log("counter: ", counter);
            // console.log("bestEver: ", bestEver);

            translate(0, height / 2);
            stroke(0);
            strokeWeight(2);
            noFill();
            beginShape();

            first = cities[currentBest[0]];

            for (let i = 0; i < currentBest.length; i++) {
                const n = currentBest[i];
                vertex(cities[n].x, cities[n].y);
                ellipse(cities[n].x, cities[n].y, 5, 5);
            }

            last = cities[currentBest[i-1]];

            vertex(first.x, first.y);
            vertex(last.x, last.y);

            endShape();
        }
        firstShow = false;
    }
    else{
        console.log("End");
        noLoop();
    }
}


function swap(a, i, j) {
    var temp = a[i];
    a[i] = a[j];
    a[j] = temp;
}

// calculating distance between cities in the lexical order generated
function calcDistance(points, order) {
    var sum = 0;
    for (var i = 0; i < order.length - 1; i++) {
        var cityAIndex = order[i];
        var cityA = points[cityAIndex];
        var cityBIndex = order[i + 1];
        var cityB = points[cityBIndex];
        var d = dist(cityA.x, cityA.y, cityB.x, cityB.y);
        sum += d;
    }
    var cityAIndex = order[0];
    var cityA = points[cityAIndex];
    var cityBIndex = order[i];
    var cityB = points[cityBIndex];
    d = dist(cityA.x, cityA.y, cityB.x, cityB.y);
    sum += d;
    return sum;
}

// This is my lexical order algorithm
function nextOrder() {
    // Counter incrementation for keeping track of progress.
    count++;

    // STEP 1 of the algorithm
    var largestI = -1;
    for (var i = 0; i < order.length - 1; i++) {
        if (order[i] < order[i + 1]) {
            largestI = i;
        }
    }
    if (largestI == -1) {
        finished = true;
        noLoop();
        console.log('finished');
    }

    // STEP 2
    var largestJ = -1;
    for (var j = 0; j < order.length; j++) {
        if (order[largestI] < order[j]) {
            largestJ = j;
        }
    }

    // STEP 3
    swap(order, largestI, largestJ);

    // STEP 4: reverse from largestI + 1 to the end
    var endArray = order.splice(largestI + 1);
    endArray.reverse();
    order = order.concat(endArray);
    console.log("order:",order,"endArray :", endArray);
}

// Factorial Calculation
function factorial(n) {
    if (n == 1) {
        return 1;
    } else {
        return n * factorial(n - 1);
    }
}
