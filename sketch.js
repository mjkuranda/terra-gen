const MAP_WIDTH     =   512;
const MAP_HEIGHT    =   128;

const PIXEL_DENSITY =   1;
const BG_THEME      =   90;


const L_SEA         =   0.502; //0.5025;
const L_BEACH       =   0.5035;

const L_HILLS       =   0.50125;//0.4975;
const L_MOUNTAIN    =   0.51//0.5075;


const INTERPOLATION =   128;


var map,
    mapSurface, // mountain, hills
    mapResources, // forests, ores
    mapAnimals, // animals
    mapImg; // FINAL


const T_TERRAIN      =   'TERRAIN';
const T_SURFACE      =   'SURFACE';
const T_RESOURCES    =   'RESOURCES';
const T_ANIMALS      =   'ANIMALS';

const T_FINAL        =   'FINAL';
var T_CURRENT        =    T_FINAL;


const TILES         =    [ 'sea', 'beach', 'plains', 'hills', 'mountain' ];



function setup() {
    createCanvas(MAP_WIDTH, MAP_HEIGHT);
    pixelDensity(PIXEL_DENSITY);

    mapImg = mapInit();

    map = mapInit();
    mapSurface = mapInit();


    generate();
}

function draw() {
    background(BG_THEME);

    loadPixels();

    for (y = 0; y < height; y++) {
        for (x = 0; x < width; x++) {
            let i = (x + y * width) * 4;

            switch (T_CURRENT) {
                case T_TERRAIN:
                    if (map[x][y] <= L_SEA) {
                        pixels[i]   =   0;
                        pixels[i+1] =   0;
                        pixels[i+2] =   127;
                        pixels[i+3] =   255;    // alpha
                    }
                    else if (map[x][y] <= L_BEACH) {
                        pixels[i]   =   223;
                        pixels[i+1] =   193;
                        pixels[i+2] =   63;
                        pixels[i+3] =   255;    // alpha
                    }
                    else {
                        pixels[i]   =   0;
                        pixels[i+1] =   127;
                        pixels[i+2] =   0;
                        pixels[i+3] =   255;    // alpha
                    }
                break;

                case T_SURFACE:
                    if (mapSurface[x][y] == 4) {
                        pixels[i]   =   127;
                        pixels[i+1] =   127;
                        pixels[i+2] =   127;
                        pixels[i+3] =   255;    // alpha
                    }
                    else if (mapSurface[x][y] == 10) { // river
                        pixels[i]   =   0;
                        pixels[i+1] =   0;
                        pixels[i+2] =   223;
                        pixels[i+3] =   255;
                    }
                    else { // Plains...
                        pixels[i]   =   0;
                        pixels[i+1] =   127;
                        pixels[i+2] =   0;
                        pixels[i+3] =   255;    // alpha
                    }
                break;

                case T_RESOURCES:
                break;

                case T_ANIMALS:
                break;

                case T_FINAL:
                    switch(mapImg[x][y]) {
                        case 0: // sea
                            pixels[i]   =   0;
                            pixels[i+1] =   0;
                            pixels[i+2] =   127;
                            pixels[i+3] =   255;
                        break;
                        
                        case 1: // beach
                            pixels[i]   =   223;
                            pixels[i+1] =   193;
                            pixels[i+2] =   63;
                            pixels[i+3] =   255;
                        break;

                        case 2: // plains
                            pixels[i]   =   0;
                            pixels[i+1] =   127;
                            pixels[i+2] =   0;
                            pixels[i+3] =   255;
                        break;

                        case 3: // forest
                            pixels[i]   =   0;
                            pixels[i+1] =   63;
                            pixels[i+2] =   0;
                            pixels[i+3] =   255;
                        break;

                        case 4: // mountain
                            pixels[i]   =   127;
                            pixels[i+1] =   127;
                            pixels[i+2] =   127;
                            pixels[i+3] =   255;
                        break;

                        case 5: // river
                            pixels[i]   =   0;
                            pixels[i+1] =   0;
                            pixels[i+2] =   223;
                            pixels[i+3] =   255;
                        break;
                    }
                break;
            }
        }
    }

    updatePixels();
}








function mapInit() {
    let map = new Array(MAP_WIDTH);

    for (i = 0; i < MAP_WIDTH; i++) {
        map[i] = new Array(MAP_HEIGHT);
    }

    return map;
}

// Generate new map
function generate() {
    console.log("Generating new terrain...");

    // Each element
    for (x = 0; x < MAP_WIDTH; x++) {
        for (y = 0; y < MAP_HEIGHT; y++) {
            map[x][y] = Math.random();
        }
    }
    

    console.log("Generating surface...");

    // Each element
    for (x = 0; x < MAP_WIDTH; x++) {
        for (y = 0; y < MAP_HEIGHT; y++) {
            mapSurface[x][y] = Math.random();
        }
    }



    for (i = 0; i < INTERPOLATION; i++) { interpolateAll(); }




    for (x = 0; x < MAP_WIDTH; x++) {
        for (y = 0; y < MAP_HEIGHT; y++) {
            if (map[x][y] <= L_SEA) mapImg[x][y] = 0; // sea
            else {
                // if (mapSurface[x][y] >= L_HILLS && mapSurface[x][y] < L_MOUNTAIN) mapImg[x][y] = 3; // hills
                // else if (mapSurface[x][y] >= L_MOUNTAIN) mapImg[x][y] = 4; // mountain
                if (Math.random() >= 0.825) {
                    if (map[x][y] <= L_BEACH) mapImg[x][y] = 1; // beach
                    else {
                        mapImg[x][y] = 3;
                        if (x > 0               && map[x-1][y] > L_BEACH) mapImg[x-1][y] = 3;
                        if (x < MAP_WIDTH - 1   && map[x+1][y] > L_BEACH) mapImg[x+1][y] = 3;
                        if (y > 0               && map[x][y-1] > L_BEACH) mapImg[x][y-1] = 3;
                        if (y < MAP_HEIGHT - 1  && map[x][y+1] > L_BEACH) mapImg[x][y+1] = 3;

                    } 
                }
                else if (map[x][y] <= L_BEACH) mapImg[x][y] = 1; // beach
                else mapImg[x][y] = 2; // plains
            }
        }
    }

    generateMountain();
    // generateRivers();

    if (document.getElementById('rivers').checked) generateRivers();
}

function generateRivers() {
    let max = 0; // maximal value
    let tim = 0; // times

    for (x = 0; x < MAP_WIDTH; x++) {
        for (y = 0; y < MAP_HEIGHT; y++) {
            if (mapImg[x][y] == 4) {
                if (map[x][y].toFixed(2) > max.toFixed(2)) {
                    max = map[x][y];
                    tim = 1;
                }
                else if (map[x][y].toFixed(2) == max.toFixed(2)) tim++;
            }
        }
    }


    // console.log("Max:", max, ", times:", tim, "where is the heighest place on the map");

    for (x = 0; x < MAP_WIDTH; x++) {
        for (y = 0; y < MAP_HEIGHT; y++) {
            if (map[x][y].toFixed(1) == max.toFixed(1) && mapImg[x][y] == 4 && rand(0, 99) == 0) {
                mapSurface[x][y] = 10;
                mapImg[x][y] = 5;
                console.log("River");

                generateRiver(x, y);
            }
        }
    }
}

function interpolate(m, x, y) {
    let sum = m[x][y];
    let tim = 1;

    if (x > 0) { sum += m[x - 1][y]; tim++; }
    if (y > 0) { sum += m[x][y - 1]; tim++; }
    if (x < MAP_WIDTH - 1) { sum += m[x + 1][y]; tim++; }
    if (y < MAP_HEIGHT - 1) { sum += m[x][y + 1]; tim++; }

    return (sum / tim);
}

// Interpolate all
function interpolateAll() {
    console.log("Interpolating terrain...");

    // Each element
    for (x = 0; x < MAP_WIDTH; x++) {
        for (y = 0; y < MAP_HEIGHT; y++) {
            map[x][y] = interpolate(map, x, y);
        }
    }
}

function setTheme(theme) {
    T_CURRENT = theme;
}

function rand(min, max) {
    return Math.floor(Math.random() * max) + min;
}




// function generateMountain2() {
//     let length = 64; // range of mountain

//     for (i = 0; i < 10; i++) {
//         let x = rand(1, MAP_WIDTH-1);
//         let y = rand(1, MAP_HEIGHT-1);

//         let dx = (Math.random() >= 0.5) ? ((x < MAP_WIDTH/2) ? -1 : 1) : 0;
//         let dy = (Math.random() >= 0.5) ? ((y < MAP_HEIGHT/2) ? -1 : 1) : 0;

//         let tx = 0;
//         let ty = 0;
//         if (Math.random() >= 0.5) tx++; else ty++;

//         if (dx == 0 && dy == 0) { dx = 1; }

//         for (l = 0; l < length; l++) {
//             mapSurface[x][y] = 4;

//             if (x > 0) mapSurface[x-1][y] = 4;
//             if (x < MAP_WIDTH - 1) mapSurface[x+1][y] = 4;
//             if (y > 0) mapSurface[x][y-1] = 4;
//             if (y < MAP_HEIGHT - 1) mapSurface[x][y+1] = 4;

//             dx += tx;
//             dy += ty;

//             x += dx;
//             y += dy;

//             if (x < 0 || y < 0 || x >= MAP_WIDTH || y >= MAP_HEIGHT) break;
//         }
//     }
// }

function generateMountain() {
    let count = 2048;

    for (c = 0; c < count; c++) {
        let x = rand(1, MAP_WIDTH-1);
        let y = rand(1, MAP_HEIGHT-1);

        // Inside map - without borders
        if (x > 0 && y > 0 && x < MAP_WIDTH-1 && y < MAP_HEIGHT-1) {
            if (map[x][y] > L_BEACH) mapImg[x][y] = 4;
            if (map[x-1][y] > L_BEACH) mapImg[x-1][y] = 4;
            if (map[x+1][y] > L_BEACH) mapImg[x+1][y] = 4;
            if (map[x][y-1] > L_BEACH) mapImg[x][y-1] = 4;
            if (map[x][y+1] > L_BEACH) mapImg[x][y+1] = 4;
        }
    }
}

// function generateRivers2() {
//     let count = 32;

//     for (c = 0; c < count; c++) {
//         let x = rand(1, MAP_WIDTH-1);
//         let y = rand(1, MAP_HEIGHT-1);

//         let xdir = 0;
//         let ydir = 0;
//         let elev = 1.0; // elevation

//         for (l = 0; l < 512; l++) {
//             // while (mapImg[x][y] != 4) {
//             //     x = rand(1, MAP_WIDTH-1);
//             //     y = rand(1, MAP_HEIGHT-1);
//             // }
//             if (map[x][y] <= L_SEA) break;

//             mapSurface[x][y] = 10;
//             mapImg[x][y] = 5;

//             if (x > 0 && map[x-1][y] < elev) { elev = map[x-1][y]; xdir = -1; ydir = 0; }
//             if (y > 0 && map[x][y-1] < elev) { elev = map[x][y-1]; xdir = 0; ydir = -1; }
//             if (x < MAP_WIDTH-1 && map[x+1][y] < elev) { elev = map[x+1][y]; xdir = +1; ydir = 0; }
//             if (x < MAP_HEIGHT-1 && map[x][y+1] < elev) { elev = map[x][y+1]; xdir = 0; ydir = +1; }

//             x += xdir;
//             y += ydir;
//         }
//     }
// }

function generateRiver(rx, ry) {
    let xdir = 0;
    let ydir = 0;
    let elev = map[rx][ry]; // elevation

    let x = rx;
    let y = ry;

    do {
        xdir = 0;
        ydir = 0;

        mapSurface[x][y] = 10;
        mapImg[x][y] = 5;

        if (x > 0 && map[x-1][y] < elev) { elev = map[x-1][y]; xdir = -1; ydir = 0; }
        if (y > 0 && map[x][y-1] < elev) { elev = map[x][y-1]; xdir = 0; ydir = -1; }
        if (x < MAP_WIDTH-1 && map[x+1][y] < elev) { elev = map[x+1][y]; xdir = +1; ydir = 0; }
        if (x < MAP_HEIGHT-1 && map[x][y+1] < elev) { elev = map[x][y+1]; xdir = 0; ydir = +1; }
        
        console.log('xxxxxxx', xdir, ydir);
        
        x += xdir;
        y += ydir;

        if (x+xdir < 0 || y+ydir < 0 || x+xdir >= MAP_WIDTH-1 || y+ydir >= MAP_HEIGHT-1) break;
    } while ((xdir != 0 || ydir != 0) && map[x+xdir][y+ydir] > L_SEA);

    if (x+xdir > 0 && y+ydir > 0 && x+xdir < MAP_WIDTH-1 && y+ydir < MAP_HEIGHT-1) {
        // Make a place, where water can accumulate above the sea
        if (map[x+xdir][y+ydir] > L_SEA) {
            mapImg[x+xdir][y+ydir] = 0;
        }
        mapImg[x+xdir-1][y+ydir] = 0;
        mapImg[x+xdir+1][y+ydir] = 0;
        mapImg[x+xdir][y+ydir-1] = 0;
        mapImg[x+xdir][y+ydir+1] = 0;
    }
}