const MAP_WIDTH     =   512;
const MAP_HEIGHT    =   128;

const PIXEL_DENSITY =   1;
const BG_THEME      =   90;


const L_SEA         =   0.502;      //0.5025;
const L_BEACH       =   0.5035;

const L_HILLS       =   0.50125;    //0.4975;
const L_MOUNTAIN    =   0.51;       //0.5075;


const INTERPOLATION =   128;


var map,            // random-valued map (0, 1)
    mapResources,   // ores, oil and gas
    mapAnimals,     // animals
    mapImg;         // FINAL


const T_TERRAIN     =   'TERRAIN';
const T_SURFACE     =   'SURFACE';
const T_RESOURCES   =   'RESOURCES';
const T_ANIMALS     =   'ANIMALS';

const T_FINAL       =   'FINAL';
var T_CURRENT       =    T_FINAL;


const TILE_SEA      =   0;
const TILE_BEACH    =   1;
const TILE_PLAINS   =   2;
const TILE_FOREST   =   3;
const TILE_MOUNTAIN =   4;
const TILE_RIVER    =   5;


const RES_COAL      =   0;  //  22%     63  63  63
const RES_IRON      =   1;  //  13%     127 127 127
const RES_COPPER    =   2;  //  13%     184 115 51
const RES_TIN       =   3;  //  10%     159 159 159
const RES_ALUMINIUM =   4;  //  15%     191 191 191
const RES_SILVER    =   5;  //  12%     211 211 211
const RES_GOLD      =   6;  //  10%     211 175 55
const RES_URANIUM   =   7;  //  5%      47  248 31

const RES_OIL       =   8;  //  0.0075% 15  15  15
const RES_GAS       =   9;  //  0.0075% 239 239 239  



function setup() {
    createCanvas(MAP_WIDTH, MAP_HEIGHT);
    pixelDensity(PIXEL_DENSITY);

    mapImg = mapInit();

    map = mapInit();
    mapResources = mapInit();
    mapAnimals = mapInit();

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
                    if (mapImg[x][y] == TILE_RIVER) { // river
                        pixels[i]   =   0;
                        pixels[i+1] =   0;
                        pixels[i+2] =   223;
                        pixels[i+3] =   255;
                    }
                    else if (mapImg[x][y] == TILE_MOUNTAIN) {
                        pixels[i]   =   127;
                        pixels[i+1] =   127;
                        pixels[i+2] =   127;
                        pixels[i+3] =   255;
                    }
                    else if (mapImg[x][y] == TILE_FOREST) {
                        pixels[i]   =   0;
                        pixels[i+1] =   63;
                        pixels[i+2] =   0;
                        pixels[i+3] =   255;
                    }
                break;

                case T_RESOURCES:
                    if (mapResources[x][y] == RES_COAL) {
                        pixels[i]   =   63;
                        pixels[i+1] =   63;
                        pixels[i+2] =   63;
                        pixels[i+3] =   255;
                    }
                    else if (mapResources[x][y] == RES_IRON) {
                        pixels[i]   =   127;
                        pixels[i+1] =   127;
                        pixels[i+2] =   127;
                        pixels[i+3] =   255;
                    }
                    else if (mapResources[x][y] == RES_COPPER) {
                        pixels[i]   =   184;
                        pixels[i+1] =   115;
                        pixels[i+2] =   51;
                        pixels[i+3] =   255;
                    }
                    else if (mapResources[x][y] == RES_TIN) {
                        pixels[i]   =   159;
                        pixels[i+1] =   159;
                        pixels[i+2] =   159;
                        pixels[i+3] =   255;
                    }
                    else if (mapResources[x][y] == RES_ALUMINIUM) {
                        pixels[i]   =   191;
                        pixels[i+1] =   191;
                        pixels[i+2] =   191;
                        pixels[i+3] =   255;
                    }
                    else if (mapResources[x][y] == RES_SILVER) {
                        pixels[i]   =   211;
                        pixels[i+1] =   211;
                        pixels[i+2] =   211;
                        pixels[i+3] =   255;
                    }
                    else if (mapResources[x][y] == RES_GOLD) {
                        pixels[i]   =   211;
                        pixels[i+1] =   175;
                        pixels[i+2] =   55;
                        pixels[i+3] =   255;
                    }
                    else if (mapResources[x][y] == RES_URANIUM) {
                        pixels[i]   =   47;
                        pixels[i+1] =   248;
                        pixels[i+2] =   31;
                        pixels[i+3] =   255;
                    }

                    else if (mapResources[x][y] == RES_OIL) {
                        pixels[i]   =   15;
                        pixels[i+1] =   15;
                        pixels[i+2] =   15;
                        pixels[i+3] =   255;
                    }
                    else if (mapResources[x][y] == RES_GAS) {
                        pixels[i]   =   239;
                        pixels[i+1] =   239;
                        pixels[i+2] =   239;
                        pixels[i+3] =   255;
                    }
                break;

                case T_ANIMALS:
                    if (mapAnimals[x][y] == 1) {
                        pixels[i]   =   127;
                        pixels[i+1] =   0;
                        pixels[i+2] =   0;
                        pixels[i+3] =   255;    // alpha
                    }
                break;

                case T_FINAL:
                    switch(mapImg[x][y]) {
                        case TILE_SEA:
                            pixels[i]   =   0;
                            pixels[i+1] =   0;
                            pixels[i+2] =   127;
                            pixels[i+3] =   255;
                        break;
                        
                        case TILE_BEACH:
                            pixels[i]   =   223;
                            pixels[i+1] =   193;
                            pixels[i+2] =   63;
                            pixels[i+3] =   255;
                        break;

                        case TILE_PLAINS:
                            pixels[i]   =   0;
                            pixels[i+1] =   127;
                            pixels[i+2] =   0;
                            pixels[i+3] =   255;
                        break;

                        case TILE_FOREST:
                            pixels[i]   =   0;
                            pixels[i+1] =   63;
                            pixels[i+2] =   0;
                            pixels[i+3] =   255;
                        break;

                        case TILE_MOUNTAIN:
                            pixels[i]   =   127;
                            pixels[i+1] =   127;
                            pixels[i+2] =   127;
                            pixels[i+3] =   255;
                        break;

                        case TILE_RIVER:
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
    console.clear();
    console.log("Generating new terrain...");

    console.log("Throwing a seed...");

    // Each element
    for (x = 0; x < MAP_WIDTH; x++) {
        for (y = 0; y < MAP_HEIGHT; y++) {
            map[x][y] = Math.random();
        }
    }



    console.log("Generating animals...");

    // Each element
    for (x = 0; x < MAP_WIDTH; x++) {
        for (y = 0; y < MAP_HEIGHT; y++) {
            mapAnimals[x][y] = (Math.random() > 0.95) ? 1 : 0;
        }
    }



    console.log("Interpolating map...");
    for (i = 0; i < INTERPOLATION; i++) { interpolateAll(); }




    for (x = 0; x < MAP_WIDTH; x++) {
        for (y = 0; y < MAP_HEIGHT; y++) {
            if (map[x][y] <= L_SEA) setTile(TILE_SEA, x, y);
            else {
                if (Math.random() >= 0.825) {
                    if (map[x][y] <= L_BEACH) setTile(TILE_BEACH, x, y);
                    else {
                        setTile(TILE_FOREST, x, y);
                        if (x > 0               && map[x-1][y] > L_BEACH) setTile(TILE_FOREST, x-1, y);
                        if (x < MAP_WIDTH - 1   && map[x+1][y] > L_BEACH) setTile(TILE_FOREST, x+1, y);
                        if (y > 0               && map[x][y-1] > L_BEACH) setTile(TILE_FOREST, x, y-1);
                        if (y < MAP_HEIGHT - 1  && map[x][y+1] > L_BEACH) setTile(TILE_FOREST, x, y+1);

                    } 
                }
                else if (map[x][y] <= L_BEACH) setTile(TILE_BEACH, x, y);
                else setTile(TILE_PLAINS, x, y);
            }
        }
    }

    generateMountain();



    console.log("Generating resources...");

    // Each element
    for (x = 0; x < MAP_WIDTH; x++) {
        for (y = 0; y < MAP_HEIGHT; y++) {
            mapResources[x][y] = -1; // reset

            if (mapImg[x][y] == TILE_MOUNTAIN) {
                let r = Math.random();

                        if (r < 0.22)   mapResources[x][y] = RES_COAL;
                else    if (r < 0.35)   mapResources[x][y] = RES_IRON;
                else    if (r < 0.48)   mapResources[x][y] = RES_COPPER;
                else    if (r < 0.58)   mapResources[x][y] = RES_TIN;
                else    if (r < 0.73)   mapResources[x][y] = RES_ALUMINIUM;
                else    if (r < 0.85)   mapResources[x][y] = RES_SILVER;
                else    if (r < 0.95)   mapResources[x][y] = RES_GOLD;
                else                    mapResources[x][y] = RES_URANIUM;
            }
            else {
                let r = Math.random();

                if (r < 0.0075) {
                    // Gas
                    if (y < 43 || y > 85) {
                        mapResources[x][y] = RES_GAS;
                    }
                    // Oil
                    else {
                        mapResources[x][y] = RES_OIL;
                    }
                }
            }
        }
    }



    if (document.getElementById('rivers').checked) generateRivers();

    

    console.log("The map has been generated successfully!");
}

function generateMountain() {
    console.log("Generating mountain...");

    let count = 2048;

    for (c = 0; c < count; c++) {
        let x = rand(1, MAP_WIDTH-1);
        let y = rand(1, MAP_HEIGHT-1);

        // Inside map - without borders
        if (x > 0 && y > 0 && x < MAP_WIDTH-1 && y < MAP_HEIGHT-1) {
            if (map[x][y] > L_BEACH)    setTile(TILE_MOUNTAIN, x, y);
            if (map[x-1][y] > L_BEACH)  setTile(TILE_MOUNTAIN, x-1, y);
            if (map[x+1][y] > L_BEACH)  setTile(TILE_MOUNTAIN, x+1, y);
            if (map[x][y-1] > L_BEACH)  setTile(TILE_MOUNTAIN, x, y-1);
            if (map[x][y+1] > L_BEACH)  setTile(TILE_MOUNTAIN, x, y+1);
        }
    }
}

function generateRivers() {
    console.log("Generating rivers...");

    let max = 0; // maximal value

    // Searching maximum
    for (x = 0; x < MAP_WIDTH; x++) {
        for (y = 0; y < MAP_HEIGHT; y++) {
            if (mapImg[x][y] == 4 && map[x][y].toFixed(2) > max.toFixed(2)) max = map[x][y];
        }
    }

    // Generating river
    for (x = 0; x < MAP_WIDTH; x++) {
        for (y = 0; y < MAP_HEIGHT; y++) {
            if (map[x][y].toFixed(1) == max.toFixed(1) && mapImg[x][y] == 4 && rand(0, 99) == 0) {
                setTile(TILE_RIVER, x, y);
                generateRiver(x, y);
            }
        }
    }
}

function generateRiver(rx, ry) {
    let x    = rx;
    let y    = ry;
    let xdir = 0;
    let ydir = 0;
    let elev = map[x][y]; // elevation

    do {
        xdir = 0;
        ydir = 0;

        setTile(TILE_RIVER, x, y);

        if (x > 0 && map[x-1][y] < elev) { elev = map[x-1][y]; xdir = -1; ydir = 0; }
        if (y > 0 && map[x][y-1] < elev) { elev = map[x][y-1]; xdir = 0; ydir = -1; }
        if (x < MAP_WIDTH-1 && map[x+1][y] < elev) { elev = map[x+1][y]; xdir = +1; ydir = 0; }
        if (x < MAP_HEIGHT-1 && map[x][y+1] < elev) { elev = map[x][y+1]; xdir = 0; ydir = +1; }
        
        x += xdir;
        y += ydir;

        if (x+xdir < 0 || y+ydir < 0 || x+xdir >= MAP_WIDTH-1 || y+ydir >= MAP_HEIGHT-1) break;
    } while ((xdir != 0 || ydir != 0) && map[x+xdir][y+ydir] > L_SEA);

    if (x+xdir > 0 && y+ydir > 0 && x+xdir < MAP_WIDTH-1 && y+ydir < MAP_HEIGHT-1) {
        // Make a place, where water can accumulate above the sea
        if (map[x+xdir][y+ydir] > L_SEA) {
            setTile(TILE_SEA, x+xdir, y+ydir);
        }
        setTile(TILE_SEA, x+xdir-1, y+ydir);
        setTile(TILE_SEA, x+xdir+1, y+ydir);
        setTile(TILE_SEA, x+xdir, y+ydir-1);
        setTile(TILE_SEA, x+xdir, y+ydir+1);
    }
}

// Interpolate all
function interpolateAll() {
    // console.log("Interpolating terrain...");

    // Each element
    for (x = 0; x < MAP_WIDTH; x++) {
        for (y = 0; y < MAP_HEIGHT; y++) {
            map[x][y] = interpolate(map, x, y);
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

function setTheme(theme) {
    T_CURRENT = theme;
}

function setTile(tile, x, y) {
    mapImg[x][y] = tile;
}

function rand(min, max) {
    return Math.floor(Math.random() * max) + min;
}