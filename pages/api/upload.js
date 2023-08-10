import multiparty from 'multiparty';
import fs from 'fs';
import { log } from 'console';
import { mongooseConnect } from '@/lib/mongoose';
import { isAdminRequest } from './auth/[...nextauth]';
const B2 = require('backblaze-b2');

export default async function handle(req, res) {
    await mongooseConnect();
    await isAdminRequest(req, res);

    const form = new multiparty.Form();

    // Parse the incoming request with multiparty
    const { fields, files } = await new Promise((resolve, reject) => {
        form.parse(req, async (err, fields, files) => {
            if (err) reject(err);
            resolve({ fields, files });
        })
    })

    // console.log('length', files.file.length);
    // console.log('files: ', files);
    const links = [];

    const b2 = new B2({
        applicationKeyId: process.env.AWS_ACCESS_KEY_ID, // or accountId: 'accountId'
        applicationKey: process.env.AWS_SECRET_ACCESS_KEY // or masterApplicationKey
    });





    try {
        await b2.authorize();

        const bucketId = '52b89cace0ee375d8591001c';
        const bucketName = 'sarim-next-ecommerce';
        const region = 'us-east-005';

        const links = [];

        for (const file of files.file) {
            const ext = file.originalFilename.split('.').pop();
            const newFilename = Date.now() + '.' + ext;

            const response = await b2.getUploadUrl({ bucketId });
            const uploadUrl = response.data.uploadUrl;
            const authToken = response.data.authorizationToken;

            await b2.uploadFile({
                uploadUrl: uploadUrl,
                uploadAuthToken: authToken,
                fileName: newFilename,
                data: fs.readFileSync(file.path),
                onUploadProgress: progress => {
                    console.log(`Upload progress: ${progress}%`);
                },
            });

            const link = `https://f005.backblazeb2.com/file/${bucketName}/${newFilename}`;
            links.push(link);
        }

        res.json({ links });
    } catch (error) {
        console.error('Error occurred:', error);
    }
}

export const config = {
    api: { bodyParser: false, },
};