export function getAlbumNumber(number) {
    let albumNumber = "";
    let lastDigit = number % 10;
    let lastTwoDigits = number % 100;

    if (lastTwoDigits != 11 && lastTwoDigits != 12 && lastTwoDigits != 13) {
        switch (lastDigit) {
            case 1:
                albumNumber = number + "st";
                break;
            case 2:
                albumNumber = number + "nd";
                break;
            case 3:
                albumNumber = number + "rd";
                break;
            default:
                albumNumber = number + "th";
                break;
        }
    } else {
        albumNumber = number + "th";
    }

    return albumNumber + " STUDIO PROJECT";
}

export function cutName(songName) {
    let bracketSplit = songName.split("(");
    let hyphenSplit = songName.split("-");

    if (bracketSplit[0].length > hyphenSplit[0].length) {
        return hyphenSplit[0];
    } else {
        return bracketSplit[0];
    }
}

export function getMonthName(monthNumber) {
    const date = new Date();
    date.setMonth(monthNumber - 1);
    return date.toLocaleString("en-US", { month: "long" }).toUpperCase();
}

export function getImageColourPalette(image) {
    var vibrant = new Vibrant(image);
    var swatches = vibrant.swatches();
    var swatchesArray = [];

    for (var key in swatches) {
        if (swatches.hasOwnProperty(key) && swatches[key]) {
            swatchesArray.push(swatches[key].getRgb());
        }
    }

    return swatchesArray;
}
