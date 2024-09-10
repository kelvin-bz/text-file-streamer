const fs = require('fs');
const readline = require('readline');

const textFilePath = './data/sample.txt';
const numLines = 10;

let fileSize = 0;
let buffer = [];

async function readLastLines() {
    const stats = await fs.promises.stat(textFilePath);
    fileSize = stats.size;
    const stream = fs.createReadStream(textFilePath, {
        start: Math.max(0, fileSize - 1024 * 1024), // Read last 1MB or whole file
        encoding: 'utf8'
    });

    const rl = readline.createInterface({
        input: stream,
        crlfDelay: Infinity
    });

    for await (const line of rl) {
        buffer.push(line);
        if (buffer.length > numLines) {
            buffer.shift();
        }
    }

    return buffer;
}

function watchFile() {
    let partialLine = '';
    fs.watch(textFilePath, async (eventType) => {
        if (eventType === 'change') {
            const newSize = fs.statSync(textFilePath).size;
            if (newSize > fileSize) {
                const stream = fs.createReadStream(textFilePath, {
                    start: Math.max(0, fileSize - 100), // Read a bit before the last position
                    encoding: 'utf8'
                });

                stream.on('data', (chunk) => {
                    const lines = (partialLine + chunk).split(/\r?\n/);
                    partialLine = lines.pop() || '';

                    for (const line of lines) {
                        if (line.trim().startsWith('Line ')) {
                            console.log('New content:', line.trim());
                            buffer.push(line.trim());
                            if (buffer.length > numLines) {
                                buffer.shift();
                            }
                        }
                    }
                });

                stream.on('end', () => {
                    if (partialLine.trim().startsWith('Line ')) {
                        console.log('New content:', partialLine.trim());
                        buffer.push(partialLine.trim());
                        if (buffer.length > numLines) {
                            buffer.shift();
                        }
                    }
                    fileSize = newSize;
                });
            }
        }
    });
}

async function main() {
    try {
        await readLastLines();
        console.log('Last', buffer.length, 'lines:');
        buffer.forEach(line => console.log(line));
        console.log('\nMonitoring for changes...');
        watchFile();
    } catch (err) {
        console.error('Error:', err);
    }
}

main();