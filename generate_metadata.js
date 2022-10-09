const fs = require("fs");
const path = require("path");
const { loadImage } = require("canvas");

const basePath = process.cwd();
const buildDir = `${basePath}/build/json`;
const inputDir = `${basePath}/build/images`;
const namePrefix = "sneaker";
const description = "sneakernft world";
const baseUri = "ipfs://NewUriToReplace";
const console = require("console");

const metadataList = [];

const buildSetup = () => {
  if (fs.existsSync(buildDir)) {
    fs.rmdirSync(buildDir, { recursive: true });
  }
  fs.mkdirSync(buildDir);
};

const getImages = (_dir) => {
  try {
    return fs
      .readdirSync(_dir)
      .filter((item) => {
        let extension = path.extname(`${_dir}${item}`);
        if (extension == ".png" || extension == ".jpg") {
          return item;
        }
      })
      .map((i) => {
        return {
          filename: i,
          path: `${_dir}/${i}`,
        };
      });
  } catch {
    return null;
  }
};

const loadImgData = async (_imgObject) => {
  try {
    const image = await loadImage(`${_imgObject.path}`);
    return {
      imgObject: _imgObject,
      loadedImage: image,
    };
  } catch (error) {
    console.error("Error loading image:", error);
  }
};



const saveMetadata = (_loadedImageObject) => {
  let shortName = _loadedImageObject.imgObject.filename.replace(
    /\.[^/.]+$/,
    ""
  );

  

  let tempMetadata = {
    name: `${namePrefix} #${shortName}`,
    description: description,
    image: `${baseUri}/${shortName}.png`,
};
  fs.writeFileSync(
    `${buildDir}/${shortName}.json`,
    JSON.stringify(tempMetadata, null, 2)
  );
  metadataList.push(tempMetadata);
};

const writeMetaData = (_data) => {
  fs.writeFileSync(`${buildDir}/_metadata.json`, _data);
};

const startCreating = async () => {
  const images = getImages(inputDir);
  if (images == null) {
    console.log("Please generate collection first.");
    return;
  }
  let loadedImageObjects = [];
  images.forEach((imgObject) => {
    loadedImageObjects.push(loadImgData(imgObject));
  });
  await Promise.all(loadedImageObjects).then((loadedImageObjectArray) => {
    loadedImageObjectArray.forEach((loadedImageObject) => {
      
      saveMetadata(loadedImageObject);
      console.log(
        `Created metadata for image: ${loadedImageObject.imgObject.filename}`
      );
    });
  });
  writeMetaData(JSON.stringify(metadataList, null, 2));
};

buildSetup();
startCreating();
