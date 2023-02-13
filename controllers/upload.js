const fs = require('fs');
const path = require('path');
const asyncWrapper = require('../errors/asyncWrapper.js');
const customError = require('../errors/customError');

const uploadPdf = asyncWrapper(async (req, res, next) => {
  const file = req.files.pdf;
  if (!req.files) {
    return next(new customError('Niste upload cv', 400));
  }
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    return next(new customError('Ne zatrpavaj server', 400));
  }

  if (!file.mimetype.endsWith('pdf')) {
    return next(new customError('Molimo uploadujte cv u pdf formatu!', 400));
  }

  let fileName = file.name + '' + new Date().getTime();
  const pdfPath = path.join(__dirname, '../public/uploads', fileName);

  await file.mv(pdfPath);

  res.status(201).json({
    //created
    success: true,
    msg: 'uspesno uploadovana slika',
    data: {
      filePath: `/uploads/${fileName}`,
    },
  });
});

module.exports = {
  uploadPdf,
};
