import { configuration } from './config';
import protobuf from 'protobufjs';
import fs from 'fs';

(async () => {
    // Read all sample messages
    const pain001Contents = await readFile('src/files/sample/1. Pain001.json');
    const pain001 = JSON.parse(pain001Contents);
    const pain013Contents = await readFile('src/files/sample/2. Pain013.json');
    const pain013 = JSON.parse(pain013Contents);
    const pacs008Contents = await readFile('src/files/sample/3. Pacs008.json');
    const pacs008 = JSON.parse(pacs008Contents);
    const pacs002Contents = await readFile('src/files/sample/4. Pacs002.json');
    const pacs002 = JSON.parse(pacs002Contents);
    const reportContents = await readFile('src/files/sample/SampleReport.json');
    const report = JSON.parse(reportContents);

    // Read all Proto files
    let root = protobuf.loadSync('src/files/Full.proto');
    const FRMSMessage = root.lookupType("FRMSMessage");
    root = protobuf.loadSync('src/files/Pacs.002.proto');
    const pacs002Message = root.lookupType("SomeMessage");
    root = protobuf.loadSync('src/files/Pacs.008.proto');
    const pacs008Message = root.lookupType("SomeMessage");
    root = protobuf.loadSync('src/files/Pain.001.proto');
    const pain001Message = root.lookupType("SomeMessage");
    root = protobuf.loadSync('src/files/Pain.013.proto');
    const pain013Message = root.lookupType("SomeMessage");
    root = protobuf.loadSync('src/files/Report.proto');
    const reportMessage = root.lookupType("SomeMessage");

    // Test individual sample files vs individual Proto files
    console.log('Pacs002: ' + pacs002Message.verify(pacs002) ?? "Fine");
    console.log('Pain001: ' + pain001Message.verify(pain001) ?? "Fine");
    console.log('Pain013: ' + pain013Message.verify(pain013) ?? "Fine");
    console.log('Pacs008: ' + pacs008Message.verify(pacs008) ?? "Fine");
    console.log('Report: ' + reportMessage.verify(report) ?? "Fine");

    // Test individual sample files vs Full combined Proto file
    console.log('-------------Verify against Full.proto-------------');
    console.log('Pacs002: ' + FRMSMessage.verify(pacs002) ?? "Fine");
    console.log('Pain001: ' + FRMSMessage.verify(pain001) ?? "Fine");
    console.log('Pain013: ' + FRMSMessage.verify(pain013) ?? "Fine");
    console.log('Pacs008: ' + FRMSMessage.verify(pacs008) ?? "Fine");
    console.log('Report: ' + FRMSMessage.verify(report) ?? "Fine");

    // Create a protobuf message to send over the wire
    let reportSample = FRMSMessage.create(report);
    let pacs002Sample = FRMSMessage.create(pacs002);
    let pacs008Sample = FRMSMessage.create(pacs008);
    let pain013Sample = FRMSMessage.create(pain013);
    let pain001Sample = FRMSMessage.create(pain001);

    // Serialize the protobuf message to binary
    const reportBuffer = FRMSMessage.encode(reportSample).finish();
    const pacs002Buffer = FRMSMessage.encode(pacs002Sample).finish();
    const pacs008Buffer = FRMSMessage.encode(pacs008Sample).finish();
    const pain013Buffer = FRMSMessage.encode(pain013Sample).finish();
    const pain001Buffer = FRMSMessage.encode(pain001Sample).finish();

    // Deserialize the binary back into a protobuf message
    const decodedReport = FRMSMessage.decode(reportBuffer);
    const decodedpacs002 = FRMSMessage.decode(pacs002Buffer);
    const decodedpacs008 = FRMSMessage.decode(pacs008Buffer);
    const decodedpain013 = FRMSMessage.decode(pain013Buffer);
    const decodedpain001 = FRMSMessage.decode(pain001Buffer);

    // Convert the protobuf message to a javascript object
    const newReport  = FRMSMessage.toObject (decodedReport);
    const newpacs002 = FRMSMessage.toObject(decodedpacs002);
    const newpacs008 = FRMSMessage.toObject(decodedpacs008);
    const newpain013 = FRMSMessage.toObject(decodedpain013);
    const newpain001 = FRMSMessage.toObject(decodedpain001);

    //reportSample.toJSON();
})();

async function readFile(fileName: string) {
    let toReturn = '';
    await new Promise<void>((resolve, reject) => fs.readFile(fileName, 'utf8',
        async (err, data) => {
            if (err) {
                console.error(err);
                reject(err);
            }
            toReturn = data;
            resolve();
        })
    );
    return toReturn;
}

