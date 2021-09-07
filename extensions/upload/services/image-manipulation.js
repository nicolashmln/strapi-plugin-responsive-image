'use strict';
/**
 * Image manipulation functions
 */
const sharp = require('sharp');

const { bytesToKbytes } = require('strapi-plugin-upload/utils/file');

const getMetadatas = buffer =>
  sharp(buffer)
    .metadata()
    .catch(() => ({})); // ignore errors

const getDimensions = buffer =>
  getMetadatas(buffer)
    .then(({ width = null, height = null }) => ({ width, height }))
    .catch(() => ({})); // ignore errors

const resizeTo = (buffer, options, quality, progressive, autoOrientation) => {
  let sharpInstance = autoOrientation ? sharp(buffer).rotate() : sharp(buffer);

  if (options.convertToFormat) {
    sharpInstance = sharpInstance.toFormat(options.convertToFormat)
  }

  return sharpInstance
    .resize(options)
    .jpeg({ quality, progressive, force: false })
    .png({ compressionLevel: Math.floor((quality / 100) * 9), progressive, force: false })
    .webp({ quality, force: false })
    .tiff({ quality, force: false })
    .toBuffer()
    .catch(() => null);
};

const generateResponsiveFormats = async file => {
  const {
    responsiveDimensions = false,
    autoOrientation = false,
  } = await strapi.plugins.upload.services.upload.getSettings();

  if (!responsiveDimensions) return [];

  if (!(await canBeProccessed(file.buffer))) {
    return [];
  }

  const originalDimensions = await getDimensions(file.buffer);
  const {
    formats,
    quality,
    progressive
  } = await strapi.plugins['responsive-image'].services['responsive-image'].getSettings();

  const x2Formats = [];
  const x1Formats = formats.map(format => {
    if (format.x2) {
      x2Formats.push(generateBreakpoint(`${format.name}_x2`, { 
        file,
        format: {
          ...format,
          width: format.width * 2,
          height: format.height ? format.height * 2 : null
        }, originalDimensions, quality, progressive, autoOrientation
      }))
    }
    return generateBreakpoint(format.name, { file, format, originalDimensions, quality, progressive, autoOrientation });
  })

  return Promise.all([...x1Formats, ...x2Formats]);
};

const getFileExtension = (file, {convertToFormat}) => {
  if(!convertToFormat) {
    return file.ext
  }

  if(convertToFormat === 'jpeg') {
    return '.jpg'
  }

  return `.${convertToFormat}`
}

const generateBreakpoint = async (key, { file, format, quality, progressive, autoOrientation }) => {
  const newBuff = await resizeTo(file.buffer, format, quality, progressive, autoOrientation);

  if (newBuff) {
    const { width, height, size } = await getMetadatas(newBuff);

    return {
      key,
      file: {
        hash: `${key}_${file.hash}`,
        ext: getFileExtension(file, format),
        mime: file.mime,
        width,
        height,
        size: bytesToKbytes(size),
        buffer: newBuff,
        path: file.path ? file.path : null,
      },
    };
  }
};

const formatsToProccess = ['jpeg', 'png', 'webp', 'tiff'];
const canBeProccessed = async buffer => {
  const { format } = await getMetadatas(buffer);
  return format && formatsToProccess.includes(format);
};

module.exports = {
  generateResponsiveFormats,
};