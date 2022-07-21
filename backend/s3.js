require('dotenv').config();
const fs = require('fs');
const S3 = require('aws-sdk/clients/s3');

const bucket = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKey = process.env.AWS_ACCESS_KEY;
const secretKey = process.env.AWS_SECRET_KEY;

const s3 = new S3({
  region: region,
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretKey,
  },
});

const uploadFile = async (file) => {
  const fileStream = fs.createReadStream(file.path);

  const params = {
    Bucket: bucket,
    Key: file.filename,
    Body: fileStream,
  };

  s3.upload(params, (err, data) => {
    if (err) {
      throw err;
    }
    console.log(data);
  });
};

exports.uploadFile = uploadFile;
