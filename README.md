# Text File Streamer

This Node.js application streams and monitors changes in a text file, displaying the last lines that were added to the file.

Output in terminal:

```
New content: Line 40: And so on.
New content: Line 41: This is the last line of the initial file.
New content: Line 42: We'll add more lines to see how the streamer handles it.
New content: Line 43: This is the next line.
New content: Line 43: This is the next line.
New content: Line 43: This is the next line.
New content: Line 44: And another one.
```

## Project Structure

- `package.json`: Project configuration
- `index.js`: Main application script
- `data/sample.txt`: Sample text file for streaming
## Setup
Run `npm install` to install the dependencies.

## Running the Application

To run the application, use the following command in the terminal:

```
npm start
```

This will execute the `index.js` file, which reads the last 10 lines of `data/sample.txt` and then monitors it for changes.

## Testing

To test the application:

1. Start the application using `npm start`.
2. Open `data/sample.txt` in a text editor.
3. Add new lines to the end of the file and save.
4. Observe the new lines being displayed in the terminal.

