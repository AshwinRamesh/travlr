import Papa from 'papaparse';

const parseCSV = (csvData) => {
    // Split CSV data into lines
    const lines = csvData.split('\n');

    // Extract column headers from the first line
    const headers = lines[0].split(',');

    // Parse each line (starting from the second line) into an object
    const parsedData = lines.slice(1).map(line => {
        const values = line.split(',');
        const row = {};
        headers.forEach((header, index) => {
            row[header] = values[index];
        });
        return row;
    });

    return parsedData;
};

const downloadAndParseCSV = (url) => {
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to download CSV file');
            }
            return response.text();
        })
        .then(csvData => {

            // Parse CSV data into JavaScript objects
            const results = Papa.parse(csvData, {
                header: true, // Treat the first row as headers
                newline: "\n" // Specify newline character
            });
  
            // Access the parsed data in the 'data' property of 'results'
            const parsedData = results.data;
            return parsedData;
        })
        .catch(error => {
            console.error('Error:', error.message);
        });
};

export {downloadAndParseCSV};