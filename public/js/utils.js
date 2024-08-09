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

// Function to convert image URL to Base64
export async function convertImageToBase64(imageUrl) {
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}


async function removeFirstRectFromSVG(svgURL) {
  const response = await fetch(svgURL);
  const svgText = await response.text();

  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svgText, "image/svg+xml");

  const firstRect = svgDoc.querySelector('rect');
  if (firstRect) {
    firstRect.remove();
  }

  const serializer = new XMLSerializer();
  const modifiedSVG = serializer.serializeToString(svgDoc.documentElement);

  // Convert the modified SVG back to Base64
  return `data:image/svg+xml;base64,${btoa(modifiedSVG)}`;
}
